import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// import rateLimit from 'express-rate-limit';
import nocache from 'nocache';
import cookieParser from 'cookie-parser';
import adminRoutes from './interfaces/http/routes/adminRoutes';
import userRoutes from './interfaces/http/routes/userRoutes';
import errorHandler from './infrastructure/middlewares/errorHandler';
import './config/googlePassport';
import './config/githubPassport';
import './config/facebookPassport';
import passport from 'passport';

export const app = express();

// Middleware
app.use(nocache());

//parse inputs
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(
  cors({
    origin: process.env.CLIENT_URL, // your frontend origin
    credentials: true, // this is crucial for cookies
  })
);
app.use(helmet());
app.use(morgan('dev'));

// Rate Limiter
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/', userRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
