// types/socket.d.ts
import { JwtPayload } from 'jsonwebtoken';
import 'socket.io';
import { CustomPayloadType } from './commonTypes/payloadType';

declare module 'socket.io' {
  interface Socket {
    user?: CustomPayloadType;
  }
}

export interface TokenPayload extends JwtPayload, CustomPayloadType {}
