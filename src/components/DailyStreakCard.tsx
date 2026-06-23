import { Flame, Check, Sparkles, Clock, Coins, Info, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { UserWallet } from '../types';
import { formatNGN } from '../utils';

interface DailyStreakCardProps {
  wallet: UserWallet;
  simulatedTime: number;
  onAdvanceTime: (msToAdd: number) => void;
}

export default function DailyStreakCard({ wallet, simulatedTime, onAdvanceTime }: DailyStreakCardProps) {
  const currentStreak = wallet.loginStreak || 0;
  const lastLogin = wallet.lastLoginDate || 'Never';
  const currentDateStr = new Date(simulatedTime).toISOString().split('T')[0];
  const isClaimedToday = lastLogin === currentDateStr;

  // Streak rewards: Day 1: 100, Day 2: 200, Day 3: 300, etc., capped at 1000 NGN
  const getRewardForDay = (dayNum: number) => {
    return Math.min(dayNum * 100, 1000);
  };

  const nextStreakLevel = isClaimedToday ? currentStreak + 1 : currentStreak || 1;
  const potentialTomorrowBonus = getRewardForDay(nextStreakLevel);

  return (
    <motion.div
      id="daily-streak-tracker-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-[#0c1220] via-[#090d16] to-[#04060b] border border-cyan-500/20 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden text-left"
    >
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />

      {/* Header Block */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/25 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)] shrink-0 animate-pulse">
            <Flame className="w-5.5 h-5.5 fill-orange-500/10" />
          </div>
          <div>
            <span className="text-[8.5px] bg-orange-400/10 border border-orange-500/25 text-orange-400 font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider font-mono">
              DAILY REWARD POOL
            </span>
            <h3 className="text-sm font-black text-white font-sans flex items-center gap-1.5 mt-0.5">
              Sovereign Login Streak
            </h3>
          </div>
        </div>
        
        {/* Streak Count Badge */}
        <div className="bg-black/30 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-left sm:text-right shrink-0 self-start sm:self-auto font-sans">
          <div className="flex items-center gap-1.5 justify-start sm:justify-end">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">CURRENT STREAK:</span>
            <span className="inline-flex items-center gap-1 text-xs font-black text-white px-2 py-0.5 bg-orange-555 rounded-md text-orange-400 bg-orange-500/10 border border-orange-400/20 animate-pulse">
              {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
            </span>
          </div>
          <div className="text-[8.5px] text-zinc-500 font-extrabold tracking-wider mt-0.5 font-sans uppercase">
            LAST ACTIVE: <span className="text-slate-300 font-mono">{lastLogin}</span>
          </div>
        </div>
      </div>

      {/* 7-Day Checklist Timeline */}
      <div className="relative z-10 space-y-3.5 my-5">
        <span className="text-[9px] font-black tracking-widest text-[#8692a6] font-mono uppercase block text-left">
          Streak Calendar Timeline (7-Day Cycle)
        </span>

        {/* Timeline Horizontal List */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((dayIndex) => {
            const isCompleted = dayIndex <= currentStreak;
            const isCurrentActiveDay = dayIndex === currentStreak + 1 && !isClaimedToday;
            const rewardValue = getRewardForDay(dayIndex);
            
            return (
              <div
                key={dayIndex}
                className={`relative rounded-xl p-2.5 border text-center transition-all ${
                  isCompleted
                    ? 'bg-gradient-to-b from-orange-500/10 to-transparent border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.05)]'
                    : isCurrentActiveDay
                    ? 'bg-slate-900 border-indigo-500/40 animate-pulse'
                    : 'bg-black/15 border-slate-850/50 opacity-40'
                }`}
              >
                {/* Active glow dot */}
                {isCompleted && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                )}

                <div className="text-[9.5px] font-black text-slate-400 font-sans uppercase">
                  Day {dayIndex}
                </div>
                
                {/* Visual Check / Flame / Clock marker */}
                <div className="my-1.5 flex items-center justify-center">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-400/30">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : isCurrentActiveDay ? (
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-400/35">
                      <Clock className="w-3 h-3 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-900/50 text-slate-500 flex items-center justify-center border border-slate-800">
                      <Coins className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                <div className={`text-[10px] font-black font-mono tracking-tight ${isCompleted ? 'text-orange-400' : 'text-slate-400'}`}>
                  +₦{rewardValue}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Information Feed / CTA action */}
      <div className="relative z-10 space-y-3">
        {isClaimedToday ? (
          <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl flex items-start gap-2 text-emerald-400">
            <Sparkles className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="text-left font-sans text-xs">
              <strong className="block font-black text-white text-[11.5px]">Streak Dividend Claimed Today!</strong>
              <p className="text-emerald-300 font-medium leading-relaxed mt-0.5">
                Nice job! You claimed (+₦{getRewardForDay(currentStreak).toLocaleString()}) and set your ledger to Day {currentStreak}. Log in again tomorrow (simulate 1 day forward) to claim <strong className="text-white">+₦{potentialTomorrowBonus.toLocaleString()}</strong>!
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-amber-950/20 border border-amber-900/30 rounded-xl flex items-start gap-2 text-amber-350">
            <Info className="w-4.5 h-4.5 text-amber-405 shrink-0 mt-0.5" />
            <div className="text-left font-sans text-xs">
              <strong className="block font-black text-white text-[11.5px]">Unclaimed Streak Award Waiting</strong>
              <p className="text-amber-200/90 font-semibold leading-relaxed mt-0.5">
                Your login streak is waiting! Claim a guaranteed free multiplier credit of <span className="text-white font-extrabold font-mono">₦{potentialTomorrowBonus.toLocaleString()}</span> directly on your available ledger.
              </p>
            </div>
          </div>
        )}

        {/* Time Simulator Hook button so user can test consecutiveness in real-time! */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-1.5 text-[10.5px] text-zinc-500 font-bold uppercase font-sans">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Test sandbox simulation tool:
          </div>
          <button
            type="button"
            onClick={() => onAdvanceTime(24 * 60 * 60 * 1000)}
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-650 hover:bg-indigo-555 text-white hover:text-white border border-indigo-550 hover:border-indigo-400 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-lg"
          >
            Leap 1 Day Forward (Simulate Login)
          </button>
        </div>
      </div>
    </motion.div>
  );
}
