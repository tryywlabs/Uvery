import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import route from './routes/userRoute.js';
import certificateRoute from './routes/certificateRoute.js';

const app = express();
dotenv.config();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:8000',
    'Add-production-domain',
  ],
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};

//middleware setup
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

//Root Route
app.get('/', (res) => {
  res.json({ message: 'Welcome to the API' });
});

//API Routes
app.use('/api/user', route);
app.use('/api/certificate', certificateRoute);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error('CORS Violation'), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

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
