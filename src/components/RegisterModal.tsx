import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Gift, ShieldAlert, CheckCircle, Landmark, User, Mail, HelpCircle } from 'lucide-react';
import { formatNGN } from '../utils';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulatedTime: number;
  onRegisterSuccess: (newUser: {
    fullName: string;
    email: string;
    accountNumber: string;
    referralUsed: string;
    password?: string;
  }) => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  simulatedTime,
  onRegisterSuccess
}: RegisterModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bankName, setBankName] = useState('Access Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!acceptedTerms) {
      setErrorMsg('You must read and accept the Shareholder Terms & Conditions before registering.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full official name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (accountNumber.length !== 10 || isNaN(Number(accountNumber))) {
      setErrorMsg('Nigerian bank NUBAN account number must be exactly 10 digits.');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Security PIN/Password must be at least 4 characters.');
      return;
    }

    // Success state
    setIsSuccess(true);
    setTimeout(() => {
      onRegisterSuccess({
        fullName: fullName.trim(),
        email: email.trim(),
        accountNumber: `NG-ACC-${accountNumber}|${bankName}`,
        referralUsed: referralCode.trim(),
        password: password.trim()
      });
      setIsSuccess(false);
      onClose();
      // Reset form
      setFullName('');
      setEmail('');
      setAccountNumber('');
      setPassword('');
      setReferralCode('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto" id="register-modal-container">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg rounded-3xl bg-white text-left shadow-2xl border border-slate-150 flex flex-col overflow-hidden max-h-[90vh]"
      >
        {/* Color stripe accent */}
        <div className="h-2 bg-gradient-to-r from-purple-600 via-purple-750 to-yellow-500 w-full shrink-0" />

        {/* Header block */}
        <div className="p-6 border-b border-slate-105 bg-slate-50/50 relative shrink-0 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 shadow-sm shrink-0">
              <Gift className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-purple-800 bg-purple-50 border border-purple-150 px-2.5 py-0.5 rounded-full inline-block">
                XENA Shareholder Program
              </span>
              <h4 className="font-sans font-black text-slate-905 text-lg tracking-tight leading-none mt-1.5 uppercase">
                Register & Earn ₦500.00
              </h4>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-slate-100 hover:bg-slate-200/80 p-1.5 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body Container */}
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin">
          {isSuccess ? (
            <div className="p-10 text-center space-y-4 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 bg-purple-50 border border-purple-150 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-10 h-10 text-purple-600 animate-bounce" />
              </div>
              <h3 className="text-xl font-black text-slate-905">Registration Completed!</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto font-medium leading-relaxed">
                Congratulations! We have instantiated your secure portfolio ledger and credited your liquid wallet with <strong className="text-purple-700 font-extrabold text-base">₦500.00</strong> sign-up welcome bonus.
              </p>
              <span className="text-[10px] uppercase font-bold text-slate-450 block tracking-widest animate-pulse">
                Deploying local workspace...
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Highlight Promo banner */}
              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-2xl flex gap-2.5 items-start">
                <Gift className="w-4.5 h-4.5 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-805 font-bold leading-relaxed">
                  XENA INVESTMENT LTD guarantees <strong>₦500.00 welcome bonus credit</strong> immediately upon registration of brand new shareholder accounts. No initial deposit is required to lock in the bonus!
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-xs font-bold leading-normal flex gap-2 items-center">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                  {errorMsg}
                </div>
              )}

              {/* Input forms */}
              <div className="space-y-4 font-sans text-xs">
                
                {/* Full Name field */}
                <div>
                  <label className="block text-[10px] uppercase font-black text-slate-450 tracking-wider mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Full Legal Official Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Babajide Chinedu"
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-150 focus:border-purple-550 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all"
                  />
                </div>

                {/* Email address field */}
                <div>
                  <label className="block text-[10px] uppercase font-black text-slate-450 tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Shareholder Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. chinedu@example.com"
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-150 focus:border-purple-550 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all"
                  />
                </div>

                {/* Simulated payout bank account */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-450 tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-slate-400" /> Receiving Bank
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-150 rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
                    >
                      <option>Access Bank</option>
                      <option>Zenith Bank</option>
                      <option>GTBank</option>
                      <option>UBA Plc</option>
                      <option>Fidelity Bank</option>
                      <option>First Bank of Nigeria</option>
                      <option>OPay</option>
                      <option>PalmPay</option>
                      <option>Moniepoint Microfinance</option>
                      <option>Kuda Bank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-450 tracking-wider mb-1.5 flex items-center gap-1">
                      NUBAN Account
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="10 Digits"
                      className="w-full px-3.5 py-3 bg-slate-50 border border-slate-150 focus:border-purple-550 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Security PIN or password */}
                <div>
                  <label className="block text-[10px] uppercase font-black text-slate-450 tracking-wider mb-1.5">
                    Security Account PIN / Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••"
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-150 focus:border-purple-550 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all"
                  />
                </div>

                {/* Optional Referral Code used to claim referee rewards */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] uppercase font-black text-slate-450 tracking-wider flex items-center gap-1">
                      Referral Code <span className="text-[9px] text-purple-700 italic font-black">(Optional)</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="e.g. XEN-OBAZEE-2026"
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-150 focus:border-purple-550 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none uppercase tracking-wider transition-all"
                  />
                  {referralCode.trim() && (
                    <div className="mt-2 p-2.5 bg-purple-50/70 border border-purple-150 rounded-xl text-[10px] text-purple-800 font-bold flex gap-1.5 items-center">
                      <CheckCircle className="w-4 h-4 shrink-0 text-purple-600" /> 
                      Code logged. Referrer will receive rewards upon your deposits.
                    </div>
                  )}
                </div>

                {/* Mandatory Terms & Conditions Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-200 text-purple-600 focus:ring-purple-600"
                    />
                    <span className="text-[10px] text-slate-450 font-semibold leading-normal">
                      I accept the <span className="text-purple-700 font-extrabold underline">Shareholder Terms & Conditions</span>, XENA INVESTMENT LTD investment policies, and confirm my bank details are accurate.
                    </span>
                  </label>
                </div>

              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={!acceptedTerms}
                className={`w-full py-3.5 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md mt-4 cursor-pointer flex items-center justify-center gap-1.5 ${
                  acceptedTerms 
                    ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-100' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                }`}
              >
                Create Shareholder Account & Activate Vault
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
