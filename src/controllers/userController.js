import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { createAccessToken } from '../lib/token.js';

const accessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

const login = async (req, res) => {
  const email =
    typeof req.body?.email === 'string'
      ? req.body.email.trim().toLowerCase()
      : '';
  const password =
    typeof req.body?.password === 'string' ? req.body.password : '';

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    const passwordMatches = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = createAccessToken(user);

    res.cookie('x_access_token', accessToken, {
      ...accessCookieOptions,
      maxAge: 30 * 60 * 1000,
    });

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const email =
    typeof req.body?.email === 'string'
      ? req.body.email.trim().toLowerCase()
      : '';
  const password =
    typeof req.body?.password === 'string' ? req.body.password : '';

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
    return res.status(400).json({
      message: 'Provide a valid name and email; password must be at least 8 characters',
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId).select('name email');

    if (!user) {
      return res.status(401).json({ message: 'User account no longer exists' });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const logout = (req, res) => {
  res.clearCookie('x_access_token', accessCookieOptions);
  return res.status(204).end();
};

export { createUser, getCurrentUser, login, logout };
