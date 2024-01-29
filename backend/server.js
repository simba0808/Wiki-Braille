import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { notFoundHandler, errorHandler } from './middleware/errorCatchMiddleware.js';
import 'express-async-errors'
import connectDB from './config/database.js';
//Router
import userRouter from './routers/userRouter.js';
import dataRouter from './routers/dataRouter.js';
import logRouter from './routers/logRouter.js';
import blogRouter from "./routers/blogRouter.js";

const port = process.env.PORT;

const app = express();

//connect to database
connectDB();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/data', dataRouter);
app.use('/api/log', logRouter);
app.use('/api/blog', blogRouter);

app.use(express.static("./images"));
app.use(express.static("./images/blogs"));

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log( `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`);
});