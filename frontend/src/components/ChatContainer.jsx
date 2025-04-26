import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { ArrowDown, Image } from "lucide-react";

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
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-base-100/50 backdrop-blur-sm"
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.03) 0%, transparent 70%)",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 rounded-xl bg-base-200/50 backdrop-blur-sm max-w-md">
              <div className="flex justify-center mb-4">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Image className="size-8 text-primary/70" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">No messages yet</h3>
              <p className="text-base-content/70">
                Start the conversation with {selectedUser.fullName}. Say hello!
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messageGroups.map((group, groupIndex) => (
              <div key={group.date} className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-base-300/50 text-xs px-3 py-1 rounded-full text-base-content/70">
                    {new Date(group.date).toLocaleDateString(undefined, { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
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
                        <div className={`size-10 rounded-full overflow-hidden border-2 border-base-200 bg-base-100 flex items-center justify-center ${!showAvatar && 'opacity-0'}`}>
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
                      {showAvatar && (
                        <div className="chat-header mb-1">
                          <span className="font-medium text-xs mr-2">
                            {isAuthUserMessage ? "You" : selectedUser.fullName}
                          </span>
                          <time className="text-xs opacity-50">
                            {formatMessageTime(message.createdAt)}
                          </time>
                        </div>
                      )}
                      <div className={`chat-bubble flex flex-col ${
                        isAuthUserMessage 
                          ? 'bg-primary text-primary-content hover:bg-primary/90' 
                          : 'bg-base-300 hover:bg-base-300/90'
                      } transition-colors shadow-sm ${
                        !isLastInGroup ? 'mb-1' : ''
                      } ${
                        !showAvatar ? (isAuthUserMessage ? 'rounded-tr-sm' : 'rounded-tl-sm') : ''
                      }`}>
                        {message.image && (
                          <img
                            src={message.image}
                            alt="Attachment"
                            className="sm:max-w-[250px] rounded-md mb-2 hover:opacity-95 transition-opacity cursor-pointer"
                            onClick={() => window.open(message.image, '_blank')}
                          />
                        )}
                        {message.text && <p>{message.text}</p>}
                      </div>
                      {!showAvatar && (
                        <div className="chat-footer opacity-50 text-xs">
                          {formatMessageTime(message.createdAt)}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-20 right-4 bg-primary text-primary-content p-2.5 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
            onClick={scrollToBottom}
          >
            <ArrowDown className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
