import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { ArrowDown, CheckCheck, Crown, Download, Expand, Heart, Image, Sparkles, X } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle scroll to show/hide scroll button
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const bottomThreshold = 100;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < bottomThreshold;
    
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = [];
    let currentGroup = [];
    let currentDate = '';

    messages.forEach((message, index) => {
      const messageDate = new Date(message.createdAt).toLocaleDateString();
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: currentGroup
          });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
      
      // Add the last group
      if (index === messages.length - 1) {
        groups.push({
          date: currentDate,
          messages: currentGroup
        });
      }
    });
    
    return groups;
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-100">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100 relative">
      <ChatHeader />

      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-base-100/50 backdrop-blur-sm custom-scrollbar"
        style={{
          backgroundImage: "radial-gradient(circle at 25% 10%, rgba(var(--primary-rgb), 0.07) 0%, transparent 70%), radial-gradient(circle at 75% 90%, rgba(var(--primary-rgb), 0.05) 0%, transparent 70%), linear-gradient(to bottom, rgba(var(--primary-rgb), 0.01), transparent)",
          backgroundSize: "100% 100%, 100% 100%, 100% 100%",
          backgroundPosition: "center, center, center",
          backgroundRepeat: "no-repeat, no-repeat, no-repeat"
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center px-10 py-12 rounded-2xl bg-gradient-to-br from-base-200/80 to-base-300/30 backdrop-blur-md max-w-md shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-8 -top-8 size-20 rounded-full bg-primary/5 blur-xl"></div>
                <div className="absolute -left-8 -bottom-8 size-20 rounded-full bg-primary/5 blur-xl"></div>
              </div>
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="size-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-inner">
                    <Image className="size-8 text-primary/70" />
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-3">No messages yet</h3>
                <p className="text-base-content/70 mb-5">
                  Start the conversation with {selectedUser.fullName}. Say hello!
                </p>
                <div className="flex justify-center">
                  <motion.div 
                    animate={{ y: [0, -5, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-primary flex items-center gap-1 text-sm font-medium opacity-60"
                  >
                    <Sparkles className="size-4" />
                    <span>Start chatting</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <AnimatePresence>
            {messageGroups.map((group, groupIndex) => (
              <div key={group.date} className="space-y-5">
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-base-300/40 via-base-300/70 to-base-300/40 text-xs px-5 py-1.5 rounded-full text-base-content/80 font-medium shadow-sm backdrop-blur-sm">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="size-3 text-primary/70" />
                      <span>
                        {new Date(group.date).toLocaleDateString(undefined, { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <Sparkles className="size-3 text-primary/70" />
                    </div>
                  </div>
                </div>
                
                {group.messages.map((message, index) => {
                  const isAuthUserMessage = message.senderId === authUser._id;
                  const showAvatar = index === 0 || 
                    group.messages[index - 1].senderId !== message.senderId;
                  const isLastInGroup = index === group.messages.length - 1 || 
                    group.messages[index + 1].senderId !== message.senderId;
                  const isLastMessage = groupIndex === messageGroups.length - 1 && 
                    index === group.messages.length - 1;
                  const isRead = true; // In a real app, get this from message state
                  
                  return (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`chat ${isAuthUserMessage ? "chat-end" : "chat-start"}`}
                      ref={isLastMessage ? messageEndRef : null}
                    >
                      <div className="chat-image avatar">
                        <div 
                          className={`size-11 rounded-full overflow-hidden ${
                            isAuthUserMessage 
                              ? 'bg-gradient-to-br from-primary/40 to-primary/5 p-0.5' 
                              : 'bg-gradient-to-br from-base-300/80 to-base-300/20 p-0.5'
                            } flex items-center justify-center shadow-md ${!showAvatar && 'opacity-0'}`}
                        >
                          <div className="size-full rounded-full overflow-hidden flex items-center justify-center">
                            <img
                              src={
                                isAuthUserMessage
                                  ? authUser.profilePic || "/avatar.png"
                                  : selectedUser.profilePic || "/avatar.png"
                              }
                              alt="profile pic"
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.src = "/avatar.png";
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {showAvatar && (
                        <div className="chat-header mb-1">
                          <span className={`font-medium text-xs mr-2 ${isAuthUserMessage ? 'text-primary/80' : ''} flex items-center gap-1`}>
                            {isAuthUserMessage ? (
                              <>
                                <span>You</span>
                                <Crown className="size-3 text-amber-400" />
                              </>
                            ) : (
                              selectedUser.fullName
                            )}
                          </span>
                          <time className="text-xs opacity-50">
                            {formatMessageTime(message.createdAt)}
                          </time>
                        </div>
                      )}
                      <div className={`chat-bubble flex flex-col ${
                        isAuthUserMessage 
                          ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-content hover:shadow-lg hover:from-primary/95 hover:to-primary/85' 
                          : 'bg-gradient-to-br from-base-300 to-base-300/90 hover:shadow-lg hover:from-base-300/95 hover:to-base-300/85'
                      } transition-all shadow-md ${
                        !isLastInGroup ? 'mb-1' : ''
                      } ${
                        !showAvatar ? (isAuthUserMessage ? 'rounded-tr-sm' : 'rounded-tl-sm') : ''
                      } ${message.image && !message.text ? 'p-1 overflow-hidden' : ''}`}>
                        {message.image && (
                          <div className={`relative group ${!message.text ? '' : 'mb-2'}`}>
                            <div className={`${!message.text ? 'overflow-hidden rounded-md' : ''}`}>
                              <img
                                src={message.image}
                                alt="Attachment"
                                className={`sm:max-w-[280px] max-w-[210px] rounded-md hover:opacity-95 transition-all cursor-pointer ${!message.text ? 'hover:scale-[1.02]' : ''}`}
                                onClick={() => setPreviewImage(message.image)}
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex justify-center items-end pb-2">
                              <div className="flex gap-2">
                                <button 
                                  className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md text-gray-800 hover:text-primary transition-all hover:scale-105"
                                  onClick={() => setPreviewImage(message.image)}
                                >
                                  <Expand className="size-4" />
                                </button>
                                <a 
                                  href={message.image} 
                                  download 
                                  target="_blank" 
                                  className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md text-gray-800 hover:text-primary transition-all hover:scale-105"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Download className="size-4" />
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                        {message.text && <p className="leading-relaxed">{message.text}</p>}
                      </div>
                      <div className="chat-footer opacity-70 text-xs flex items-center gap-1">
                        {!showAvatar && (
                          <time className="text-xs">
                            {formatMessageTime(message.createdAt)}
                          </time>
                        )}
                        {isAuthUserMessage && (
                          <span className="text-primary/80 ml-1 flex items-center gap-0.5">
                            {isRead ? (
                              <CheckCheck className="size-3" />
                            ) : (
                              <span className="size-1.5 bg-primary/40 rounded-full"></span>
                            )}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute -top-12 right-0 bg-white/20 hover:bg-white/30 rounded-full p-2.5 text-white transition-all hover:scale-105"
                onClick={() => setPreviewImage(null)}
              >
                <X className="size-5" />
              </button>
              
              <img 
                src={previewImage} 
                alt="Enlarged preview" 
                className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
              
              <div className="mt-5 flex justify-center space-x-4">
                <a 
                  href={previewImage} 
                  download 
                  target="_blank" 
                  className="btn btn-sm gap-2 bg-white/20 hover:bg-white/30 text-white border-none transition-all hover:scale-105"
                >
                  <Download className="size-4" />
                  Download
                </a>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="btn btn-sm gap-2 bg-white/20 hover:bg-white/30 text-white border-none transition-all hover:scale-105"
                >
                  <X className="size-4" />
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-24 right-4 bg-gradient-to-br from-primary to-primary/85 text-primary-content p-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            onClick={scrollToBottom}
          >
            <ArrowDown className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(var(--b1), 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--p), 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--p), 0.3);
        }
      `}</style>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
