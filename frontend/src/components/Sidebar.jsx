import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter users based on online status and search query
  const filteredUsers = users
    .filter(user => {
      const matchesOnlineFilter = showOnlineOnly ? onlineUsers.includes(user._id) : true;
      const matchesSearch = searchQuery 
        ? user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesOnlineFilter && matchesSearch;
    })
    .sort((a, b) => {
      // Sort online users first
      const aIsOnline = onlineUsers.includes(a._id);
      const bIsOnline = onlineUsers.includes(b._id);
      
      if (aIsOnline && !bIsOnline) return -1;
      if (!aIsOnline && bIsOnline) return 1;
      
      // Then sort by name
      return a.fullName.localeCompare(b.fullName);
    });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-80 border-r border-base-200 bg-base-100/80 backdrop-blur-sm flex flex-col transition-all duration-300 shadow-sm">
      <div className="border-b border-base-200 w-full p-4 bg-base-200/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Users className="size-5 text-primary" />
          </div>
          <span className="font-medium hidden lg:block text-base-content">Contacts</span>
          <div className="badge badge-sm badge-primary ml-auto hidden lg:flex">
            {onlineUsers.length - 1} online
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="space-y-2 hidden lg:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-sm input-bordered w-full pl-9 bg-base-100/70 focus:bg-base-100 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/50" />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-primary checkbox-xs"
              />
              <span className="text-sm">Show online only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-2 flex-1 scrollbar-thin">
        <AnimatePresence>
          {filteredUsers.length > 0 ? (
            <motion.div layout className="space-y-1 px-2">
              {filteredUsers.map((user) => {
                const isOnline = onlineUsers.includes(user._id);
                const isSelected = selectedUser?._id === user._id;
                
                return (
                  <motion.button
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedUser(user)}
                    className={`
                      w-full p-2.5 flex items-center gap-3 rounded-lg
                      transition-all duration-200
                      ${isSelected 
                        ? "bg-primary/10 text-primary-content" 
                        : "hover:bg-base-200"
                      }
                    `}
                  >
                    <div className="relative mx-auto lg:mx-0">
                      <div className={`size-12 rounded-full overflow-hidden border-2 ${isSelected ? 'border-primary/30' : 'border-base-300'} flex items-center justify-center shadow-sm ${isOnline ? 'ring-2 ring-success/20' : ''}`}>
                        <img
                          src={user.profilePic || "/avatar.png"}
                          alt={user.name}
                          className={`h-full w-full object-cover transition-all ${isSelected ? 'saturate-100' : 'saturate-[0.85]'}`}
                          onError={(e) => {
                            e.target.src = "/avatar.png";
                          }}
                        />
                      </div>
                      {isOnline && (
                        <span
                          className={`absolute bottom-0.5 right-0.5 size-3 bg-success 
                          rounded-full border-2 border-base-100 ${isSelected ? 'animate-pulse' : ''}`}
                        />
                      )}
                    </div>

                    {/* User info - only visible on larger screens */}
                    <div className="hidden lg:block text-left min-w-0 flex-1">
                      <div className="font-medium truncate">{user.fullName}</div>
                      <div className={`text-xs flex items-center gap-1.5 ${isOnline ? 'text-success' : 'text-base-content/50'}`}>
                        <span className={`size-1.5 rounded-full ${isOnline ? 'bg-success' : 'bg-base-content/30'} ${isOnline && isSelected ? 'animate-ping' : ''}`}></span>
                        {isOnline ? "Online" : "Offline"}
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="w-1.5 h-8 bg-primary rounded-full hidden lg:block ml-2 animate-pulse"></div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-40 text-center p-4"
            >
              <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-3">
                <Users className="size-8 text-base-content/40" />
              </div>
              <p className="text-base-content/60 text-sm">
                {searchQuery 
                  ? `No contacts matching "${searchQuery}"`
                  : "No contacts available"}
              </p>
              {searchQuery && (
                <button 
                  className="btn btn-xs btn-ghost mt-2"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};
export default Sidebar;
