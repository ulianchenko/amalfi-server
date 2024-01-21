// import express from 'express';
// import authRoutes from './auth.routes';
// import reviewRoutes from './review.routes';
// import bookingRoutes from './booking.routes';
// import roomRoutes from './room.routes';
// import userRoutes from './user.routes';
// import likeRoutes from './like.routes';
const express = require('express');
// const authRoutes = require('./auth.routes');
// const reviewRoutes = require('./review.routes');
// const bookingRoutes = require('./booking.routes');
// const roomRoutes = require('./room.routes');
// const userRoutes = require('./user.routes');
// const likeRoutes = require('./like.routes');

const router = express.Router({ mergeParams: true });

router.use('/auth', require('./auth.routes'));
router.use('/review', require('./review.routes'));
router.use('/booking', require('./booking.routes'));
router.use('/rooms', require('./room.routes'));
router.use('/user', require('./user.routes'));
router.use('/like', require('./like.routes'));

// export default router;
module.exports = router;