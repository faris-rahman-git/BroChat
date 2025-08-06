import 'socket.io';
import { CustomPayloadType } from '../../../domain/dtos/auth/authTypes';

declare module 'socket.io' {
  interface Socket {
    user?: CustomPayloadType;
  }
}
