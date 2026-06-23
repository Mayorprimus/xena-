import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Landmark, User, Mail, Lock, Gift, HelpCircle, ShieldCheck } from 'lucide-react';
import { formatNGN } from '../utils';
import { UserWallet } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (userWallet: UserWallet, isAdmin: boolean) => void;
  registeredUsers: UserWallet[];
  onRegisterUser: (newUser: UserWallet) => void;
}

export default function AuthScreen({
  onLoginSuccess,
  registeredUsers,
  onRegisterUser
}: AuthScreenProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup states
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [bankName, setBankName] = useState('Access Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-detect referral code from URL search param or pathname
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref');
      if (refParam) {
        setReferralCode(refParam.trim());
        setTab('signup');
      }
    } catch (e) {}
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetEmail = email.trim().toLowerCase();
    const targetPassword = password;

    // 1. Admin login checking
    if (targetEmail === 'admin1234@gmail.com' && targetPassword === 'admin1234') {
      setIsSuccess(true);
      setTimeout(() => {
        // Admin user profile structure
        onLoginSuccess({
          fullName: 'Corporate Admin',
          email: 'admin1234@gmail.com',
          walletBalance: 0,
          investedBalance: 0,
          withdrawnBalance: 0,
          earnedBalance: 0,
          accountNumber: 'NG-ACC-ADMIN',
          referralCode: 'XEN-ADMIN-2026',
          referralsCount: 0,
          referralEarnings: 0,
          hasClaimedBonus: true,
          password: 'admin1234'
        }, true);
        setIsSuccess(false);
      }, 1000);
      return;
    }

    // 2. Regular customer login checking
    const userMatch = registeredUsers.find(
      u => u.email.toLowerCase() === targetEmail && (!u.password || u.password === targetPassword)
    );

    if (userMatch) {
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess(userMatch, false);
        setIsSuccess(false);
      }, 1000);
    } else {
      setErrorMsg('Incorrect shareholder email address or security account PIN/password.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!acceptedTerms) {
      setErrorMsg('You must agree to the Shareholder Terms & Conditions before registering.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full legal official name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMsg('Please enter a valid shareholder email address.');
      return;
    }
    if (signupEmail.trim().toLowerCase() === 'admin1234@gmail.com') {
      setErrorMsg('The email administrative routing space is restricted. Please use your private email.');
      return;
    }
    if (accountNumber.length !== 10 || isNaN(Number(accountNumber))) {
      setErrorMsg('Nigerian bank NUBAN account number must be exactly 10 digits.');
      return;
    }
    if (signupPassword.length < 4) {
      setErrorMsg('Security Password PIN must be at least 4 alphanumeric digits.');
      return;
    }

    // Check if user already exists
    const exists = registeredUsers.some(u => u.email.toLowerCase() === signupEmail.trim().toLowerCase());
    if (exists) {
      setErrorMsg('A shareholder workspace already exists for this email address. Please sign in instead.');
      return;
    }

    // Create a brand new wallet that starts empty (0 balance)
    const cleanNamePart = fullName.trim().split(' ')[0]?.toUpperCase().replace(/[^A-Z]/g, '') || 'MEMBER';
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const generatedReferralCode = `XEN-${cleanNamePart}-${randCode}`;
    const randUid = `XNA-${Math.floor(10000 + Math.random() * 90000)}`;
    const newWallet: UserWallet = {
      fullName: fullName.trim(),
      email: signupEmail.trim(),
      accountNumber: `NG-ACC-${accountNumber}|${bankName}`,
      walletBalance: 0, // Fresh shareholder starts with 0 Naira
      investedBalance: 0,
      withdrawnBalance: 0,
      earnedBalance: 0,
      referralCode: generatedReferralCode,
      referralsCount: 0,
      referralEarnings: 0,
      hasClaimedBonus: false,
      password: signupPassword,
      isFlagged: false,
      requireReferralToWithdraw: false,
      referredBy: referralCode.trim() || undefined,
      uid: randUid,
      xenaBalance: 0,
      usdtBalance: 0,
      solBalance: 0,
      btcBalance: 0,
      ethBalance: 0,
      bnbBalance: 0
    };

    onRegisterUser(newWallet);
    setIsSuccess(true);
    setSuccessMsg('Portfolio ledger successfully designated!');

    setTimeout(() => {
      onLoginSuccess(newWallet, false);
      setIsSuccess(false);
      // Reset signup fields
      setFullName('');
      setSignupEmail('');
      setAccountNumber('');
      setSignupPassword('');
      setReferralCode('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center relative py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      {/* Dynamic Ambient Background Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-35" />
      
      {/* Decorative colored glow fields */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Modern thin top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-[#9333ea] to-amber-500 z-10" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 relative z-10">
        {/* Brand visual header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 bg-indigo-950/40 border border-indigo-500/35 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.15)]"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#02050b] to-[#0d1220] border border-cyan-400/40 flex items-center justify-center text-white font-black text-xs shadow-[0_0_10px_rgba(34,211,238,0.4)] shrink-0">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-[0_0_4px_#22d3ee]">X</span>
          </div>
          <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest leading-none font-mono">
            XENA PORTFOLIO LEDGER • Sovereign Class
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h2 className="text-3xl font-sans font-black text-white tracking-tight leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-indigo-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)] font-black">X</span>ENA PORTFOLIO
          </h2>
          <p className="mt-2 text-xs text-slate-400 font-extrabold max-w-xs mx-auto leading-relaxed">
            High-Yield Global Corporate Shares & Protected Decentralized Ledger.
          </p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        {/* Card Frame */}
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
          
          {/* Subtle upper glow corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full pointer-events-none" />

          {/* Form tab toggle */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              id="auth-tab-signin"
              onClick={() => {
                setTab('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-center text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer relative ${
                tab === 'signin'
                  ? 'bg-purple-600/15 border border-purple-500/35 text-purple-400 font-black shadow-inner shadow-purple-500/5'
                  : 'text-slate-450 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              id="auth-tab-signup"
              onClick={() => {
                setTab('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-center text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer relative ${
                tab === 'signup'
                  ? 'bg-purple-600/15 border border-purple-500/35 text-purple-400 font-black shadow-inner shadow-purple-500/5'
                  : 'text-slate-450 hover:text-slate-200'
              }`}
            >
              Register Account
            </button>
          </div>

          <div className="pt-2">
            {errorMsg && (
              <div className="p-3.5 bg-rose-950/40 border border-rose-900/50 rounded-2xl text-rose-300 text-xs font-bold leading-relaxed flex gap-2.5 items-start">
                <Shield className="w-4.5 h-4.5 shrink-0 text-rose-500 mt-0.5 animate-pulse" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-purple-950/40 border border-purple-900/55 rounded-2xl text-purple-300 text-xs font-bold leading-relaxed flex gap-2.5 items-center">
                <ShieldCheck className="w-5 h-5 text-purple-500 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>

          {isSuccess ? (
            <div className="py-12 text-center space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center animate-bounce">
                <ShieldCheck className="w-9 h-9 text-purple-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Verifying Ledger Keys</h3>
              <p className="text-xs text-slate-400 font-extrabold max-w-xs leading-relaxed">
                Platform is verifying the authorized African Stock Broker allocation credentials...
              </p>
            </div>
          ) : (
            <>
              {tab === 'signin' ? (
                /* SIGN IN FORM */
                <form onSubmit={handleSignIn} className="space-y-5 pt-2">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-purple-500" /> Shareholder Email Identity
                    </label>
                    <input
                      id="signin-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. shareholder@example.com"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-purple-550/80 focus:ring-1 focus:ring-purple-500 rounded-xl text-xs font-semibold text-white focus:outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-purple-500" /> Security PIN / Password
                    </label>
                    <input
                      id="signin-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-purple-550/80 focus:ring-1 focus:ring-purple-500 rounded-xl text-xs font-semibold text-white focus:outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>

                  <button
                    id="btn-signin-submit"
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-purple-950/40 mt-4 cursor-pointer"
                  >
                    Authorize Session & Enter Ledger
                  </button>
                </form>
              ) : (
                /* SIGN UP FORM */
                <form onSubmit={handleSignUp} className="space-y-4 pt-2">
                  {/* Promo welcome 500 banner */}
                  <div className="p-3 bg-purple-950/30 border border-purple-900/40 rounded-2xl flex gap-2.5 items-start">
                    <Gift className="w-4.5 h-4.5 text-purple-400 shrink-0 mt-0.5 animate-pulse" />
                    <p className="text-[11px] text-purple-300 font-bold leading-relaxed">
                      XENA INVESTMENT LTD <strong className="text-white">Naira Welcome Reward</strong>: Sign up now to receive an instant <strong className="text-amber-400">₦500.00 welcome bonus booster</strong> credited directly to your shareholder balance!
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-500" /> Full Official Name
                    </label>
                    <input
                      id="signup-fullname"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Jeremiah Obazee"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-purple-550/80 focus:ring-1 focus:ring-purple-550 rounded-xl text-xs font-semibold text-white focus:outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-purple-500" /> Shareholder Email Address
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. jeremiah@example.com"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-purple-550/80 focus:ring-1 focus:ring-purple-550 rounded-xl text-xs font-semibold text-white focus:outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 flex items-center gap-1 flex-nowrap truncate">
                        <Landmark className="w-3.5 h-3.5 text-purple-500 shrink-0" /> Receiving Bank
                      </label>
                      <select
                        id="signup-bank"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none cursor-pointer"
                      >
                        <option className="bg-slate-950">Access Bank</option>
                        <option className="bg-slate-950">Zenith Bank</option>
                        <option className="bg-slate-950">GTBank</option>
                        <option className="bg-slate-950">UBA Plc</option>
                        <option className="bg-slate-950">Fidelity Bank</option>
                        <option className="bg-slate-950">First Bank of Nigeria</option>
                        <option className="bg-slate-950">OPay</option>
                        <option className="bg-slate-950">PalmPay</option>
                        <option className="bg-slate-950">Moniepoint Microfinance</option>
                        <option className="bg-slate-950">Kuda Bank</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                        NUBAN Account
                      </label>
                      <input
                        id="signup-nuban"
                        type="text"
                        maxLength={10}
                        required
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="10 Digits"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-purple-550/80 focus:ring-1 focus:ring-purple-550 rounded-xl text-xs font-semibold text-white focus:outline-none transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <p className="text-[9px] text-purple-400 bg-purple-950/20 p-2.5 border border-purple-900/30 rounded-xl font-bold leading-normal text-left">
                    💡 Receiving bank credentials can be instantly modified inside of your shareholder profile dashboard settings.
                  </p>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-purple-500" /> Choose Security Pass PIN
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-purple-550/80 focus:ring-1 focus:ring-purple-550 rounded-xl text-xs font-semibold text-white focus:outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                      Referral ID Code <span className="text-[9px] text-purple-400 italic font-black">(Optional)</span>
                    </label>
                    <input
                      id="signup-refcode"
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="e.g. XEN-OBAZEE-2026"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-purple-550/80 focus:ring-1 focus:ring-purple-500 rounded-xl text-xs font-semibold text-white focus:outline-none uppercase tracking-wider transition-all placeholder:text-slate-600"
                    />
                  </div>

                  {/* Mandatory Terms & Conditions Checkbox */}
                  <div className="pt-2 select-none">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 bg-slate-950 border border-slate-800 rounded checked:bg-purple-600 checked:border-purple-600 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-[10px] text-slate-400 font-semibold leading-normal">
                        I accept the <span className="text-purple-400 font-extrabold underline">Shareholder Terms & Conditions</span>, XENA INVESTMENT LTD investment policies, and guarantee my withdrawal payment bank details are authentic.
                      </span>
                    </label>
                  </div>

                  <button
                    id="btn-signup-submit"
                    type="submit"
                    disabled={!acceptedTerms}
                    className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md mt-4 cursor-pointer flex items-center justify-center gap-1.5 ${
                      acceptedTerms
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-purple-950/40'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-40 border border-slate-700'
                    }`}
                  >
                    Register Profile Ledger (starts with ₦0)
                  </button>
                </form>
              )}
            </>
          )}

        </div>
      </motion.div>
    </div>
  );
}
