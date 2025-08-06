import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// import rateLimit from 'express-rate-limit';
import nocache from 'nocache';
import cookieParser from 'cookie-parser';

import authRoute from '../src/presentation/express/routers/auth/authRoute';
import dmRoute from '../src/presentation/express/routers/user/dmRoute';
import groupRoute from '../src/presentation/express/routers/user/groupRoute';
import messageRoute from '../src/presentation/express/routers/user/messageRoute';
import mediaRoute from '../src/presentation/express/routers/user/mediaRoute';
import paymentRoute from '../src/presentation/express/routers/user/paymentRoute';
import profileRoute from '../src/presentation/express/routers/user/profileRoute';
import callRoute from '../src/presentation/express/routers/user/callRoute';

import userManagementRoute from '../src/presentation/express/routers/admin/userManagementRoute';
import reportManagementRoute from '../src/presentation/express/routers/admin/reportManagementRoute';
import revenueManagementRoute from '../src/presentation/express/routers/admin/revenueManagementRoute';
import groupManagementRoute from '../src/presentation/express/routers/admin/groupManagementRoute';

import './infra/services/passport/facebookPassport';
import './infra/services/passport/githubPassport';
import './infra/services/passport/googlePassport';

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
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan('dev'));

// Rate Limiter
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests
// });
// app.use(limiter);

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/user/dm', dmRoute);
app.use('/api/user/group', groupRoute);
app.use('/api/user/message', messageRoute);
app.use('/api/user/media', mediaRoute);
app.use('/api/user/payment', paymentRoute);
app.use('/api/user/profile', profileRoute);
app.use('/api/user/call', callRoute);

app.use('/api/admin/userManagement', userManagementRoute);
app.use('/api/admin/reportManagement', reportManagementRoute);
app.use('/api/admin/revenueManagement', revenueManagementRoute);
app.use('/api/admin/groupManagement', groupManagementRoute);

export default app;
