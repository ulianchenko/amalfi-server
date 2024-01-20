import  { Schema, model } from 'mongoose';

const userSchema = new Schema({
  firstName: { type: String, required: true },
  secondName: { type: String, required: true },
  subscribe: Boolean,
  birthYear: Number,
  avatarPhoto: String,
  password: String,
  role: { type: String, enum: ['user', 'admin'] },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['male', 'female'] },
});

const User = model('User', userSchema);

export default User;
