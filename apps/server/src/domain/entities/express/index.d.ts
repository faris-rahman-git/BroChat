// types/express/index.d.ts
import { JwtPayload } from 'jsonwebtoken';
import { CustomPayloadType } from '../commonTypes/payloadType';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload & CustomPayloadType;
  }
}
