import  { Schema, model } from 'mongoose';

const likeSchema = new Schema(
  {
    reviewId: {
      type: String,
      ref: 'Review',
      required: true
    },
    userId: {
      type: String,
      ref: 'User',
      required: true
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);


const Like = model('Like', likeSchema);

export default Like;
