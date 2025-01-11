import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, onlineUser } from "../components/utilities/types";
import { ChatState } from "../components/utilities/interface";




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
    updateLastMessage(state, action: PayloadAction<{ roomId: string; message: string; createdAt: string }>) {
      const { roomId, message, createdAt } = action.payload;
      const room = state.chats.find((chat) => chat._id === roomId);
      if (room) {
        room.lastMessage = message;
        room.lastMessageDate = createdAt;
      }
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
  },
});

export const { setMessages, addMessages,setOnlineUsers, setChats,updateLastMessage, setActiveChat,clearActiveChat ,clearChat} = chatSlice.actions;
export default chatSlice.reducer;