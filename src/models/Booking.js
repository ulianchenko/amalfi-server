// import { Schema, model } from 'mongoose';
const { Schema, model } = require('mongoose');


const bookingSchema = new Schema({
  adults: { type: Number, required: true },
  babies: { type: Number, required: true },
  children: { type: Number, required: true },
  arrivalDate: Date,
  departureDate: Date,
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required : true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required : true },
  totalPrice: { type: Number, required: true },
  expires_at: Number
});


// const Booking = model('Booking', bookingSchema);
module.exports = model('Booking', bookingSchema);

// export default Booking;
// module.exports = Booking;