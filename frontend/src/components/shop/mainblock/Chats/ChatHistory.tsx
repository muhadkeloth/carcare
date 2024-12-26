import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cleanupSocket, connectSocket } from "../../../../services/socketService";
import { clearChat, setChats } from "../../../../features/chatSlice";
import { fetchChatRooms } from "../../../../services/shopService";
import ChatSidebar from "./ChatSidebar";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatHeader from "./ChatHeader";
import { RootState } from "../../../../store";


export interface CurrentUser{
  name:string;
  isOnline?:boolean
}

const ChatHistory = () => {
  const { _id:shopId } = useSelector((state:RootState)=>state.shop.shopDetails) || {};
  const roomId = useSelector((state:RootState)=> state.chat.activeChat);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({name:""});
  const dispatch = useDispatch();


    useEffect(()=> {
      if(shopId) connectSocket(shopId);

      return () => {
        cleanupSocket()
        dispatch(clearChat())
      }
    },[shopId,dispatch]);

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
    <div className="flex flex-col h-screen max-h-screen ">
        <div className="flex bg-background rounded-md overflow-hidden flex-1">
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

      <div className="flex-1 flex flex-col  min-w-0 h-full">
        <ChatHeader
          name={currentUser.name}
          isOnline={currentUser?.isOnline || false}
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