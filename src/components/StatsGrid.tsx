import { Landmark, ShieldCheck, TrendingUp, Sparkles, ArrowUpRight, Wallet, Award } from 'lucide-react';
import { formatNGN } from '../utils';
import { UserWallet, ActiveInvestment } from '../types';
import { motion } from 'motion/react';

interface StatsGridProps {
  wallet: UserWallet;
  onOpenModal: (type: 'deposit' | 'withdraw') => void;
  activeInvestments?: ActiveInvestment[];
}

export default function StatsGrid({ wallet, onOpenModal, activeInvestments = [] }: StatsGridProps) {
  // calculate accrued profit from active investments belonging to this user
  const userActiveInvestments = activeInvestments.filter(
    (inv) => inv.status === 'active' && inv.userEmail?.toLowerCase() === wallet?.email?.toLowerCase()
  );
  const activeAccruedProfit = userActiveInvestments.reduce((sum, inv) => sum + (inv.totalAccrued || 0), 0);
  const allTimeCumulative = wallet.earnedBalance + activeAccruedProfit;

  // Determine Shareholder Status based on total active investments
  const invested = wallet.investedBalance || 0;
  
  // Tiers setup
  let currentTier = 'Standard Member';
  let nextTier = 'Bronze';
  let minThreshold = 0;
  let nextThreshold = 50000;
  let tierGradient = 'from-slate-900 via-zinc-950 to-[#07090f]';
  let textColor = 'text-slate-300';
  
  if (invested >= 15000000) {
    currentTier = 'Diamond Elite';
    nextTier = '';
    minThreshold = 15000000;
    nextThreshold = 15005000;
    tierGradient = 'from-emerald-950/40 via-cyan-950/20 to-zinc-950';
    textColor = 'text-cyan-400';
  } else if (invested >= 5000000) {
    currentTier = 'Platinum High-Net';
    nextTier = 'Diamond';
    minThreshold = 5000000;
    nextThreshold = 15000000;
    tierGradient = 'from-blue-950/40 via-indigo-950/20 to-zinc-950';
    textColor = 'text-indigo-300';
  } else if (invested >= 1000000) {
    currentTier = 'Gold Director';
    nextTier = 'Platinum';
    minThreshold = 1000000;
    nextThreshold = 5000000;
    tierGradient = 'from-amber-950/40 via-stone-900/40 to-zinc-950';
    textColor = 'text-amber-400';
  } else if (invested >= 200000) {
    currentTier = 'Silver Sovereign';
    nextTier = 'Gold';
    minThreshold = 200000;
    nextThreshold = 1000000;
    tierGradient = 'from-slate-800/40 via-[#101424]/40 to-zinc-950';
    textColor = 'text-slate-300';
  } else if (invested >= 50000) {
    currentTier = 'Bronze Shareholder';
    nextTier = 'Silver';
    minThreshold = 50000;
    nextThreshold = 200000;
    tierGradient = 'from-orange-950/40 via-zinc-900/40 to-zinc-950';
    textColor = 'text-orange-400';
  }

  const remainingNeeded = nextThreshold - invested;
  const range = nextThreshold - minThreshold;
  const currentProgress = invested - minThreshold;
  const percent = nextTier ? Math.min(100, Math.max(0, (currentProgress / range) * 100)) : 100;

  return (
    <div className="space-y-6">
      
      {/* 1. COMPACT SHAREHOLDER STATUS CARD (Centerpiece Status Desk) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden bg-gradient-to-r ${tierGradient} border border-slate-800/80 rounded-2xl p-4 md:p-5 shadow-lg text-left text-white`}
      >
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 font-sans">
          
          {/* Status Group */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl text-slate-950 shadow shadow-emerald-500/20 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black tracking-widest text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono">
                  MEMBER DIVISION
                </span>
                <span className="text-[9px] text-zinc-400 font-bold font-mono">Active Capital: {formatNGN(invested)}</span>
              </div>
              <h3 className="text-base font-black tracking-tight flex items-center gap-1.5">
                <span className={textColor}>{currentTier}</span>
              </h3>
            </div>
          </div>

          {/* Real-time Progress Stepper (Compact version) */}
          {nextTier ? (
            <div className="space-y-1.5 md:max-w-xs w-full shrink-0">
              <div className="flex justify-between items-center text-[9px] font-semibold tracking-wider font-mono">
                <span className="text-zinc-400 font-bold">Milestone: {percent.toFixed(0)}%</span>
                <span className="text-emerald-400 font-bold">Next: {nextTier} ({formatNGN(nextThreshold)})</span>
              </div>
              <div className="w-full bg-[#111726] h-1.5 rounded-full overflow-hidden p-[1px] border border-slate-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" 
                />
              </div>
              <p className="text-[8.5px] text-[#8692a6] font-bold leading-none">Stake {formatNGN(remainingNeeded)} more to rank up in dividend class.</p>
            </div>
          ) : (
            <div className="p-2 bg-emerald-950/40 border border-emerald-800/30 rounded-xl flex items-center gap-1.5 text-emerald-400 shrink-0">
              <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-wider font-mono">⭐ APEX DIVISION REACHED</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* 2. Interactive Quick Multiplier Promo Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden bg-gradient-to-r from-[#0d1324] via-[#090d16] to-[#04060b] border border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 text-left"
      >
        <div className="absolute top-0 right-0 w-85 h-85 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-45 h-45 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10" />

        <div className="flex gap-4 relative z-10">
          <div className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-emerald-400 shrink-0 self-start md:self-center shadow-lg">
            <Sparkles className="w-5.5 h-5.5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 font-mono">
                ACTIVE MULTIPLIER
              </span>
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400">
                OFFICIAL PORTFOLIO COUPLING
              </span>
            </div>
            <h4 className="font-sans font-semibold text-white text-base md:text-lg">
              Maximize Passive Profit Payouts
            </h4>
            <p className="text-zinc-400 text-xs mt-0.5 max-w-xl leading-relaxed">
              Experience modern global equities options. Acquire company shares starting at just <strong className="text-white">₦1,500</strong> to yield guaranteed daily dividends up to <span className="text-emerald-400 font-extrabold font-mono">26.67% daily</span>. Safe, insured and direct.
            </p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto shrink-0 relative z-10 border-t border-slate-850 md:border-t-0 pt-4 md:pt-0">
          <button
            id="btn-shortcut-deposit"
            onClick={() => onOpenModal('deposit')}
            className="flex-1 md:flex-none px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0"
          >
            Deposit Capital
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
          <button
            id="btn-shortcut-withdraw"
            onClick={() => onOpenModal('withdraw')}
            className="flex-1 md:flex-none px-5 py-3 bg-white/5 hover:bg-white/10 text-white border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center"
          >
            Withdraw Profits
          </button>
        </div>
      </motion.div>

    </div>
  );
}
