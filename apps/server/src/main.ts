import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { setupSocket } from './presentation/socket';

const PORT = process.env.PORT || 5000;
import app from './app';
import connectMongo from './infra/databases/mongo/dbConnection';
import { cleanExpiredSubscriptions } from './presentation/jobs/handler/cleanExpiredSubscriptions';

dotenv.config();
// Create HTTP server using Express app
const server = http.createServer(app);

// Setup all socket handlers
export const io = new Server(server, {
  cors: {
    origin: "https://brochat-gules.vercel.app",
    credentials: true,
  },
  pingInterval: 3000, // send ping every 5 seconds
  pingTimeout: 2000, // disconnect if no pong within 3s
});
setupSocket(io);

connectMongo();

cleanExpiredSubscriptions();

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
