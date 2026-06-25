import { useState } from 'react';
import { 
  User, 
  Lock, 
  Landmark, 
  CheckCircle, 
  ShieldAlert, 
  Copy, 
  Check, 
  CreditCard, 
  Coins, 
  Smartphone,
  Eye,
  EyeOff,
  Award,
  Sparkles,
  Clock,
  Share2,
  Calendar,
  Shield,
  Fingerprint,
  QrCode,
  ArrowRightLeft,
  Globe,
  FileText
} from 'lucide-react';
import { UserWallet, ReferralRelationship } from '../types';
import { motion } from 'motion/react';

interface ProfileViewProps {
  wallet: UserWallet;
  onUpdateProfile: (updates: Partial<UserWallet>) => void;
  simulatedTime: number;
  adminApprovalSettings?: {
    requireDepositApproval: boolean;
    requireInvestmentApproval: boolean;
    requireWithdrawalApproval: boolean;
    customReferralLink?: string;
    isReferralLinkStatic?: boolean;
  };
  registeredUsers: UserWallet[];
  referralsList?: ReferralRelationship[];
  onLogout?: () => void;
}

export default function ProfileView({ 
  wallet, 
  onUpdateProfile, 
  simulatedTime, 
  adminApprovalSettings,
  registeredUsers,
  referralsList = [],
  onLogout
}: ProfileViewProps) {
  // Precompute multi-level referral counts
  const codeNormalized = (wallet.referralCode || '').trim().toLowerCase();
  
  // Filter user referrals
  const userDirectReferrals = referralsList.filter(
    (r) => r.referrerEmail.toLowerCase() === wallet.email.toLowerCase() ||
           r.referrerCode.trim().toLowerCase() === wallet.referralCode.trim().toLowerCase()
  );

  const getNetworkCounts = () => {
    if (!codeNormalized) return { lv1: 0, lv2: 0, lv3: 0, lv4: 0, lv5: 0 };
    
    const lv1Users = registeredUsers.filter(u => u.referredBy?.trim().toLowerCase() === codeNormalized);
    const lv2Users = registeredUsers.filter(u => {
      if (!u.referredBy) return false;
      const refByCode = u.referredBy.trim().toLowerCase();
      return lv1Users.some(l1 => l1.referralCode.trim().toLowerCase() === refByCode);
    });
    const lv3Users = registeredUsers.filter(u => {
      if (!u.referredBy) return false;
      const refByCode = u.referredBy.trim().toLowerCase();
      return lv2Users.some(l2 => l2.referralCode.trim().toLowerCase() === refByCode);
    });
    const lv4Users = registeredUsers.filter(u => {
      if (!u.referredBy) return false;
      const refByCode = u.referredBy.trim().toLowerCase();
      return lv3Users.some(l3 => l3.referralCode.trim().toLowerCase() === refByCode);
    });
    const lv5Users = registeredUsers.filter(u => {
      if (!u.referredBy) return false;
      const refByCode = u.referredBy.trim().toLowerCase();
      return lv4Users.some(l4 => l4.referralCode.trim().toLowerCase() === refByCode);
    });
    
    return {
      lv1: lv1Users.length,
      lv2: lv2Users.length,
      lv3: lv3Users.length,
      lv4: lv4Users.length,
      lv5: lv5Users.length
    };
  };

  const netCounts = getNetworkCounts();

  const handleRequestUnlock = (levelName: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond') => {
    onUpdateProfile({
      pendingLevelUpgrade: levelName
    });
  };

  // Account/Bank binding states
  const [bankName, setBankName] = useState(wallet.accountNumber?.split('|')[1] || 'Access Bank');
  const [accountNumber, setAccountNumber] = useState(wallet.accountNumber?.split('|')[0]?.replace('NG-ACC-', '') || '');
  const [accountName, setAccountName] = useState(wallet.fullName);
  const [withdrawalMethod, setWithdrawalMethod] = useState<string>(
    wallet.password?.includes('USDT') ? 'usdt' : (wallet.accountNumber?.includes('USDT') ? 'usdt' : 'bank')
  );
  const [usdtAddress, setUsdtAddress] = useState(wallet.accountNumber?.startsWith('TRX') ? wallet.accountNumber : '');
  const [opayPhone, setOpayPhone] = useState(wallet.accountNumber?.startsWith('OPAY-') ? wallet.accountNumber.replace('OPAY-', '') : '');

  // Password modification states
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status message states
  const [bankSuccess, setBankSuccess] = useState('');
  const [bankError, setBankError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');
  
  // Referral link copying & promotional script variables
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  // Computed User UID
  const computedUid = wallet.uid || `XENA-${wallet.referralCode?.split('-').pop() || '49104'}`;

  const handleCopyUid = () => {
    navigator.clipboard.writeText(computedUid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const getReferralLink = () => {
    const link = adminApprovalSettings?.customReferralLink;
    if (link && link.trim() !== '') {
      if (adminApprovalSettings.isReferralLinkStatic) {
        return link.trim();
      }
      if (link.includes('{CODE}')) {
        return link.replace('{CODE}', wallet.referralCode).trim();
      }
      if (link.endsWith('=')) {
        return `${link.trim()}${wallet.referralCode}`;
      }
      const separator = link.includes('?') ? '&' : '?';
      return `${link.trim()}${separator}ref=${wallet.referralCode}`;
    }
    const baseDomain = "https://laferageinvestmentshares.xyz";
    return `${baseDomain}?ref=${wallet.referralCode}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getReferralLink());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getPromoMessage = (refLink: string) => {
    return `💎 *XENA INVESTMENT SHARES* 💎\nSecure your daily passive dividends with world-leading company shares including Apple, Samsung, Nvidia, Tesla, Microsoft, and Alphabet! Backed by premium global stocks and escrow-safe payouts. 📈\n\n💰 *Onboarding Reward:* Get *₦500.00* instantly credited to your register upon signup!\n📊 *Daily Passive Yields:* Earn up to *26.67% daily dividends* on company shares (Apple, Samsung, Nvidia, Tesla, Microsoft, Alphabet).\n👥 *Passive Earnings:* Build a network and unlock up to 5 tiers of daily passive commissions starting from 0.1%!\n\nJoin our active stakeholder network instantly using my unique link:\n👇👇👇\n${refLink}`;
  };

  const handleCopyMemo = () => {
    const msg = getPromoMessage(getReferralLink());
    navigator.clipboard.writeText(msg);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const getWhatsAppShareUrl = () => {
    const msg = getPromoMessage(getReferralLink());
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  };

  const handleSaveSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    setBankSuccess('');
    setBankError('');

    if (withdrawalMethod === 'bank') {
      if (!accountNumber || accountNumber.length !== 10 || isNaN(Number(accountNumber))) {
        setBankError('Standard Nigerian NUBAN account number must be exactly 10 digits.');
        return;
      }
      if (!bankName) {
        setBankError('Please select a valid commercial partner bank.');
        return;
      }
      
      const newAccountNumber = `NG-ACC-${accountNumber}|${bankName}`;
      onUpdateProfile({
        accountNumber: newAccountNumber,
        fullName: accountName
      });
      setBankSuccess('Your commercial bank account has been securely bound to your portfolio.');
    } else if (withdrawalMethod === 'usdt') {
      if (!usdtAddress || usdtAddress.length < 26) {
        setBankError('USDT wallet address must be at least 26 characters.');
        return;
      }
      
      onUpdateProfile({
        accountNumber: usdtAddress
      });
      setBankSuccess('Your USDT wallet address has been bounds successfully.');
    } else if (withdrawalMethod === 'opay') {
      if (!opayPhone || opayPhone.length < 10 || isNaN(Number(opayPhone))) {
        setBankError('Standard OPay mobile wallet number must be at least 10 digits.');
        return;
      }
      
      const newAccountNumber = `OPAY-${opayPhone}`;
      onUpdateProfile({
        accountNumber: newAccountNumber
      });
      setBankSuccess('Your OPay mobile e-wallet phone line has been synchronized.');
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdSuccess('');
    setPwdError('');

    if (currentPasswordInput !== wallet.password) {
      setPwdError('The current password or PIN you provided is incorrect.');
      return;
    }
    if (newPasswordInput.length < 4) {
      setPwdError('The new security passcode must be at least 4 digits/characters.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPwdError('The confirmed new password does not match.');
      return;
    }

    onUpdateProfile({
      password: newPasswordInput
    });

    setPwdSuccess('Your secure portfolio passcode was updated successfully!');
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 text-zinc-100">
      
      {/* Header Panel */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-6 md:p-8">
        {/* Subtle background glow */}
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-3xl shadow-xl shadow-blue-950/40 uppercase shrink-0">
              {wallet.fullName[0]}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl md:text-3xl font-black text-white font-sans tracking-tight leading-none">
                  {wallet.fullName}
                </h2>
                <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase rounded-full px-2.5 py-1 border ${
                  wallet.approvedLevel === 'Diamond'
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                    : wallet.approvedLevel === 'Platinum'
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.1)]'
                    : wallet.approvedLevel === 'Gold'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : wallet.approvedLevel === 'Silver'
                    ? 'bg-slate-500/10 border-slate-500/30 text-slate-300'
                    : wallet.approvedLevel === 'Bronze'
                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                    : 'bg-zinc-800/40 border-zinc-700 text-zinc-400'
                }`}>
                  <Award className="w-3.5 h-3.5" />
                  {wallet.approvedLevel ? `${wallet.approvedLevel} Partner` : 'Standard Affiliate'}
                </span>
              </div>
              
              <p className="text-sm text-zinc-400 font-mono font-bold leading-none">
                {wallet.email}
              </p>
              
              {/* Unique Country, and KYC Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-850 text-[10.5px] font-mono">
                  <Globe className="w-3.5 h-3.5 mr-1.5 text-blue-400 shrink-0" />
                  <span className="text-zinc-500 mr-1.5 uppercase text-[7.5px] tracking-wider font-sans font-extrabold">Country:</span>
                  <span className="font-extrabold text-blue-400">
                    {wallet.country || 'Nigeria'}
                  </span>
                </div>

                <div className="flex items-center bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-850 text-[10.5px] font-mono">
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-400 shrink-0" />
                  <span className="text-zinc-500 mr-1.5 uppercase text-[7.5px] tracking-wider font-sans font-extrabold">KYC Verified:</span>
                  <span className="font-extrabold text-blue-400 truncate max-w-[150px]">
                    {wallet.kycIdType || 'National ID'} ({wallet.kycIdNumber ? wallet.kycIdNumber.replace(/.(?=.{4})/g, '*') : 'A4918239'})
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Prominent, Extremely Visible XENA Shareholder ID Box */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <div className="bg-zinc-950/90 border border-blue-500/30 rounded-2xl p-4 flex flex-col justify-center text-left min-w-[240px] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-lg pointer-events-none" />
              <span className="text-[8px] uppercase font-black text-blue-400 tracking-widest block mb-1">
                XENA Shareholder ID (UID)
              </span>
              <div className="flex items-center justify-between gap-3">
                <span className="text-lg font-mono font-black text-white tracking-widest select-all">
                  {computedUid}
                </span>
                <button
                  onClick={handleCopyUid}
                  className="p-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-zinc-950 rounded-lg border border-blue-500/20 transition-all cursor-pointer"
                  title="Copy ID"
                >
                  {copiedUid ? (
                    <span className="text-[9px] px-1 font-black uppercase text-blue-400">Copied</span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <span className="text-[7.5px] text-zinc-500 leading-none mt-1.5 block">
                Use for inter-shareholder matrix transfers & verification.
              </span>
            </div>

            {/* Side Stats & Sign Out */}
            <div className="flex flex-row sm:flex-col gap-2 justify-stretch">
              <div className="flex-1 text-center bg-zinc-950/60 p-2.5 px-4 rounded-xl border border-zinc-805 text-left min-w-[120px]">
                <span className="text-[7.5px] uppercase font-bold text-zinc-500 tracking-wider block">Local Node</span>
                <span className="text-xs font-mono font-black text-purple-400 block mt-0.5">🔐 CNC-HS2</span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex-1 bg-red-950/20 hover:bg-red-900/30 border border-red-900/30 text-red-500 hover:text-red-400 font-extrabold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wide font-mono"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Referral Pipeline & Milestones */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Referral Reward Hub */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/60">
              <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-white text-sm leading-tight">Double-Reward Referral Node</h4>
                <p className="text-[10.5px] text-zinc-400 mt-0.5">Promote Xena across your network & earn ₦505.00 each</p>
              </div>
            </div>

            <div className="space-y-5 pt-4">
              
              {/* Copy Code */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-extrabold text-zinc-400 tracking-wider block">Your Invitation Code</label>
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                  <span className="font-mono font-black text-purple-400 tracking-widest text-sm select-all">
                    {wallet.referralCode}
                  </span>
                  <span className="text-[8.5px] uppercase font-black px-2.5 py-1 bg-purple-950/40 text-purple-400 rounded-lg border border-purple-500/20">
                    Invite Key
                  </span>
                </div>
              </div>

              {/* Copy URL */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] uppercase font-extrabold tracking-wider block">
                  <span className="text-zinc-400">Shareholder Registration Link</span>
                  {adminApprovalSettings?.customReferralLink && adminApprovalSettings.customReferralLink.trim() !== '' && (
                    <span className="text-[8px] text-blue-400 bg-blue-950/40 border border-blue-500/20 px-1.5 py-0.5 rounded uppercase">
                      Admin Configured Link Active
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getReferralLink()}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-3 py-2 text-[10px] text-zinc-300 font-mono focus:outline-none select-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyLink}
                    className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition-all shadow-lg shadow-purple-950/40 shrink-0 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-blue-300 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                  </motion.button>
                </div>
              </div>

              {/* WhatsApp Quick share promos */}
              <div className="border-t border-zinc-800/60 pt-4 space-y-3">
                <div className="flex items-center gap-1.5 text-[9.5px] font-black text-zinc-400 uppercase tracking-widest">
                  <QrCode className="w-3.5 h-3.5 text-purple-400" />
                  <span>WhatsApp Pitch Promoters</span>
                </div>
                
                <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-[9.5px] leading-relaxed text-zinc-400 relative">
                  <span className="font-extrabold text-purple-400 block mb-1">📢 Invite Copywriting Pitch:</span>
                  <p className="select-all italic">
                    "💎 *XENA INVESTMENT SHARES* 💎 Secure your daily passive dividends with world-leading company shares including Apple, Samsung, Nvidia..."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCopyMemo}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 text-zinc-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    {copiedMsg ? <Check className="w-4 h-4 text-blue-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                    <span>{copiedMsg ? "Copied!" : "Copy Pitch"}</span>
                  </motion.button>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    href={getWhatsAppShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#128C7E] hover:bg-[#075E54] text-white font-black text-xs rounded-xl transition-all shadow-sm text-center"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </motion.a>
                </div>
              </div>

            </div>
          </div>

          {/* Referred Members Registry */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-5">
            <div className="flex gap-2.5 items-center justify-between">
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-purple-400">
                  <CheckCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-black text-white text-sm leading-tight">Referred Partners Register</h4>
                  <p className="text-[10px] text-zinc-400">Track registration & audit state</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-extrabold text-purple-400 bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-500/20 shrink-0">
                {userDirectReferrals.length} Partners
              </span>
            </div>

            {userDirectReferrals.length === 0 ? (
              <div className="p-5 bg-zinc-950/40 rounded-2xl border border-dashed border-zinc-800 text-center space-y-1.5">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">No referred partners yet</p>
                <p className="text-[10px] text-zinc-400 leading-normal">
                  Give candidates your unique invite link. Once they register, they will appear here as pending supervisor audit validation!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {userDirectReferrals.map((ref) => (
                  <div key={ref.id} className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-black text-white truncate block">
                        {ref.referredName}
                      </span>
                      <span className={`text-[8.5px] font-extrabold uppercase px-2 py-0.5 mt-0.5 rounded border tracking-wider shrink-0 w-auto ${
                        ref.status === 'approved'
                          ? 'bg-purple-950/60 border-purple-500/30 text-purple-400'
                          : ref.status === 'rejected'
                          ? 'bg-red-955/20 border-red-500/20 text-red-400'
                          : 'bg-amber-955/20 border-amber-500/20 text-amber-400 animate-pulse'
                      }`}>
                        {ref.status === 'approved' ? 'Confirmed' : ref.status === 'rejected' ? 'Declined' : 'Pending Audit'}
                      </span>
                    </div>
                    <div className="flex justify-between items-end gap-1.5 font-mono text-[9.5px] text-zinc-500">
                      <span className="truncate">{ref.referredEmail}</span>
                      <span className="shrink-0">{new Date(ref.date).toLocaleDateString()}</span>
                    </div>

                    {ref.status === 'pending' && (
                      <div className="text-[9px] text-amber-400 leading-normal bg-amber-500/5 p-2 border border-amber-500/10 rounded-lg">
                        ⚠️ Pending review on the supervisor node. Your passive commission of ₦505.00 will clear upon first investment verification.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Bind Settlement Channels & Passcode Forms */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Vault Settlements Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-purple-400" /> Secure Settlement Bindings
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Configure your bound bank accounts, crypto cold-wallet addresses or e-wallets to receive fast automatic payouts.
              </p>
            </div>

            {/* Premium Selector Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'bank', name: 'Nigerian Bank Acc', icon: Landmark, desc: 'Receive standard NGN' },
                { id: 'usdt', name: 'USDT Address', icon: Coins, desc: 'Crypto cold-wallet' },
                { id: 'opay', name: 'OPay Quick Out', icon: Smartphone, desc: 'OPay mobile wallet' }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = withdrawalMethod === item.id;
                return (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={item.id}
                    onClick={() => {
                      setWithdrawalMethod(item.id);
                      setBankSuccess('');
                      setBankError('');
                    }}
                    className={`p-3 rounded-2xl text-left border flex flex-col justify-between h-[86px] transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg' 
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:border-zinc-750'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-zinc-500'}`} />
                    <div className="leading-none space-y-0.5">
                      <span className="text-[11px] font-black block uppercase tracking-tight">{item.name}</span>
                      <span className="text-[8px] tracking-wider uppercase opacity-65 font-mono text-[7px] mt-0.5 block">{item.desc}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {bankSuccess && (
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl text-xs font-bold flex gap-2 items-center animate-fade-in">
                <CheckCircle className="w-5 h-5 text-purple-400 shrink-0" />
                <span>{bankSuccess}</span>
              </div>
            )}

            {bankError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold flex gap-2 items-center animate-fade-in">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                <span>{bankError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettlement} className="space-y-5">
              
              {withdrawalMethod === 'bank' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] uppercase font-black text-zinc-400 tracking-wider block">
                        Nigerian Bank Partner
                      </label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-purple-500 hover:border-zinc-700 bg-zinc-950 rounded-2xl text-xs font-semibold focus:outline-none cursor-pointer text-zinc-200"
                      >
                        <option>Access Bank</option>
                        <option>Zenith Bank</option>
                        <option>Guaranty Trust Bank (GTBank)</option>
                        <option>United Bank for Africa (UBA)</option>
                        <option>Fidelity Bank</option>
                        <option>First Bank of Nigeria</option>
                        <option>Sterling Bank</option>
                        <option>Wema Bank Plc</option>
                        <option>OPay</option>
                        <option>PalmPay</option>
                        <option>Moniepoint Microfinance</option>
                        <option>Kuda Bank</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9.5px] uppercase font-black text-zinc-400 tracking-wider block">
                        Account Number (10 Digit NUBAN)
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        required
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 1013449104"
                        className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-2xl text-xs font-extrabold focus:outline-none transition-all tracking-wider font-mono text-white placeholder-zinc-650"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9.5px] uppercase font-black text-zinc-400 tracking-wider block">
                      Account Full Legal Name (Must match payout ID)
                    </label>
                    <input
                      type="text"
                      required
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="e.g. Jeremiah Obazee"
                      className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-2xl text-xs font-semibold focus:outline-none transition-all text-white placeholder-zinc-600"
                    />
                  </div>
                </div>
              )}

              {withdrawalMethod === 'usdt' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] uppercase font-black text-zinc-400 tracking-wider block">
                      USDT Wallet Address (TRC-20 Node)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TN2P98fX6H87Y6d... (Requires TRC-20 channel)"
                      value={usdtAddress}
                      onChange={(e) => setUsdtAddress(e.target.value.trim())}
                      className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-2xl text-xs font-extrabold focus:outline-none transition-all tracking-wider font-mono text-white placeholder-zinc-600"
                    />
                    <div className="flex gap-2 bg-purple-500/5 p-3 rounded-2xl border border-purple-500/10 text-[10px] text-zinc-400 leading-relaxed mt-2">
                      <QrCode className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>
                        Payout logs using digital assets are processed internationally by Xena overseas clearance partners within 15 minutes of withdrawal requests.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {withdrawalMethod === 'opay' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] uppercase font-black text-zinc-400 tracking-wider block">
                      Bound OPay Phone Line (10 to 11 digits)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 08123456789"
                      value={opayPhone}
                      onChange={(e) => setOpayPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-2xl text-xs font-extrabold focus:outline-none transition-all tracking-widest font-mono text-white placeholder-zinc-600"
                    />
                    <p className="text-[10px] text-amber-400/90 italic font-semibold leading-normal mt-1 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ensure phone matches your OPay official identification space.</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-zinc-800/60">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-purple-950/40 cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Bind Receiver Credentials</span>
                </motion.button>
              </div>
            </form>
          </div>

          {/* Change Security Passcode Panel */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" /> Security Access Credentials
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Regularly refresh your secure account password PIN to shield asset vaults from unauthorized access.
              </p>
            </div>

            {pwdSuccess && (
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl text-xs font-bold flex gap-2 items-center animate-fade-in">
                <CheckCircle className="w-5 h-5 text-purple-400 shrink-0" />
                <span>{pwdSuccess}</span>
              </div>
            )}

            {pwdError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold flex gap-2 items-center animate-fade-in">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                <span>{pwdError}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              
              <div className="space-y-1.5 relative">
                <label className="text-[9.5px] uppercase font-black text-zinc-400 tracking-wider block">
                  Current Password PIN
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    placeholder="Provide active password"
                    className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-2xl text-xs font-semibold focus:outline-none transition-all pr-12 text-white placeholder-zinc-700 font-mono tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-550 hover:text-zinc-300"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <label className="text-[9.5px] uppercase font-black text-zinc-400 tracking-wider block">
                    New Security Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Minimum 4 digits"
                      className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-2xl text-xs font-semibold focus:outline-none transition-all pr-12 text-white placeholder-zinc-700 font-mono tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-550 hover:text-zinc-300"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9.5px] uppercase font-black text-zinc-400 tracking-wider block">
                    Confirm Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Repeat new passcode"
                    className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-2xl text-xs font-semibold focus:outline-none transition-all text-white placeholder-zinc-700 font-mono tracking-widest"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-zinc-800/60">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-purple-950/40 cursor-pointer flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Update Vault Access Code</span>
                </motion.button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
