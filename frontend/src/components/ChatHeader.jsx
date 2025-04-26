import { ArrowLeft, MoreVertical, Phone, Video, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOptions, setShowOptions] = useState(false);
  
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-3 border-b border-base-300 bg-base-200/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back button (mobile) */}
          <button 
            onClick={() => setSelectedUser(null)} 
            className="md:hidden btn btn-sm btn-ghost btn-circle"
          >
            <ArrowLeft className="size-5" />
          </button>
          
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative border-2 border-base-300 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-base-100 flex items-center justify-center">
              <img 
                src={selectedUser.profilePic || "/avatar.png"} 
                alt={selectedUser.fullName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = "/avatar.png";
                }}
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 size-3 bg-success rounded-full border-2 border-base-100"></span>
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className={`text-xs ${isOnline ? 'text-success' : 'text-base-content/50'} flex items-center gap-1`}>
              <span className={`size-2 rounded-full ${isOnline ? 'bg-success animate-pulse' : 'bg-base-content/30'}`}></span>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button className="btn btn-sm btn-ghost btn-circle hidden md:flex hover:bg-base-300/50">
            <Phone className="size-4" />
          </button>
          <button className="btn btn-sm btn-ghost btn-circle hidden md:flex hover:bg-base-300/50">
            <Video className="size-4" />
          </button>
          
          <div className="relative">
            <button 
              className="btn btn-sm btn-ghost btn-circle hover:bg-base-300/50"
              onClick={() => setShowOptions(!showOptions)}
            >
              <MoreVertical className="size-4" />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 top-full mt-1 bg-base-100 shadow-lg rounded-lg p-2 border border-base-300 z-10 w-40">
                <ul className="space-y-1">
                  <li>
                    <button 
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-base-200 text-sm flex items-center gap-2"
                      onClick={() => setSelectedUser(null)}
                    >
                      <X className="size-4" />
                      Close chat
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
