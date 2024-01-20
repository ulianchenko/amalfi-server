import  { Schema, model } from 'mongoose';

const roomSchema= new Schema({
  roomNumber: { type: Number, required: true},
  price: { type: Number, required: true},
  countReviews: Number,
  rate: Number,
  images: [String],
  comforts: [String],
  bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  type: { type: String, enum: ["Standard", "Suite"] },
  hasWifi: Boolean,
  hasConditioner: Boolean,
  hasWorkSpace: Boolean,
  canSmoke: Boolean,
  canPets: Boolean,
  canInvite: Boolean,
  hasWideHallway: Boolean,
  hasDisabledAssistant: Boolean
});

const Room = model('Room', roomSchema);

export default Room;