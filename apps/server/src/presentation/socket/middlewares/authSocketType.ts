import 'socket.io';
import { CustomPayloadType } from '../../../domain/entity/auth/authTypes';

declare module 'socket.io' {
  interface Socket {
    user?: CustomPayloadType;
  }
}
