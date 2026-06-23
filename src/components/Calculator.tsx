import { useState } from 'react';
import { Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { formatNGN } from '../utils';
import { productsList } from '../data';
import { motion } from 'motion/react';

export default function Calculator() {
  const [calcAmount, setCalcAmount] = useState<number>(1500);
  const [cycles, setCycles] = useState<number>(3); // default 3 cycles

  // Find the highest product we qualify for based on simulation amount
  // Since productsList is sorted from cheapest to most expensive, we filter qualify limit
  const qualifiedProducts = [...productsList].filter(p => calcAmount >= p.minAmount);
  const matchingProduct = qualifiedProducts.length > 0 ? qualifiedProducts[qualifiedProducts.length - 1] : productsList[0];
  const termDays = matchingProduct.termDays;
  const returnRatePerCycle = matchingProduct.rate * termDays; 
  
  // Calculate standard profit
  const standardReturn = calcAmount * returnRatePerCycle * cycles;
  const standardTotal = calcAmount + standardReturn;

  // Calculate compounding profit ((1 + returnRatePerCycle)^cycles)
  const compoundTotal = calcAmount * Math.pow(1 + returnRatePerCycle, cycles);
  const compoundReturn = compoundTotal - calcAmount;

  return (
    <div className="bg-[#0b0e14] border border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-xl space-y-6 text-white text-left">
      
      {/* Title */}
      <div>
        <h3 className="text-lg font-black text-white font-sans flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" /> Dividend Growth Calculator
        </h3>
        <p className="text-xs text-slate-400 font-semibold">Simulate XENA stock options growth. Contrast standard withdrawals with the dynamic rolling compounding engine.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders and Inputs */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-extrabold uppercase tracking-wider">Simulated Share Capital Size</span>
              <strong className="text-emerald-400 font-black text-xl font-mono bg-[#070a0e] border border-slate-800 px-3.5 py-1.5 rounded-xl shadow-inner">{formatNGN(calcAmount)}</strong>
            </div>
            
            <div className="relative group pt-1">
              <input
                id="calculator-range-amount"
                type="range"
                min="1500"
                max="30000"
                step="500"
                value={calcAmount}
                onChange={(e) => setCalcAmount(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-900 border border-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none transition-all outline-none"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-extrabold uppercase font-mono">
              <span>₦1,500</span>
              <span>₦10,000</span>
              <span>₦20,000</span>
              <span>₦30,000</span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Simulation Terms ({termDays}-day Rolling Cycles)</span>
            
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: `${termDays} Days`, val: 1 },
                { label: `${termDays * 3} Days`, val: 3 },
                { label: `${termDays * 5} Days`, val: 5 },
                { label: `${termDays * 10} Days`, val: 10 }
              ].map((item, idx) => (
                <motion.button
                  whileHover={{ y: -1, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={idx}
                  type="button"
                  id={`calc-cycle-${item.val}`}
                  onClick={() => setCycles(item.val)}
                  className={`py-2 px-1 rounded-xl text-xs font-black transition-all border text-center cursor-pointer ${
                    cycles === item.val
                      ? 'bg-blue-600 border-transparent text-white shadow-lg'
                      : 'bg-[#101424]/60 border-slate-800 text-slate-400 hover:bg-[#151c30] hover:border-slate-700'
                  }`}
                >
                  {item.label}
                  <span className={`block text-[9px] font-bold mt-0.5 ${cycles === item.val ? 'text-blue-100' : 'text-slate-550'}`}>
                    {item.val} Turn{item.val > 1 ? 's' : ''}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-emerald-950/15 border border-emerald-900/30 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wide block font-sans">Compounding Factor: {(1 + returnRatePerCycle).toFixed(2)}x Per Turn</span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold font-sans">
                By enabling rollover compounding, your daily dividends are automatically folded back into your holdings. At {(returnRatePerCycle * 100).toFixed(1)}% term gain per {termDays} days, your capital grows geometrically, delivering extreme asset compounding.
              </p>
            </div>
          </div>
        </div>

        {/* Results comparisons */}
        <div className="lg:col-span-5 bg-[#070a0e]/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest block border-b border-slate-850 pb-2 font-display">Projections</span>
          
          <div className="space-y-4 text-left">
            {/* Standard Return box */}
            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400 font-semibold">Standard Daily Cashouts</span>
                <span className="text-sm font-black text-slate-300 font-mono">{formatNGN(standardTotal)}</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-805">
                <div 
                  className="bg-slate-600 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (standardTotal / compoundTotal) * 100)}%` }} 
                  / >
              </div>
              <p className="text-[10px] text-slate-500 font-bold">Liquid dividends are extracted daily, and principal returns after cycles.</p>
            </div>

            {/* Compounded Return box */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-emerald-400 font-black flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-emerald-450 animate-pulse" /> Rolling Compound Pipeline
                </span>
                <span className="text-lg font-black text-emerald-400 font-mono">{formatNGN(compoundTotal)}</span>
              </div>
              <div className="w-full bg-emerald-950/20 h-2 rounded-full overflow-hidden border border-emerald-900/30">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: '100%' }} />
              </div>
              <p className="text-[10px] text-slate-400 font-bold">Maximum compounding speed backed by dynamic daily dividend roller integrations.</p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-left">
            <div className="flex justify-between items-center text-slate-400 font-semibold">
              <span>Initial Share Buy-in:</span>
              <span className="font-bold text-slate-300 font-mono">{formatNGN(calcAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-400 font-semibold bg-[#101918] px-3 py-2.5 rounded-xl border border-emerald-900/40">
              <span className="flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 shrink-0 text-emerald-500" /> Net Yield Projection:
              </span>
              <span className="font-mono font-black text-emerald-300">+{formatNGN(compoundReturn)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
