import http from 'http';
import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import connectMongo from './config/db';
import { Server } from 'socket.io';
import { setupSocket } from './infrastructure/socket';
const PORT = process.env.PORT || 5000;

// Create HTTP server using Express app
const server = http.createServer(app);

// Setup all socket handlers
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
  pingInterval: 3000, // send ping every 5 seconds
  pingTimeout: 2000, // disconnect if no pong within 3s
});
setupSocket(io);

connectMongo();

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
