import { ActiveInvestment } from '../types';
import { formatNGN } from '../utils';
import { Clock, CheckCircle, ArrowUpRight, ShieldCheck, RefreshCw, Layers, TrendingUp, Landmark } from 'lucide-react';
import { motion } from 'motion/react';

interface ActiveInvestmentsProps {
  investments: ActiveInvestment[];
  simulatedTime: number;
  onToggleCompounding: (id: string, value: boolean) => void;
  onClaim: (id: string) => void;
  onOpenInvestTab: () => void;
}

export default function ActiveInvestments({
  investments,
  simulatedTime,
  onToggleCompounding,
  onClaim,
  onOpenInvestTab
}: ActiveInvestmentsProps) {
  
  const getProgress = (inv: ActiveInvestment) => {
    if (inv.status === 'matured' || simulatedTime >= inv.endDate) return 100;
    const totalDuration = inv.endDate - inv.startDate;
    const elapsed = simulatedTime - inv.startDate;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const getTimeLeftStr = (inv: ActiveInvestment) => {
    const msLeft = inv.endDate - simulatedTime;
    if (msLeft <= 0 || inv.status === 'matured') return 'Matured';
    
    const minutes = Math.floor((msLeft / (1000 * 60)) % 60);
    const hours = Math.floor((msLeft / (1000 * 60 * 60)) % 24);
    const days = Math.floor(msLeft / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days}d ${hours}h left`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
  };

  const activeInvestmentsList = investments.filter(i => i.status === 'active' || i.status === 'matured');
  const pendingInvestmentsList = investments.filter(i => i.status === 'pending');

  return (
    <div className="bg-[#0b0e14] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-8 relative overflow-hidden text-left">
      {/* Decorative dynamic background lines */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-6 border-b border-slate-800/50 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest block font-mono">XENA SECURITY ASSETS</span>
          <h3 className="text-xl font-black text-white font-sans flex items-center gap-2.5">
            <Landmark className="w-5.5 h-5.5 text-emerald-500" />
            Stock Portfolio & Asset Ledger
          </h3>
          <p className="text-xs text-slate-400 font-medium">Underwrites public/corporate company share packages delivering hourly yields.</p>
        </div>
        
        <div className="flex items-center gap-3 self-start md:self-auto font-mono">
          <span className="text-xs font-black text-emerald-400 bg-emerald-950/25 border border-emerald-800/60 px-3 py-1.5 rounded-xl shadow-xs inline-flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-405" />
            {activeInvestmentsList.length} ACTIVE POSITIONS
          </span>
        </div>
      </div>

      {pendingInvestmentsList.length > 0 && (
        <div className="space-y-3.5 bg-amber-500/5 border border-amber-800/40 rounded-2xl p-4 md:p-5">
          <span className="text-[10px] font-black text-amber-500 bg-amber-950/40 border border-amber-800/30 px-3 py-1 rounded-lg uppercase tracking-wider inline-flex items-center gap-1.5 font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" /> Awaiting Supervisor Authorization ({pendingInvestmentsList.length})
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {pendingInvestmentsList.map((inv) => (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                key={inv.id} 
                className="p-4 bg-black/30 border border-amber-700/30 rounded-xl flex items-center justify-between gap-4 font-sans text-xs shadow-xs"
              >
                <div className="space-y-1">
                  <h4 className="font-extrabold text-white">{inv.productName}</h4>
                  <div className="flex items-center gap-2 text-zinc-400 font-bold font-mono text-[10px]">
                    <span>Stake: {formatNGN(inv.amountInvested)}</span>
                    <span className="text-zinc-700">•</span>
                    <span>Target: {formatNGN(inv.expectedReturn)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-850/50 uppercase tracking-widest font-mono animate-pulse shrink-0">
                  VERIFYING
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeInvestmentsList.length === 0 ? (
        <div className="text-center py-16 px-6 max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-white/5 border border-slate-800 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <TrendingUp className="w-8 h-8 text-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h4 className="font-black text-white text-base">Your Portfolio is Empty</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              You do not hold active share certificates currently. Acquire high-performance positions to start yielding dividends instantly (e.g., ₦1,500 plan yielding ₦12,000 corporate cash in 30 days).
            </p>
          </div>
          <button
            id="btn-no-invest-shortcut"
            onClick={onOpenInvestTab}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md cursor-pointer hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 mx-auto uppercase tracking-wider"
          >
            Acquire Shares Now
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {activeInvestmentsList.map((inv) => {
            const currentRate = inv.rate || 0.10;
            const termDays = inv.termDays || Math.round(inv.expectedReturn / (inv.amountInvested * currentRate)) || 4;
            const progress = getProgress(inv);
            const isMatured = inv.status === 'matured' || simulatedTime >= inv.endDate;
            const dailyYield = inv.amountInvested * currentRate;
            const fullPotentialYield = inv.expectedReturn || (inv.amountInvested * currentRate * termDays);

            return (
              <motion.div 
                whileHover={{ y: -3, boxShadow: "0 12px 25px -4px rgba(16, 185, 129, 0.08)" }}
                key={inv.id} 
                className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 relative ${
                  isMatured 
                    ? 'border-emerald-500/30 bg-gradient-to-tr from-emerald-950/20 via-[#0a0d14] to-blue-950/10 shadow-sm' 
                    : 'border-slate-800/80 bg-[#0f1322] hover:border-emerald-800 shadow-xs'
                }`}
              >
                {/* Upper metrics row */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap text-left">
                      <span className="text-[11px] uppercase font-black text-white tracking-wider">
                        {inv.productName}
                      </span>
                      {isMatured ? (
                        <span className="bg-emerald-550 text-slate-950 text-[8.5px] font-black tracking-widest px-2.5 py-0.5 rounded-lg uppercase font-mono animate-bounce shadow-xs">
                          ● MATURED (100%)
                        </span>
                      ) : (
                        <span className="bg-emerald-950/50 text-emerald-400 text-[8.5px] font-black tracking-widest px-2.5 py-0.5 rounded-lg uppercase font-mono animate-pulse border border-emerald-800/40 shadow-xs">
                          ● ACCRUING DAILY
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-0.5 text-left">
                      <span className="text-[9px] text-zinc-500 mt-1 uppercase tracking-wider block font-mono">ALLOCATED CAPITAL</span>
                      <div className="flex items-baseline gap-1.5 justify-start">
                         <h4 className="text-xl md:text-2xl font-black text-white font-mono tracking-tight">
                           {formatNGN(inv.amountInvested)}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-black font-mono">NGN</span>
                      </div>
                    </div>
                  </div>

                  {/* Dividends and cycle durations bento ledger */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800/50">
                    <div className="bg-black/35 p-2.5 rounded-xl border border-slate-800/70 space-y-0.5 text-left">
                      <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-black font-mono block">Daily Dividends</span>
                      <strong className="text-emerald-400 font-black text-sm block font-mono">+{formatNGN(dailyYield)}</strong>
                    </div>

                    <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20 space-y-0.5 text-left">
                      <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-black font-mono block">Accumulating Yield</span>
                      <strong className="text-emerald-450 font-black text-sm block font-mono">
                        {formatNGN(inv.totalAccrued)}
                      </strong>
                    </div>

                    <div className="bg-black/35 p-2.5 rounded-xl border border-slate-800/70 space-y-0.5 col-span-2 md:col-span-1 text-left">
                      <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-black font-mono block">Target Return</span>
                      <span className="text-white font-extrabold text-xs block font-mono truncate">
                        {formatNGN(fullPotentialYield)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar and timeline indicators */}
                <div className="mt-6 space-y-2.5 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold flex items-center gap-1.5 font-sans">
                      <Clock className="w-4 h-4 text-slate-500" />
                      {isMatured ? `${termDays} days cycle completed` : `Position Lifetime: ${getTimeLeftStr(inv)}`}
                    </span>
                    <span className="font-mono text-emerald-400 font-black text-xs">{progress.toFixed(0)}%</span>
                  </div>
                  
                  {/* Outer track */}
                  <div className="w-full h-2.5 bg-slate-950/80 border border-slate-800/50 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-450 to-blue-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Compound configuration and active payment claims */}
                <div className="mt-6 pt-5 border-t border-dashed border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                  
                  {/* Dynamic interactive compound option */}
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={inv.isCompounding !== false}
                        onChange={() => onToggleCompounding(inv.id, inv.isCompounding === false)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-700 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                    </label>
                    <div className="leading-tight">
                      <span className="text-xs font-black text-white block font-sans">Auto-Rollover & Reinvest Principal</span>
                      <p className="text-[10px] text-slate-405 font-medium max-w-xs md:max-w-md">
                        {inv.isCompounding !== false 
                          ? `Restarts ${termDays}-day cycle automatically on mature, capturing compounding interest overrides.`
                          : `Disburses principal back of NGN ${formatNGN(inv.amountInvested)} to liquid cash on ${new Date(inv.endDate).toLocaleDateString()}.`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Claim action triggers */}
                  {isMatured ? (
                    <button
                      id={`btn-claim-${inv.id}`}
                      onClick={() => onClaim(inv.id)}
                      className="w-full md:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 uppercase tracking-wider whitespace-nowrap"
                    >
                      Withdraw Capital & Yield (₦{formatNGN(fullPotentialYield)})
                      <ArrowUpRight className="w-4 h-4 text-slate-950 animate-pulse" />
                    </button>
                  ) : (
                    <div className="text-[10px] text-emerald-400 bg-emerald-950/20 border border-emerald-800/35 rounded-xl p-3 font-medium flex items-center gap-2 max-w-xs md:max-w-md text-left leading-normal font-sans shadow-xs">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      Daily performance dividends settle directly into your Liquid cash balances every 24 hours. No manual logging is required.
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
