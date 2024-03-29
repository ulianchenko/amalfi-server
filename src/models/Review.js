// import { Schema, model } from 'mongoose';
const { Schema, model } = require('mongoose');

const reviewSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    rating: Number,
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// const Review = model('Review', reviewSchema);
module.exports = model('Review', reviewSchema);

// export default Review;
// module.exports = Review ;
