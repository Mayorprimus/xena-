import React, { useState } from 'react';
import { X, CheckCircle, Smartphone, Landmark, Wallet, AlertCircle, ArrowUpRight, ArrowDownLeft, Copy, Check } from 'lucide-react';
import { formatNGN, generateRef } from '../utils';
import { UserWallet, DepositAccount, Transaction } from '../types';
import { motion } from 'motion/react';

interface DepositWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw';
  walletBalance: number;
  onConfirm: (amount: number, txType: 'deposit' | 'withdraw', details: string, source: 'wallet' | 'referral') => void;
  simulatedTime: number;
  wallet: UserWallet;
  depositAccounts: DepositAccount[];
  registeredUsers?: UserWallet[];
  transactions?: Transaction[];
  adminApprovalSettings?: {
    minReferralWithdrawal?: number;
    allowAnytimeWithdrawal?: boolean;
    [key: string]: any;
  };
}

export default function DepositWithdrawModal({
  isOpen,
  onClose,
  type,
  walletBalance,
  onConfirm,
  simulatedTime,
  wallet,
  depositAccounts,
  registeredUsers = [],
  transactions = [],
  adminApprovalSettings = {}
}: DepositWithdrawModalProps) {
  const minRefWithdrawal = adminApprovalSettings?.minReferralWithdrawal || 5000;
  const userHasReferrals = !!((wallet.referralsCount && wallet.referralsCount > 0) || (wallet.referralEarnings && wallet.referralEarnings > 0));

  const [withdrawSource, setWithdrawSource] = useState<'wallet' | 'referral'>('wallet');
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<'bank' | 'card' | 'crypto'>('bank');
  
  // States for simulated fields
  const [bankName, setBankName] = useState('');
  const [otherBankName, setOtherBankName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: input, 2: processing/payment, 3: success receipt
  const [copied, setCopied] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [finalTxRef, setFinalTxRef] = useState('');

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAcc = (e: React.MouseEvent | undefined, text: string) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedAcc(text);
    setTimeout(() => setCopiedAcc(null), 2000);
  };

  const validateStep1 = () => {
    setErrorMessage('');
    const amtNum = parseFloat(amount);
    if (isNaN(amtNum) || amtNum <= 0) {
      setErrorMessage('Please enter a valid positive Naira amount.');
      return false;
    }

    if (type === 'withdraw') {
      if (wallet.isFlagged) {
        setErrorMessage("Withdrawal access has been flagged & locked by XENA INVESTMENT LTD compliance officers. Please submit a support ticket via the Customer Service tab to verify your shareholder documentation and clear any regulatory holds.");
        return false;
      }

      if (wallet.requireReferralToWithdraw && wallet.referralsCount < 1) {
        setErrorMessage("Withdrawal Blocked: Shareholder program policies currently place a strict 1-Referral minimum rule on your account. Please invite at least 1 associate or simulation participant to join XENA sharing options before requesting a payout.");
        return false;
      }

      if (wallet.requireReferralDepositToWithdraw) {
        // Find users referred by this user
        const referredUsers = registeredUsers.filter(u => 
          u.referredBy?.trim().toLowerCase() === wallet.referralCode?.trim().toLowerCase()
        );

        // Check if any of these referred users has any completed deposit transaction
        const anyReferralDeposited = referredUsers.some(u => 
          transactions.some(tx => 
            tx.userEmail?.toLowerCase() === u.email.toLowerCase() && 
            tx.type === 'deposit' && 
            tx.status === 'completed'
          )
        );

        if (!anyReferralDeposited) {
          setErrorMessage("Withdrawal Blocked: Your account profile requires a Referral Deposit Verification. To verify authentic invite growth, at least one user you referred must fund their XENA account with an active deposit before you can submit a withdrawal.");
          return false;
        }
      }

      const simulatedDate = new Date(simulatedTime);
      const currentHour = simulatedDate.getHours();
      const allowByAdminOrRef = !!(adminApprovalSettings?.allowAnytimeWithdrawal || withdrawSource === 'referral');
      
      if (!allowByAdminOrRef && (currentHour < 10 || currentHour >= 12)) {
        const timeString = simulatedDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        });
        setErrorMessage(`Withdrawal processing window is strictly limited from 10:00 AM to 12:00 PM daily. The current simulated platform time is ${timeString}. Please use the Virtual Time Machine on the Dashboard to leap forward to the 10:00 AM withdrawal hours!`);
        return false;
      }

      const targetBalance = withdrawSource === 'referral' ? (wallet.referralEarnings || 0) : walletBalance;
      if (amtNum > targetBalance) {
        setErrorMessage(`Insufficient funds. Your selected ${withdrawSource === 'referral' ? 'referral earnings' : 'local share'} balance is ${formatNGN(targetBalance)}.`);
        return false;
      }
      
      if (withdrawSource === 'referral' || userHasReferrals) {
        const minVal = withdrawSource === 'referral' ? minRefWithdrawal : 2000;
        if (amtNum < minVal) {
          setErrorMessage(`Minimum withdrawal amount is ${formatNGN(minVal)}.`);
          return false;
        }
      } else {
        if (amtNum < 2000) {
          setErrorMessage('Minimum withdrawal amount is ₦2,005.00.');
          return false;
        }
      }
    } else {
      if (amtNum < 1000) {
        setErrorMessage('Minimum deposit amount is ₦1,000.00 to match XENA share starter packages.');
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (!validateStep1()) return;
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amtNum = parseFloat(amount);
    
    if (type === 'withdraw') {
      if (method === 'bank' && (!bankName || !accountNo)) {
        setErrorMessage('Please fill in bank name and account number details.');
        return;
      }
      if (method === 'crypto' && !cryptoAddress) {
        setErrorMessage('Please fill in your destination wallet address.');
        return;
      }
    } else {
      if (method === 'card' && (!cardNo || !cardExpiry || !cardCvv)) {
        setErrorMessage('Please fill in your processing card details.');
        return;
      }
    }

    setIsProcessing(true);
    setErrorMessage('');

    // Simulate Nigerian Inter-Bank Settlement System (NIBSS) or Paystack gateway processing latency
    setTimeout(() => {
      setIsProcessing(false);
      setFinalTxRef(generateRef());
      setStep(3);
      
      const resolvedBankName = bankName === 'Other Bank (Type custom)' ? otherBankName : bankName;
      const sourceLabel = withdrawSource === 'referral' ? 'Referral Earnings' : 'Shareholder Wallet';
      const detailsText = type === 'deposit' 
        ? `Deposited to XENA via ${method.toUpperCase()} (${method === 'card' ? 'Verve/Mastercard' : method === 'bank' ? 'Instant Bank Transfer' : 'USDT TRC20 Equivalent'})`
        : `Withdrawn from ${sourceLabel} to ${method.toUpperCase()} (${method === 'bank' ? resolvedBankName + ' - ' + accountNo : cryptoAddress.substring(0, 6) + '...'})`;
      
      onConfirm(amtNum, type, detailsText, type === 'withdraw' ? withdrawSource : 'wallet');
    }, 1500);
  };

  const resetModal = () => {
    setAmount('');
    setWithdrawSource('wallet');
    setStep(1);
    setErrorMessage('');
    setIsProcessing(false);
    onClose();
  };

  const nigerianBanks = [
    'Guaranty Trust Bank (GTBank)',
    'Zenith Bank',
    'Access Bank',
    'United Bank for Africa (UBA)',
    'First Bank of Nigeria',
    'Wema Bank / ALAT',
    'Sterling Bank',
    'Stanbic IBTC Bank',
    'Fidelity Bank',
    'Moniepoint Microfinance Bank',
    'OPay',
    'PalmPay',
    'Kuda Bank',
    'Other Bank (Type custom)'
  ];

  return (
    <div className="fixed inset-0 bg-purple-950/70 backdrop-blur-md flex items-start sm:items-center justify-center z-[1000] p-3 md:p-4 overflow-y-auto overscroll-contain transition-all duration-300">
      <div className="bg-white border border-slate-150 rounded-3xl w-full max-w-md shadow-2xl relative flex flex-col my-auto max-h-[92vh] sm:max-h-[85vh] overflow-hidden transition-all duration-300 transform scale-100">
        
        {/* Top Accent bar using XENA gradient */}
        <div className="h-2 bg-gradient-to-r from-purple-600 via-violet-700 to-yellow-500 w-full shrink-0" />

        {/* Header */}
        <div className="p-5 border-b border-slate-105 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-purple-800 bg-purple-50 border border-purple-150 px-3 py-1 rounded-full inline-block">
              {type === 'deposit' ? 'XENA Capital Portal' : 'Secured Earnings Payout'}
            </span>
            <h3 className="text-lg font-black text-slate-905 mt-2 font-sans tracking-tight leading-none leading-tight">
              {type === 'deposit' ? 'Fund Share Account' : 'Withdraw Yield Profit'}
            </h3>
          </div>
          <button 
            id={`btn-close-${type}`}
            onClick={resetModal}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 animate-pulse" />
          </button>
        </div>

        {/* Scrollable body content */}
        <div className="flex-1 overflow-y-auto min-h-0 pb-10 overscroll-contain touch-pan-y scrollbar-thin">
          {/* Errors and warnings info */}
          {errorMessage && (
            <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <p className="font-semibold leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* Step 1: Input Amount and Select Method */}
          {step === 1 && (
          <div className="p-6 space-y-5">
            {type === 'withdraw' && (
              <>
                {/* Prominent Referral Earnings Overview Banner */}
                <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-100/80 border border-amber-200 rounded-xl text-amber-700 shrink-0">
                      <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-amber-700/80 uppercase font-black tracking-widest leading-none mb-1">Total Referral Earnings</span>
                      <span className="text-lg font-black text-amber-955 font-mono tracking-tight">{formatNGN(wallet.referralEarnings || 0)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block text-[9px] font-black uppercase bg-amber-600 text-white px-2.5 py-1 rounded-lg tracking-wider font-mono shadow-xs">
                      ⚡ 24/7 PAYOUT
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Withdrawal Source Segment
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setWithdrawSource('wallet');
                        setAmount('');
                      }}
                      className={`p-3 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                        withdrawSource === 'wallet'
                          ? 'border-purple-600 bg-purple-50/30 text-slate-900 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-black tracking-wider text-slate-400">Share Balance</span>
                      <span className="block text-sm font-black mt-0.5 text-slate-900">{formatNGN(walletBalance)}</span>
                      <span className="block text-[9px] font-bold text-slate-500 mt-1">NIBSS Daily Window</span>
                      {withdrawSource === 'wallet' && (
                        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-purple-600" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setWithdrawSource('referral');
                        setAmount('');
                      }}
                      className={`p-3 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                        withdrawSource === 'referral'
                          ? 'border-amber-600 bg-amber-50/40 text-slate-900 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-black tracking-wider text-amber-700">Ref Income</span>
                      <span className="block text-sm font-black mt-0.5 text-slate-900">{formatNGN(wallet.referralEarnings || 0)}</span>
                      <span className="block text-[9px] font-bold text-purple-600 mt-1">⚡ Anytime Express</span>
                      {withdrawSource === 'referral' && (
                        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {type === 'withdraw' ? (
              <div className="p-3.5 bg-purple-50/40 border border-purple-100 rounded-2xl space-y-1">
                <span className="text-[10px] font-black uppercase text-purple-600 tracking-widest block">⏰ Payout Policy Check</span>
                <p className="text-[10.5px] text-slate-600 leading-normal font-semibold">
                  {withdrawSource === 'referral' ? (
                    <span className="text-purple-800 font-extrabold">🎉 24/7 Express processing window active for Referral Earnings. Payout anytime instantly!</span>
                  ) : adminApprovalSettings?.allowAnytimeWithdrawal ? (
                    <span className="text-purple-800 font-extrabold">🟢 Admin Override: 24/7 Global Express Withdrawals are currently open!</span>
                  ) : (
                    <span>Payout compliance cycles process daily from <strong className="text-purple-600 font-bold">10:00 AM to 12:00 PM</strong>. Use the dashboard's <strong className="underline text-purple-700">Time Machine</strong> to advance the simulated hour.</span>
                  )}
                </p>
              </div>
            ) : null}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Enter Amount (Naira ₦)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">₦</span>
                <input
                  id="input-amount"
                  type="number"
                  placeholder={type === 'deposit' ? "1,000" : (withdrawSource === 'referral' ? String(minRefWithdrawal) : (userHasReferrals ? String(minRefWithdrawal) : "2,005"))}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border-2 border-slate-205 rounded-2xl text-2xl font-black focus:bg-white focus:border-purple-600 focus:outline-none transition-all placeholder:text-slate-300 text-slate-800 font-mono shadow-inner"
                />
              </div>
              <div className="mt-1.5 flex justify-between text-xs text-slate-400 font-bold">
                <span>Min: ₦{type === 'deposit' ? '1,000.00' : (withdrawSource === 'referral' ? minRefWithdrawal.toLocaleString() + '.00' : (userHasReferrals ? minRefWithdrawal.toLocaleString() + '.00' : '2,000.00'))}</span>
                {type === 'withdraw' && (
                  <span>Withdrawable: <strong className="text-purple-700 font-mono font-black">{formatNGN(withdrawSource === 'referral' ? (wallet.referralEarnings || 0) : walletBalance)}</strong></span>
                )}
              </div>
            </div>

            {/* Quick amount shortcuts in Naira */}
            <div className="grid grid-cols-4 gap-1.5">
              {(type === 'deposit' 
                ? [1500, 3000, 5000, 10000] 
                : (withdrawSource === 'referral'
                  ? [minRefWithdrawal, minRefWithdrawal * 2, wallet.referralEarnings]
                  : (userHasReferrals 
                    ? [minRefWithdrawal, minRefWithdrawal * 2, minRefWithdrawal * 5, walletBalance] 
                    : [2000, 5000, 15000, walletBalance]))).map((preset, idx) => {
                if (!preset || preset <= 0) return null;
                const isMax = (withdrawSource === 'referral' ? idx === 2 : idx === 3) && type === 'withdraw';
                return (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    key={idx}
                    type="button"
                    onClick={() => setAmount(preset.toFixed(0))}
                    className="py-1.5 text-[10px] font-black text-slate-700 bg-slate-105 border border-slate-205 rounded-xl hover:bg-slate-200 transition-all cursor-pointer text-center"
                  >
                    {isMax ? 'MAX' : `₦${preset.toLocaleString()}`}
                  </motion.button>
                );
              })}
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Select Transaction Avenue
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`p-3 border-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                    method === 'bank'
                      ? 'border-purple-600 bg-purple-50/30 text-purple-955 font-black scale-102 shadow-2xs'
                      : 'border-slate-150 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Landmark className="w-5 h-5 mx-auto text-purple-600" />
                  <span className="text-[11px] block">Bank Transfer</span>
                </button>

                {type === 'deposit' ? (
                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`p-3 border-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                      method === 'card'
                        ? 'border-purple-600 bg-purple-50/30 text-purple-955 font-black scale-102 shadow-2xs'
                        : 'border-slate-150 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto text-purple-600" />
                    <span className="text-[11px] block">Debit Card</span>
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => setMethod('crypto')}
                  className={`p-3 border-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                    method === 'crypto'
                      ? 'border-purple-600 bg-purple-50/30 text-purple-955 font-black scale-102 shadow-2xs'
                      : 'border-slate-150 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Wallet className="w-5 h-5 mx-auto text-purple-600" />
                  <span className="text-[11px] block">USDT TRC25</span>
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="btn-modal-next"
              onClick={handleNextStep}
              className="w-full mt-2 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-md shadow-purple-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue Secure Gateway
              {type === 'deposit' ? <ArrowUpRight className="w-4 h-4 text-purple-100" /> : <ArrowDownLeft className="w-4 h-4 text-purple-100" />}
            </motion.button>
          </div>
        )}

        {/* Step 2: Form submission and Details check */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-purple-50/40 border border-purple-150 p-4 rounded-2xl space-y-2 text-xs mb-4">
              <div className="flex justify-between items-center text-slate-500 font-bold">
                <span>Requested Amount (Naira):</span>
                <span className="font-mono text-slate-800">{formatNGN(parseFloat(amount))}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 font-bold">
                <span>Gateway Process Fee:</span>
                <span className="text-purple-700">{type === 'deposit' ? '₦0.00 (Free)' : '1.0% (₦' + (parseFloat(amount) * 0.01).toFixed(2) + ')'}</span>
              </div>
              <div className="border-t border-purple-150/60 pt-2 flex justify-between items-center font-black text-slate-905 text-sm">
                <span>{type === 'deposit' ? 'Total to Pay:' : 'Net Outflow To Account:'}</span>
                <span className="text-purple-700 font-mono">
                  {formatNGN(type === 'deposit' ? parseFloat(amount) : parseFloat(amount) * 0.99)}
                </span>
              </div>
            </div>

            {/* CONDITIONAL BILLING OR CRYPTO DETAILS */}
            {method === 'bank' && type === 'deposit' && (
              <div className="space-y-3 animate-fade-in text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">XENA Escrow Deposit Bank Channels</span>
                <div className="space-y-3">
                  {depositAccounts && depositAccounts.filter(a => a.isActive).map((acc, index) => {
                    const isAccCopied = copiedAcc === acc.accountNumber;
                    return (
                      <div 
                        key={acc.id} 
                        onClick={() => handleCopyAcc(undefined, acc.accountNumber)}
                        className={`p-4 bg-slate-50 border rounded-2xl space-y-2 relative shadow-2xs cursor-pointer transition-all hover:bg-purple-50/10 active:scale-[0.99] select-none text-left ${
                          isAccCopied ? 'border-purple-600 ring-1 ring-purple-500 bg-purple-50/10' : 'border-slate-205 hover:border-purple-600'
                        }`}
                        title="Click anywhere on card to copy account number"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-purple-800">{acc.bankName}</span>
                          <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[8.5px] font-black uppercase rounded-lg tracking-wider font-mono">
                            Active #{index + 1}
                          </span>
                        </div>
                        <div className="space-y-1.5 text-xs text-slate-600 font-bold">
                          <p className="flex justify-between mb-1">
                            <span className="text-slate-400">Account Name:</span>
                            <strong className="text-slate-905">{acc.accountName}</strong>
                          </p>
                          <div className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded-xl text-xs shadow-2xs">
                            <span className="text-slate-400 uppercase tracking-wider text-[9.5px]">Account Number:</span>
                            <span className="font-mono text-slate-905 flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs leading-none">
                              {acc.accountNumber}
                              {isAccCopied ? (
                                <span className="flex items-center gap-1 text-[10px] text-purple-700 font-black">
                                  <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" /> Copied!
                                </span>
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-purple-605 shrink-0 cursor-pointer" />
                              )}
                            </span>
                          </div>
                          <p className="flex justify-between pt-1">
                            <span className="text-slate-400">Reference:</span>
                            <strong className="text-purple-700 font-mono font-black border border-purple-150 px-2 py-0.5 rounded bg-purple-50/40">XENA-DEP-{amount}</strong>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {(!depositAccounts || depositAccounts.filter(a => a.isActive).length === 0) && (
                    <div className="p-4 text-center border border-dashed border-slate-200 rounded-2xl text-xs text-slate-450 font-bold">
                      No active bank transfer channels currently set up by Admin. Please try alternative payment methods or report to support.
                    </div>
                  )}
                </div>
                <div className="pt-2 text-[10.5px] text-slate-450 font-bold">
                  Transfer exactly ₦{parseFloat(amount).toLocaleString()} using your mobile bank and click below to confirm.
                </div>
              </div>
            )}

            {method === 'bank' && type === 'withdraw' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Select Payout Bank</label>
                  <select
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-sm bg-white focus:bg-white focus:border-purple-600 focus:outline-none"
                  >
                    <option value="">-- Choose Bank --</option>
                    {nigerianBanks.map((bnk, idx) => (
                      <option key={idx} value={bnk}>{bnk}</option>
                    ))}
                  </select>
                </div>

                {bankName === 'Other Bank (Type custom)' && (
                  <div className="animate-fade-in">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Type Custom Bank Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PalmPay, OPay, Sparkle"
                      value={otherBankName}
                      onChange={(e) => setOtherBankName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-sm focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">NUBAN Account Number (10 Digits)</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="e.g. 0123456789"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-sm font-mono focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {method === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="5061 2222 3333 4444 (Verve / Mastercard)"
                    maxLength={19}
                    value={cardNo}
                    onChange={(e) => setCardNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-sm focus:border-purple-600 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-sm focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">CVV (3 Digits)</label>
                    <input
                      type="password"
                      required
                      placeholder="123"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-sm focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {method === 'crypto' && type === 'deposit' && (
              <div className="p-4 bg-slate-50 border border-purple-100 rounded-2xl space-y-3 text-center shadow-inner">
                <span className="text-[10px] font-black text-purple-800 uppercase tracking-widest block">USDT TRC20 Gateway Equivalent</span>
                <div className="w-32 h-32 mx-auto bg-white rounded-2xl border border-slate-200 flex items-center justify-center p-2.5 relative overflow-hidden">
                  <div className="grid grid-cols-6 gap-0.5 w-full h-full opacity-80">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className={`rounded-sm ${(i * 7 + 13) % 5 === 0 || (i % 7 === 0) ? 'bg-[#062817]' : 'bg-transparent'}`} />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <span className="text-[10px] font-mono font-bold text-purple-900 bg-purple-50 border border-purple-150 px-2 py-0.5 rounded-lg">USDT QR</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-center py-2 px-2.5 bg-white border border-slate-205 rounded-xl">
                  <code className="text-[10.5px] font-mono text-purple-800 font-extrabold truncate flex-1 leading-none select-all">TYv1A8yG86mZPfCBzfCB9086d76eB0afXENA</code>
                  <button
                    type="button"
                    onClick={() => handleCopy('TYv1A8yG86mZPfCBzfCB9086d76eB0afXENA')}
                    className="p-1 text-purple-705 hover:bg-slate-50 rounded cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-purple-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-bold leading-normal">Transfers process dynamically into and out of Naira assets at standard rates.</p>
              </div>
            )}

            {method === 'crypto' && type === 'withdraw' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Destination USDT Address (TRC20)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TYv1A8yG86mZPfCBzfCB..."
                    value={cryptoAddress}
                    onChange={(e) => setCryptoAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-sm text-slate-800 font-mono focus:border-purple-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-amber-600 font-medium block mt-1.5 flex items-start gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                    Secure address checks ensure compliance protocols match.
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-550 text-sm transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  type === 'deposit' ? 'Confirm Transfer' : 'Confirm Payout'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success Receipt */}
        {step === 3 && (
          <div className="p-8 text-center space-y-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
              type === 'deposit' && adminApprovalSettings?.requireDepositApproval
                ? 'bg-amber-100 text-amber-600'
                : 'bg-purple-100 rounded-full text-purple-800 border border-purple-150 shadow-sm'
            }`}>
              {type === 'deposit' && adminApprovalSettings?.requireDepositApproval ? (
                <AlertCircle className="w-10 h-10 text-amber-500" />
              ) : (
                <CheckCircle className="w-10 h-10 text-purple-600 animate-bounce" />
              )}
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-905">
                {type === 'deposit' 
                  ? (adminApprovalSettings?.requireDepositApproval ? 'Deposit Under Audit' : 'Fund Successful') 
                  : 'Withdrawal Processing'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-bold">
                {type === 'deposit' 
                  ? (adminApprovalSettings?.requireDepositApproval 
                      ? 'The administrator ledger will review and credit this transaction.' 
                      : 'NIBSS settlement confirms XENA INVESTMENT LTD shares have been credited.') 
                  : 'Requested transaction registry confirms pending transfer approval.'}
              </p>
            </div>

            <div className={`border rounded-2xl p-4 text-left space-y-3 text-xs ${
              type === 'deposit' && adminApprovalSettings?.requireDepositApproval
                ? 'border-amber-200 bg-amber-50/10'
                : 'border-purple-150 bg-purple-50/10'
            }`}>
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono text-slate-750 font-black select-all">{finalTxRef}</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-400">Value Date & Time:</span>
                <span className="text-slate-750 font-mono font-black">{new Date().toLocaleString('en-NG')}</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-400 font-bold">Processed Amount:</span>
                <span className="text-purple-750 font-mono font-black text-sm">{formatNGN(parseFloat(amount))}</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-400">Position Status:</span>
                {type === 'deposit' && adminApprovalSettings?.requireDepositApproval ? (
                  <span className="bg-amber-100 text-amber-850 border border-amber-200 font-black px-2.5 py-0.5 rounded-lg text-[9px] tracking-wide uppercase">PENDING AUDIT</span>
                ) : (
                  <span className="bg-purple-105 text-purple-800 border border-purple-150 font-black px-2.5 py-0.5 rounded-lg text-[10px]">AUTHORIZED</span>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="btn-receipt-dismiss"
              onClick={resetModal}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Return to Portfolio
            </motion.button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
