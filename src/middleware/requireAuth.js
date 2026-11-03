import jwt from 'jsonwebtoken';
import { verifyAccessToken } from '../lib/token.js';

const requireAuth = (req, res, next) => {
  const token = req.cookies?.x_access_token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = verifyAccessToken(token);

    if (typeof payload === 'string' || typeof payload.sub !== 'string') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.auth = { userId: payload.sub };
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    return next(error);
  }
};

export default requireAuth;
