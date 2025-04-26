import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Paperclip, Send, Smile, Sparkles, X } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setIsUploading(false);
      textInputRef.current?.focus();
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    textInputRef.current?.focus();
  };

  const handleEmojiClick = (emojiData) => {
    setText((prevText) => prevText + emojiData.emoji);
    setShowEmojiPicker(false);
    textInputRef.current?.focus();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  const handleTextChange = (e) => {
    setText(e.target.value);
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      // Here you would typically emit a "typing" event to your backend
      // socket.emit("typing", selectedUser._id);
    } else if (isTyping && e.target.value.length === 0) {
      setIsTyping(false);
      // socket.emit("stop typing", selectedUser._id);
    }
  };

  return (
    <div className="p-3 md:p-4 w-full relative border-t border-base-200 bg-base-100/90 backdrop-blur-sm">
      <AnimatePresence>
        {imagePreview && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mb-3 flex items-start gap-3 bg-gradient-to-r from-base-200/40 to-base-200/60 p-3 rounded-xl backdrop-blur-sm"
          >
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-all border border-base-300 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0"></div>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 relative z-10"
                />
              </div>
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-base-300 shadow-md
                flex items-center justify-center hover:bg-error hover:text-white transition-colors"
                type="button"
                aria-label="Remove image"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <div className="flex flex-col text-sm">
              <div className="font-medium text-base-content flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary/70" />
                <span>Image ready to send</span>
              </div>
              <span className="text-xs text-base-content/60 mt-1">Click the send button to share this image</span>
              <button
                onClick={removeImage}
                className="mt-2 text-xs flex items-center gap-1 text-base-content/70 hover:text-error transition-colors self-start"
                type="button"
              >
                <X className="size-3" />
                Remove
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-4 z-10 shadow-xl rounded-lg"
          >
            <div className="relative">
              <button 
                onClick={() => setShowEmojiPicker(false)} 
                className="absolute -top-2 -right-2 bg-base-300 rounded-full size-6 flex items-center justify-center shadow-md hover:bg-error hover:text-white transition-colors"
              >
                <X className="size-3" />
              </button>
              <div className="rounded-lg overflow-hidden">
                <EmojiPicker 
                  onEmojiClick={handleEmojiClick} 
                  height={350} 
                  width={320}
                  searchPlaceHolder="Search emoji..."
                  previewConfig={{ showPreview: false }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSendMessage} className="relative">
        <div className="flex items-center gap-2 bg-base-200/50 hover:bg-base-200/60 focus-within:bg-base-100 rounded-2xl shadow-sm transition-all p-1 pl-2 pr-0.5">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-primary hover:bg-base-200/70"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={20} />
          </button>
          
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none py-2 px-1 focus:ring-0 placeholder:text-base-content/40"
            placeholder="Type a message..."
            value={text}
            onChange={handleTextChange}
            ref={textInputRef}
          />
          
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`btn btn-sm btn-circle btn-ghost
                     ${imagePreview ? "text-primary" : "text-base-content/60 hover:text-primary hover:bg-base-200/70"} relative`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Paperclip size={18} className="rotate-45" />
            )}
          </button>

          <button
            type="submit"
            className={`btn btn-sm h-10 w-10 rounded-full ${
              !text.trim() && !imagePreview 
                ? 'btn-disabled bg-base-300' 
                : 'bg-gradient-to-tr from-primary to-primary/85 text-primary-content hover:shadow-lg hover:scale-105'
            } transition-all`}
            disabled={!text.trim() && !imagePreview || isUploading}
          >
            {isUploading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-6 left-4 text-xs text-primary/70 flex items-center gap-1"
            >
              <span className="flex space-x-1 items-center">
                <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </span>
              <span>typing...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};
export default MessageInput;
