// import express from 'express';
// import { check, validationResult } from 'express-validator';
// import bcrypt from 'bcryptjs';

// import User from '../models/User';
// import tokenService from '../services/token.service';
// import generateUserData from '../utils/generateUserData';
const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const tokenService  = require('../services/token.service');
const generateUserData = require('../utils/generateUserData');


const router = express.Router({ mergeParams: true });

function isTokenInvalid(data, dbToken) {
  return !data || !dbToken || data._id !== dbToken?.user?.toString();
}

router.post('/signUp', [
  check('email', 'Email is incorrect').isEmail(),
  check('password', 'Minimum password length is 8 symbols').isLength({ min: 8 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: {
            message: 'INVALID DATA',
            code: 400,
          },
        });
      }

      // const { email, password } = req.body;
      const { email, password, firstName, secondName } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          error: {
            message: 'EMAIL_EXISTS',
            code: 400,
          },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await User.create({
        ...generateUserData(firstName, secondName),
        ...req.body,
        role: 'user',
        password: hashedPassword,
      });

      const tokens = tokenService.generate({ _id: newUser._id });
      await tokenService.save(newUser._id, tokens.refreshToken);
      res.status(201).send({ ...tokens, userId: newUser._id });
    } catch (error) {
      res.status(500).json({
        message: 'An error has occurred on the server. Please, try again later',
      });
    }
  },
]);

router.post('/signInWithPassword', [
  check('email', 'Email is incorrect').normalizeEmail().isEmail(),
  check('password', 'Password cannot be empty').exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: {
            message: 'INVALID_DATA',
            code: 400,
          },
        });
      }

      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(400).send({
          error: {
            message: 'EMAIL_NOT_FOUND',
            code: 400,
          },
        });
      }

      const existingUserPassword = existingUser.password;
      if (existingUserPassword) {
        const isPasswordEqual = await bcrypt.compare(password, existingUserPassword);

        if (!isPasswordEqual) {
          return res.status(400).json({
            error: {
              message: 'INVALID_PASSWORD',
              code: 400,
            },
          });
        }
      }


      const tokens = tokenService.generate({ _id: existingUser._id });
      await tokenService.save(existingUser._id, tokens.refreshToken);

      res.status(200).send({
        ...tokens,
        userId: existingUser._id,
      });
    } catch (error) {
      res.status(500).json({
        message: 'An error has occurred on the server. Please, try again later',
      });
    }
  },
]);

router.post('/token', async (req, res) => {
  try {
    const { refresh_token: refreshToken } = req.body;
    const data = tokenService.validateRefresh(refreshToken);
    const dbToken = await tokenService.findToken(refreshToken);

    if (isTokenInvalid(data, dbToken)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if(data && typeof data !== 'string') {
      const tokens = tokenService.generate({
        _id: data?._id,
      });

      await tokenService.save(data?._id, tokens.refreshToken);

      res.status(200).send({ ...tokens, userId: data?._id });
      // res.status(200).json({ ...tokens, userId: data._id });
    }

  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

// export default router;
module.exports = router;