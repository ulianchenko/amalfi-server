import express from 'express';
import Review from '../models/Review';
import auth from '../middlewares/auth.middleware';

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res)=> {
  try {
    // const { orderBy, equalTo } = req.query;
    // const reviews = await Review.find({ [orderBy]: equalTo });
    const reviews = await Review.find();
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const newReview = await Review.create({
      ...req.body,
      userId: req.body.user._id,
    });
    res.status(201).send(newReview);
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

router.patch('/:reviewId', auth, async (req, res)=> {
  try {
    const { reviewId } = req.params;
    const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, { new: true });
    res.send(updatedReview);
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const removedReview = await Review.findById(reviewId);
    if (removedReview?.userId?.toString() === req.body.user._id || req.body.userRole === 'admin') {
      await removedReview?.deleteOne();
      // return res.send(null);
      // return res.send(removedReview);
      res.send(removedReview);
      return;
    } else {
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

export default router;
