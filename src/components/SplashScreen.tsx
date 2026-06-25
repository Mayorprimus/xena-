import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import XenaLogo from './XenaLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 15) + 10;
        const currentProgress = next >= 100 ? 100 : next;

        if (currentProgress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
          }, 400);
        }
        return currentProgress;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          id="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            transition: { duration: 0.3, ease: 'easeInOut' } 
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070b13] text-white p-6 select-none"
        >
          <div className="flex flex-col items-center max-w-xs w-full text-center space-y-6">
            
            {/* Minimalist Brand Logo */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-2"
            >
              <XenaLogo size={100} showText={true} textSize="text-sm" textTracking="tracking-[0.6em]" />
            </motion.div>
  
            {/* Simple Progress Bar */}
            <div className="w-full space-y-2">
              <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.1 }}
                />
              </div>
              <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                Loading... {progress}%
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
