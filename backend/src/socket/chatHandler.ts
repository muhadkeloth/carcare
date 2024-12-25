// import { Server, Socket } from "socket.io";
// import logger from "../middleware/logger";

// // let onlineUsers:{userId:string;socketId:any}[] = [];

// export const chatHandler = (io:Server, socket:Socket) => {
//     logger.info(`User connected: ${socket.id}`)

//     socket.on('joinRoom', (room) => {
//         socket.join(room);
//         logger.info(`User joined room: ${room}`)
//     });

    
//     socket.on('sendMessage', ({ room, message,senderId }) => {
//         logger.info(`Message from ${senderId} in room ${room}: ${message}`);
//         io.to(room).emit('newMessage', { _id:Date.now(),ChatId:room,message, senderId,createdAt:new Date() });
//     });


//     // socket.on("addNewUser",(userId:string) => {
//     //     !onlineUsers.some(user => user.userId === userId) &&
//     //     onlineUsers.push({userId,socketId:socket.id,})
//     // })

//     // socket.on('message', (data) => {
//     //     io.to(data.room).emit('message',data);
//     // });














//       // Leave a room
//       socket.on('leaveRoom', (room) => {
//         socket.leave(room);
//         logger.info(`User ${socket.id} left room: ${room}`);
//     });


//     // Send notifications (Example: Emit a notification to all clients)
//     socket.on('sendNotification', (notification) => {
//         io.emit('notification', notification);
//         console.log(`Notification sent: ${notification}`);
//     });

    
//     socket.on('disconnect', () => {
//         logger.info(`User disconnected: ${socket.id}`)
//     })
// }

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

    // io.emit('userOnlineStatus', { userId, isOnline: true });
    console.log('onlineUsers',Array.from(onlineUsers.entries()).map(([id])=>({userId:id,isOnline:true})))
    io.emit('onlineUsers', Array.from(onlineUsers.entries()).map(([id])=>({userId:id,isOnline:true})));

    socket.on('joinRoom', (room) => {
        socket.join(room);

        const unread = unreadMessages.get(room) || [];
        const lastMessage = unread.slice(-1)[0] || null;

        io.to(socket.id).emit('roomData', { lastMessage, unread });  

        unreadMessages.delete(room);
        logger.info(`User joined room: ${room}`)
    });

    
    socket.on('sendMessage', (messageData:{room: string, message: string,senderId:string,image?:string}) => {
        const newMessage = {_id:Date.now(),ChatId:messageData.room,message:messageData.message,senderId: messageData.senderId,createdAt:new Date().toISOString(),...(messageData.image?{image:messageData.image}:{})};
        io.to(messageData.room).emit('newMessage', newMessage);
        if(!unreadMessages.has(messageData.room)) unreadMessages.set(messageData.room, []);
        unreadMessages.get(messageData.room)?.push(newMessage);
      
        io.to(messageData.room).emit('notification', { room:messageData.room, message:messageData.message,senderId:messageData.senderId});
        logger.info(`Message from ${messageData.senderId} in room ${messageData.room}: ${messageData.message}`);
    });
    // socket.on('sendMessage', ({ room, message,senderId }) => {
    //     const newMessage = {_id:Date.now(),ChatId:room,message, senderId,createdAt:new Date().toISOString()};
    //     io.to(room).emit('newMessage', newMessage);
    //     if(!unreadMessages.has(room)) unreadMessages.set(room, []);
    //     unreadMessages.get(room)?.push(newMessage);
      
    //     io.to(room).emit('notification', { room, message,senderId});
    //     logger.info(`Message from ${senderId} in room ${room}: ${message}`);
    // });

    
    socket.on("leaveRoom", (room) => {
            socket.leave(room);
            logger.info(`User ${socket.id} left room: ${room}`);
            io.to(room).emit('userLeftRoom', { userId });//
    });
    
    socket.on('disconnect', () => {
        if (userId) {
            onlineUsers.delete(userId);
            // io.emit('userOnlineStatus', { userId, isOnline: false }); 
            io.emit('onlineUsers', Array.from(onlineUsers.entries()).map(([id])=> ({userId:id,isOnline:true})));
          }
        logger.info(`User disconnected: ${socket.id}`)
    })
}