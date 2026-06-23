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
            scale: 0.97,
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#03060c] text-white p-6 overflow-hidden select-none"
        >
          {/* Animated Matrix Background Accent */}
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          {/* High-Fidelity Radial Nebula Fields */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
            
            {/* Extremely Bright Glowing Brand Logo Container */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
              }}
              className="relative mb-10"
            >
              {/* Outer Cosmic Halo Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 rounded-3xl border border-indigo-500/20 pointer-events-none"
              />
              {/* Inner Cyber Concentric Solid & Dashed Rings */}
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 rounded-2xl border border-dashed border-cyan-400/35 pointer-events-none"
              />

              {/* The Central High-Performance Brand Plate */}
              <div className="relative w-24 h-24 bg-gradient-to-tr from-[#090e1a] via-[#04060c] to-[#0f1526] rounded-2xl border-2 border-indigo-500/40 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.25)] overflow-hidden">
                {/* Dynamic scanner line inside badge */}
                <motion.div 
                  animate={{ y: [-48, 48, -48] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[2px] bg-cyan-400/30 blur-[1px] pointer-events-none"
                />

                {/* Extremely Bright glowing "X" utilizing dual heavy drop-shadows */}
                <span className="text-5xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.95)] drop-shadow-[0_0_4px_rgba(99,102,241,0.95)] tracking-tighter select-none font-sans relative z-10 select-none">
                  X
                </span>
                
                {/* Shiny accent star positioned onto emblem */}
                <motion.div
                  animate={{ 
                    scale: [0.8, 1.3, 0.8],
                    opacity: [0.5, 1, 0.5] 
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1.5 right-1.5 z-20"
                >
                  <Sparkles className="w-4.5 h-4.5 text-cyan-400 fill-cyan-400/20" />
                </motion.div>
              </div>

              {/* Ping active status marker outside badge */}
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-[#03060c]"></span>
              </span>
            </motion.div>
  
            {/* Title Block with bright logo highlight */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                transition: { delay: 0.2, duration: 0.7 }
              }}
              className="space-y-3 mb-10"
            >
              <h1 className="font-sans text-3xl font-black tracking-tight text-white uppercase flex items-center justify-center gap-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] font-black">X</span>ENA <span className="text-cyan-455 font-bold text-[9px] tracking-widest px-2.5 py-1 border border-indigo-500/30 rounded bg-indigo-950/40 font-mono">PORTFOLIO</span>
              </h1>
              <div className="flex justify-center items-center gap-1.5">
                <span className="text-[10px] text-cyan-400 font-bold tracking-[0.25em] uppercase font-mono">
                  Sovereign Multi-Asset Ledger
                </span>
              </div>
              <p className="text-xs text-slate-400 font-extrabold max-w-sm leading-relaxed mt-1">
                Nigeria's premier automated platform for high-yield technology corporate equity options & secured real-time settlement assets.
              </p>
            </motion.div>

            {/* Premium Progress & Telemetry Feedback Container */}
            <div className="w-full space-y-4 px-2">
              
              {/* Outer slider rail with high-tech neon bar */}
              <div className="h-1.5 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-[1px] relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full relative"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut" }}
                >
                  {/* Glowing end node tip */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#38bdf8]" />
                </motion.div>
              </div>

              {/* Real-time Loading telemetry statistics */}
              <div className="flex justify-between items-center text-slate-500 text-[9.5px] font-mono tracking-wide uppercase font-bold">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" /> SSL SECURE API
                </span>
                <span className="text-cyan-400 font-black tracking-wide font-sans">{progress}% COMPLETE</span>
                <span className="flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-purple-400" /> AES-256 SYSTEM
                </span>
              </div>

              {/* Status stream line */}
              <div className="h-8 flex items-center justify-center">
                <motion.p
                  key={statusText}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-slate-350 text-xs font-bold leading-normal text-indigo-200"
                >
                  {statusText}
                </motion.p>
              </div>
            </div>

            {/* Clean, official corporate partner & compliance footer badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[8px] font-mono tracking-widest uppercase font-bold text-slate-500 whitespace-nowrap"
            >
              <ShieldCheck className="w-3 h-3 text-cyan-400" /> CBN-COMPLIANT DIGITAL SHARE LEDGER SYSTEMS • CBN APPROVED
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
