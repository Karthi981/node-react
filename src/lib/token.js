import jwt from 'jsonwebtoken';

const getSecret = () => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (typeof secret !== 'string' || secret.trim() === '') {
    throw new Error('JWT_ACCESS_SECRET is not configured');
  }

  return secret;
};

const createAccessToken = (user) =>
  jwt.sign({ sub: String(user.id) }, getSecret(), { expiresIn: '30m' });

const verifyAccessToken = (token) =>
  jwt.verify(token, getSecret(), { algorithms: ['HS256'] });

export { createAccessToken, verifyAccessToken };