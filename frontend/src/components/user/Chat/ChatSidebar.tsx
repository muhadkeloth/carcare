import { useEffect, useState } from 'react'
import { CurrentUser } from './ChatHistory';
import { ScrollArea } from '../../reuseComponents/ui/scroll-area';
import { Button } from '../../reuseComponents/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faMessage, faX } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setActiveChat, setOnlineUsers } from '../../../features/chatSlice';
import { getOnlineUsers, leaveRoom, onNotification } from '../../../services/socketService';
import { useLocation } from 'react-router-dom';

interface ChatSidebarProps {
    isOpen:boolean;
    onClose:()=>void;
    onSelectUser:(user:CurrentUser) => void;
}


const ChatSidebar = ({isOpen,onClose,onSelectUser}:ChatSidebarProps) => {
  const [unreadCounts, setUnreadCounts] = useState<{[key:string]:number}>({})
  const {chats,activeChat,onlineUsers} = useSelector((state:RootState)=>state.chat);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    getOnlineUsers((users) => {
      dispatch(setOnlineUsers(users))
       });    
  },[dispatch]);
  
  
  useEffect(()=>{
    onNotification((data) => {
      const { room } = data;
      if(activeChat !== room){
        setUnreadCounts((prev) => ({
          ...prev,
          [room]: (prev[room] || 0) + 1,
        }));
      }
      });
  },[activeChat])

    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const roomId = searchParams.get('roomId');
      if(roomId && !activeChat) {
        const room = chats.find((chat) => chat._id ===roomId);
        if(room){
          dispatch(setActiveChat(roomId));
          onSelectUser({
            name:room.shopId.shopName,
            isOnline:isUserOnline(room.userId._id)
          })
        }
      }
    },[chats])

  const handleRoom = (room:any) => {
    if(activeChat) leaveRoom(activeChat);
    dispatch(setActiveChat(room._id));
    onSelectUser({
      name:room.shopId.shopName,
      isOnline:isUserOnline(room.shopId._id)
    });
    if (window.innerWidth < 1024) onClose();

    setUnreadCounts((prev)=>({
      ...prev,
      [room._id]:0,
    }));
  }

  const isUserOnline = (userId:string) => {
    return onlineUsers.some((user)=>user.userId === userId && user.isOnline);
  }
  
  return (
    <div
    className={`fixed inset-y-0 left-0 z-50 w-80 border-r border-border bg-background transform transition-transform duration-200 ease-in-out lg:relative lg:transform-none 
        ${isOpen ? "translate-x-0" : "-translate-x-full" }`}
  >
    <div className="p-4 border-b border-border text-primary flex justify-between items-center">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <FontAwesomeIcon className="w-5 h-5" icon={faMessage} />
        Messages
      </h2>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faX} />
      </Button>
    </div>
    <ScrollArea className="h-[calc(100vh-5rem)]">
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer relative"
          onClick={()=> handleRoom(chat)}
        >
          <div className="relative">
            {chat.shopId?.image ? (
              <img
                src={chat.shopId.image}
                alt={chat.shopId.shopName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
            <FontAwesomeIcon icon={faCircleUser} />
            )}
            {isUserOnline(chat.shopId._id) && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-medium truncate">{chat.shopId.shopName}</h3>
              <span className="text-xs text-muted-foreground">
                {/* {users[0].lastMessageTime} */}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {/* {users[0].lastMessage} */}
            </p>
          </div>
          {unreadCounts[chat._id] > 0 && (
            <div className="absolute right-4 bottom-4">
              <div className="bg-green-500 text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs">
                {unreadCounts[chat._id]}
              </div>
            </div>
          )}
        </div>
      ))}
    </ScrollArea>
  </div>
  )
}

export default ChatSidebar