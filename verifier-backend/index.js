import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import route from './routes/userRoute.js';

const app = express();
dotenv.config();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};

//middleware setup
app.use(cors(corsOptions));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

//Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

//API Routes
app.use('/api/user', route);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log('Server is running on port: ', PORT);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
