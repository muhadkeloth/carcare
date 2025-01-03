import { Server } from "socket.io";
import { chatHandler } from "./chatHandler";


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
  io.on("connection", (socket) => {
    chatHandler(io, socket);
  });
};


