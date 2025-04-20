import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`bg-base-100 fixed w-full top-0 z-40 h-16
      backdrop-blur-lg transition-all duration-300 border-b ${
        scrolled 
          ? "border-base-300 bg-base-100/90 shadow-sm" 
          : "border-transparent bg-base-100/50"
      }`}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-5 h-5 text-primary animate-pulse" style={{ animationDuration: '3s' }} />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Chatty</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {authUser ? (
              <>
                <Link
                  to={"/settings"}
                  className="btn btn-sm btn-ghost gap-2 hover:bg-base-200 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>

                <Link to={"/profile"} className="btn btn-sm btn-ghost gap-2 hover:bg-base-200 transition-colors">
                  <User className="size-4" />
                  <span>Profile</span>
                </Link>

                <div className="w-px h-6 bg-base-300 mx-1"></div>

                <button 
                  className="btn btn-sm btn-error btn-outline gap-2 hover:scale-105 transition-transform" 
                  onClick={logout}
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </button>
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
              className="btn btn-sm btn-ghost" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-base-100/95 ${
        mobileMenuOpen ? "max-h-60 py-3 border-t border-base-200" : "max-h-0"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-2 pb-2">
            {authUser ? (
              <>
                <Link
                  to={"/settings"}
                  className="btn btn-sm w-full justify-start gap-2 hover:bg-base-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>

                <Link 
                  to={"/profile"} 
                  className="btn btn-sm w-full justify-start gap-2 hover:bg-base-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="size-4" />
                  <span>Profile</span>
                </Link>

                <button 
                  className="btn btn-sm btn-error btn-outline w-full justify-start gap-2" 
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
      </div>
    </header>
  );
};
export default Navbar;
