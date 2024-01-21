/* eslint-disable @typescript-eslint/no-var-requires */
// import express from 'express';
const express = require('express');
// import cors from 'cors';
const cors = require('cors');
// const chalk = require('chalk');
// import config from 'config';
const config = require('config');
// import dotenv from 'dotenv';
const dotenv = require('dotenv');
const Stripe = require('stripe');
const mongoose = require('mongoose');
// import  mongoose, { Document, Model, Schema, model } from 'mongoose';

// import swaggerUi from 'swagger-ui-express';
// Database
// import initDatabase from './src/db/initDatabase';
// import initDatabase from './src/db/initDatabase.js';
// import initDatabase from './src/db/initDatabase.js';
const initDatabase = require('./src/db/initDatabase');
// Routes
// import routes from './src/routes/index.js'
// import routes from './src/routes/index';
const routes = require('./src/routes');
// // Swagger
// import swaggerSpec from './configs/swagerSpec'

const app = express();
dotenv.config();
// const PORT = process.env.PORT || config.get('port') || 8080;
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || config.get('port') || 8080;
// const PORT: number = 8080;
const stripeObj = new Stripe('sk_test_51OWkH4GKmalhlFM413SZO0W54WMJKhMYB1lRE7eNRyzHFsR3SriI1rGRVwVhLRcvnKF2A9KSHABfL0fHIvR7zjXc00ii850ogO');
// const DOMAIN_NAME = 'http://localhost:3000';
const DOMAIN_NAME = 'https://amalfi-lk6nxuyv3-serhiis-projects-3f240a8a.vercel.app';

// initDatabase();

// // Serve Swagger UI at /api-docs
// app.use('/api-docs',
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerSpec)
// );

app.use(express.json());
app.use(cors());

app.use('/api', routes);

// Route for the root URL
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripeObj.checkout.sessions.create({
    // ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1OX4MIGKmalhlFM45nyYlosE',
        quantity: 1,
      },
    ],
    mode: 'payment',
    // return_url: `${DOMAIN_NAME}/return?session_id={CHECKOUT_SESSION_ID}`,
    // success_url: `${DOMAIN_NAME}?success=true`,
    success_url: `${DOMAIN_NAME}/return`,
    cancel_url: `${DOMAIN_NAME}?canceled=true`,
  });

  // res.send({clientSecret: session.client_secret});
  res.redirect(303, String(session.url));
});

app.get('/session-status', async (req, res) => {
  const sessionId = String(req.query.session_id);
  const session = await stripeObj.checkout.sessions.retrieve(sessionId);

  res.send({
    status: session.status,
    customer_email: session?.customer_details?.email
  });
});

// Middleware for handling 404 error
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Middleware for handling 500 error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
  next();
});








async function start() {
  try {
    mongoose.connection.once('open', () => {
      initDatabase();
    });
    // await mongoose.connect(
    //   'mongodb+srv://solexofficial:solexofficial123@cluster0.ijqvj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    // );
    // await mongoose.connect(
    //   'mongodb+srv://ulianchenko:a1b2c3d4e5@cluster0.nzybwy4.mongodb.net/dbAmalfi?retryWrites=true&w=majority'
    // );
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');
    app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`));
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

start();







// Start server on port 8080
// eslint-disable-next-line no-undef
// if (process.env.NODE_ENV !== 'test') {
//   app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
//   });
// }