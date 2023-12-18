import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/database.js';

const port = process.env.PORT;

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {s
    res.send('API is running....');
  });
}

app.listen(process.env.PORT, () => {
  console.log( `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`);
});