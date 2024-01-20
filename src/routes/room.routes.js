import express from 'express';
import Room from '../models/Room';
import filterRooms from '../utils/filterRooms';
import auth from '../middlewares/auth.middleware';

const router = express.Router({ mergeParams: true });

// router.get('/', async (req: Request, res: Response): Promise<Response<any, Record<string, any>> | void> => {
router.get('/', async (req, res) => {
  const query = req.query;
  try {
    const rooms = await Room.find();
    if (Object.keys(query).length > 0) {
      const filteredRooms= await filterRooms(rooms, query);
      // return res.status(200).send(filteredRooms);
      res.status(200).send(filteredRooms);
      return;
    }

    res.status(200).send(rooms);
    // res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId);
    res.send(room);
    // res.json(room);
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

router.post('/:roomId', auth, async (req, res)=> {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    const isBooked = room?.bookings?.some(booking => booking.toString() === req.body.bookings);

    if (isBooked) {
      const updatedRoom = await Room.findByIdAndUpdate(roomId, { $pull: req.body }, { new: true });
      res.send(updatedRoom);
    } else {
      const updatedRoom = await Room.findByIdAndUpdate(roomId, { $push: req.body }, { new: true });
      res.send(updatedRoom);
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

router.patch('/:roomId', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const updatedRoom = await Room.findByIdAndUpdate(roomId, req.body, { new: true });
    res.send(updatedRoom);
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

export default router;