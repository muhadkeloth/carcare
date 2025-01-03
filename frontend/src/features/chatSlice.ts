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

export const { setMessages, addMessages,setOnlineUsers, setChats, setActiveChat,clearActiveChat ,clearChat} = chatSlice.actions;
export default chatSlice.reducer;