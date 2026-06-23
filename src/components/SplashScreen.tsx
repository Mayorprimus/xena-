import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cpu, Sparkles, Globe, Key, CloudLightning } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Secure Handshake...');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const statuses = [
      { threshold: 10, text: 'Resolving XENA Sovereign Node Cluster...' },
      { threshold: 25, text: 'Connecting to Apex Equity Liquidity Gateways...' },
      { threshold: 45, text: 'Instantiating Multi-Signature Escrow Vault...' },
      { threshold: 65, text: 'Synchronizing NGN-Insured Share Ledgers...' },
      { threshold: 85, text: 'Performing Cryptographic Zero-Knowledge Audits...' },
      { threshold: 95, text: 'Sovereign Ledger Online. Decryption Successful.' },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        const currentProgress = next >= 100 ? 100 : next;

        const matchingStatus = [...statuses]
          .reverse()
          .find((s) => currentProgress >= s.threshold);
        if (matchingStatus) {
          setStatusText(matchingStatus.text);
        }

        if (currentProgress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
          }, 900);
        }
        return currentProgress;
      });
    }, 100);

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
            transition: { duration: 0.5 } 
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070b13] text-white p-6 overflow-hidden select-none"
        >
          <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
            
            {/* Plain and Simple Brand Logo */}
            <div className="relative mb-8">
              <div className="w-16 h-16 bg-[#0c1222] rounded-xl border border-blue-500 flex items-center justify-center shadow-lg">
                <span className="text-4xl font-sans font-black text-blue-400">
                  X
                </span>
              </div>
            </div>
  
            {/* Title Block with simple branding */}
            <motion.div
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="space-y-2 mb-8 font-sans"
            >
              <h1 className="text-2xl font-black tracking-tight text-white uppercase flex items-center justify-center gap-2">
                <span className="text-blue-400">X</span>ENA PREMIUM WEALTH
              </h1>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Automated platform for stock shares & digital assets.
              </p>
            </motion.div>

            {/* Simple Progress Container */}
            <div className="w-full max-w-xs space-y-3 px-2">
              <div className="h-1.5 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>

              <div className="flex justify-between items-center text-slate-500 text-[9.5px] font-mono uppercase font-bold">
                <span className="flex items-center gap-1 text-blue-400">
                  SSL SECURE API
                </span>
                <span className="text-blue-400">{progress}% COMPLETE</span>
                <span className="text-blue-400">AES-256 SYSTEM</span>
              </div>

              <div className="h-6 flex items-center justify-center">
                <p className="text-slate-400 text-xs font-semibold">
                  {statusText}
                </p>
              </div>
            </div>

            {/* Clean, official corporate partner & compliance footer badge */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[8.5px] font-mono tracking-widest uppercase font-bold text-slate-500 whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> SYSTEM ONLINE • CBN COMPLIANT LEDGER
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
