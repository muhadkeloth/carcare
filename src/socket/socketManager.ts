import { Server } from "socket.io";
import { chatHandler } from "./chatHandler";
import logger from "../middleware/logger";


export const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: [
        process.env.ENDPORT_FRONTEND || "",
        process.env.ENDPORT_FRONTEND_LOCAL || "",
      ],
      methods:['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials:true,
    },
  });

  logger.warn("✅ WebSocket server initialized on the same port as Express");

  io.on("connection", (socket) => {
    logger.warn(`✅ WebSocket Connected: ${socket.id}`);
    chatHandler(io, socket);
  });

  io.on("error", (error) => {
    logger.error("❌ WebSocket Server Error:", error);
  });
};


