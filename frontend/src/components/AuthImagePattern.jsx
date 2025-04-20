import { useEffect, useState } from "react";

const AuthImagePattern = ({ title, subtitle }) => {
  const [activeIndex, setActiveIndex] = useState(4); // Start with middle tile active

  useEffect(() => {
    // Create a sequence that moves around the grid in a pattern
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 9);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-md text-center relative z-10">
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl transition-all duration-500 shadow-sm
                ${i === activeIndex 
                  ? "bg-primary/20 scale-110 shadow-md" 
                  : i % 3 === 0 
                    ? "bg-primary/10 animate-pulse" 
                    : i % 3 === 1 
                      ? "bg-secondary/10" 
                      : "bg-base-300"
                }`}
              style={{ 
                animationDuration: `${2 + (i % 3)}s`,
                transform: i === activeIndex ? "scale(1.1)" : "scale(1)"
              }}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{title}</h2>
        <p className="text-base-content/70 text-lg">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
