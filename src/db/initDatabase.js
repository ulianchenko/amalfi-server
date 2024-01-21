// import mongoose from 'mongoose';
// // Mock data
// import roomsMockData from './mockData/rooms.json';
// // Models
// import Room from '../models/Room';
// const mongoose = require('mongoose');
// Mock data
const roomsMockData = require('./mockData/rooms.json');
// Models
const Room = require ('../models/Room');

// const initDatabase = () => {
//   module.exports = async () => {
//   // Connect to MongoDB
//   // eslint-disable-next-line no-undef
//   // mongoose.connect(process.env.MONGO_URI);

//   // const db = mongoose.connection;
//   // db.on('error', console.error.bind(console, 'Connection error'));
//   // db.once('open', async function () {
//     mongoose.connection.once('open', async function () {
//     console.log('Connected successfully');
//     const roomsCount = await Room.estimatedDocumentCount();
//     // const roomsCount = await Room.find();
//     if (roomsCount === 0) {
//       try {
//         await Room.insertMany(roomsMockData);
//         console.log('Database was uploaded from mock data');
//       } catch (err) {
//         console.error('Error uploading database from mock data');
//       }
//     }
//   });

//   mongoose.connect('mongodb+srv://ulianchenko:a1b2c3d4e5@cluster0.nzybwy4.mongodb.net/?retryWrites=true&w=majority');
// }

module.exports = async () => {
  const roomsCount = await Room.estimatedDocumentCount();
  if (roomsCount === 0) {
    // await createInitialEntity(Room, roomsMockData);
    // console.log('rooms add mongoDB');
    await Room.insertMany(roomsMockData);
        console.log('Database was uploaded from mock data');
  }
};

// export default initDatabase;
// module.exports = { initDatabase };