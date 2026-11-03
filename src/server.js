import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/config.js';
import 'dotenv/config';
import employeeRoutes from './routes/employeeRoutes.js';
import userRoutes from './routes/userRoutes.js';

const PORT = process.env.PORT || '5000';
const app = express();

app.use(cors({
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);

app.use((req, res) => {
  return res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  

  console.error(error);
  return res.status(500).json({ message: 'Internal server error' });
});

const startServer = async () => {
  await connectDB();
  console.log('Database is connected');
  app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Unable to start server:', error.message);
  process.exitCode = 1;
});
