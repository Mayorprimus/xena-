import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Landmark, User, Mail, Lock, Gift, HelpCircle, ShieldCheck, Globe, FileText } from 'lucide-react';
import { formatNGN } from '../utils';
import { UserWallet } from '../types';
import XenaLogo from './XenaLogo';

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
  const [country, setCountry] = useState('Nigeria');
  const [kycIdType, setKycIdType] = useState('National ID');
  const [kycIdNumber, setKycIdNumber] = useState('');
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
    if (!kycIdNumber.trim() || kycIdNumber.trim().length < 4) {
      setErrorMsg('Please enter a valid official ID document number (at least 4 characters).');
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
    const randUid = `XENA-${Math.floor(10000 + Math.random() * 90000)}`;
    const newWallet: UserWallet = {
      fullName: fullName.trim(),
      email: signupEmail.trim(),
      accountNumber: `XENA-VAULT-${Math.floor(100000 + Math.random() * 900000)}`,
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
      bnbBalance: 0,
      country,
      kycIdType,
      kycIdNumber,
      kycStatus: 'verified' // Automatically verified KYC to allow instant high performance operations
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
      setKycIdNumber('');
      setSignupPassword('');
      setReferralCode('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#070b13] flex flex-col justify-center relative py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 relative z-10">
        {/* High-Fidelity Brand Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-2"
        >
          <XenaLogo size={100} showText={true} textSize="text-base" textTracking="tracking-[0.8em]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest font-mono">
            PREMIUM WEALTH PLATFORM
          </p>
          <p className="mt-1.5 text-[11px] text-slate-500 font-medium max-w-xs mx-auto leading-relaxed font-mono">
            High-Yield Global Corporate Shares & Secured Multi-Asset Digital Vault.
          </p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        {/* Card Frame */}
        <div className="bg-[#0b0e14] py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 shadow-2xl relative">
          
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
                  ? 'bg-blue-600/15 border border-blue-500/35 text-blue-400 font-black shadow-inner'
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
                  ? 'bg-blue-600/15 border border-blue-500/35 text-blue-400 font-black shadow-inner'
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
                  {/* Promo welcome XNC banner */}
                  <div className="p-3 bg-blue-950/30 border border-blue-900/40 rounded-2xl flex gap-2.5 items-start">
                    <Gift className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5 animate-pulse" />
                    <p className="text-[11px] text-blue-350 font-bold leading-relaxed">
                      Xena Premium Wealth <strong className="text-white">Xena Coin Reward</strong>: Sign up now to receive an instant <strong className="text-blue-400">500.0000 XNC welcome coin bonus</strong> credited directly to your digital asset vault!
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

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-purple-500" /> Country of Residence
                      </label>
                      <select
                        id="signup-country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none cursor-pointer"
                      >
                        <option className="bg-slate-950">Nigeria</option>
                        <option className="bg-slate-950">Ghana</option>
                        <option className="bg-slate-950">Kenya</option>
                        <option className="bg-slate-950">South Africa</option>
                        <option className="bg-slate-950">United Kingdom</option>
                        <option className="bg-slate-950">United States</option>
                        <option className="bg-slate-950">Canada</option>
                        <option className="bg-slate-950">Germany</option>
                        <option className="bg-slate-950">United Arab Emirates</option>
                        <option className="bg-slate-950">India</option>
                        <option className="bg-slate-950">Australia</option>
                        <option className="bg-slate-950">Other</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-purple-500 shrink-0" /> KYC ID Document
                        </label>
                        <select
                          id="signup-kyc-type"
                          value={kycIdType}
                          onChange={(e) => setKycIdType(e.target.value)}
                          className="w-full px-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none cursor-pointer"
                        >
                          <option className="bg-slate-950">National ID / NIN</option>
                          <option className="bg-slate-950">International Passport</option>
                          <option className="bg-slate-950">Driver's License</option>
                          <option className="bg-slate-950">Voter's Card</option>
                          <option className="bg-slate-950">Social Security / State ID</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                          Document ID Number
                        </label>
                        <input
                          id="signup-kyc-number"
                          type="text"
                          required
                          value={kycIdNumber}
                          onChange={(e) => setKycIdNumber(e.target.value)}
                          placeholder="e.g. A12345678"
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-purple-550/80 focus:ring-1 focus:ring-purple-550 rounded-xl text-xs font-semibold text-white focus:outline-none transition-all placeholder:text-slate-600"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[9px] text-purple-400 bg-purple-950/20 p-2.5 border border-purple-900/30 rounded-xl font-bold leading-normal text-left">
                    💡 Your KYC and identity status are secured via global distributed ledger technology. Verified status is granted instantly.
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
                        I accept the <span className="text-purple-400 font-extrabold underline">Shareholder Terms & Conditions</span>, XENA INVESTMENT LTD investment policies, and guarantee my official identity KYC details are authentic.
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
