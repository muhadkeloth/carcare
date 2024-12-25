import React, { useRef, useState } from 'react'
import { Input } from '../../../reuseComponents/ui/input';
import { Button } from '../../../reuseComponents/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { saveImageMessage, saveMessage } from '../../../../services/shopService';
import { sendMessage } from '../../../../services/socketService';

const ChatInput = () => {
    const [message,setMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {activeChat} = useSelector((state:RootState) => state.chat)
    const [file, setFile] = useState<File | null>(null);

    const handleSendMessage = async() => {
      if (activeChat && (message.trim() || file) ) {
        try {
          let imagePath:string|null = null;
          if (file) {
            const formData = new FormData();
            formData.append("image", file);
            const response = await saveImageMessage(formData);
            imagePath = response.data.image;
          }
          const response = await saveMessage(activeChat,message,imagePath);
          if(response?.data?.savedMessage){
            sendMessage({
              room:activeChat,
              message,
              senderId:response?.data?.savedMessage.senderId,
              ...(imagePath ? {image:imagePath} : {})
            });
          }
          setMessage('');
          setFile(null);
        } catch (error) {
          console.log('error to save message',error)
        } 
      }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
        }
      };

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
              const selectedFile = event.target.files ? event.target.files[0] : null;
              if (selectedFile) {
                setFile(selectedFile);
              }
            };

  return (
    <div className="p-4 border-t border-border bg-background">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
        >
          <FontAwesomeIcon icon={faImages} />
        </Button>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button onClick={handleSendMessage} disabled={!(message.trim() || file)}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </Button>
      </div>
    </div>
  )
}

export default ChatInput