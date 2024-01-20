import User from '../models/User';
import tokenService from '../services/token.service';


const auth =  async ( req, res, next) => {
  // if (req.method === 'OPTIONS') {
  //   next();
  // }

  try {
    const token = req.headers.authorization?.split(' ')[1] || '';
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const data = tokenService.validateAccess(token);
    const currentUserData = await User.findById(data);

    req.body.user = data;
    req.body.userRole = currentUserData?.role || '';
    next();

  } catch (error) {
    res.status(401).json({
      message: 'Unauthorized',
    });
  }
};

export default auth;
