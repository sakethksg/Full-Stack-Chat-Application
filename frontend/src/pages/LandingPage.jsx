import { Link } from "react-router-dom";
import { MessageSquare, Users, Shield, Zap, ArrowRight } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { useEffect, useState } from "react";

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="bg-base-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-base-content/70">{description}</p>
    </div>
  );
};

const LandingPage = () => {
  const { theme } = useThemeStore();
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "Connect with friends in real-time";
  
  useEffect(() => {
    setIsVisible(true);
    
    // Typing animation effect
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    
    return () => clearInterval(typingInterval);
  }, []);

  // Floating animation for chat bubbles
  const [bubblePositions, setBubblePositions] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBubblePositions(prev => 
        prev.map(() => ({ 
          x: Math.random() * 10 - 5, 
          y: Math.random() * 10 - 5 
        }))
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className={`flex-1 space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {typedText}<span className="text-primary animate-pulse">|</span>
              </h1>
              <p className="text-xl text-base-content/70 max-w-lg animate-fadeIn" style={{ animationDelay: '1000ms' }}>
                A modern chat application built with security and performance in mind. Stay connected with your friends and colleagues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fadeIn" style={{ animationDelay: '1500ms' }}>
                <Link to="/signup" className="btn btn-primary group">
                  Get Started <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="btn btn-outline hover:scale-105 transition-transform">
                  Sign In
                </Link>
              </div>
            </div>
            <div className={`flex-1 relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative z-10 hover:scale-[1.02] transition-transform duration-500">
                <div className="bg-base-200 rounded-xl shadow-xl overflow-hidden border border-base-300" data-theme={theme}>
                  {/* Mock Chat UI */}
                  <div className="p-3 border-b border-base-300 flex items-center gap-3">
                    <div className="avatar">
                      <div className="size-10 rounded-full">
                        <img src="/avatar.png" alt="User" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-4 min-h-[300px] bg-base-100">
                    <div className="flex justify-start transition-transform duration-500" 
                      style={{ transform: `translate(${bubblePositions[0].x}px, ${bubblePositions[0].y}px)` }}>
                      <div className="max-w-[80%] rounded-xl p-3 bg-base-200 hover:shadow-md transition-shadow">
                        <p className="text-sm">Hey! How's it going?</p>
                        <p className="text-[10px] mt-1.5 text-base-content/70">12:00 PM</p>
                      </div>
                    </div>
                    <div className="flex justify-end transition-transform duration-500"
                      style={{ transform: `translate(${bubblePositions[1].x}px, ${bubblePositions[1].y}px)` }}>
                      <div className="max-w-[80%] rounded-xl p-3 bg-primary text-primary-content hover:shadow-md transition-shadow">
                        <p className="text-sm">I'm doing great! Just checking out this new chat app.</p>
                        <p className="text-[10px] mt-1.5 text-primary-content/70">12:01 PM</p>
                      </div>
                    </div>
                    <div className="flex justify-start transition-transform duration-500"
                      style={{ transform: `translate(${bubblePositions[2].x}px, ${bubblePositions[2].y}px)` }}>
                      <div className="max-w-[80%] rounded-xl p-3 bg-base-200 hover:shadow-md transition-shadow">
                        <p className="text-sm">It looks amazing! I love the design.</p>
                        <p className="text-[10px] mt-1.5 text-base-content/70">12:02 PM</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-base-300">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered flex-1 text-sm h-10"
                        placeholder="Type a message..."
                      />
                      <button className="btn btn-primary h-10 min-h-0 hover:scale-105 transition-transform">
                        <Zap size={18} className="animate-pulse" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 size-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <div className="absolute -top-6 -left-6 size-64 bg-secondary/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '4s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-base-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 animate-fadeIn">Why Choose Chatty?</h2>
            <p className="text-base-content/70 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '200ms' }}>
              Our platform offers a seamless communication experience with powerful features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Zap className="size-6 text-primary animate-pulse" />}
              title="Real-time Messaging"
              description="Send and receive messages instantly with our powerful Socket.io integration"
              delay={0}
            />
            <FeatureCard
              icon={<Shield className="size-6 text-primary animate-pulse" style={{ animationDelay: '1s' }} />}
              title="Secure Communication"
              description="Your conversations are protected with industry-standard security protocols"
              delay={200}
            />
            <FeatureCard
              icon={<Users className="size-6 text-primary animate-pulse" style={{ animationDelay: '2s' }} />}
              title="User Presence"
              description="See when your contacts are online and ready to chat"
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-base-300 rounded-2xl p-8 md:p-12 text-center hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-base-content/70 max-w-2xl mx-auto mb-8">
              Join thousands of users already enjoying our platform. Create your account today and start connecting.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup" className="btn btn-primary group">
                Create Account <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="btn btn-outline hover:scale-105 transition-transform">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-base-300">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center hover:rotate-12 transition-transform">
                <MessageSquare className="size-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </div>
            <div className="text-sm text-base-content/70">
              © {new Date().getFullYear()} Chatty. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;