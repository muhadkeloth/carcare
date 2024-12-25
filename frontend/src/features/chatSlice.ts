import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Message = {
    _id?:string;
    chatId:string;
    senderId:string;
    message:string;
    image?:string;
    createdAt:string;
};

type onlineUser = {userId:string;isOnline:boolean}

interface ChatState {
    messages:Message[];
    chats:any[];
    activeChat:string | null;
    onlineUsers:onlineUser[],
    Notification:[];
}
const initialState:ChatState = {
    messages:[],
    chats:[],
    activeChat:null,
    onlineUsers:[],
    Notification:[],
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    addMessages(state, action: PayloadAction<Message>) {
      state.messages = [...state.messages, action.payload];
    },
    setChats(state, action:PayloadAction<any[]>) {
      state.chats = action.payload;
    },
    setActiveChat(state, action: PayloadAction<string|null>) {
      state.activeChat = action.payload;
    },
    setOnlineUsers(state, action: PayloadAction<onlineUser[]>) {
      state.onlineUsers = action.payload;
    },
    clearChat(){
      return initialState;
    },
    clearActiveChat(state) {
      state.activeChat = null;
    },
    //   addNotification(state, action) {
    //     state.notifications.push(action.payload);
    //   },
    //   clearNotifications(state, action) {
    //     state.notifications = state.notifications.filter(
    //       (n) => n.chatId !== action.payload
    //     );
    //   },
  },
});

export const { setMessages, addMessages,setOnlineUsers, setChats, setActiveChat,clearActiveChat ,clearChat} = chatSlice.actions;
export default chatSlice.reducer;