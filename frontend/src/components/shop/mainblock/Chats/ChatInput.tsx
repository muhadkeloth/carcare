import React, { useRef, useState } from 'react'
import { Input } from '../../../reuseComponents/ui/input';
import { Button } from '../../../reuseComponents/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faPaperPlane, faSmile, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { saveImageMessage, saveMessage } from '../../../../services/shopService';
import { sendMessage } from '../../../../services/socketService';
import { AnimatePresence, motion } from 'framer-motion';
import { ColorRing } from 'react-loader-spinner';
import Picker from '@emoji-mart/react';


const ChatInput = () => {
    const [message,setMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {activeChat} = useSelector((state:RootState) => state.chat)
    const [file, setFile] = useState<File | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [filePreview, setFilePreview] = useState<string|null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(false);


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
          setFilePreview(null)
        } catch (error) {
          console.log('error to save message',error)
        } finally{
          setIsLoading(false);
        }
      }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
        }
      };

        const handleFileChange = (
          event: React.ChangeEvent<HTMLInputElement>
        ) => {
          const selectedFile = event.target.files
            ? event.target.files[0]
            : null;
          if (selectedFile) {
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile));
          }
        };

        const removeFile = () => {
          setFile(null);
          setFilePreview(null);
        };

        const addEmoji = (emoji: any) => {
          setMessage((prev) => `${prev}${emoji.native}`);
          setShowEmojiPicker(false);
        };

  return (
    <div className="p-4 border-t border-border bg-background relative">
      <AnimatePresence>
        {filePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 left-4 bg-white p-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <img
              src={filePreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 "
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 relative">
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
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faSmile} />
        </Button>
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-20"
            >
              <Picker onEmojiSelect={addEmoji} />
            </motion.div>
          )}
        </AnimatePresence>

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!(message.trim() || file)}
        >
          {isLoading ? (
            <ColorRing
              visible={true}
              width="35"
              ariaLabel="color-ring-loading"
              wrapperClass="color-ring-wrapper"
              colors={["#fff", "#fff", "#fff", "#fff", "#ff"]}
            />
          ) : (
            <FontAwesomeIcon icon={faPaperPlane} className="w-6" />
          )}
        </Button>
      </div>
    </div>
    // <div className="p-4 border-t border-border bg-background">
    //   <div className="flex items-center gap-2">
    //     <Input
    //       type="file"
    //       accept="image/*"
    //       className="hidden"
    //       ref={fileInputRef}
    //       onChange={handleFileChange}
    //     />
    //     <Button
    //       variant="outline"
    //       size="icon"
    //       onClick={() => fileInputRef.current?.click()}
    //     >
    //       <FontAwesomeIcon icon={faImages} />
    //     </Button>
    //     <Input
    //       value={message}
    //       onChange={(e) => setMessage(e.target.value)}
    //       onKeyDown={handleKeyPress}
    //       placeholder="Type your message..."
    //       className="flex-1"
    //     />
    //     <Button onClick={handleSendMessage} disabled={!(message.trim() || file)}>
    //       <FontAwesomeIcon icon={faPaperPlane} />
    //     </Button>
    //   </div>
    // </div>
  );
}

export default ChatInput