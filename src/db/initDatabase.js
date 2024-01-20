import mongoose from 'mongoose';
// Mock data
import roomsMockData from './mockData/rooms.json';
// Models
import Room from '../models/Room';

const initDatabase = () => {
  // Connect to MongoDB
  // eslint-disable-next-line no-undef
  mongoose.connect(process.env.MONGO_URI);

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Connection error'));
  db.once('open', async function () {
    console.log('Connected successfully');
    const roomsCount = await Room.estimatedDocumentCount();
    if (roomsCount === 0) {
      try {
        await Room.insertMany(roomsMockData);
        console.log('Database was uploaded from mock data');
      } catch (err) {
        console.error('Error uploading database from mock data');
      }
    }
  });
}

export default initDatabase;