import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Clock, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Landmark, 
  BadgeAlert, 
  Award, 
  TrendingUp, 
  Users, 
  Sparkles,
  Globe,
  Wallet
} from 'lucide-react';

interface WelcomeXenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasActiveInvestments: boolean;
}

export default function WelcomeXenaModal({ isOpen, onClose, hasActiveInvestments }: WelcomeXenaModalProps) {
  const [page, setPage] = useState<1 | 2 | 3>(1);

  const handleNext = () => {
    if (page < 3) {
      setPage((prev) => (prev + 1) as any);
    } else {
      onClose();
      // Reset after close transition completes
      setTimeout(() => setPage(1), 300);
    }
  };

  const handleBack = () => {
    if (page > 1) {
      setPage((prev) => (prev - 1) as any);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setPage(1), 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0c0817]/85 backdrop-blur-md flex items-center justify-center z-[1100] p-4 font-sans select-none"
        >
          <motion.div
            initial={{ scale: 0.93, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.93, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden text-left"
          >
            {/* Top decorative premium metallic copper/gold gradient bar */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-fuchsia-600 to-indigo-600 w-full" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-20 cursor-pointer"
              aria-label="Close modal"
              id="close-welcome-xena-modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content area */}
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Header Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black text-blue-800 bg-blue-50 border border-blue-150 px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  Verified Shareholder Hub
                </span>
                <span className="text-[10px] font-black text-amber-800 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1 font-mono">
                  {hasActiveInvestments ? '★ ACTIVE ACCRUAL TIER' : '★ STARTER TIER'}
                </span>
                <span className="text-[10px] font-black text-purple-800 bg-purple-50 border border-purple-150 px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1 font-mono">
                  PAGE {page} OF 3
                </span>
              </div>

              {/* Animated Carousel Pages */}
              <div className="min-h-[240px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {page === 1 && (
                    <motion.div
                      key="page1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl">
                          <Landmark className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-black tracking-widest text-blue-500 font-mono">WELCOME TO XENA</span>
                          <h3 className="text-xl md:text-2xl font-black text-slate-950 font-sans tracking-tight leading-tight">
                            Sovereign Corporate Equity
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        XENA Investment Ltd provides a unified gateway designed to coordinate large-scale asset allocations, real-time compound dividends, and direct payout processing.
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-800 font-black text-[11px] uppercase tracking-wider font-mono">
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                            SECURE CO-OP
                          </div>
                          <p className="text-[9.5px] text-slate-500 leading-snug font-medium">Licensed and compliant equity frameworks.</p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-800 font-black text-[11px] uppercase tracking-wider font-mono">
                            <Globe className="w-4 h-4 text-blue-600" />
                            GLOBAL SCOPE
                          </div>
                          <p className="text-[9.5px] text-slate-500 leading-snug font-medium">Diversified corporate project underwriting.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {page === 2 && (
                    <motion.div
                      key="page2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-fuchsia-50 border border-fuchsia-100 text-fuchsia-600 rounded-2xl">
                          <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-black tracking-widest text-fuchsia-500 font-mono">COMPOUND INTEREST ENGINE</span>
                          <h3 className="text-xl md:text-2xl font-black text-slate-950 font-sans tracking-tight leading-tight">
                            Continuous Yield Accruals
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        Your shareholdings trigger continuous interest accumulation. Monitor rates of return scaling up to <span className="text-purple-600 font-black">26.67% daily compound yield</span>.
                      </p>

                      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 text-left space-y-2 font-sans">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-bold">Compounding Cycle:</span>
                          <span className="font-black text-blue-600 font-mono animate-pulse">AUTOMATIC CONTINUOUS</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-bold">NIBSS Settlement Hour:</span>
                          <span className="font-extrabold text-slate-800 font-mono">10:00 AM - 12:00 PM Daily</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-bold">Client Escrow Ledger:</span>
                          <span className="font-extrabold text-fuchsia-600 font-mono">SSL ENCRYPTED SECURE</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {page === 3 && (
                    <motion.div
                      key="page3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-50 border border-purple-100 text-purple-600 rounded-2xl">
                          <Users className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-black tracking-widest text-purple-500 font-mono">PARTNER NETWORK ADVANTAGE</span>
                          <h3 className="text-xl md:text-2xl font-black text-slate-950 font-sans tracking-tight leading-tight">
                            Sovereign Referral Matrix
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        Maximize returns by expanding your network! Build group depths across 5 strategic tiers of passive overrides, now dynamically simulated directly within your dashboard.
                      </p>

                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-blue-500 text-white rounded-lg">
                          <Sparkles className="w-4 h-4 animate-spin-slow" />
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider block font-mono">Claim Welcome Booster</span>
                          <p className="text-[9.5px] text-slate-600 font-semibold mt-0.5">Initialize your secure digital treasury with 500 XNC bonus tokens!</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress Indicators & Carousel Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {/* Dots */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setPage(idx as any)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        page === idx ? 'w-6 bg-blue-600' : 'w-2 bg-slate-200 hover:bg-slate-350'
                      }`}
                      aria-label={`Go to slide ${idx}`}
                    />
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-2">
                  {page > 1 && (
                    <button
                      onClick={handleBack}
                      className="px-4 py-2.5 text-xs text-slate-600 hover:text-slate-950 border border-slate-200 hover:border-slate-300 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                  )}

                  <button
                    id="btn-confirm-welcome-dismiss"
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {page === 3 ? 'Initialize Portfolio Ledger' : 'Next'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
