import { Socket } from 'socket.io';
import { socketAdapter } from '../../adapters/socketAdapter';
import { webJoinRoomComposer } from '../../../infra/services/socketComposers/call/webJoinRoomComposer';
import { webCallUserComposer } from '../../../infra/services/socketComposers/call/webCallUserComposer';
import { webAcceptCallComposer } from '../../../infra/services/socketComposers/call/webAcceptCallComposer';
import { webLeaveRoomComposer } from '../../../infra/services/socketComposers/call/webLeaveRoomComposer';
import { webToggleCameraAudioComposer } from '../../../infra/services/socketComposers/call/webToggleCameraAudioComposer';

export const callHandler = (socket: Socket) => {
  socket.on(
    'web-join-room',
    async (data, ack) =>
      await socketAdapter(socket, data, ack, webJoinRoomComposer())
  );

  socket.on(
    'web-call-user',
    async (data, ack) =>
      await socketAdapter(socket, data, ack, webCallUserComposer())
  );

  socket.on(
    'web-accept-call',
    async (data, ack) =>
      await socketAdapter(socket, data, ack, webAcceptCallComposer())
  );

  socket.on(
    'web-leave-room',
    async (data, ack) =>
      await socketAdapter(socket, data, ack, webLeaveRoomComposer())
  );

  socket.on(
    'web-toggle-camera-audio',
    async (data, ack) =>
      await socketAdapter(socket, data, ack, webToggleCameraAudioComposer())
  );
};
