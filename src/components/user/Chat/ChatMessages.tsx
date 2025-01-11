import { useEffect, useRef, useState } from 'react'
import { ScrollArea } from '../../reuseComponents/ui/scroll-area';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { addMessages, setMessages, updateLastMessage } from '../../../features/chatSlice';
import { fetchAllMessages } from '../../../services/userService';
import { joinRoom,  leaveRoom,  onNewMessage } from '../../../services/socketService';
import { format } from 'date-fns';
import no_message from '../../../assets/images/no_message.svg'
import { Message } from '../../utilities/types';

  
const ChatMessages = () => {
  const {messages, activeChat, chats} = useSelector((state:RootState)=>state.chat)
  const [userId,setUserId] = useState('');
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);


  useEffect(()=>{
    if(activeChat){
      joinRoom(activeChat);
       fetchAllMessages(activeChat)
                  .then((response) =>{ dispatch(setMessages(response.data.allMessages))})
                  .catch((err) => {console.error('Error fetching messages:', err)});
      setUserId(chats.find((chat)=>chat._id === activeChat)?.userId?._id || '');
    };
    return ()=>{
     if(activeChat) leaveRoom(activeChat);
    }    
  },[activeChat, dispatch]);

  useEffect(()=>{
    onNewMessage((message:Message) => {
      dispatch(addMessages(message));
      // dispatch(updateLastMessage({
      //   roomId: message.chatId,
      //   message: message.message,
      //   createdAt: message.createdAt,
      // }));
    });
  },[dispatch,activeChat]);

  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4 max-w-3xl mx-auto">
        {activeChat ? (
          messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message._id}
                className={`flex mb-3 ${
                  message.senderId === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] shadow-md rounded-t-lg rounded-s-lg px-4 py-2 ${
                    message.senderId === userId
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Shared image"
                      className="rounded-lg mb-2 max-w-full"
                      loading="lazy"
                    />
                  )}
                  <p className="break-words">{message.message}</p>
                  <span
                    className={`text-xs block mt-1 ${
                      message.senderId === userId
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {format(message.createdAt, "hh:mm a")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-end h-screen">
              <span className="text-2xl font-semibold">Say Hi..</span>
            </div>
          )
        ) : (
          <div className="flex flex-col justify-center w-[70%]">
            <span className="text-center mb-4">No Messages Yet</span>
            <img src={no_message} alt="no_message" className="mt-5" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}

export default ChatMessages