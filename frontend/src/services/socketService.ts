import { io, Socket } from 'socket.io-client'
import { Message } from '../features/chatSlice';

let socket:Socket|null = null;
const socketURL = import.meta.env.VITE_ENDPORTSOCKETBACKEND;

export const connectSocket = (userId:string):Socket => {
    if(socket) return socket;

    socket = io(socketURL, {
        transports:['websocket'],
        query:{userId}
    });

    socket.on('connect', () => {
        console.log('connected to socket server in frontend');
    });

    socket.on('disconnect', () => {
        console.log('disconnected from the socket server');
    })
    return socket;
}


export const joinRoom = (room: string) => {
      if (socket) {
      socket?.emit('leaveRoom','all');  
      socket?.emit('joinRoom', room);  
        }
  };

  export const leaveRoom = (room: string) => {
    if (socket) {
      socket?.emit("leaveRoom", room);
    }
  };

  export const sendMessage = (messageData:{room: string, message: string,senderId:string,file?:File}) => {
    if (socket) {
        socket?.emit('sendMessage', messageData); 
    }
};


export const onNewMessage = (callback: (message: Message) => void) => {
    if (socket) {
        socket.off('newMessage');
        socket.on('newMessage', callback);
    }
};

export const getOnlineUsers = (callback: (users: { userId: string; isOnline: boolean }[]) => void) => {
    if (socket) {
        socket.off('onlineUsers'); 
        socket.on('onlineUsers', callback); 
      }
};

export const onNotification  = (callback: (data:any) => void) => {
    if (socket) {
        socket.off('notification'); 
        socket.on('notification', callback);
    }
};


export const cleanupSocket = () => {
    if (socket) {
        // socket.off('connect');
        socket.off('newMessage');
        socket.off('onlineUsers');
        socket.off('notification');
        socket.off('disconnect');
        // socket.disconnect()
        // socket = null;
        console.log('socket disconnected manually')
    }
};



