"use client"
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface ShiningTextProps {
  texts: string[];
  className?: string;
  cycleDuration?: number;
}

export function ShiningText({ texts, className = "", cycleDuration = 2000 }: ShiningTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, cycleDuration);

    return () => clearInterval(interval);
  }, [texts.length, cycleDuration]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.h1
          key={currentIndex}
          className={`bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-base font-regular text-transparent ${className}`}
          initial={{ backgroundPosition: "200% 0", opacity: 0 }}
          animate={{ 
            backgroundPosition: "-200% 0",
            opacity: 1
          }}
          exit={{ opacity: 0 }}
          transition={{
            backgroundPosition: {
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            },
            opacity: {
              duration: 0.3,
              ease: "easeInOut"
            }
          }}
        >
          {texts[currentIndex]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
