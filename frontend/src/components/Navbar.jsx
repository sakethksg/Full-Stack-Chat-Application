import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, Menu, ChevronDown, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileDropdown(false);
    };

    if (showProfileDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showProfileDropdown]);

  return (
    <header
      className={`bg-base-100 fixed w-full top-0 z-40 h-16
      backdrop-blur-lg transition-all duration-300 border-b ${
        scrolled 
          ? "border-base-200 bg-base-100/95 shadow-sm" 
          : "border-transparent bg-base-100/80"
      }`}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="group flex items-center gap-2.5 hover:opacity-90 transition-all"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="size-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shadow-sm"
              >
                <MessageSquare className="w-5 h-5 text-primary animate-pulse" style={{ animationDuration: '3s' }} />
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                Chatty
              </motion.h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {authUser ? (
              <>
                <div className="indicator mr-3">
                  <span className="indicator-item badge badge-xs badge-primary"></span>
                  <button className="btn btn-sm btn-ghost btn-circle">
                    <Bell className="size-4" />
                  </button>
                </div>

                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                      showProfileDropdown ? 'bg-base-200/80' : 'hover:bg-base-200/50'
                    }`}
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
                    <div className="size-8 rounded-full overflow-hidden border-2 border-base-200 bg-base-100 flex items-center justify-center">
                      <img
                        src={authUser.profilePic || "/avatar.png"}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = "/avatar.png";
                        }}
                      />
                    </div>
                    <span className="font-medium text-sm">{authUser.fullName}</span>
                    <ChevronDown className={`size-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 w-56 bg-base-100 shadow-lg rounded-lg border border-base-200 overflow-hidden z-10"
                      >
                        <div className="p-3 border-b border-base-200 flex items-center gap-3">
                          <div className="size-10 rounded-full overflow-hidden bg-base-200 flex items-center justify-center">
                            <img
                              src={authUser.profilePic || "/avatar.png"}
                              alt="Profile"
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.src = "/avatar.png";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{authUser.fullName}</div>
                            <div className="text-xs text-base-content/60 truncate">{authUser.email}</div>
                          </div>
                        </div>
                        
                        <div className="p-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 w-full p-2 text-sm rounded-md hover:bg-base-200 transition-colors"
                            onClick={() => setShowProfileDropdown(false)}
                          >
                            <User className="size-4" />
                            <span>Your Profile</span>
                          </Link>
                          
                          <Link
                            to="/settings"
                            className="flex items-center gap-2 w-full p-2 text-sm rounded-md hover:bg-base-200 transition-colors"
                            onClick={() => setShowProfileDropdown(false)}
                          >
                            <Settings className="size-4" />
                            <span>Settings</span>
                          </Link>
                        </div>
                        
                        <div className="p-1 border-t border-base-200">
                          <button 
                            onClick={() => {
                              setShowProfileDropdown(false);
                              logout();
                            }} 
                            className="flex w-full items-center gap-2 p-2 text-sm rounded-md text-error hover:bg-error/10 transition-colors"
                          >
                            <LogOut className="size-4" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-ghost hover:bg-base-200 transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-sm btn-primary hover:scale-105 transition-transform">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              className="btn btn-sm btn-ghost btn-circle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-base-100/95 border-t border-base-200 shadow-md overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3">
              {authUser && (
                <div className="flex items-center gap-3 p-2 mb-2 border-b border-base-200 pb-3">
                  <div className="size-10 rounded-full overflow-hidden bg-base-200 flex items-center justify-center">
                    <img
                      src={authUser.profilePic || "/avatar.png"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = "/avatar.png";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{authUser.fullName}</div>
                    <div className="text-xs text-base-content/60 truncate">{authUser.email}</div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col gap-2 pb-1">
                {authUser ? (
                  <>
                    <Link
                      to={"/profile"}
                      className="btn btn-sm w-full justify-start gap-2 hover:bg-base-200 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="size-4" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      to={"/settings"}
                      className="btn btn-sm w-full justify-start gap-2 hover:bg-base-200 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="size-4" />
                      <span>Settings</span>
                    </Link>

                    <button 
                      className="btn btn-sm btn-error btn-outline w-full justify-start gap-2 mt-1" 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="size-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="btn btn-sm w-full justify-start hover:bg-base-200 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/signup" 
                      className="btn btn-sm btn-primary w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Navbar;
