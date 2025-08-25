import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
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
import planRoute from '../src/presentation/express/routers/user/planRoute';

import userManagementRoute from '../src/presentation/express/routers/admin/userManagementRoute';
import reportManagementRoute from '../src/presentation/express/routers/admin/reportManagementRoute';
import revenueManagementRoute from '../src/presentation/express/routers/admin/revenueManagementRoute';
import groupManagementRoute from '../src/presentation/express/routers/admin/groupManagementRoute';
import planManagementRoute from '../src/presentation/express/routers/admin/planManagementRoute';
import dashboardRoute from '../src/presentation/express/routers/admin/dashboardRoute';

import './infra/services/passport/facebookPassport';
import './infra/services/passport/githubPassport';
import './infra/services/passport/googlePassport';

import passport from 'passport';
import {
  ADMIN_BASE_ROUTE,
  BASE_ROUTE,
  USER_BASE_ROUTE,
} from './presentation/constants/routesConstants';
import { errorHandler } from './presentation/express/middlewares/errorHandler';

export const app = express();

app.set('trust proxy', 1);

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
const limiter = rateLimit({
  windowMs: 7 * 60 * 1000, // 7 minutes
  max: 1000, // limit each IP to 1000 requests
});
app.use(limiter);

// API Routes
app.use(BASE_ROUTE + '/auth', authRoute);
app.use(USER_BASE_ROUTE + '/dm', dmRoute);
app.use(USER_BASE_ROUTE + '/group', groupRoute);
app.use(USER_BASE_ROUTE + '/message', messageRoute);
app.use(USER_BASE_ROUTE + '/media', mediaRoute);
app.use(USER_BASE_ROUTE + '/payment', paymentRoute);
app.use(USER_BASE_ROUTE + '/profile', profileRoute);
app.use(USER_BASE_ROUTE + '/call', callRoute);
app.use(USER_BASE_ROUTE + '/plan', planRoute);

app.use(ADMIN_BASE_ROUTE + '/userManagement', userManagementRoute);
app.use(ADMIN_BASE_ROUTE + '/reportManagement', reportManagementRoute);
app.use(ADMIN_BASE_ROUTE + '/revenueManagement', revenueManagementRoute);
app.use(ADMIN_BASE_ROUTE + '/groupManagement', groupManagementRoute);
app.use(ADMIN_BASE_ROUTE + '/planManagement', planManagementRoute);
app.use(ADMIN_BASE_ROUTE + '/dashboard', dashboardRoute);

// error handler
app.use(errorHandler);

export default app;
