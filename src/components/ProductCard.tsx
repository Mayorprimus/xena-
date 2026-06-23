import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gem, AlertCircle, ArrowUpRight, ShieldCheck, Sparkles, Clock, Award, Coins, Crown, Shield } from 'lucide-react';
import { InvestmentProduct } from '../types';
import { formatNGN } from '../utils';

interface ProductCardProps {
  product: InvestmentProduct;
  walletBalance: number;
  onInvest: (productId: string, amount: number, isCompounding: boolean) => void;
  onOpenDeposit: () => void;
  autoInvestDefault?: boolean;
}

export default function ProductCard({
  product,
  walletBalance,
  onInvest,
  onOpenDeposit,
  autoInvestDefault = true
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [isCompounding, setIsCompounding] = useState(autoInvestDefault);
  const [errorText, setErrorText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Custom configuration based on Metal Tier as requested
  const getCardConfig = () => {
    const nameLower = product.name.toLowerCase();
    
    if (product.id.includes('apple') || nameLower.includes('bronze')) {
      return {
        containerClass: 'bg-gradient-to-br from-[#231510] via-[#160c08] to-[#0d0705] border border-amber-900/60 shadow-xl text-white hover:border-amber-500/60 hover:shadow-amber-900/5',
        badgeClass: 'text-amber-400 bg-amber-500/10 border border-amber-550/20',
        iconBg: 'bg-amber-500/15 border border-amber-500/30 text-amber-505',
        payoutBtn: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black focus:ring-amber-300',
        cardTitleColor: 'text-amber-100',
        decorColor: 'from-amber-500/10 to-transparent',
        tagline: 'Defensive Starter Tier',
        shadowColor: 'shadow-amber-900/10',
        icon: <Award className="w-5 h-5 text-amber-400" />
      };
    }
    if (product.id.includes('samsung') || nameLower.includes('silver')) {
      return {
        containerClass: 'bg-gradient-to-br from-[#1b1e22] via-[#0f1114] to-[#0a0b0d] border border-slate-705/60 shadow-xl text-white hover:border-slate-400/60 hover:shadow-slate-900/5',
        badgeClass: 'text-slate-300 bg-slate-500/10 border border-slate-500/20',
        iconBg: 'bg-slate-500/15 border border-slate-500/30 text-slate-300',
        payoutBtn: 'bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-350 hover:to-slate-450 text-slate-955 font-black focus:ring-slate-300',
        cardTitleColor: 'text-slate-100',
        decorColor: 'from-slate-400/5 to-transparent',
        tagline: 'Compounding Silver Growth',
        shadowColor: 'shadow-slate-900/10',
        icon: <Coins className="w-5 h-5 text-slate-300" />
      };
    }
    if (product.id.includes('nvidia') || nameLower.includes('gold')) {
      return {
        containerClass: 'bg-gradient-to-br from-[#2c2311] via-[#1a140a] to-[#0f0b05] border border-yellow-850/60 shadow-xl text-white hover:border-yellow-500/60 hover:shadow-yellow-900/5',
        badgeClass: 'text-yellow-405 bg-yellow-500/10 border border-yellow-550/30',
        iconBg: 'bg-yellow-500/15 border border-yellow-500/30 text-yellow-400',
        payoutBtn: 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-955 font-black focus:ring-yellow-300',
        cardTitleColor: 'text-yellow-50',
        decorColor: 'from-yellow-500/10 to-transparent',
        tagline: 'Standard Golden Value',
        shadowColor: 'shadow-yellow-900/10',
        icon: <Sparkles className="w-5 h-5 text-yellow-400" />
      };
    }
    if (product.id.includes('tesla') || nameLower.includes('platinum')) {
      return {
        containerClass: 'bg-gradient-to-br from-[#102120] via-[#091312] to-[#050a0a] border border-teal-850/60 shadow-xl text-white hover:border-teal-400/60 hover:shadow-teal-900/5',
        badgeClass: 'text-teal-300 bg-teal-500/10 border border-teal-500/20',
        iconBg: 'bg-teal-500/15 border border-teal-550/30 text-teal-300',
        payoutBtn: 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-955 font-black focus:ring-teal-300',
        cardTitleColor: 'text-teal-50',
        decorColor: 'from-teal-500/10 to-transparent',
        tagline: 'Prestige Platinum Option',
        shadowColor: 'shadow-teal-900/10',
        icon: <ShieldCheck className="w-5 h-5 text-teal-400" />
      };
    }
    if (product.id.includes('microsoft') || nameLower.includes('diamond')) {
      return {
        containerClass: 'bg-gradient-to-br from-[#121929] via-[#0a0e18] to-[#06080e] border border-blue-900/60 shadow-xl text-white hover:border-blue-500/60 hover:shadow-blue-900/5',
        badgeClass: 'text-sky-350 bg-sky-500/10 border border-sky-505/20',
        iconBg: 'bg-sky-500/15 border border-sky-500/30 text-sky-455',
        payoutBtn: 'bg-gradient-to-r from-sky-500 via-indigo-550 to-purple-600 hover:from-sky-400 hover:via-indigo-400 hover:to-purple-500 text-white font-black focus:ring-sky-300',
        cardTitleColor: 'text-sky-100',
        decorColor: 'from-sky-500/10 to-transparent',
        tagline: 'Sovereign Diamond Security',
        shadowColor: 'shadow-sky-900/10',
        icon: <Gem className="w-5 h-5 text-sky-400" />
      };
    }
    // VIP Tier
    return {
      containerClass: 'bg-gradient-to-br from-[#1c0f2b] via-[#100819] to-[#09040f] border border-purple-900/60 shadow-xl text-white hover:border-purple-500/60 hover:shadow-purple-900/5',
      badgeClass: 'text-purple-300 bg-purple-500/10 border border-purple-500/20',
      iconBg: 'bg-purple-500/15 border border-purple-550/30 text-purple-400',
      payoutBtn: 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-rose-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-rose-500 text-white font-black focus:ring-purple-300',
      cardTitleColor: 'text-purple-50',
      decorColor: 'from-purple-500/15 to-transparent',
      tagline: 'Ultimate VIP Sovereign Option',
      shadowColor: 'shadow-purple-900/10',
      icon: <Crown className="w-5 h-5 text-purple-400" />
    };
  };

  const config = getCardConfig();

  const handleOpenModal = () => {
    setAmount(product.minAmount.toString());
    setErrorText('');
    setIsSuccess(false);
    setIsCompounding(autoInvestDefault);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    const amtNum = parseFloat(amount);

    if (isNaN(amtNum)) {
      setErrorText('Please enter a valid investable amount.');
      return;
    }

    if (amtNum < product.minAmount || amtNum > product.maxAmount) {
      setErrorText(`Investment must be between ${formatNGN(product.minAmount)} and ${formatNGN(product.maxAmount)} for this package.`);
      return;
    }

    if (amtNum > walletBalance) {
      setErrorText('Insufficient wallet balance. Please add funds into your Naira wallet.');
      return;
    }

    onInvest(product.id, amtNum, isCompounding);
    setIsSuccess(true);
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -6, scale: 1.015 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`${config.containerClass} rounded-2xl p-6 flex flex-col justify-between transition-all relative overflow-hidden group font-sans text-left`}
      >
        {/* Glowing visual indicator circle */}
        <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-b ${config.decorColor} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className={`p-2.5 ${config.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
              {config.icon}
            </div>
            <div className="text-right">
              <span className={`text-[9px] uppercase font-black tracking-widest ${config.badgeClass} px-2.5 py-1 rounded-md`}>
                {product.category}
              </span>
              <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{config.tagline}</p>
            </div>
          </div>

          <div className="space-y-1 text-left">
            <h4 className={`text-xl font-extrabold ${config.cardTitleColor} tracking-tight font-display`}>
              {product.name}
            </h4>
            <p className="text-xs text-slate-305/85 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Pricing tier metrics (executive styling with transparent overlay) */}
          <div className="p-4 bg-black/45 border border-white/5 rounded-2xl space-y-2.5 relative shadow-inner text-left">
            <div className="flex justify-between items-start text-xs text-slate-300">
              <span className="font-semibold text-slate-400 mt-0.5">Required Stake:</span>
              <div className="text-right">
                <strong className="text-white font-extrabold block font-mono text-[14px]">₦{product.minAmount.toLocaleString()}</strong>
                <span className="text-[10px] text-emerald-400 font-bold block">returns {formatNGN(product.minAmount * (1 + product.rate * product.termDays))}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-start text-xs text-slate-300 pt-2 border-t border-white/5">
              <span className="font-semibold text-slate-400 mt-0.5">Total Matured Yield:</span>
              <div className="text-right">
                <span className="text-[10px] bg-emerald-500/15 text-emerald-350 border border-emerald-500/10 px-1.5 py-0.5 rounded font-black font-sans shrink-0 uppercase tracking-widest leading-none mt-0.5 inline-block">
                  {(product.rate * product.termDays * 100).toFixed(0)}% Maturity
                </span>
                <span className="text-[10px] text-zinc-400 font-medium block mt-1">Over {product.termDays} Days Locked Term</span>
              </div>
            </div>
          </div>

          {/* Payout rates */}
          <div className="flex items-baseline justify-between pt-2.5 border-t border-white/5 mt-2">
            <div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Daily Returns</span>
              <span className="text-2.5xl font-black text-emerald-400 tracking-tight font-mono">{(product.rate * 100).toFixed(1)}%</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-black text-gray-450 uppercase tracking-widest block">Daily Dividends</span>
              <span className="text-xs font-black text-slate-200 font-mono">+{formatNGN(product.minAmount * product.rate)}/day</span>
            </div>
          </div>
        </div>

        <button
          id={`btn-open-invest-${product.id}`}
          onClick={handleOpenModal}
          className={`w-full mt-5 py-3 ${config.payoutBtn} rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap`}
        >
          Acquire Share Options
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </motion.div>

      {isModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-[#1e0a38]/65 backdrop-blur-md flex items-center justify-center z-[1000] p-4"
        >
          <motion.div 
            initial={{ scale: 0.93, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="bg-white border border-purple-100 rounded-2xl w-full max-w-md shadow-2xl relative flex flex-col max-h-[85vh] sm:max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="h-1.5 bg-purple-600 w-full shrink-0" />
            
            <div className="p-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0 border-slate-100/80">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
                  Portfolio Placement
                </span>
                <h3 className="text-base font-bold text-gray-905 mt-0.5">{product.name} Allocation</h3>
              </div>
              <button
                id="btn-close-invest-setup"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <XComp />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 pb-8">
              {isSuccess ? (
                <div className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-purple-50 border border-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6 text-purple-650 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-gray-900 font-display font-sans">Acquisition Completed</h4>
                    <p className="text-xs text-gray-500 leading-normal max-w-sm mx-auto font-sans">
                      Your share option placement of <strong className="text-gray-900">{formatNGN(parseFloat(amount || '0'))}</strong> in {product.name} has been processed successfully.
                    </p>
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 mt-3 text-[11px] text-purple-700 leading-normal text-left font-sans space-y-0.5">
                      <p className="font-extrabold text-purple-900">&#9679; Active Option Placement:</p>
                      <p>Your capital has been successfully deployed. This option position is now <strong>active</strong> and has begun generating high-performance interest yields credited to your ledger dashboard daily.</p>
                    </div>
                  </div>
                  <button
                    id="btn-close-success-modal"
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer font-sans"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <>
                  {errorText && (
                    <div className="mx-4 mt-3.5 p-2.5 bg-rose-50 border border-rose-100 rounded-xl flex gap-2 text-rose-700 text-xs font-bold leading-normal">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p>{errorText}</p>
                        {errorText.includes('Insufficient wallet balance') && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsModalOpen(false);
                              onOpenDeposit();
                            }}
                            className="text-purple-600 font-extrabold hover:underline block cursor-pointer"
                          >
                            Fund your Naira account Instantly &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleModalSubmit} className="p-4 space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Share Capital (Naira ₦)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">₦</span>
                        <input
                          id="input-invest-amount"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 border-2 border-purple-100/80 rounded-xl text-2xl font-black bg-gray-50 focus:bg-white focus:border-purple-600 focus:outline-none transition-all text-gray-850"
                        />
                      </div>
                      <div className="mt-1.5 flex justify-between text-[11px] text-gray-400 font-semibold font-sans">
                        <span>Min/Max: {formatNGN(product.minAmount)} - {formatNGN(product.maxAmount)}</span>
                        <span>Wallet Balance: <strong className="text-purple-600">{formatNGN(walletBalance)}</strong></span>
                      </div>
                    </div>

                    {/* Highly Compact Compounding Info Row */}
                    <div className="p-2.5 bg-purple-50/50 border border-purple-150/70 rounded-xl flex items-center justify-between text-xs font-sans">
                      <div className="flex items-center gap-1.5 text-purple-900 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                        <span>Daily Auto-Rollover Reinvest</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="invest-compounding-toggle"
                          type="checkbox"
                          checked={isCompounding}
                          onChange={(e) => setIsCompounding(e.target.checked)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-550 cursor-pointer"
                        />
                        <span className="text-[9px] uppercase font-extrabold text-purple-705 bg-purple-100 px-2 py-0.5 rounded-md">
                          {isCompounding ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    </div>

                    {/* Real-time Forecast Calculations (Compact) */}
                    <div className="bg-gray-50 border border-gray-150 p-3 rounded-xl space-y-1 text-xs text-gray-555 font-semibold font-sans">
                      <div className="flex justify-between">
                        <span>Daily Dividends Payout:</span>
                        <strong className="text-purple-600">
                          +{formatNGN(parseFloat(amount || '0') * product.rate)} / Day
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Accumulated Returns:</span>
                        <strong className="text-gray-900 font-mono">
                          +{formatNGN(parseFloat(amount || '0') * product.rate * product.termDays)} ({((product.rate * 100) * product.termDays).toFixed(0)}.0%)
                        </strong>
                      </div>
                      <div className="flex justify-between border-t border-gray-200/50 pt-1 mt-1">
                        <span>Total Matured Capital Recoup:</span>
                        <strong className="text-purple-600 text-xs font-mono">
                          {formatNGN(parseFloat(amount || '0') * (1 + product.rate * product.termDays))}
                        </strong>
                      </div>
                      <div className="flex justify-between border-t border-dashed border-gray-200 mt-1.5 pt-1.5 text-purple-600 font-extrabold text-[11px]">
                        <span>Expected Compound (3 cycles):</span>
                        <span className="font-mono">{formatNGN(parseFloat(amount || '0') * Math.pow(1 + product.rate * product.termDays, 3))}</span>
                      </div>
                    </div>

                    <button
                      id="btn-confirm-investment"
                      type="submit"
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer font-sans"
                    >
                      Acquire Option Position
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

function XComp() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
