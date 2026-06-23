import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Clock, X, ChevronRight, Landmark, BadgeAlert, Award } from 'lucide-react';

interface WelcomeXenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasActiveInvestments: boolean;
}

export default function WelcomeXenaModal({ isOpen, onClose, hasActiveInvestments }: WelcomeXenaModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0c0817]/80 backdrop-blur-md flex items-center justify-center z-[1100] p-4 font-sans select-none"
        >
          <motion.div
            initial={{ scale: 0.93, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.93, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="bg-white border border-purple-100 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden text-left"
          >
            {/* Top decorative premium metallic copper/gold gradient bar */}
            <div className="h-2 bg-gradient-to-r from-amber-500 via-fuchsia-600 to-indigo-600 w-full" />

            {/* Close button */}
            <button
              onClick={onClose}
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
                <span className="text-[10px] font-black text-purple-800 bg-purple-50 border border-purple-150 px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Verified Shareholder Hub
                </span>
                <span className="text-[10px] font-black text-amber-800 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1 font-mono">
                  {hasActiveInvestments ? '★ ACTIVE ACCRUAL TIER' : '★ STARTER TIER'}
                </span>
              </div>

              {/* Title & Introduction */}
              <div className="space-y-2">
                <h3 className="text-2.5xl font-black text-slate-950 font-sans tracking-tight leading-tight">
                  Welcome to XENA INVESTMENT LTD
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Consolidated sovereign shareholder hub. Manage your automated investment packages, monitor real-time compound dividends, track 5-tier referral commissions, and authorize payout settlement corridors directly from this secure terminal.
                </p>
              </div>

              {/* Mini Status Ledger Board */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-left space-y-3 font-sans relative">
                <div className="flex items-center justify-between border-b border-slate-150 pb-2.5">
                  <span className="text-[9px] uppercase font-black text-purple-850 tracking-wider font-mono">LEDGER GATEWAY STATUS</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[8.5px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase animate-pulse font-mono">
                    ● ONLINE
                  </span>
                </div>
                
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">Daily Return Multiplier:</span>
                    <span className="font-extrabold text-[#9c59ff] bg-purple-50 border border-purple-100 px-2 py-0.5 rounded text-[10.5px] font-mono">UP TO 26.67%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-505 font-bold">NIBSS Settlement Hour:</span>
                    <span className="font-extrabold text-slate-800 font-mono">10:00 AM - 12:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-0.5">
                    <span className="text-slate-505 font-bold">Asset Compounding Cycle:</span>
                    <span className="font-black text-emerald-600 font-mono animate-pulse">AUTOMATIC CONTINUOUS</span>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex items-start gap-2 p-2.5 bg-purple-50/20 border border-purple-100/30 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-wide">SSL SECURED Ledger</p>
                    <p className="text-[9.5px] text-slate-500 font-semibold leading-snug">Full escrow grade encryption</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2.5 bg-purple-50/20 border border-purple-100/30 rounded-xl">
                  <Clock className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-wide">100% Automated</p>
                    <p className="text-[9.5px] text-slate-500 font-semibold leading-snug">Continuous compound yields</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                id="btn-confirm-welcome-dismiss"
                onClick={onClose}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-indigo-500 text-white hover:text-white rounded-xl text-xs uppercase tracking-widest font-black shadow-md hover:shadow-purple-900/30 transition-all cursor-pointer text-center flex items-center justify-center gap-1"
              >
                Enter Portfolio Ledger
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
