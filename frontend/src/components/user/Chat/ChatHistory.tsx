import { useEffect, useState } from 'react'
import Header from '../reusableComponents/Header'
import ChatSidebar from './ChatSidebar';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import { cleanupSocket, connectSocket } from '../../../services/socketService';
import { fetchChatRooms } from '../../../services/userService';
import { useDispatch, useSelector } from 'react-redux';
import {  clearChat, setChats } from '../../../features/chatSlice';
import { RootState } from '../../../store';
import ChatHeader from '../../reuseComponents/Chats/ChatHeader';

export interface CurrentUser{
  name:string;
  isOnline?:boolean
}

const ChatHistory = () => {
  const { _id:userId } = useSelector((state:RootState)=> state.user.userDetails) || {}
  const roomId = useSelector((state:RootState)=> state.chat.activeChat);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({name:""});
  const dispatch = useDispatch();

    useEffect(()=> {
      if(userId) connectSocket(userId);

      return () => {
        cleanupSocket()
        dispatch(clearChat())
      }
    },[userId,dispatch]);

    useEffect(()=>{
      const fetchRooms = async()=>{
        try {
          const response = await fetchChatRooms();
          dispatch(setChats(response.data.chatRooms))
        } catch (error) {
          console.error('error to fetch chat rooms ',error)
        }
      }
      fetchRooms()
    },[dispatch]);

    const handleUserSelection = (currentUserstatus: CurrentUser) => {
      setCurrentUser(currentUserstatus);
    };

  return (
    <>
        <Header />
    <div className="flex sticky top-0 flex-col h-screen max-h-screen">
        <div className="flex bg-background overflow-hidden flex-1">
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectUser={handleUserSelection}
      />
      
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <ChatHeader
          name={currentUser.name}
          isOnline={currentUser?.isOnline|| false}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <ChatMessages />
        {roomId &&  <ChatInput /> }       
      </div>
    </div>
    </div>        
    </>
  )
}

export default ChatHistory