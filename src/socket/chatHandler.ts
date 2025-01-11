import { Server, Socket } from "socket.io";
import logger from "../middleware/logger";

const unreadMessages: Map<string, any[]> = new Map();
const onlineUsers = new Map<string, string>(); 

export const chatHandler = (io:Server, socket:Socket) => {
    logger.info(`User connected: ${socket.id}`)

    const userId = Array.isArray(socket.handshake.query.userId)
    ? socket.handshake.query.userId[0]
    : socket.handshake.query.userId;

    if (!userId) {
        logger.warn(`Socket connected without userId: ${socket.id}`);
        return;
    }

    onlineUsers.set(userId, socket.id);

    io.emit(
      "onlineUsers",
      Array.from(onlineUsers.entries()).map(([id]) => ({
        userId: id,
        isOnline: true,
      }))
    );

    socket.on('joinRoom', (room) => {
        socket.join(room);

        // const unread = unreadMessages.get(room) || [];
        // const lastMessage = unread.slice(-1)[0] || null;

        // io.to(socket.id).emit('roomData', { lastMessage, unread });  

        unreadMessages.delete(room);
        logger.info(`User joined room: ${room}`)
    });

    
    socket.on(
      "sendMessage",
      (messageData: {room: string;message: string;senderId: string;image?: string;}) => {
        const newMessage = {
          _id: Date.now(),
          chatId: messageData.room,
          message: messageData.message,
          senderId: messageData.senderId,
          createdAt: new Date().toISOString(),
          ...(messageData.image ? { image: messageData.image } : {}),
        };

        io.to(messageData.room).emit("newMessage", newMessage);

        io.emit("lastMessageUpdate", newMessage)

        if (!unreadMessages.has(messageData.room))
          unreadMessages.set(messageData.room, []);
        unreadMessages.get(messageData.room)?.push(newMessage);

        io.to(messageData.room).emit("notification", {
          room: messageData.room,
          message: messageData.message,
          senderId: messageData.senderId,
        });
        logger.info(
          `Message from ${messageData.senderId} in room ${messageData.room}: ${messageData.message}`
        );
      }
    );
    
    socket.on("leaveRoom", (room) => {
            socket.leave(room);
            logger.info(`User ${socket.id} left room: ${room}`);
            io.to(room).emit('userLeftRoom', { userId });//
    });
    
    socket.on('disconnect', () => {
        if (userId) {
            onlineUsers.delete(userId);
            io.emit('onlineUsers', Array.from(onlineUsers.entries()).map(([id])=> ({userId:id,isOnline:true})));
          }
        logger.info(`User disconnected: ${socket.id}`)
    })
}