import { useState, useEffect, useRef } from 'react';
import { 
  Factory, 
  TrendingUp, 
  Clock, 
  HelpCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Landmark, 
  CheckCircle,
  Menu,
  X,
  Plus,
  Compass,
  Lock,
  Gift,
  Users,
  Copy,
  Check,
  Headphones,
  MessageSquare,
  Send,
  User,
  Share2,
  Sparkles,
  Phone,
  Coins,
  Zap,
  RefreshCw,
  Wallet
} from 'lucide-react';

import { ActiveInvestment, UserWallet, Transaction, SupportTicket, DepositAccount, ReferralRelationship, BonusCode } from './types';
import { productsList } from './data';
import { formatNGN, generateRef } from './utils';

// Import child components
import StatsGrid from './components/StatsGrid';
import ProductCard from './components/ProductCard';
import ActiveInvestments from './components/ActiveInvestments';
import Calculator from './components/Calculator';
import BonusClaimSection from './components/BonusClaimSection';
import TransactionHistory from './components/TransactionHistory';
import DepositWithdrawModal from './components/DepositWithdrawModal';
import RegisterModal from './components/RegisterModal';
import AdminPortal from './components/AdminPortal';
import AuthScreen from './components/AuthScreen';
import ProfileView from './components/ProfileView';
import SplashScreen from './components/SplashScreen';
import PromoReferralModal from './components/PromoReferralModal';
import WelcomeXenaModal from './components/WelcomeXenaModal';
import CryptoSwapSection from './components/CryptoSwapSection';
import DailyStreakCard from './components/DailyStreakCard';
import { motion } from 'motion/react';

export default function App() {
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const isJustRegisteredRef = useRef(false);
  const syncLock = useRef(false);
  const localVersion = useRef(0);
  const isInitializedFromServer = useRef(false);
  const isSyncingFromServer = useRef(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'invest' | 'crypto' | 'simulator' | 'faq' | 'cs' | 'admin' | 'profile'>('dashboard');
  const [adminApprovalSettings, setAdminApprovalSettings] = useState({
    requireDepositApproval: true,
    requireInvestmentApproval: true,
    requireWithdrawalApproval: true,
    customReferralLink: '',
    isReferralLinkStatic: false,
    csNumber: '08158432605',
    officialWhatsAppGroup: 'https://chat.whatsapp.com/KHZgCi1h24154DqIIHz3VE',
    minReferralWithdrawal: 5000,
    allowAnytimeWithdrawal: false
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Real-time Virtual Simulate Date Clock
  const [simulatedTime, setSimulatedTime] = useState<number>(Date.now());

  // Modal handler states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'deposit' | 'withdraw'>('deposit');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [referredByCode, setReferredByCode] = useState(() => {
    return localStorage.getItem('lafarge_referred_by_code') || '';
  });

  const [referrals, setReferrals] = useState<ReferralRelationship[]>(() => {
    const saved = localStorage.getItem('lafarge_referrals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  const checkAndRecordReferral = (referredUser: UserWallet, currentUsers: UserWallet[]) => {
    const rawRefCode = referredUser.referredBy;
    if (rawRefCode) {
      const referrer = currentUsers.find(
        (u) => u.referralCode.trim().toLowerCase() === rawRefCode.trim().toLowerCase()
      );
      if (referrer) {
        setReferrals((prev) => {
          const alreadyExists = prev.some(
            (r) => r.referredEmail.toLowerCase() === referredUser.email.toLowerCase()
          );
          if (!alreadyExists) {
            const refObj: ReferralRelationship = {
              id: `ref-${Math.random().toString(36).substring(2, 9)}`,
              referrerEmail: referrer.email,
              referrerCode: referrer.referralCode,
              referredEmail: referredUser.email,
              referredName: referredUser.fullName,
              amount: 500, // ₦500 referral reward
              status: 'pending',
              date: Date.now()
            };
            return [refObj, ...prev];
          }
          return prev;
        });
      }
    }
  };

  // Local state of registered shareholder accounts stored in persistent DB storage
  const [registeredUsers, setRegisteredUsers] = useState<UserWallet[]>(() => {
    const saved = localStorage.getItem('lafarge_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u, i) => ({
            ...u,
            uid: u.uid || `XNA-${u.accountNumber ? u.accountNumber.split('-').pop() : Math.floor(10000 + Math.random() * 90000)}`
          }));
        }
      } catch (e) {}
    }
    return [
      {
        fullName: 'Jeremiah Obazee',
        email: 'jeremiahobazee11@gmail.com',
        walletBalance: 120000,
        investedBalance: 30000,
        withdrawnBalance: 4500,
        earnedBalance: 4500,
        accountNumber: 'NG-ACC-1013449104',
        referralCode: 'XEN-OBAZEE-2026',
        referralsCount: 4,
        referralEarnings: 2000,
        hasClaimedBonus: true,
        password: '2026',
        isFlagged: false,
        requireReferralToWithdraw: false,
        autoInvest: true,
        xenaBalance: 154.50,
        usdtBalance: 45.00,
        solBalance: 0.250,
        btcBalance: 0.0035,
        ethBalance: 0.1250,
        bnbBalance: 1.450,
        uid: 'XNA-49104'
      },
      {
        fullName: 'Chioma Adebayo',
        email: 'chioma.a@demoland.com',
        walletBalance: 45000,
        investedBalance: 0,
        withdrawnBalance: 0,
        earnedBalance: 0,
        accountNumber: 'NG-ACC-2094810293',
        referralCode: 'XEN-CHIOMA-992',
        referralsCount: 0,
        referralEarnings: 0,
        hasClaimedBonus: true,
        password: '1234',
        isFlagged: false,
        requireReferralToWithdraw: false,
        autoInvest: true,
        uid: 'XNA-02931',
        xenaBalance: 12.0
      },
      {
        fullName: 'Emeka Okafor',
        email: 'emeka.o@demoland.com',
        walletBalance: 98000,
        investedBalance: 50000,
        withdrawnBalance: 12000,
        earnedBalance: 12000,
        accountNumber: 'NG-ACC-3049182041',
        referralCode: 'XEN-EMEKA-105',
        referralsCount: 2,
        referralEarnings: 1000,
        hasClaimedBonus: true,
        password: '1234',
        isFlagged: false,
        requireReferralToWithdraw: false,
        autoInvest: true,
        uid: 'XNA-82041',
        xenaBalance: 45.0
      }
    ];
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const sessionStr = localStorage.getItem('lafarge_login_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session && session.expiresAt > Date.now()) {
          return true;
        }
      } catch (e) {}
    }
    return false;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const sessionStr = localStorage.getItem('lafarge_login_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session && session.expiresAt > Date.now()) {
          return !!session.isAdmin;
        }
      } catch (e) {}
    }
    return false;
  });

  // Active wallet state bound to current logged in session
  const [wallet, setWallet] = useState<UserWallet>(() => {
    const sessionStr = localStorage.getItem('lafarge_login_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session && session.expiresAt > Date.now()) {
          const savedUsers = localStorage.getItem('lafarge_registered_users');
          if (savedUsers) {
            const users = JSON.parse(savedUsers);
            const userMatch = users.find((u: any) => u.email.toLowerCase() === session.email.toLowerCase());
            if (userMatch) return userMatch;
          }
          if (session.isAdmin) {
            return {
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
            };
          }
        }
      } catch (e) {}
    }
    // Default fallback to Jeremiah
    return {
      fullName: 'Jeremiah Obazee',
      email: 'jeremiahobazee11@gmail.com',
      walletBalance: 120000,
      investedBalance: 30000,
      withdrawnBalance: 4500,
      earnedBalance: 4500,
      accountNumber: 'NG-ACC-1013449104',
      referralCode: 'XEN-OBAZEE-2026',
      referralsCount: 4,
      referralEarnings: 2000,
      hasClaimedBonus: true,
      password: '2026',
      isFlagged: false,
      requireReferralToWithdraw: false,
      autoInvest: true,
      xenaBalance: 154.50,
      usdtBalance: 45.00,
      solBalance: 0.250,
      btcBalance: 0.0035,
      ethBalance: 0.1250,
      bnbBalance: 1.450
    };
  });

  // Active investments array setup with a mock Calabar Port Bulk Cement Option share position
  const [activeInvestments, setActiveInvestments] = useState<ActiveInvestment[]>(() => {
    const saved = localStorage.getItem('lafarge_active_investments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'inv-first-calabar',
        productId: 'prod-calabar-30k',
        productName: 'Calabar Port Bulk Cement Options',
        amountInvested: 30000,
        startDate: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
        endDate: Date.now() + 10 * 24 * 60 * 60 * 1000,   // 10 days left for 11-day cycle
        lastAccrualTime: Date.now() - 1 * 24 * 60 * 60 * 1000,
        status: 'active',
        totalAccrued: 7800, // ₦7,800 daily dividend (26.0% of ₦30,000) pre-accrued for demonstration!
        expectedReturn: 234000, // 26.0% daily * 30 days on 30,000 is 234,000 profit
        isCompounding: true,
        termDays: 30,
        rate: 0.26,
        userEmail: 'jeremiahobazee11@gmail.com'
      }
    ];
  });

  // Interactive Customer Service chat and ticket states
  const [depositAccounts, setDepositAccounts] = useState<DepositAccount[]>(() => {
    const defaultAccounts = [
      {
        id: 'da-opay-default',
        bankName: 'OPay',
        accountName: 'XENA Africa Corporate Escrow Ledger',
        accountNumber: '8158432605',
        isActive: true
      },
      {
        id: 'da-1',
        bankName: 'Access International Bank PLC',
        accountName: 'XENA Investment Plc Settlement Ledger',
        accountNumber: '1019014197',
        isActive: true
      },
      {
        id: 'da-2',
        bankName: 'OPay Digital Ltd (Escrow)',
        accountName: 'XENA Investment Treasury Holdings',
        accountNumber: '9082914104',
        isActive: true
      },
      {
        id: 'da-3',
        bankName: 'Moniepoint Microfinance Bank',
        accountName: 'XENA Treasury Premium Shares',
        accountNumber: '5039294103',
        isActive: true
      }
    ];

    const saved = localStorage.getItem('lafarge_deposit_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const hasNew = parsed.some(acc => acc.accountNumber === '8158432605');
          if (!hasNew) {
            return [defaultAccounts[0], ...parsed];
          }
          return parsed;
        }
      } catch (e) {}
    }
    return defaultAccounts;
  });

  const [csTickets, setCsTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('lafarge_cs_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'TCK-924401',
        userEmail: 'jeremiahobazee11@gmail.com',
        userFullName: 'Obazee Jeremiah',
        category: 'Deposit Upgrade',
        subject: 'Paystack transfer delay verification',
        status: 'resolved',
        date: Date.now() - 2 * 24 * 60 * 60 * 1000,
        messages: [
          {
            id: 'msg_1',
            sender: 'user',
            senderName: 'Obazee Jeremiah',
            text: 'I sent my deposit of 50,000 NGN via Paystack but it has not shown up in my wallet. Please check.',
            date: Date.now() - 2 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000
          },
          {
            id: 'msg_2',
            sender: 'agent',
            senderName: 'Blessing Adebayo',
            text: 'Hello Obazee, thank you for providing the transaction details! We have verified the transaction against our hub ledger and manually credited your account. Wishing you prosperous returns on your options.',
            date: Date.now() - 2 * 24 * 60 * 60 * 1000
          }
        ]
      },
      {
        id: 'TCK-104932',
        userEmail: 'jeremiahobazee11@gmail.com',
        userFullName: 'Obazee Jeremiah',
        category: 'Withdrawal Window',
        subject: 'Clarification on 10am limits',
        status: 'resolved',
        date: Date.now() - 1 * 24 * 60 * 60 * 1000,
        messages: [
          {
            id: 'msg_3',
            sender: 'user',
            senderName: 'Obazee Jeremiah',
            text: 'Can I request a withdrawal at any time of day, or is it only permitted during specified daily corporate hours?',
            date: Date.now() - 1 * 24 * 60 * 60 * 1000 - 45 * 60 * 1000
          },
          {
            id: 'msg_4',
            sender: 'agent',
            senderName: 'Blessing Adebayo',
            text: 'Our payout desk processes settlement claims in batches, with premium options cleared between 10 AM and 4 PM NIBSS time. Your request can be submitted whenever convenient!',
            date: Date.now() - 1 * 24 * 60 * 60 * 1005
          }
        ]
      }
    ];
  });

  const [userChatThreads, setUserChatThreads] = useState<Record<string, { sender: 'user' | 'agent' | 'admin'; text: string; time: string; }[]>>(() => {
    const saved = localStorage.getItem('lafarge_user_chat_threads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      'jeremiahobazee11@gmail.com': [
        {
          sender: 'agent',
          text: 'Good day! Welcome to XENA Investment Client Relations Desk. I am Blessing Adebayo, your dedicated advisor today. How may I help you solve issues or maximize return on your global shares package?',
          time: 'Just now'
        }
      ]
    };
  });

  const csChatMessages = userChatThreads[wallet.email.toLowerCase()] || [
    {
      sender: 'agent',
      text: 'Good day! Welcome to XENA Investment Client Relations Desk. I am Blessing Adebayo, your dedicated advisor today. How may I help you solve issues or maximize return on your global shares package?',
      time: 'Just now'
    }
  ];

  const [currentCsInput, setCurrentCsInput] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Deposit Issue');
  const [ticketSuccessInfo, setTicketSuccessInfo] = useState('');
  const [selectedTicketIdForUser, setSelectedTicketIdForUser] = useState<string | null>(null);
  const [userTicketReplyText, setUserTicketReplyText] = useState('');

  // Cryptographic swap simulator states
  const [swapAmount, setSwapAmount] = useState<number>(15000);
  const [swapCoin, setSwapCoin] = useState<'XNC' | 'USDT' | 'SOL'>('XNC');
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapSuccessMessage, setSwapSuccessMessage] = useState<string>('');

  // Comprehensive historic txn list corresponding safely to visual balances in database storage
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('lafarge_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'tx-initial-deployment',
        type: 'invest',
        amount: 30000,
        status: 'completed',
        date: Date.now() - 1 * 24 * 60 * 60 * 1000,
        reference: 'TX-XEN9086',
        description: 'Acquired Samsung Electronics Shares',
        userEmail: 'jeremiahobazee11@gmail.com'
      },
      {
        id: 'tx-dividend-claim-prev',
        type: 'payout',
        amount: 4500,
        status: 'completed',
        date: Date.now() - 0.5 * 24 * 60 * 60 * 1000,
        reference: 'TX-EARN451',
        description: 'Withdrew Day 1 XENA Stock Dividend',
        userEmail: 'jeremiahobazee11@gmail.com'
      },
      {
        id: 'tx-initial-deposit',
        type: 'deposit',
        amount: 154500,
        status: 'completed',
        date: Date.now() - 1.5 * 24 * 60 * 60 * 1000,
        reference: 'TX-ACC-PAYSTACK',
        description: 'Funded account via paystack gateway',
        userEmail: 'jeremiahobazee11@gmail.com'
      }
    ];
  });

  // Admin and user bonus code state
  const [bonusCodes, setBonusCodes] = useState<BonusCode[]>(() => {
    const saved = localStorage.getItem('xena_bonus_codes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'bonus-welcome-2026',
        code: 'XENA-WELCOME',
        rewardAmount: 1000,
        maxClaims: 100,
        claimedBy: [],
        isActive: true,
        createdAt: Date.now()
      },
      {
        id: 'bonus-vip-wealth',
        code: 'VIP5000',
        rewardAmount: 5000,
        maxClaims: 10,
        claimedBy: [],
        isActive: true,
        createdAt: Date.now()
      }
    ];
  });

  // Dynamic automatic synchronization hooks for the local database
  useEffect(() => {
    localStorage.setItem('lafarge_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('xena_bonus_codes', JSON.stringify(bonusCodes));
  }, [bonusCodes]);

  useEffect(() => {
    localStorage.setItem('lafarge_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('lafarge_active_investments', JSON.stringify(activeInvestments));
  }, [activeInvestments]);

  useEffect(() => {
    localStorage.setItem('lafarge_deposit_accounts', JSON.stringify(depositAccounts));
  }, [depositAccounts]);

  useEffect(() => {
    localStorage.setItem('lafarge_cs_tickets', JSON.stringify(csTickets));
  }, [csTickets]);

  useEffect(() => {
    localStorage.setItem('lafarge_user_chat_threads', JSON.stringify(userChatThreads));
  }, [userChatThreads]);

  useEffect(() => {
    localStorage.setItem('lafarge_referred_by_code', referredByCode);
  }, [referredByCode]);

  useEffect(() => {
    localStorage.setItem('lafarge_referrals', JSON.stringify(referrals));
  }, [referrals]);

  // Dynamic automatic synchronization with full-stack server
  useEffect(() => {
    let isMounted = true;
    const poll = async () => {
      try {
        const res = await fetch('/api/sync');
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data && (data.version > localVersion.current || !isInitializedFromServer.current)) {
            // New changes exist on server database. Lock synchronizer feedback and update state.
            isSyncingFromServer.current = true;
            localVersion.current = data.version;

            if (data.registeredUsers) setRegisteredUsers(data.registeredUsers);
            if (data.transactions) setTransactions(data.transactions);
            if (data.activeInvestments) setActiveInvestments(data.activeInvestments);
            if (data.depositAccounts) setDepositAccounts(data.depositAccounts);
            if (data.csTickets) setCsTickets(data.csTickets);
            if (data.userChatThreads) setUserChatThreads(data.userChatThreads);
            if (data.referrals) setReferrals(data.referrals);
            if (data.adminApprovalSettings) {
              setAdminApprovalSettings({
                requireDepositApproval: data.adminApprovalSettings.requireDepositApproval ?? true,
                requireInvestmentApproval: data.adminApprovalSettings.requireInvestmentApproval ?? true,
                requireWithdrawalApproval: data.adminApprovalSettings.requireWithdrawalApproval ?? true,
                customReferralLink: data.adminApprovalSettings.customReferralLink ?? '',
                isReferralLinkStatic: data.adminApprovalSettings.isReferralLinkStatic ?? false,
                csNumber: data.adminApprovalSettings.csNumber ?? '08158432605',
                officialWhatsAppGroup: data.adminApprovalSettings.officialWhatsAppGroup ?? 'https://chat.whatsapp.com/KHZgCi1h24154DqIIHz3VE',
                minReferralWithdrawal: data.adminApprovalSettings.minReferralWithdrawal ?? 5000,
                allowAnytimeWithdrawal: data.adminApprovalSettings.allowAnytimeWithdrawal ?? false
              });
            }

            isInitializedFromServer.current = true;

            setTimeout(() => {
              isSyncingFromServer.current = false;
            }, 800);
          }
        }
      } catch (e) {
        // Gracefully warning-log transient network/restart errors, only error on true logical bugs
        const errorMsg = e instanceof Error ? e.message : String(e);
        if (errorMsg.includes('Failed to fetch') || errorMsg.includes('fetch') || errorMsg.includes('network') || errorMsg.includes('Load failed')) {
          console.warn("Sync server is temporarily offline or restarting, retrying soon...");
        } else {
          console.error("Online poll error:", e);
        }
      }
    };

    poll();
    const interval = setInterval(poll, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Comprehensive Daily Login Streak Engine (grants incremental bonuses for consecutive logging-in)
  useEffect(() => {
    if (!isLoggedIn || !wallet || !wallet.email || isAdmin) return;

    // Standardize current date according to sandbox simulatedTime
    const currentDateStr = new Date(simulatedTime).toISOString().split('T')[0];
    const prevDateStr = wallet.lastLoginDate || '';

    // If already checked/approved today, bypass
    if (prevDateStr === currentDateStr) return;

    let newStreak = 1;
    let gotBonus = false;

    if (prevDateStr) {
      const prevDate = new Date(prevDateStr + 'T00:00:00');
      const currDate = new Date(currentDateStr + 'T00:00:00');
      const diffMs = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak = (wallet.loginStreak || 0) + 1;
        gotBonus = true;
      } else if (diffDays > 1) {
        // broken consecutive streak
        newStreak = 1;
        gotBonus = true;
      } else {
        // Same day or time wound back, do not re-claim
        return;
      }
    } else {
      // First ever login streak log
      newStreak = 1;
      gotBonus = true;
    }

    if (gotBonus) {
      // Base Day 1 is ₦100, Day 2 is ₦200, Day 3 is ₦300 up to max ₦1000 limit
      const bonusAmount = Math.min(newStreak * 100, 1000);

      setRegisteredUsers((prevUsers) => {
        const nextUsers = prevUsers.map((u) => {
          if (u.email.toLowerCase() === wallet.email.toLowerCase()) {
            return {
              ...u,
              loginStreak: newStreak,
              lastLoginDate: currentDateStr,
              walletBalance: u.walletBalance + bonusAmount,
              earnedBalance: u.earnedBalance + bonusAmount,
            };
          }
          return u;
        });

        // Sync local wallet state gracefully
        const matched = nextUsers.find((u) => u.email.toLowerCase() === wallet.email.toLowerCase());
        if (matched) {
          setWallet(matched);
        }
        return nextUsers;
      });

      // Construct a Completed Dividend Transaction receipt
      setTransactions((prevTx) => {
        const txId = `tx-streak-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const streakTx: Transaction = {
          id: txId,
          type: 'payout',
          amount: bonusAmount,
          status: 'completed',
          date: simulatedTime,
          reference: `STREAK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          description: `Daily Login Streak Day ${newStreak} Reward (+₦${bonusAmount.toLocaleString()}) credited to portfolio`,
          userEmail: wallet.email,
        };
        return [streakTx, ...prevTx];
      });
    }

  }, [isLoggedIn, wallet?.email, simulatedTime, isAdmin]);

  useEffect(() => {
    // If the state has not been initialized from the server, do NOT push
    if (!isInitializedFromServer.current) {
      return;
    }

    // If the state changes were downloaded from polling/syncing, do NOT trigger feedback loop push
    if (isSyncingFromServer.current) {
      return;
    }

    const pushChanges = async () => {
      try {
        const payload = {
          registeredUsers,
          transactions,
          activeInvestments,
          depositAccounts,
          csTickets,
          userChatThreads,
          referrals,
          adminApprovalSettings,
          clientVersion: localVersion.current
        };

        const res = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.version) {
            localVersion.current = data.version;
          }
        }
      } catch (error) {
        // Gracefully warning-log transient connection errors, only error on true logical bugs
        const errorMsg = error instanceof Error ? error.message : String(error);
        if (errorMsg.includes('Failed to fetch') || errorMsg.includes('fetch') || errorMsg.includes('network') || errorMsg.includes('Load failed')) {
          console.warn("Sync push is temporarily deferred due to offline/restart state. Will retry...");
        } else {
          console.error("Sync push error:", error);
        }
      }
    };

    pushChanges();
  }, [
    registeredUsers,
    transactions,
    activeInvestments,
    depositAccounts,
    csTickets,
    userChatThreads,
    referrals,
    adminApprovalSettings
  ]);

  const areWalletsDifferent = (w1: any, w2: any): boolean => {
    if (!w1 || !w2) return w1 !== w2;
    const allKeys = Array.from(new Set([...Object.keys(w1), ...Object.keys(w2)]));
    for (const key of allKeys) {
      const v1 = w1[key];
      const v2 = w2[key];
      const isFalsy1 = v1 === undefined || v1 === null || v1 === false;
      const isFalsy2 = v2 === undefined || v2 === null || v2 === false;
      if (isFalsy1 && isFalsy2) {
        continue;
      }
      if (v1 !== v2) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (!wallet || !wallet.email || wallet.email.toLowerCase() === 'admin1234@gmail.com') return;
    setRegisteredUsers((prevUsers) => {
      const match = prevUsers.find((u) => u.email.toLowerCase() === wallet.email.toLowerCase());
      if (match) {
        if (areWalletsDifferent(wallet, match)) {
          return prevUsers.map((u) =>
            u.email.toLowerCase() === wallet.email.toLowerCase() ? { ...wallet } : u
          );
        }
      }
      return prevUsers;
    });
  }, [wallet]);

  useEffect(() => {
    if (!wallet || !wallet.email || wallet.email.toLowerCase() === 'admin1234@gmail.com') return;
    const match = registeredUsers.find((u) => u.email.toLowerCase() === wallet.email.toLowerCase());
    if (match) {
      if (areWalletsDifferent(wallet, match)) {
        setWallet(match);
      }
    } else if (isInitializedFromServer.current) {
      handleLogout();
    }
  }, [registeredUsers]);

  // Filter user-specific lists so each registered account has their own isolated ledger
  const userTransactions = transactions.filter(
    (tx) => tx.userEmail?.toLowerCase() === (wallet?.email || '').toLowerCase()
  );
  const userActiveInvestments = activeInvestments.filter(
    (inv) => inv.userEmail?.toLowerCase() === (wallet?.email || '').toLowerCase()
  );
  const userActiveCount = userActiveInvestments.filter(i => i.status === 'active').length;

  // Real-time Virtual Simulate Date Clock ticking every second
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setSimulatedTime((prev) => prev + 1000);
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Unified Automatic dividend accrual processing under simulation/real-time
  useEffect(() => {
    if (!isInitializedFromServer.current || activeInvestments.length === 0) return;

    const stepMs = 24 * 60 * 60 * 1000;
    let nextInvestments = [...activeInvestments];
    let userUpdates: Record<string, { walletAdd: number; earnedAdd: number; investedSub: number }> = {};
    let nextTransactions = [...transactions];
    let hasChanges = false;

    nextInvestments = nextInvestments.map((inv) => {
      if (inv.status !== 'active') return inv;

      const startDate = inv.startDate;
      const termDays = inv.termDays || 30;
      const rate = inv.rate || 0.26666666666666666;
      const amountInvested = inv.amountInvested;

      const elapsedMs = Math.max(0, simulatedTime - inv.lastAccrualTime);
      const steps = Math.floor(elapsedMs / stepMs);

      if (steps < 1) return inv;

      const daysAlreadyCredited = Math.round((inv.lastAccrualTime - startDate) / stepMs);
      const maxDaysToCredit = Math.max(0, termDays - daysAlreadyCredited);
      const actualStepsToAccrue = Math.min(steps, maxDaysToCredit);

      if (actualStepsToAccrue < 1) return inv;

      hasChanges = true;
      const dailyYield = Math.round(amountInvested * rate);
      const totalYieldAmount = dailyYield * actualStepsToAccrue;

      let nextLastAccrualTime = inv.lastAccrualTime + actualStepsToAccrue * stepMs;
      let nextStatus: ActiveInvestment['status'] = inv.status;
      let totalAccrued = (inv.totalAccrued || 0) + totalYieldAmount;

      const emailKey = (inv.userEmail || '').toLowerCase();
      if (!userUpdates[emailKey]) {
        userUpdates[emailKey] = { walletAdd: 0, earnedAdd: 0, investedSub: 0 };
      }
      userUpdates[emailKey].walletAdd += totalYieldAmount;
      userUpdates[emailKey].earnedAdd += totalYieldAmount;

      nextTransactions.unshift({
        id: `tx-yield-${Math.random().toString(36).substring(2, 9)}`,
        type: 'payout',
        amount: totalYieldAmount,
        status: 'completed',
        date: nextLastAccrualTime,
        reference: `DIV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        description: `Daily dividend payout (+₦${totalYieldAmount.toLocaleString()}) dropped from ${inv.productName}`,
        userEmail: inv.userEmail,
      });

      const totalDaysCredited = daysAlreadyCredited + actualStepsToAccrue;
      if (totalDaysCredited >= termDays) {
        if (inv.isCompounding !== false) {
          // Auto restart cycle
          nextTransactions.unshift({
            id: `tx-roll-${Math.random().toString(36).substring(2, 9)}`,
            type: 'invest',
            amount: amountInvested,
            status: 'completed',
            date: nextLastAccrualTime,
            reference: `ROLL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            description: `Auto-Rollover Reinvestment: Cleanly restarted new ${termDays}-day cycle for ${inv.productName}`,
            userEmail: inv.userEmail,
          });

          return {
            ...inv,
            startDate: nextLastAccrualTime,
            endDate: nextLastAccrualTime + termDays * stepMs,
            lastAccrualTime: nextLastAccrualTime,
            totalAccrued: 0,
            status: 'active',
          };
        } else {
          // Return Capital Principal
          nextStatus = 'withdrawn';
          userUpdates[emailKey].walletAdd += amountInvested;
          userUpdates[emailKey].investedSub += amountInvested;

          nextTransactions.unshift({
            id: `tx-refund-${Math.random().toString(36).substring(2, 9)}`,
            type: 'refund',
            amount: amountInvested,
            status: 'completed',
            date: nextLastAccrualTime,
            reference: `REF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            description: `Capital principal unlocked (+₦${amountInvested.toLocaleString()}) from fully matured ${inv.productName}`,
            userEmail: inv.userEmail,
          });
        }
      }

      return {
        ...inv,
        lastAccrualTime: nextLastAccrualTime,
        totalAccrued,
        status: nextStatus,
      };
    });

    if (hasChanges) {
      setRegisteredUsers((prevUsers) => {
        const nextUsers = prevUsers.map((u) => {
          const emailKey = u.email.toLowerCase();
          const updatesForUser = userUpdates[emailKey];
          if (updatesForUser) {
            return {
              ...u,
              walletBalance: u.walletBalance + updatesForUser.walletAdd,
              earnedBalance: u.earnedBalance + updatesForUser.earnedAdd,
              investedBalance: Math.max(0, u.investedBalance - updatesForUser.investedSub),
            };
          }
          return u;
        });

        // Sync local wallet
        if (wallet) {
          const matched = nextUsers.find((u) => u.email.toLowerCase() === wallet.email.toLowerCase());
          if (matched) {
            setWallet(matched);
          }
        }
        return nextUsers;
      });

      setActiveInvestments(nextInvestments);
      setTransactions(nextTransactions);
    }
  }, [simulatedTime]);

  // Global Time Machine Engine updating state dynamically!
  const handleAdvanceTime = (msToAdd: number) => {
    setSimulatedTime((prevTime) => prevTime + msToAdd);
  };

  const handleAddBonusCode = (code: string, rewardAmount: number, maxClaims: number) => {
    const newCode: BonusCode = {
      id: `bonus-${Math.random().toString(36).substring(2, 9)}`,
      code: code.trim().toUpperCase(),
      rewardAmount,
      maxClaims,
      claimedBy: [],
      isActive: true,
      createdAt: Date.now()
    };
    setBonusCodes((prev) => [newCode, ...prev]);
  };

  const handleDeleteBonusCode = (id: string) => {
    setBonusCodes((prev) => prev.filter(b => b.id !== id));
  };

  const handleClaimBonusCode = (codeText: string): { success: boolean; message: string } => {
    const cleanCodeText = codeText.trim().toUpperCase();
    if (!cleanCodeText) {
      return { success: false, message: 'Please enter a valid bonus code.' };
    }
    
    // Find matching code
    const foundIdx = bonusCodes.findIndex(b => b.code.toUpperCase() === cleanCodeText);
    if (foundIdx === -1) {
      return { success: false, message: 'Invalid or unrecognized bonus promotional code.' };
    }
    
    const targetCode = bonusCodes[foundIdx];
    if (!targetCode.isActive) {
      return { success: false, message: 'This bonus promotional code has been deactivated.' };
    }
    
    if (targetCode.claimedBy.includes(wallet.email.toLowerCase())) {
      return { success: false, message: 'You have already claimed this bonus reward code!' };
    }
    
    if (targetCode.claimedBy.length >= targetCode.maxClaims) {
      return { success: false, message: 'This bonus code has reached its maximum allocation limits.' };
    }
    
    // Update the claims list of the bonus code
    const updatedCodes = [...bonusCodes];
    updatedCodes[foundIdx] = {
      ...targetCode,
      claimedBy: [...targetCode.claimedBy, wallet.email.toLowerCase()]
    };
    setBonusCodes(updatedCodes);
    
    // Credit user wallet and registered users list
    setWallet((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + targetCode.rewardAmount,
      earnedBalance: prev.earnedBalance + targetCode.rewardAmount
    }));
    
    setRegisteredUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.email.toLowerCase() === wallet.email.toLowerCase()
          ? {
              ...u,
              walletBalance: u.walletBalance + targetCode.rewardAmount,
              earnedBalance: u.earnedBalance + targetCode.rewardAmount
            }
          : u
      )
    );
    
    // Add transaction history
    setTransactions((prev) => [
      {
        id: `tx-bonus-${Math.random().toString(36).substring(2, 9)}`,
        type: 'deposit',
        amount: targetCode.rewardAmount,
        status: 'completed',
        date: simulatedTime,
        reference: generateRef(),
        description: `Promo Bonus Claimed: ${targetCode.code}`,
        userEmail: wallet.email
      },
      ...prev
    ]);
    
    return {
      success: true,
      message: `Successfully claimed promo reward! ₦${formatNGN(targetCode.rewardAmount)} has been credited to your balance.`
    };
  };

  // Launch XENA share investment
  const handleDeployCapital = (productId: string, amountToDeploy: number, isCompounding: boolean) => {
    const productDef = productsList.find(p => p.id === productId);
    if (!productDef) return;

    const requireApproval = false; // Anyone with enough balance to purchase a product can purchase without admin approval.
    const newInst: ActiveInvestment = {
      id: `inv-${Math.random().toString(36).substring(2, 9)}`,
      productId,
      productName: productDef.name,
      amountInvested: amountToDeploy,
      startDate: simulatedTime,
      endDate: simulatedTime + (productDef.termDays * 24 * 60 * 60 * 1000), // exactly product.termDays
      lastAccrualTime: simulatedTime,
      status: requireApproval ? 'pending' : 'active',
      totalAccrued: 0,
      expectedReturn: amountToDeploy * productDef.rate * productDef.termDays,
      isCompounding,
      userEmail: wallet.email,
      termDays: productDef.termDays,
      rate: productDef.rate
    };

    // Update state lists
    setActiveInvestments((prev) => [...prev, newInst]);
    setWallet((prev) => ({
      ...prev,
      walletBalance: requireApproval ? prev.walletBalance : prev.walletBalance - amountToDeploy,
      investedBalance: requireApproval ? prev.investedBalance : prev.investedBalance + amountToDeploy
    }));

    setRegisteredUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.email.toLowerCase() === wallet.email.toLowerCase()
          ? {
              ...u,
              walletBalance: requireApproval ? u.walletBalance : u.walletBalance - amountToDeploy,
              investedBalance: requireApproval ? u.investedBalance : u.investedBalance + amountToDeploy
            }
          : u
      )
    );

    setTransactions((prev) => [
      {
        id: `tx-${Math.random().toString(36).substring(2, 9)}`,
        type: 'invest',
        amount: amountToDeploy,
        status: requireApproval ? 'pending' : 'completed',
        date: simulatedTime,
        reference: generateRef(),
        description: `Acquired ${productDef.name} Share Options${requireApproval ? ' (Awaiting Corporate Underwrite)' : ''}`,
        userEmail: wallet.email
      },
      ...prev
    ]);
  };

  // Claim dividends or matured stock positions dynamically!
  const handleClaimMatured = (investmentId: string) => {
    const target = activeInvestments.find(i => i.id === investmentId);
    if (!target) return;

    if (target.status === 'matured') {
      const currentRate = target.rate || 0.10;
      const termDays = target.termDays || Math.round(target.expectedReturn / (target.amountInvested * currentRate)) || 4;
      const profit = target.expectedReturn || (target.amountInvested * currentRate * termDays);
      const grossReturn = target.amountInvested + profit;

      setActiveInvestments((prev) => 
        prev.map(i => i.id === investmentId ? { ...i, status: 'withdrawn', totalAccrued: 0 } : i)
      );

      setWallet((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + grossReturn,
        investedBalance: prev.investedBalance - target.amountInvested,
        earnedBalance: prev.earnedBalance + profit
      }));

      setRegisteredUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.email.toLowerCase() === wallet.email.toLowerCase()
            ? {
                ...u,
                walletBalance: u.walletBalance + grossReturn,
                investedBalance: u.investedBalance - target.amountInvested,
                earnedBalance: u.earnedBalance + profit
              }
            : u
        )
      );

      setTransactions((prev) => [
        {
          id: `tx-claims-${Math.random().toString(36).substring(2, 10)}`,
          type: 'payout',
          amount: profit,
          status: 'completed',
          date: simulatedTime,
          reference: generateRef(),
          description: `Withdrew matured dividends: ${target.productName}`,
          userEmail: wallet.email
        },
        {
          id: `tx-refund-${Math.random().toString(36).substring(2, 10)}`,
          type: 'refund',
          amount: target.amountInvested,
          status: 'completed',
          date: simulatedTime,
          reference: generateRef(),
          description: `XENA share capital unlocked: ${target.productName}`,
          userEmail: wallet.email
        },
        ...prev
      ]);
    } else if (target.status === 'active' && target.totalAccrued > 0) {
      // Partial claim of daily accrued dividends before maturity!
      const dividendToClaim = target.totalAccrued;

      setActiveInvestments((prev) => 
        prev.map(i => i.id === investmentId ? { ...i, totalAccrued: 0, startDate: simulatedTime } : i)
      );

      setWallet((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + dividendToClaim,
        earnedBalance: prev.earnedBalance + dividendToClaim
      }));

      setRegisteredUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.email.toLowerCase() === wallet.email.toLowerCase()
            ? {
                ...u,
                walletBalance: u.walletBalance + dividendToClaim,
                earnedBalance: u.earnedBalance + dividendToClaim
              }
            : u
        )
      );

      setTransactions((prev) => [
        {
          id: `tx-claims-${Math.random().toString(36).substring(2, 10)}`,
          type: 'payout',
          amount: dividendToClaim,
          status: 'completed',
          date: simulatedTime,
          reference: generateRef(),
          description: `Withdrew accumulated daily dividend yields: ${target.productName}`,
          userEmail: wallet.email
        },
        ...prev
      ]);
    }
  };

  // Toggle compounding on active nodes
  const handleToggleCompounding = (id: string, toggleVal: boolean) => {
    setActiveInvestments(prev => 
      prev.map(i => i.id === id ? { ...i, isCompounding: toggleVal } : i)
    );
  };

  const handleToggleGlobalAutoInvest = (enabled: boolean) => {
    setWallet(prev => {
      const next = { ...prev, autoInvest: enabled };
      
      setRegisteredUsers(prevUsers =>
        prevUsers.map(u => u.email.toLowerCase() === prev.email.toLowerCase() ? { ...u, autoInvest: enabled } : u)
      );
      
      return next;
    });

    // Sync all user's active/pending investments compounding status to match global preferences!
    setActiveInvestments(prev => 
      prev.map(inv => {
        if (inv.userEmail?.toLowerCase() === wallet.email.toLowerCase()) {
          return { ...inv, isCompounding: enabled };
        }
        return inv;
      })
    );
  };

  // Add mock deposits/withdraws
  const handleConfirmDepositWithdraw = (amount: number, txType: 'deposit' | 'withdraw', logDetails: string, source: 'wallet' | 'referral' = 'wallet') => {
    if (txType === 'deposit') {
      const requireApproval = adminApprovalSettings.requireDepositApproval;
      
      if (!requireApproval) {
        const activeReferrer = referredByCode;
        if (activeReferrer) {
          setReferredByCode(''); // reset after first deposit
        }

        setWallet(prev => ({
          ...prev,
          walletBalance: prev.walletBalance + amount
        }));

        setRegisteredUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.email.toLowerCase() === wallet.email.toLowerCase()
              ? {
                  ...u,
                  walletBalance: u.walletBalance + amount
                }
              : u
          )
        );
      }

      setTransactions(prev => {
        const baseTxList = [
          {
            id: `tx-dep-${Math.random().toString(36).substring(2, 9)}`,
            type: 'deposit' as const,
            amount,
            status: requireApproval ? ('pending' as const) : ('completed' as const),
            date: simulatedTime,
            reference: generateRef(),
            description: logDetails + (requireApproval ? ' (Awaiting Paystack Audit Review)' : ' (Processed - Autocredited Instantly)'),
            userEmail: wallet.email
          },
          ...prev
        ];

        // Only auto-trigger referral payout if not requiring manual deposit audits!
        if (!requireApproval && referredByCode) {
          baseTxList.unshift({
            id: `tx-ref-trig-${Math.random().toString(36).substring(2, 9)}`,
            type: 'payout' as const,
            amount: 500,
            status: 'completed' as const,
            date: simulatedTime,
            reference: generateRef(),
            description: `Referral Reward: Referrer code ${referredByCode} credited with ₦500.00 booster bonus!`,
            userEmail: wallet.email
          });
        }

        return baseTxList;
      });
    } else {
      const requireApproval = adminApprovalSettings.requireWithdrawalApproval;
      const isReferral = source === 'referral';
      
      setWallet(prev => ({
        ...prev,
        walletBalance: isReferral ? prev.walletBalance : prev.walletBalance - amount,
        referralEarnings: isReferral ? Math.max(0, prev.referralEarnings - amount) : prev.referralEarnings,
        withdrawnBalance: requireApproval ? prev.withdrawnBalance : prev.withdrawnBalance + amount
      }));

      setRegisteredUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.email.toLowerCase() === wallet.email.toLowerCase()
            ? {
                ...u,
                walletBalance: isReferral ? u.walletBalance : u.walletBalance - amount,
                referralEarnings: isReferral ? Math.max(0, (u.referralEarnings || 0) - amount) : (u.referralEarnings || 0),
                withdrawnBalance: requireApproval ? u.withdrawnBalance : u.withdrawnBalance + amount
              }
            : u
        )
      );

      setTransactions(prev => [
        {
          id: `tx-with-${Math.random().toString(36).substring(2, 9)}`,
          type: 'withdraw',
          amount,
          status: requireApproval ? ('pending' as const) : ('completed' as const),
          date: simulatedTime,
          reference: generateRef(),
          description: logDetails + (requireApproval ? ' (Pending Corporate Executive Approval)' : ' (Processed - Instant Bank Outflow)'),
          userEmail: wallet.email
        },
        ...prev
      ]);
    }
  };

  // Supervisor Approval Handlers
  const handleApproveReferral = (refId: string) => {
    const targetRef = referrals.find(r => r.id === refId);
    if (!targetRef || targetRef.status !== 'pending') return;

    // 1. Update Referrals list status
    setReferrals((prevRefs) =>
      prevRefs.map((r) => (r.id === refId ? { ...r, status: 'approved' as const } : r))
    );

    // 2. Credit the Referrer across database & active logged-in wallets
    setRegisteredUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.email.toLowerCase() === targetRef.referrerEmail.toLowerCase()) {
          const nextUser = {
            ...u,
            walletBalance: u.walletBalance + targetRef.amount,
            earnedBalance: u.earnedBalance + targetRef.amount,
            referralEarnings: u.referralEarnings + targetRef.amount,
            referralsCount: u.referralsCount + 1
          };
          
          // If this is also the active wallet of the user, we update that too
          if (wallet && wallet.email.toLowerCase() === u.email.toLowerCase()) {
            setWallet(nextUser);
          }
          
          return nextUser;
        }
        return u;
      })
    );

    // 3. Append a transaction record for the referrer
    setTransactions((prevTxs) => [
      {
        id: `tx-ref-auth-${Math.random().toString(36).substring(2, 9)}`,
        type: 'payout' as const,
        amount: targetRef.amount,
        status: 'completed' as const,
        date: simulatedTime,
        reference: generateRef(),
        description: `Referral Approved: Successfully credited ₦${targetRef.amount.toFixed(2)} bonus for referring ${targetRef.referredName}!`,
        userEmail: targetRef.referrerEmail
      },
      ...prevTxs
    ]);
  };

  const handleDeclineReferral = (refId: string) => {
    setReferrals((prevRefs) =>
      prevRefs.map((r) => {
        if (r.id === refId && r.status === 'pending') {
          return { ...r, status: 'rejected' as const };
        }
        return r;
      })
    );
  };

  const handleApproveDeposit = (txId: string) => {
    const targetTx = transactions.find((tx) => tx.id === txId);
    if (!targetTx || targetTx.status !== 'pending') return;

    const emailToUpdate = (targetTx.userEmail || '').toLowerCase();

    // 1. Update transactions list
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === txId
          ? {
              ...tx,
              status: 'completed' as const,
              description: tx.description.replace(' (Awaiting Paystack Audit Review)', ''),
            }
          : tx
      )
    );

    // 2. Update registered users database & the active logged-in wallet state if applicable
    setRegisteredUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.email.toLowerCase() === emailToUpdate) {
          const nextUser = {
            ...u,
            walletBalance: u.walletBalance + targetTx.amount,
          };
          if (wallet && wallet.email.toLowerCase() === u.email.toLowerCase()) {
            setWallet(nextUser);
          }
          return nextUser;
        }
        return u;
      })
    );
  };

  const handleDeclineDeposit = (txId: string) => {
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === txId && tx.status === 'pending') {
          return {
            ...tx,
            status: 'failed' as const,
            description: tx.description.replace(' (Awaiting Paystack Audit Review)', '') + ' (Declined by Corporate Supervisor)',
          };
        }
        return tx;
      })
    );
  };

  const handleApproveWithdrawal = (txId: string) => {
    const targetTx = transactions.find((tx) => tx.id === txId);
    if (!targetTx || targetTx.status !== 'pending') return;

    const emailToUpdate = (targetTx.userEmail || '').toLowerCase();

    // 1. Update transactions list
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === txId
          ? {
              ...tx,
              status: 'completed' as const,
              description: tx.description.replace(' (Pending Corporate Executive Approval)', ''),
            }
          : tx
      )
    );

    // 2. Update registered users database & the active logged-in wallet state if applicable
    setRegisteredUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.email.toLowerCase() === emailToUpdate) {
          const nextUser = {
            ...u,
            withdrawnBalance: u.withdrawnBalance + targetTx.amount,
          };
          if (wallet && wallet.email.toLowerCase() === u.email.toLowerCase()) {
            setWallet(nextUser);
          }
          return nextUser;
        }
        return u;
      })
    );
  };

  const handleDeclineWithdrawal = (txId: string) => {
    const targetTx = transactions.find((tx) => tx.id === txId);
    if (!targetTx || targetTx.status !== 'pending') return;

    const emailToUpdate = (targetTx.userEmail || '').toLowerCase();

    // 1. Update transactions list
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === txId
          ? {
              ...tx,
              status: 'failed' as const,
              description: tx.description.replace(' (Pending Corporate Executive Approval)', '') + ' (Rejected by Financial Auditor)',
            }
          : tx
      )
    );

    // 2. Refund user's database entry and the active logged-in wallet state
    setRegisteredUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.email.toLowerCase() === emailToUpdate) {
          const nextUser = {
            ...u,
            walletBalance: u.walletBalance + targetTx.amount,
          };
          if (wallet && wallet.email.toLowerCase() === u.email.toLowerCase()) {
            setWallet(nextUser);
          }
          return nextUser;
        }
        return u;
      })
    );
  };

  const handleApproveInvestment = (invId: string) => {
    setActiveInvestments((prev) =>
      prev.map((inv) => {
        if (inv.id === invId && inv.status === 'pending') {
          const emailToUpdate = (inv.userEmail || '').toLowerCase() || 'jeremiahobazee11@gmail.com';
          
          // Update local session wallet if it matches the target
          if (emailToUpdate === wallet.email.toLowerCase()) {
            setWallet((p) => ({
              ...p,
              walletBalance: p.walletBalance - inv.amountInvested,
              investedBalance: p.investedBalance + inv.amountInvested
            }));
          }

          setRegisteredUsers((prevUsers) =>
            prevUsers.map((u) => {
              if (u.email.toLowerCase() === emailToUpdate) {
                return {
                  ...u,
                  walletBalance: u.walletBalance - inv.amountInvested,
                  investedBalance: u.investedBalance + inv.amountInvested,
                };
              }
              return u;
            })
          );

          // Complete corresponding deposit/buy transaction
          setTransactions((prevTxs) =>
            prevTxs.map((tx) => {
              if (tx.type === 'invest' && tx.status === 'pending' && Math.abs(tx.amount - inv.amountInvested) < 0.01) {
                return {
                  ...tx,
                  status: 'completed' as const,
                  description: tx.description.replace(' (Awaiting Corporate Underwrite)', ''),
                };
              }
              return tx;
            })
          );

          return {
            ...inv,
            status: 'active' as const,
            startDate: simulatedTime,
            endDate: simulatedTime + (inv.termDays || 10) * 24 * 60 * 60 * 1000,
            lastAccrualTime: simulatedTime,
          };
        }
        return inv;
      })
    );
  };

  const handleDeclineInvestment = (invId: string) => {
    setActiveInvestments((prev) =>
      prev.map((inv) => {
        if (inv.id === invId && inv.status === 'pending') {
          const emailToUpdate = (inv.userEmail || '').toLowerCase() || 'jeremiahobazee11@gmail.com';
          setRegisteredUsers((prevUsers) =>
            prevUsers.map((u) => {
              if (u.email.toLowerCase() === emailToUpdate) {
                return {
                  ...u,
                };
              }
              return u;
            })
          );

          // Set corresponding transaction to failed
          setTransactions((prevTxs) =>
            prevTxs.map((tx) => {
              if (tx.type === 'invest' && tx.status === 'pending' && Math.abs(tx.amount - inv.amountInvested) < 0.01) {
                return {
                  ...tx,
                  status: 'failed' as const,
                  description: tx.description.replace(' (Awaiting Corporate Underwrite)', '') + ' (Placement Declined by Executive Board)',
                };
              }
              return tx;
            })
          );

          return {
            ...inv,
            status: 'cancelled' as const,
          };
        }
        return inv;
      })
    );
  };

  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedPromoMsg, setCopiedPromoMsg] = useState(false);
  
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
    const baseDomain = "https://xenainvestment.com";
    return `${baseDomain}?ref=${wallet.referralCode}`;
  };

  const handleCopyRefLink = () => {
    navigator.clipboard.writeText(getReferralLink());
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const getPromoMessage = (refLink: string) => {
    return `💎 *XENA INVESTMENT SHARES* 💎\nSecure your daily passive dividends with world-leading company shares including Apple, Samsung, Nvidia, Tesla, Microsoft, and Alphabet! Backed by premium global stocks and escrow-safe payouts. 📈\n\n💰 *Onboarding Reward:* Get *₦500.00* instantly credited to your register upon signup!\n📊 *Daily Passive Yields:* Earn up to *26.67% daily dividends* on company shares (Apple, Samsung, Nvidia, Tesla, Microsoft, Alphabet).\n👥 *Passive Earnings:* Build a network and unlock up to 5 tiers of daily passive commissions under dynamic growth!\n\nJoin our active stakeholder network instantly using my unique link:\n👇👇👇\n${refLink}`;
  };

  const handleCopyPromoMessage = () => {
    const msg = getPromoMessage(getReferralLink());
    navigator.clipboard.writeText(msg);
    setCopiedPromoMsg(true);
    setTimeout(() => setCopiedPromoMsg(false), 2000);
  };

  const getWhatsAppShareUrl = () => {
    const msg = getPromoMessage(getReferralLink());
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  };



  const handleRegisterSuccess = (newUser: {
    fullName: string;
    email: string;
    accountNumber: string;
    referralUsed: string;
    password?: string;
  }) => {
    const cleanNamePart = newUser.fullName.split(' ')[0]?.toUpperCase().replace(/[^A-Z]/g, '') || 'MEMBER';
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const generatedReferralCode = `XEN-${cleanNamePart}-${randCode}`;
    
    const newWallet: UserWallet = {
      walletBalance: 0, // Starts immediately with 0 Naira
      investedBalance: 0,
      withdrawnBalance: 0,
      earnedBalance: 0,
      accountNumber: newUser.accountNumber,
      fullName: newUser.fullName,
      email: newUser.email,
      referralCode: generatedReferralCode,
      referralsCount: 0,
      referralEarnings: 0,
      hasClaimedBonus: false,
      password: newUser.password || '1234', // Uses the user's custom chosen password
      isFlagged: false,
      requireReferralToWithdraw: false,
      referredBy: newUser.referralUsed || undefined,
      autoInvest: true
    };

    setWallet(newWallet);
    const latestUsers = [...registeredUsers, newWallet];
    setRegisteredUsers(latestUsers);
    setIsLoggedIn(true);
    setIsAdmin(false);

    // Write a 30-day persistent session to active log
    localStorage.setItem('lafarge_login_session', JSON.stringify({
      email: newWallet.email.toLowerCase(),
      isAdmin: false,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
    }));

    // Clear portfolios for new registered user
    setActiveInvestments([]);

    // Keep transactions completely empty for new registration as requested!
    // Simply do not call setTransactions or set it to empty for this user.

    if (newUser.referralUsed) {
      setReferredByCode(newUser.referralUsed);
      localStorage.setItem('lafarge_referred_by_code', newUser.referralUsed);
      checkAndRecordReferral(newWallet, latestUsers);
    }
    setShowPromoModal(true);
  };

  const handleClaimBonus = () => {
    setWallet((prev) => {
      const next = {
        ...prev,
        walletBalance: prev.walletBalance + 500,
        earnedBalance: prev.earnedBalance + 500,
        hasClaimedBonus: true
      };

      // Sync into registeredUsers list
      setRegisteredUsers((prevUsers) =>
        prevUsers.map((u) => (u.email.toLowerCase() === prev.email.toLowerCase() ? { ...u, walletBalance: next.walletBalance, earnedBalance: next.earnedBalance, hasClaimedBonus: true } : u))
      );

      return next;
    });

    setTransactions((prevTx) => [
      {
        id: `tx-bonus-${Math.random().toString(36).substring(2, 9)}`,
        type: 'deposit',
        amount: 500,
        status: 'completed',
        date: simulatedTime,
        reference: generateRef(),
        description: 'XENA Shareholder Registration welcome booster bonus settled',
        userEmail: wallet.email
      },
      ...prevTx
    ]);
  };

  const handleSendMessageToAgent = (inputText: string) => {
    if (!inputText.trim()) return;

    const userEmailKey = wallet.email.toLowerCase();

    // 1. Appending user message to their private chat stream
    setUserChatThreads(prev => {
      const thread = prev[userEmailKey] || [];
      return {
        ...prev,
        [userEmailKey]: [
          ...thread,
          { sender: 'user' as const, text: inputText, time: 'Just now' }
        ]
      };
    });

    // 2. Clear input
    setCurrentCsInput('');
    setIsAgentTyping(true);

    // 3. Process reply inside timer
    setTimeout(() => {
      let responseText = "Thank you for contacting our support desk. Your query has been logged with Priority Support. Our team is checking the active account details for " + wallet.fullName + ". Let us know if this is regarding a specific transaction reference.";
      
      const textLower = inputText.toLowerCase();
      if (textLower.includes('withdr') || textLower.includes('time') || textLower.includes('10am') || textLower.includes('hour') || textLower.includes('limit')) {
        responseText = "I see you are inquiring about withdrawals! Please remember that all capital and accrued dividend withdrawals are approved between 10:00 AM and 12:00 PM daily. If the simulated time clock shows a different window, you can use the 'Virtual Time Machine' on the dashboard workspace to leap forward instantly and process your payout.";
      } else if (textLower.includes('deposit') || textLower.includes('fund') || textLower.includes('paystack') || textLower.includes('pay')) {
        responseText = "Our payment gateway supports secure instant bank deposits. Transfers typically verify within 1 to 5 minutes. If you completed a deposit and are waiting for it to show, please click 'Simulate Referee Deposit' on the dashboard referral card, or contact us with your reference number.";
      } else if (textLower.includes('refer') || textLower.includes('ref') || textLower.includes('bonus') || textLower.includes('friend') || textLower.includes('comm')) {
        responseText = "For every teammate you refer, you get ₦500.00 instantly upon their first company shares placement. PLUS, you unlock up to 5 levels of high-yield daily passive commissions synchronized with their yield structure (Level 1: 0.1% at 5 refs, Level 2: 0.2% at 10 refs, Level 3: 0.3% at 15 refs, Level 4: 0.4% at 20 refs, Level 5: 0.5% at 25 refs)! Test this using the 'Simulate Referee Deposit' switch on your dashboard.";
      } else if (textLower.includes('comp') || textLower.includes('interest') || textLower.includes('rate') || textLower.includes('percent')) {
        responseText = "XENA's high-yield daily dividend packages (offering up to 26.67% daily return depending on your chosen company share tier) rollover after a fixed 30-day cycle. Both your principal capital and the accrued profits automatically compound into another cycle, compounding your returns exponentially!";
      }

      setUserChatThreads(prev => {
        const thread = prev[userEmailKey] || [];
        return {
          ...prev,
          [userEmailKey]: [
            ...thread,
            { sender: 'agent' as const, text: responseText, time: 'Just now' }
          ]
        };
      });
      setIsAgentTyping(false);
    }, 1500);
  };

  const handleCreateSupportTicket = (category: string, subject: string) => {
    if (!subject.trim()) return;

    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(100000 + Math.random() * 900000)}`,
      userEmail: wallet.email,
      userFullName: wallet.fullName,
      category,
      subject,
      status: 'pending',
      date: simulatedTime,
      messages: [
        {
          id: `msg-${Math.floor(100000 + Math.random() * 900000)}`,
          sender: 'user',
          senderName: wallet.fullName,
          text: subject,
          date: simulatedTime
        }
      ]
    };

    setCsTickets(prev => [newTicket, ...prev]);
  };

  const handleReplyToTicket = (ticketId: string, text: string) => {
    setCsTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const newMsg = {
            id: `msg-${Math.floor(100000 + Math.random() * 900000)}`,
            sender: 'agent' as const,
            senderName: 'Blessing Adebayo (Strategic Advisor)',
            text,
            date: simulatedTime
          };
          return {
            ...t,
            messages: [...(t.messages || []), newMsg]
          };
        }
        return t;
      })
    );
  };

  const handleUserReplyToTicket = (ticketId: string, text: string) => {
    setCsTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const newMsg = {
            id: `msg-${Math.floor(100000 + Math.random() * 900000)}`,
            sender: 'user' as const,
            senderName: wallet.fullName,
            text,
            date: simulatedTime
          };
          return {
            ...t,
            status: 'pending' as const,
            messages: [...(t.messages || []), newMsg]
          };
        }
        return t;
      })
    );
  };

  const handleUpdateTicketStatus = (ticketId: string, status: 'pending' | 'resolved') => {
    setCsTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  const handleSendAdminChatBySupervisor = (userEmail: string, text: string, role: 'admin' | 'agent') => {
    const key = userEmail.toLowerCase();
    setUserChatThreads(prev => {
      const thread = prev[key] || [];
      return {
        ...prev,
        [key]: [
          ...thread,
          { sender: role, text, time: 'Just now' }
        ]
      };
    });
  };

  const handleAddDepositAccount = (bankName: string, accountName: string, accountNumber: string) => {
    const newAcc: DepositAccount = {
      id: `da-${Math.floor(100000 + Math.random() * 900000)}`,
      bankName,
      accountName,
      accountNumber,
      isActive: true
    };
    setDepositAccounts(prev => [...prev, newAcc]);
  };

  const handleRemoveDepositAccount = (id: string) => {
    setDepositAccounts(prev => prev.filter(a => a.id !== id));
  };

  const handleToggleDepositAccount = (id: string) => {
    setDepositAccounts(prev =>
      prev.map(a => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const handleOpenModal = (type: 'deposit' | 'withdraw') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSelectUser = (email: string) => {
    if (email.toLowerCase() === 'admin1234@gmail.com') {
      setWallet({
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
      });
      return;
    }
    const targetUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (targetUser) {
      setWallet(targetUser);
    }
  };

  const handleUpdateUserWalletByAdmin = (updates: Partial<UserWallet>) => {
    setWallet((prev) => {
      const next = { ...prev, ...updates };
      setRegisteredUsers((prevUsers) =>
        prevUsers.map((u) => u.email.toLowerCase() === prev.email.toLowerCase() ? { ...u, ...updates } : u)
      );

      if (updates.autoInvest !== undefined) {
        const isAuto = updates.autoInvest;
        setActiveInvestments(prevInv => 
          prevInv.map(inv => {
            if (inv.userEmail?.toLowerCase() === prev.email.toLowerCase()) {
              return { ...inv, isCompounding: isAuto };
            }
            return inv;
          })
        );
      }

      return next;
    });
  };

  const handleUpdateSpecificUser = (email: string, updates: Partial<UserWallet>) => {
    setRegisteredUsers((prevUsers) =>
      prevUsers.map((u) => u.email.toLowerCase() === email.toLowerCase() ? { ...u, ...updates } : u)
    );

    setWallet((prev) => {
      if (prev.email.toLowerCase() === email.toLowerCase()) {
        return { ...prev, ...updates };
      }
      return prev;
    });
  };

  const handleDeleteUser = (userEmail: string) => {
    if (userEmail.toLowerCase() === 'admin1234@gmail.com') {
      alert("Cannot delete primary Corporate Admin.");
      return;
    }

    setRegisteredUsers((prevUsers) => {
      const nextUsers = prevUsers.filter((u) => u.email.toLowerCase() !== userEmail.toLowerCase());
      
      if (wallet && wallet.email.toLowerCase() === userEmail.toLowerCase()) {
        const fallback = nextUsers.find(u => u.email.toLowerCase() === 'jeremiahobazee11@gmail.com') || nextUsers[0];
        if (fallback) {
          setWallet(fallback);
        }
      }
      return nextUsers;
    });

    setTransactions((prevTxs) => prevTxs.filter((tx) => tx.userEmail?.toLowerCase() !== userEmail.toLowerCase()));
    setActiveInvestments((prevInvestments) => prevInvestments.filter((inv) => (inv.userEmail || '').toLowerCase() !== userEmail.toLowerCase()));
    setReferrals((prevRefs) => prevRefs.filter((ref) => ref.referredEmail.toLowerCase() !== userEmail.toLowerCase() && ref.referrerEmail.toLowerCase() !== userEmail.toLowerCase()));
  };

  const handleRegisterUser = (newUser: UserWallet) => {
    isJustRegisteredRef.current = true;
    const latestUsers = [...registeredUsers, newUser];
    setRegisteredUsers(latestUsers);
    
    if (newUser.referredBy) {
      setReferredByCode(newUser.referredBy);
      localStorage.setItem('lafarge_referred_by_code', newUser.referredBy);
      checkAndRecordReferral(newUser, latestUsers);
    }
  };

  const handleLoginSuccess = (userWallet: UserWallet, adminStatus: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(adminStatus);
    setWallet(userWallet);
    
    // Save 30-day persistent session log
    localStorage.setItem('lafarge_login_session', JSON.stringify({
      email: userWallet.email.toLowerCase(),
      isAdmin: adminStatus,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // Lasts 30 days
    }));

    if (adminStatus) {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
      if (isJustRegisteredRef.current) {
        setShowPromoModal(true);
        isJustRegisteredRef.current = false;
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lafarge_login_session');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setActiveTab('dashboard');
  };

  if (isSplashActive) {
    return <SplashScreen onComplete={() => setIsSplashActive(false)} />;
  }

  if (!isLoggedIn) {
    return (
      <AuthScreen 
        onLoginSuccess={handleLoginSuccess}
        registeredUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 font-sans flex flex-col antialiased pb-24 sm:pb-32">
      
      {/* (Upper Brand Nav header and sidebar removed for premium, distraction-free widescreen workspace look with Floating Bottom Dock navigation) */}

      {/* Primary Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8 text-left">
        
        {/* Prominent Bank-Style Balance Cards Section — Only visible on Home Page (activeTab === 'dashboard') */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Mini Portfolio Brand Box — Replaces header logo neatly on home page with glowing X emblem */}
            <div className="bg-[#0b0e14]/50 border border-slate-850 rounded-2xl p-4 flex flex-col justify-center text-left relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-3 select-none">
                <div className="relative w-10 h-10 bg-gradient-to-tr from-[#02050b] to-[#0e1322] border border-indigo-500/35 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.25)] shrink-0 overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-505/5 animate-pulse" />
                  <span className="text-xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400 drop-shadow-[0_0_4px_#22d3ee] tracking-tighter select-none">
                    X
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="font-sans text-base font-black tracking-[0.12em] text-white leading-none flex items-center gap-1">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-indigo-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)] font-black">X</span>ENA
                    <span className="text-[9px] text-indigo-400 font-black tracking-widest bg-indigo-500/10 border border-indigo-500/10 px-1 py-0.5 rounded uppercase font-mono scale-[0.8] origin-left">
                      SECURE
                    </span>
                  </div>
                  <span className="text-[7px] text-slate-400 leading-none tracking-[0.2em] font-extrabold uppercase mt-1">
                    PREMIUM WEALTH
                  </span>
                </div>
              </div>
              <div className="mt-3.5 pt-3 border-t border-slate-900 flex justify-between items-center text-[10px] text-zinc-400">
                <span className="font-mono">User: {wallet.fullName?.split(' ')[0]}</span>
                <span className="font-mono text-emerald-450 font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Active Node
                </span>
              </div>
            </div>

            {/* Wallet Balance Card */}
            <div className="bg-gradient-to-r from-slate-950 to-[#0e121f] border border-slate-800/95 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group hover:border-slate-750">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
                  <Wallet className="w-5.5 h-5.5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold tracking-wider text-slate-400 font-sans uppercase">Wallet Available Cash</span>
                  </div>
                  <strong className="text-2xl font-black font-mono text-white tracking-tight mt-1 leading-none select-all">
                    {formatNGN(wallet.walletBalance)}
                  </strong>
                  <span className="text-[9px] text-zinc-500 font-bold mt-1.5 font-mono">
                    Ledger: <span className="text-slate-300 font-extrabold">{wallet.accountNumber || '1029415842'}</span>
                  </span>
                </div>
              </div>
              <button
                id="btn-header-deposit-card"
                onClick={() => handleOpenModal('deposit')}
                className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow hover:shadow-blue-500/20 flex items-center gap-1.5 shrink-0"
              >
                Deposit <Plus className="w-3 h-3 stroke-[3]" />
              </button>
            </div>

            {/* Invested Balance Card */}
            <div className="bg-gradient-to-r from-slate-950 to-[#120e24] border border-slate-800/95 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group hover:border-slate-750">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 shadow-inner shrink-0">
                  <TrendingUp className="w-5.5 h-5.5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold tracking-wider text-slate-400 font-sans uppercase">Compounding Venture Shares</span>
                  </div>
                  <strong className="text-2xl font-black font-mono text-white tracking-tight mt-1 leading-none select-all">
                    {formatNGN(wallet.investedBalance)}
                  </strong>
                  <span className="text-[9px] text-zinc-500 font-bold mt-1.5 font-sans">
                    Insured compounding daily at apex 26.67%
                  </span>
                </div>
              </div>
              <button
                id="btn-header-withdraw-card"
                onClick={() => handleOpenModal('withdraw')}
                className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-slate-800 hover:border-slate-705 rounded-xl text-xs font-black transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                Withdraw <ArrowUpRight className="w-3 h-3 stroke-[3]" />
              </button>
            </div>

          </div>
        )}
        
        {/* Dynamic content render depending on ActiveTab */}
        
        {activeTab === 'dashboard' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 text-left"
          >
            {/* Sophisticated Minimalist Greeting Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-200 font-sans text-left">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-purple-600 block">
                  XENA PORTFOLIO ENGINE
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-slate-905 tracking-tight font-sans">
                  Portfolio Overview
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Welcome back, <span className="text-purple-600 font-bold">{wallet.fullName}</span>. Your capital allocations and daily dividend matrix are synchronized.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-[8.5px] font-bold uppercase tracking-wider font-mono">
                  ● SECURE SYSTEM
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-[8.5px] font-black uppercase tracking-wider font-mono">
                  ● CBN VERIFIED
                </span>
              </div>
            </div>

            {/* Top Stats blocks */}
            <StatsGrid wallet={wallet} onOpenModal={handleOpenModal} activeInvestments={activeInvestments} />

            {/* Pr            {/* Premium 5-Level Daily Referral Commission Matrix */}
            <div className="bg-[#0b0e14] border border-slate-800/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                {(() => {
                  const netCounts = (() => {
                    const codeNormalized = (wallet.referralCode || '').trim().toLowerCase();
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
                  })();

                  const totalNetworkCount = netCounts.lv1 + netCounts.lv2 + netCounts.lv3 + netCounts.lv4 + netCounts.lv5;

                  const levelsConfig = [
                    { level: 1, rate: '0.1% daily', name: 'Bronze Rank', req: 5, current: netCounts.lv1, border: 'border-amber-500/30 text-amber-550' },
                    { level: 2, rate: '0.2% daily', name: 'Silver Rank', req: 10, current: netCounts.lv2, border: 'border-slate-350/20 text-slate-350' },
                    { level: 3, rate: '0.3% daily', name: 'Gold Rank', req: 15, current: netCounts.lv3, border: 'border-yellow-500/30 text-yellow-500' },
                    { level: 4, rate: '0.4% daily', name: 'Platinum Rank', req: 20, current: netCounts.lv4, border: 'border-indigo-500/20 text-indigo-400' },
                    { level: 5, rate: '0.5% daily', name: 'Diamond Rank', req: 25, current: netCounts.lv5, border: 'border-cyan-500/30 text-cyan-400' }
                  ];

                  return (
                    <>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/50">
                        <div className="space-y-0.5">
                          <span className="text-[8.5px] bg-emerald-400/10 border border-emerald-500/25 text-emerald-400 font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider font-mono">
                            XENA PARTNER NETWORKS
                          </span>
                          <h3 className="text-sm font-black text-white font-sans flex items-center gap-1.5 mt-1">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            Dynamic Shareholder Dividends Network
                          </h3>
                        </div>
                        <div className="bg-black/35 border border-slate-800 px-3 py-1.5 rounded-lg font-mono text-[10px] flex items-center gap-1.5 shrink-0 self-start md:self-auto">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-zinc-400 font-bold">TOTAL COMMISSIONS:</span>
                          <strong className="text-emerald-400 font-extrabold">{totalNetworkCount} MEMBERS</strong>
                        </div>
                      </div>

                      {/* Clean compact list container of levelsConfig */}
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                        {levelsConfig.map((lv) => {
                          const isUnlocked = lv.current >= lv.req;

                          return (
                            <div 
                              key={lv.level} 
                              className={`rounded-xl p-3 border flex items-center justify-between gap-2 transition-all duration-300 ${
                                isUnlocked 
                                  ? `bg-[#0e121e]/80 ${lv.border} shadow-sm` 
                                  : 'bg-black/15 border-slate-850/40 opacity-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-xs ${isUnlocked ? 'bg-emerald-500/10 text-emerald-450' : 'bg-slate-800 text-slate-500'}`}>
                                  L{lv.level}
                                </span>
                                <div className="flex flex-col text-left">
                                  <span className="text-[10px] font-extrabold text-slate-205 leading-none">{lv.name}</span>
                                  <span className={`text-[9px] font-bold font-mono tracking-tight mt-0.5 ${isUnlocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    +{lv.rate}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="text-right leading-none shrink-0">
                                <span className="text-[10px] font-mono text-slate-300 font-extrabold block">{lv.current}/{lv.req}</span>
                                <span className={`text-[8px] font-black font-sans tracking-tight uppercase block mt-1 ${isUnlocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                                  {isUnlocked ? 'OK' : '🔒 LOCK'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-2.5 bg-emerald-950/20 border border-emerald-900/20 text-emerald-400 font-sans font-medium text-[9.5px] rounded-xl flex items-center gap-2">
                        <span className="shrink-0 p-0.5 px-1 bg-emerald-500/10 border border-emerald-500/20 rounded font-bold">⚡ RULES</span>
                        Recursively earn bonus shares up to Level 5 overrides. Expand active referral counts to unlock advanced tiers.
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
                     {/* Claim Welcome Bonus Banner */}
            {!wallet.hasClaimedBonus ? (
              <div id="bonus-claim-callout" className="bg-gradient-to-r from-purple-600 to-purple-950 border border-purple-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md text-white relative overflow-hidden animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500 rounded-xl text-white shadow-md shadow-amber-500/20 shrink-0">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 font-sans">
                    <h3 className="font-extrabold text-amber-300 text-sm flex flex-wrap items-center gap-2">
                      XENA Shareholder Welcome Offer
                      <span className="px-2 py-0.5 bg-purple-900 border border-purple-800 text-purple-100 rounded-md text-[10px] font-black uppercase tracking-wider">
                        ₦500.00 Awaiting
                      </span>
                    </h3>
                    <p className="text-xs text-purple-100 leading-relaxed font-semibold">
                      Your shareholder profile is active, but your balance starts at ₦0.00. Claim your <span className="font-bold text-amber-300">₦500.00 free welcome booster credit</span> to initialize your dividend treasury.
                    </p>
                  </div>
                </div>
                <button
                  id="btn-claim-bonus"
                  onClick={handleClaimBonus}
                  className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 border border-yellow-300 font-black text-xs rounded-xl shadow-md transition-all hover:scale-[1.01] cursor-pointer shrink-0"
                >
                  Claim ₦500 Cash Bonus Now 🎁
                </button>
              </div>
            ) : (
              <div className="bg-[#0b0e14] border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
                <span className="absolute top-0 right-0 p-1 bg-emerald-600 text-white font-black text-[8px] uppercase tracking-widest rotate-6 translate-x-2 translate-y-1 text-center font-mono py-0.5 px-3">
                  COMPLETED
                </span>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-950/40 rounded-xl text-emerald-450 border border-emerald-900/30 shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 font-sans">
                    <h3 className="font-extrabold text-white text-sm flex flex-wrap items-center gap-2">
                      XENA Shareholder Program
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-md text-[10px] font-black uppercase tracking-wider">
                        Shareholder Vault Active
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                      Congratulations! Your shareholder wallet is now active. Fund your account and acquire shares or bonds to produce high-performance high-yield daily dividends.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Active Investments & Portfolio */}
              <div className="lg:col-span-8 space-y-8">
                <ActiveInvestments 
                  investments={userActiveInvestments}
                  simulatedTime={simulatedTime}
                  onToggleCompounding={handleToggleCompounding}
                  onClaim={handleClaimMatured}
                  onOpenInvestTab={() => setActiveTab('invest')}
                />

                {/* Bonus Reward Coupon Claim Section - Moved before transaction log */}
                <BonusClaimSection 
                  onClaim={handleClaimBonusCode}
                />

                <TransactionHistory transactions={userTransactions} />
              </div>

              {/* Right Column: Time machine simulation and security details */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Daily Login Streak Status Block */}
                <DailyStreakCard 
                  wallet={wallet}
                  simulatedTime={simulatedTime}
                  onAdvanceTime={handleAdvanceTime}
                />

                {/* Refer and Earn Card - Modern Executive Design */}
                <div id="referral-affiliate-card" className="bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950 border border-indigo-500/20 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl font-sans text-left">
                  {/* Outer decorative light leaks */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

                  <div className="space-y-4 relative z-10 text-left">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-xl text-slate-950 shadow-md font-sans">
                        <Gift className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-left font-sans">
                        <span className="text-[10px] uppercase font-black tracking-widest text-amber-450 block text-left">Affiliate Benefits</span>
                        <h4 className="font-extrabold text-[15px] text-white tracking-tight -mt-0.5 text-left">Refer & Earn Real Reward Capital</h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300/90 leading-relaxed font-semibold text-left font-sans">
                      Invite friends to join XENA. When they activate their first options purchase, your available account is immediately credited with a bonus of <strong className="text-amber-400 font-extrabold font-mono">₦500.00</strong>.
                    </p>

                    {/* Copy Link Layout Block */}
                    <div className="space-y-1.5 pt-1.5 text-left font-sans">
                      <label className="block text-[9px] uppercase font-black tracking-widest text-indigo-300 text-left">
                        Personal Affiliate link
                      </label>
                      <div className="flex items-center gap-2 p-1.5 bg-black/40 border border-slate-700/60 rounded-xl">
                        <code className="text-[10px] font-mono font-bold text-slate-200 truncate flex-1 pl-1">
                          {getReferralLink()}
                        </code>
                        <button
                          onClick={handleCopyRefLink}
                          className="p-2 bg-purple-650 hover:bg-purple-550 border border-slate-600/50 hover:border-purple-400 text-white rounded-lg cursor-pointer transition-colors shrink-0"
                          title="Copy Link to Clipboard"
                        >
                          {copiedRef ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Instant Social Channels */}
                      <div className="grid grid-cols-2 gap-2 pt-1 text-left font-sans">
                        <button
                          type="button"
                          onClick={handleCopyPromoMessage}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 hover:border-white/20 text-indigo-200 font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer text-left font-sans"
                        >
                          {copiedPromoMsg ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedPromoMsg ? "Copied Info" : "Copy Invite Text"}</span>
                        </button>
                        <a
                          href={getWhatsAppShareUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#128C7E] hover:bg-[#075E54] active:scale-95 border border-emerald-500/30 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md text-left font-sans"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    {/* Referral Metrics Bar */}
                    <div className="grid grid-cols-2 gap-3.5 p-3.5 bg-black/35 border border-white/5 rounded-2xl text-left font-sans">
                      <div className="text-left font-sans">
                        <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block text-left">My Invitees</span>
                        <span className="text-sm font-black font-mono text-white flex items-center gap-1.5 mt-0.5 text-left">
                          <Users className="w-4 h-4 text-indigo-400 shrink-0" /> {wallet.referralsCount}
                        </span>
                      </div>
                      <div className="text-left border-l border-white/10 pl-3.5 font-sans">
                        <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block text-left">Paid Accruals</span>
                        <span className="text-sm font-black font-mono text-emerald-400 block mt-0.5 text-left">
                          {formatNGN(wallet.referralEarnings)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit and Security trust widget */}
                <div className="bg-[#0b0e14] border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2.5 py-1 rounded-full inline-block">
                    Licensed Escrow Safe Guarantee
                  </span>
                  
                  <div className="space-y-3">
                    <h4 className="font-bold text-white leading-tight">Global Market Maker Liquidity Guarantee</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                      Underpinned by liquidity pool allocations in first-tier global tech shares. Positions correspond to licensed local broker holdings across international equities.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/60 space-y-2 text-[11px] text-slate-300 font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-blue-400" /> NIBSS & Paystack Gateway Security</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-450" /> SEC Registered Corporate Shares</div>
                    <div className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Global Equity Board Audit Approved</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Global Auto-Invest setting at the bottom of Portfolio */}
            <div className="bg-[#0b0e14] border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
              
              <div className="space-y-1.5 md:pl-2 max-w-2xl font-sans">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-2.5 bg-blue-950/40 text-blue-400 text-[10px] font-black uppercase tracking-wider rounded-md border border-blue-900/30">
                    System Preference
                  </span>
                  {wallet.autoInvest !== false ? (
                    <span className="p-0.5 px-2 bg-emerald-600 text-white text-[9px] font-bold uppercase rounded-md animate-pulse">
                      ACTIVE & COMpounding
                    </span>
                  ) : (
                    <span className="p-0.5 px-2 bg-slate-900 text-slate-400 border border-slate-800 text-[9px] font-bold uppercase rounded-md">
                      PAUSED
                    </span>
                  )}
                </div>
                <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500 shrink-0" /> Account Auto-Invest Reinvestment Node
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  With Auto-Invest enabled (ON by default), all your acquired positions will automatically roll over into a new cycle upon maturity. Disable this to payout matured funds straight into your liquid naira balance.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 sm:self-center">
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3 px-4 shadow-inner">
                  <span className="text-xs font-black text-slate-300 animate-pulse">
                    {wallet.autoInvest !== false ? 'Auto-Invest ON' : 'Auto-Invest OFF'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wallet.autoInvest !== false}
                      onChange={(e) => handleToggleGlobalAutoInvest(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-slate-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {activeTab === 'invest' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="border-b border-purple-150 pb-5">
              <h2 className="text-2xl md:text-3xl font-display font-black text-gray-950 tracking-tight">Cement Production Stock Options</h2>
              <p className="text-sm text-gray-500 mt-1 max-w-xl">Acquire shares in Nigeria's leading building material assets. Get robust daily dividends (up to 26.67% daily) with flexible options on static 30-day corporate schedules.</p>
            </div>

            {/* Product card matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsList.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  walletBalance={wallet.walletBalance}
                  onInvest={handleDeployCapital}
                  onOpenDeposit={() => handleOpenModal('deposit')}
                  autoInvestDefault={wallet.autoInvest !== false}
                />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'crypto' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <CryptoSwapSection 
              wallet={wallet}
              registeredUsers={registeredUsers}
              onUpdateUserWallet={handleUpdateUserWalletByAdmin}
              onUpdateSpecificUser={handleUpdateSpecificUser}
              onAddTransaction={(txn) => {
                setTransactions((prev) => [txn, ...prev]);
              }}
            />
          </motion.div>
        )}

        {activeTab === 'simulator' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 text-left"
          >
            <div className="border-b border-gray-200 pb-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 block">
                SIMULATE PERFORMANCE VELOCITY
              </span>
              <h2 className="text-2xl md:text-3xl font-sans font-black text-slate-905 tracking-tight mt-1">Compound Projections & Asset Models</h2>
              <p className="text-xs text-slate-500 mt-1.5 max-w-xl font-medium leading-relaxed">
                Configure your simulated capital stake below to witness high-volume rollover growth. Evaluate compounding cycles dynamically synchronized with our global corporate equity packages.
              </p>
            </div>

            <Calculator />

            {/* Structured Dual Section on Referral Level Matrix & XENA COIN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              
              {/* Box A: Multi-Tier Referral levels system (7 columns for rich structural layout) */}
              <div className="lg:col-span-7 bg-[#0b0e14] border border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-700 text-white rounded-2xl shadow-md">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider font-mono">5-LEVEL COMMISSION MATRIX</span>
                      <h4 className="font-sans font-black text-[17px] text-white leading-tight">
                        Sovereign Referral Network
                      </h4>
                    </div>
                  </div>
                  <div className="bg-emerald-950/40 border border-emerald-900/30 rounded-xl px-3 py-1.5 text-left md:text-right shrink-0">
                    <span className="text-[8px] uppercase font-semibold text-emerald-405 block">Registration Commission</span>
                    <span className="text-xs font-black text-emerald-400 font-mono">₦500.00 / Activation</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Expand your professional group and yield dynamic bonuses! Ranks are structured across <span className="text-blue-400 font-black font-mono">5 generational depths</span>. Your network overrides scale recursively as active members upgrade assets:
                </p>

                {/* Structured Multi-Tier Timeline Flowchart */}
                <div className="relative pl-6 md:pl-8 space-y-4 pt-1">
                  {/* Decorative Timeline line */}
                  <div className="absolute left-[11px] md:left-[15px] top-3 bottom-3 w-[2.5px] bg-gradient-to-b from-amber-500 via-zinc-400 via-yellow-500 via-purple-500 to-cyan-500 rounded-full" />

                  {/* Level 1 Bronze */}
                  <div className="relative group transition-transform hover:translate-x-1 duration-200">
                    <span className="absolute -left-[23px] md:-left-[27px] top-[18px] w-3.5 h-3.5 rounded-full bg-white border-4 border-amber-700 shadow-sm" />
                    <div className="bg-gradient-to-r from-amber-500/5 via-amber-600/5 to-amber-700/5 p-4 rounded-2xl border border-amber-500/30 hover:border-amber-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-sm">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider font-sans">LEVEL 1 • BRONZE AGENT</span>
                          <span className="px-2 py-0.5 text-[8.5px] font-bold uppercase rounded bg-amber-100 text-amber-850 border border-amber-200 font-mono">5 Refs Required</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">Underwrites basic daily team options dividends override.</p>
                      </div>
                      <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md border border-amber-400 px-3 py-1.5 rounded-xl shrink-0 text-center sm:text-right">
                        <span className="text-xs font-black font-mono uppercase block leading-none">+0.1% DAILY</span>
                        <span className="text-[7.5px] font-black text-amber-100 uppercase tracking-wider block mt-0.5">Yield Multiplier</span>
                      </div>
                    </div>
                  </div>

                  {/* Level 2 Silver */}
                  <div className="relative group transition-transform hover:translate-x-1 duration-200">
                    <span className="absolute -left-[23px] md:-left-[27px] top-[18px] w-3.5 h-3.5 rounded-full bg-white border-4 border-slate-450 shadow-sm" />
                    <div className="bg-gradient-to-r from-slate-500/5 via-zinc-600/5 to-slate-700/5 p-4 rounded-2xl border border-slate-350 hover:border-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-sm">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black text-slate-705 uppercase tracking-wider font-sans">LEVEL 2 • SILVER ASSOCIATE</span>
                          <span className="px-2 py-0.5 text-[8.5px] font-bold uppercase rounded bg-slate-105 text-slate-700 border border-slate-200 font-mono">10 Refs Required</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">Adds direct settlement queues and ledger updates.</p>
                      </div>
                      <div className="bg-gradient-to-br from-slate-500 to-slate-700 text-white shadow-md border border-slate-400 px-3 py-1.5 rounded-xl shrink-0 text-center sm:text-right">
                        <span className="text-xs font-black font-mono uppercase block leading-none">+0.2% DAILY</span>
                        <span className="text-[7.5px] font-black text-slate-100 uppercase tracking-wider block mt-0.5">Yield Multiplier</span>
                      </div>
                    </div>
                  </div>

                  {/* Level 3 Gold */}
                  <div className="relative group transition-transform hover:translate-x-1 duration-200">
                    <span className="absolute -left-[23px] md:-left-[27px] top-[18px] w-3.5 h-3.5 rounded-full bg-white border-4 border-yellow-500 shadow-sm" />
                    <div className="bg-gradient-to-r from-yellow-500/5 via-amber-500/5 to-amber-600/5 p-4 rounded-2xl border border-yellow-550/30 hover:border-yellow-550/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-sm">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black text-yellow-805 uppercase tracking-wider font-sans">LEVEL 3 • GOLD PARTNER</span>
                          <span className="px-2 py-0.5 text-[8.5px] font-bold uppercase rounded bg-yellow-105 text-amber-850 border border-yellow-200 font-mono">15 Refs Required</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">Unlocks 1.5% passive dividend boost and metal card privileges.</p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-500 to-amber-650 text-slate-950 shadow-md border border-yellow-350 px-3 py-1.5 rounded-xl shrink-0 text-center sm:text-right">
                        <span className="text-xs font-black font-mono uppercase block leading-none">+0.3% DAILY</span>
                        <span className="text-[7.5px] font-black text-amber-950 uppercase tracking-wider block mt-0.5">Yield Multiplier</span>
                      </div>
                    </div>
                  </div>

                  {/* Level 4 Platinum */}
                  <div className="relative group transition-transform hover:translate-x-1 duration-200">
                    <span className="absolute -left-[23px] md:-left-[27px] top-[18px] w-3.5 h-3.5 rounded-full bg-white border-4 border-purple-500 shadow-sm" />
                    <div className="bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-purple-600/5 p-4 rounded-2xl border border-purple-500/30 hover:border-purple-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-sm">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black text-purple-800 uppercase tracking-wider font-sans">LEVEL 4 • PLATINUM SHAREHOLDER</span>
                          <span className="px-2 py-0.5 text-[8.5px] font-bold uppercase rounded bg-purple-100 text-purple-805 border border-purple-200 font-mono">20 Refs Required</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">Provides zero-fee NUBAN local bank wiring channels.</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-650 to-indigo-650 text-white shadow-md border border-purple-400 px-3 py-1.5 rounded-xl shrink-0 text-center sm:text-right">
                        <span className="text-xs font-black font-mono uppercase block leading-none">+0.4% DAILY</span>
                        <span className="text-[7.5px] font-black text-purple-100 uppercase tracking-wider block mt-0.5">Yield Multiplier</span>
                      </div>
                    </div>
                  </div>

                  {/* Level 5 Diamond */}
                  <div className="relative group transition-transform hover:translate-x-1 duration-200">
                    <span className="absolute -left-[23px] md:-left-[27px] top-[18px] w-3.5 h-3.5 rounded-full bg-cyan-400 border-4 border-cyan-200 shadow-lg animate-pulse" />
                    <div className="bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-emerald-500/5 p-4 rounded-2xl border border-cyan-500/30 hover:border-cyan-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black text-cyan-800 uppercase tracking-wider font-sans">LEVEL 5 • COGNITIVE DIAMOND EXECUTIVE</span>
                          <span className="px-2 py-0.5 text-[8.5px] font-black uppercase rounded bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-sm font-mono">Apex Tier Active</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">Encompasses physical advisory roundtables and heavy 5% dividend boost.</p>
                      </div>
                      <div className="bg-gradient-to-br from-cyan-500 to-emerald-600 text-white shadow-lg border border-cyan-300 px-3 py-1.5 rounded-xl shrink-0 text-center sm:text-right">
                        <span className="text-xs font-black font-mono uppercase block leading-none">+0.5% DAILY</span>
                        <span className="text-[7.5px] font-black text-cyan-50 uppercase tracking-wider block mt-0.5">Yield Multiplier</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display Current Invite link */}
                <div className="bg-[#070a0f] border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Your Referral Invite Link</span>
                    <p className="text-xs font-bold text-emerald-400 font-mono">{adminApprovalSettings.customReferralLink || `https://xenainvestment.com/join?ref=${wallet.referralCode}`}</p>
                  </div>
                  <button 
                    onClick={() => {
                      const shareLink = adminApprovalSettings.customReferralLink || `https://xenainvestment.com/join?ref=${wallet.referralCode}`;
                      navigator.clipboard.writeText(shareLink);
                      alert('Affiliate link successfully copied to your system clipboard!');
                    }}
                    className="px-4 py-2 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 font-black tracking-wider text-[10px] uppercase rounded-xl border border-emerald-900/30 transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Link
                  </button>
                </div>
              </div>

              {/* Box B: Cryptocurrency & XENA COIN Ecosystem (5 columns for a dark futuristic crypto terminal) */}
              <div className="lg:col-span-5 bg-gradient-to-b from-indigo-950 via-zinc-950 to-black text-white border border-zinc-805 rounded-3xl p-6 flex flex-col justify-between text-left shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full blur-[80px] opacity-35 group-hover:opacity-45 transition-opacity" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-600 rounded-full blur-[100px] opacity-25" />
                
                <div className="space-y-5 relative">
                  {/* Token Header badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-450 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-md relative animate-pulse">
                        <Coins className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-sans font-black text-sm uppercase text-amber-400 tracking-wide">
                          XENA COIN (XNC)
                        </h4>
                        <span className="text-[10px] uppercase font-black text-zinc-400 block tracking-widest mt-0.5 font-mono">
                          Vault: {wallet.xenaBalance ? wallet.xenaBalance.toFixed(4) : '0.0000'} XNC
                        </span>
                      </div>
                    </div>
                    <span className="text-[8px] bg-purple-950 text-purple-200 border border-purple-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      ● Pre-Launch Phase
                    </span>
                  </div>

                  <p className="text-[11.5px] text-zinc-350 leading-relaxed font-sans font-semibold">
                    The corporate cryptocurrency <strong className="text-white">XENA COIN (XNC)</strong> allows stakeholders to bridge traditional share options into decentralized liquid assets. Swap compounding available funds easily.
                  </p>

                  {/* DEX Exchange Listing Disclosure Section */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2.5">
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block font-mono">🚀 DECENTRALIZED EXCHANGE LISTINGS</span>
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold">
                      XENA COIN satisfies standards to go active on the fastest viral memecoin desks and primary DEX portals:
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[9px]">
                      <div className="p-2 bg-black/40 border border-zinc-800 rounded-xl text-center">
                        <span className="font-black text-white block">Pump.fun platform</span>
                        <span className="text-purple-400 font-bold uppercase text-[7.5px]">VIRAL MEMECOINS</span>
                      </div>
                      <div className="p-2 bg-black/40 border border-zinc-800 rounded-xl text-center">
                        <span className="font-black text-white block">Raydium DEX</span>
                        <span className="text-purple-400 font-bold uppercase text-[7.5px]">SOLANA NETWORK</span>
                      </div>
                      <div className="p-2 bg-black/40 border border-zinc-800 rounded-xl text-center">
                        <span className="font-black text-white block">Uniswap V3</span>
                        <span className="text-purple-400 font-bold uppercase text-[7.5px]">BSC / ETHER POOLS</span>
                      </div>
                      <div className="p-2 bg-black/40 border border-zinc-800 rounded-xl text-center">
                        <span className="font-black text-white block">DexScreener App</span>
                        <span className="text-purple-400 font-bold uppercase text-[7.5px]">REAL-TIME API</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Conversion Engine Simulation (Convert Available Naira to Security Vault Coins) */}
                  <div className="p-4 bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-900/40 rounded-2xl space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-extrabold text-amber-400 uppercase tracking-widest block font-mono flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-450 animate-bounce" /> NAIRA TO XENA SWAPPER
                      </span>
                      <span className="text-[8.5px] font-mono text-zinc-400 uppercase">Rate: 1 XNC = ₦45</span>
                    </div>

                    <p className="text-[9.5px] text-purple-305 leading-none font-bold">
                      ⚠ Note: You can only swap Naira (NGN) to XENA coin assets.
                    </p>

                    {swapSuccessMessage ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 rounded-xl space-y-2 text-center"
                      >
                        <span className="block text-xs font-black text-emerald-300">🎉 CONVERSION SUCCESSFUL</span>
                        <p className="text-[10px] leading-relaxed font-semibold">{swapSuccessMessage}</p>
                        <button 
                          onClick={() => setSwapSuccessMessage('')}
                          className="mt-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-black text-[9px] uppercase font-black rounded-lg transition-colors cursor-pointer"
                        >
                          Perform New Swap
                        </button>
                      </motion.div>
                    ) : (
                      <div className="space-y-3">
                        {/* Selector (Only NGN to XENA is permitted) */}
                        <div className="flex gap-2 bg-black/40 p-1.5 rounded-lg border border-zinc-800">
                          <button
                            className="flex-1 py-1 px-2 text-[10px] font-black rounded-md bg-purple-600 text-white shadow"
                          >
                            NGN ➔ XNC (Native)
                          </button>
                        </div>

                        {/* Slide input */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-zinc-400">NGN Balance: <strong className="text-white font-mono">{formatNGN(wallet.walletBalance)}</strong></span>
                            <span className="text-purple-300 font-mono font-bold">Swap {formatNGN(swapAmount)}</span>
                          </div>
                          <input
                            type="range"
                            min="1000"
                            max={Math.max(1000, wallet.walletBalance)}
                            step="1000"
                            value={swapAmount > wallet.walletBalance ? wallet.walletBalance : swapAmount}
                            onChange={(e) => setSwapAmount(Number(e.target.value))}
                            className="w-full accent-purple-600 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                          />
                        </div>

                        {/* Estimated output results */}
                        <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-850 flex justify-between items-center">
                          <div>
                            <span className="text-[8px] uppercase font-bold text-zinc-500 block">Est. XNC Vault Yield</span>
                            <span className="text-xs font-black text-white font-mono tracking-wide">
                              {((swapAmount) / 45).toLocaleString('en-US', { maximumFractionDigits: 4 })} XNC
                            </span>
                          </div>
                          <div className="bg-zinc-900 px-2 py-1 rounded border border-zinc-800 text-[8px] font-mono text-zinc-400 tracking-wider">
                            SWAP FEE: 0%
                          </div>
                        </div>

                        {/* Action trigger button */}
                        <button
                          onClick={() => {
                            if (swapAmount > wallet.walletBalance) {
                              alert("Insufficient Naira (NGN) available balance in your options portfolio. Please fund your wallet first to swap.");
                              return;
                            }
                            setIsSwapping(true);
                            setTimeout(() => {
                              setIsSwapping(false);
                              const xncReceived = Number((swapAmount / 45).toFixed(4));
                              
                              const nextWalletBalance = wallet.walletBalance - swapAmount;
                              const nextXenaBalance = (wallet.xenaBalance || 0) + xncReceived;
                              
                              handleUpdateUserWalletByAdmin({
                                walletBalance: nextWalletBalance,
                                xenaBalance: nextXenaBalance,
                              });
                              
                              setSwapSuccessMessage(`Successfully converted ${formatNGN(swapAmount)} Naira from your core balance into ${xncReceived.toLocaleString('en-US', { maximumFractionDigits: 4 })} XNC! Complete listing updates deployed.`);
                            }, 1200);
                          }}
                          disabled={isSwapping || wallet.walletBalance < 1000}
                          className="w-full py-2 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-sans font-black text-[10px] tracking-widest uppercase rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {isSwapping ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> EXECUTING LEDGER CONVERSION...
                            </>
                          ) : wallet.walletBalance < 1000 ? (
                            "Insufficient Naira to Convert"
                          ) : (
                            <>
                              <RefreshCw className="w-3.5 h-3.5" /> SWAP NAIRA TO XENA COIN
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-6 flex justify-between items-center text-[9px] text-zinc-500 font-extrabold uppercase font-mono relative">
                  <span>TOKEN TICKER: XNC</span>
                  <span className="text-emerald-400 animate-pulse flex items-center gap-1">🟢 STATUS: LIQUIDITY LISTING POOLED</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {activeTab === 'faq' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 max-w-3xl mx-auto"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight">Help & Secure Disclosures</h2>
              <p className="text-sm text-slate-400">Everything you need to know about XENA company share allocations and daily payouts.</p>
            </div>

            <div className="bg-[#0b0e14] border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-sm divide-y divide-slate-805/50 space-y-6">
              {[
                {
                  q: 'Is this platform backed by real public equities?',
                  a: 'Yes. This simulated share options portal models equity allocations in high-performing international technology, hardware, and energy entities like Apple, Samsung, Nvidia, Tesla, Microsoft, and Alphabet.'
                },
                {
                  q: 'How does the daily dividend payout work?',
                  a: 'For every day your chosen company stock position remains active, you accumulate high-yield daily returns. For instance, a ₦1,500 Apple Shares allocation yields ₦400 daily (₦12,000 total returned upon maturity), and a ₦30,000 Alphabet Shares allocation yields ₦7,800 daily (₦234,000 total returned). These yields accumulate in real-time, allowing you to withdraw or roll them forward to compound!'
                },
                {
                  q: 'What is the lock-in period for corporate shares?',
                  a: 'All positions are held in a fixed 30-day term cycle. Once the term elapses, the position matures, releasing 100% of your initial capital and accrued yields back into your liquid wallet for manual withdrawal or compounding.'
                },
                {
                  q: 'What is the Multi-Level Daily Referral Commission system?',
                  a: 'We offer a highly rewarding 5-tier network structure. Beyond the setup onboarding bonus of ₦500.00, we reward our most active members with daily passive commissions proportional to their team\'s options yield: Level 1 (0.1% unlocked at 5 refs), Level 2 (0.2% unlocked at 10 refs), Level 3 (0.3% unlocked at 15 refs), Level 4 (0.4% unlocked at 20 refs), and Level 5 (0.5% unlocked at 25 refs).'
                },
                {
                  q: 'What are the channels for depositing and withdrawing funds?',
                  a: 'Deposits and payouts are handled via secure instant bank wire networks in Nigeria (using Access Bank escrow, GTBank, Zenith, etc.) and card gateways. USDT TRC20 stablecoin settlement is also fully integrated at real-time currency conversion rates.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="pt-6 first:pt-0 space-y-2.5">
                  <h4 className="text-base font-bold text-white flex items-start gap-2.5 font-sans">
                    <span className="w-5 h-5 rounded-lg bg-slate-800 text-blue-400 text-[11px] font-black shrink-0 flex items-center justify-center mt-0.5 border border-slate-700/50">Q</span>
                    {faq.q}
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed pl-7">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'cs' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* CS Banner Header */}
            <div className="border-b border-slate-800 pb-5 space-y-2">
              <span className="text-[10px] font-bold text-blue-400 bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                🤝 24/7 Client Relations Desk
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight">Customer Service Portal</h2>
              <p className="text-sm text-slate-400 max-w-xl font-medium">
                Get real-time support from our priority desk agents. Resolve account inquiries, check withdrawal windows, or open ticket logs instantly.
              </p>
            </div>

            {/* Interactive CS Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Live Automated & Smart Assistant Chat (7 Cols) */}
              <div className="lg:col-span-7 bg-[#0b0e14] border border-slate-800/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                
                {/* Agent Header bar */}
                <div className="px-5 py-4 bg-[#0d121c] border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center">
                        BA
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-550 border-2 border-[#0d121c] rounded-full animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">Blessing Adebayo</h4>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Strategic Desk Advisor</p>
                    </div>
                  </div>
                  
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2.5 py-1 rounded-lg font-black uppercase tracking-wider font-mono">
                    ● Active Now
                  </span>
                </div>

                {/* Chat window body */}
                <div className="p-4 h-[350px] overflow-y-auto space-y-4 bg-slate-950/40 flex flex-col">
                  {csChatMessages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                      }`}
                    >
                      <div className={`px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-[#0d121c] text-slate-100 border border-slate-800 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 px-1 font-mono">{msg.time}</span>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isAgentTyping && (
                    <div className="flex items-center gap-2 self-start bg-[#0d121c] border border-slate-850 rounded-2xl px-4 py-3 shadow-xs">
                      <span className="text-[10px] text-slate-400 font-bold italic">Blessing is typing</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100" />
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200" />
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-300" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive Suggestion Chips */}
                <div className="p-4 border-t border-slate-800 bg-[#0d121c] space-y-3">
                  <span className="block text-[9px] uppercase tracking-wider font-bold text-slate-405">Popular support queries (tap to ask)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { text: 'Why is withdrawal closed?', search: 'When is withdrawal open?' },
                      { text: 'Explain dynamic returns', search: 'How do daily returns work?' },
                      { text: 'Where is my referral link?', search: 'How do I refer friends to get N500?' },
                      { text: 'How to roll over packages?', search: 'How do I compound?' }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessageToAgent(item.search)}
                        disabled={isAgentTyping}
                        className="text-[10px] px-3 py-1.5 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-800 rounded-lg text-slate-300 font-bold cursor-pointer transition-colors"
                      >
                        {item.text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessageToAgent(currentCsInput);
                  }}
                  className="p-4 bg-[#0b0e14] border-t border-slate-800 flex gap-2"
                >
                  <input
                    type="text"
                    value={currentCsInput}
                    onChange={(e) => setCurrentCsInput(e.target.value)}
                    placeholder="Type your message to Blessing..."
                    className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:bg-[#070a0f] focus:ring-2 focus:ring-blue-500 text-slate-100"
                  />
                  <button
                    type="submit"
                    disabled={!currentCsInput.trim() || isAgentTyping}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-sans transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Send <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Right Column: Support Tickets & Physical Desk details (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Official Channels Link Cards */}
                <div className="bg-[#0b0e14] border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Fast Support Hotline channels</h4>
                  
                  <div className="space-y-2.5">
                    <a 
                      href="https://t.me/DEVVERTEX" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 rounded-xl transition-all cursor-pointer group animate-fade-in"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-sky-950 text-sky-400 rounded-lg flex items-center justify-center font-bold">
                          <Send className="w-4 h-4 text-sky-450" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-100">Direct CS Telegram Desk</p>
                          <p className="text-[10px] text-slate-400 font-semibold">Immediate 1-on-1 chatting support (@DEVVERTEX)</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-450 transition-colors" />
                    </a>

                    {adminApprovalSettings.officialWhatsAppGroup && (
                      <a 
                        href={adminApprovalSettings.officialWhatsAppGroup} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 border border-emerald-900/30 bg-emerald-950/20 hover:bg-emerald-950/40 rounded-xl transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-emerald-950 border border-emerald-900/30 rounded-lg text-emerald-450 flex items-center justify-center font-bold">
                            <Share2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-100">Official WhatsApp Group</p>
                            <p className="text-[10px] text-slate-400 font-semibold">Join thousands of active shareholders live</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                      </a>
                    )}

                    <a 
                      href="https://t.me/+lXKtQC1GNbsxMzY0" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 rounded-xl transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-sky-950 rounded-lg text-sky-400 flex items-center justify-center">
                          <Send className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-100">Official Telegram Group</p>
                          <p className="text-[10px] text-slate-400 font-semibold">Join thousands of active shareholders</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-450 transition-colors" />
                    </a>

                    <a 
                      href="https://t.me/+kXjTOqAGZK1kYWJk" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 rounded-xl transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-sky-950 rounded-lg text-sky-400 flex items-center justify-center">
                          <Send className="w-4 h-4 text-sky-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-100">Official Telegram Channel</p>
                          <p className="text-[10px] text-slate-400 font-semibold">Get latest announcements & updates live</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-450 transition-colors" />
                    </a>
                  </div>
                </div>

                {/* Submit Support Ticket Card */}
                <div className="bg-[#0b0e14] border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4.5 h-4.5 text-blue-400" />
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">File a Support Ticket</h4>
                  </div>

                  {ticketSuccessInfo ? (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-xs rounded-xl font-bold space-y-2 animate-fade-in">
                      <p>{ticketSuccessInfo}</p>
                      <button 
                        onClick={() => setTicketSuccessInfo('')}
                        className="text-[10px] underline hover:text-emerald-350 font-black tracking-widest uppercase block cursor-pointer"
                      >
                        Dismiss & Create new
                      </button>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateSupportTicket(ticketCategory, ticketSubject);
                        setTicketSuccessInfo(`Ticket successfully generated! XENA financial agents will inspect Subject: "${ticketSubject}" shortly.`);
                        setTicketSubject('');
                      }}
                      className="space-y-3.5"
                    >
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Inquiry Department</label>
                        <select
                          value={ticketCategory}
                          onChange={(e) => setTicketCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-100"
                        >
                          <option value="Deposit Issue" className="bg-[#0b0e14]">Deposit Channel Delayed (Paystack/Card/Wire)</option>
                          <option value="Withdrawal Window" className="bg-[#0b0e14]">Withdrawal Window Exception (10AM - 12PM)</option>
                          <option value="Referral System" className="bg-[#0b0e14]">Referral Earnings Error (₦500 Credit)</option>
                          <option value="Investment Deployment" className="bg-[#0b0e14]">Corporate share allocation issues</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Detailed Subject</label>
                        <textarea
                          rows={2}
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          placeholder="Explain what happened with transaction or account..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:bg-[#070a0f] focus:ring-1 focus:ring-blue-500 text-slate-100"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-900/30 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Submit priority ticket request
                      </button>
                    </form>
                  )}
                </div>

                {/* Tickets History Lists */}
                <div className="bg-[#0b0e14] border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4 text-left">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">Your Ticket History</h4>
                    {selectedTicketIdForUser && (
                      <button
                        onClick={() => {
                          setSelectedTicketIdForUser(null);
                          setUserTicketReplyText('');
                        }}
                        className="text-[10px] text-slate-400 hover:text-white font-extrabold uppercase tracking-wide cursor-pointer flex items-center gap-1"
                      >
                        &larr; View All List
                      </button>
                    )}
                  </div>
                  
                  {selectedTicketIdForUser ? (() => {
                    const ticket = csTickets.find(t => t.id === selectedTicketIdForUser);
                    if (!ticket) return <p className="text-xs text-slate-450">Selected ticket not found.</p>;
                    return (
                      <div className="space-y-4 animate-fade-in text-left">
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] uppercase px-2 py-0.5 rounded-md font-bold tracking-wider ${
                              ticket.status === 'resolved'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30'
                                : 'bg-amber-950/40 text-amber-500 border border-amber-900/40'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                          <p className="text-xs font-extrabold text-slate-100">{ticket.subject}</p>
                          <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                            <span>Category: {ticket.category}</span>
                            <span>•</span>
                            <span>{new Date(ticket.date).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Message Transcript */}
                        <div className="space-y-3 max-h-[180px] overflow-y-auto p-1.5 border border-dashed border-slate-800 rounded-xl bg-slate-950/40 flex flex-col gap-2">
                          {ticket.messages && ticket.messages.map((m) => (
                            <div
                              key={m.id}
                              className={`flex flex-col max-w-[90%] ${
                                m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                              }`}
                            >
                              <span className="text-[8px] font-bold text-slate-500 mb-0.5">{m.senderName}</span>
                              <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold leading-relaxed ${
                                m.sender === 'user'
                                  ? 'bg-blue-600 text-white rounded-tr-none'
                                  : 'bg-[#0d121c] border border-slate-800 text-slate-100 rounded-tl-none'
                              }`}>
                                {m.text}
                              </div>
                              <span className="text-[7px] text-slate-400 mt-0.5 font-mono">{new Date(m.date).toLocaleTimeString()}</span>
                            </div>
                          ))}
                          {(!ticket.messages || ticket.messages.length === 0) && (
                            <p className="text-center text-[10px] text-slate-450 py-3 font-semibold italic">No messages registered yet.</p>
                          )}
                        </div>

                        {/* Interactive Reply form */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!userTicketReplyText.trim()) return;
                            handleUserReplyToTicket(ticket.id, userTicketReplyText);
                            setUserTicketReplyText('');
                          }}
                          className="flex gap-2"
                        >
                          <input
                            type="text"
                            value={userTicketReplyText}
                            onChange={(e) => setUserTicketReplyText(e.target.value)}
                            placeholder="Type response to support advisor..."
                            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:bg-[#070a0f] focus:ring-1 focus:ring-blue-500 text-slate-100"
                          />
                          <button
                            type="submit"
                            disabled={!userTicketReplyText.trim()}
                            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 text-xs font-black uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                          >
                            Send <Send className="w-3 h-3" />
                          </button>
                        </form>
                      </div>
                    );
                  })() : (
                    <div className="space-y-2 divide-y divide-slate-800 max-h-[300px] overflow-y-auto pr-1">
                      {csTickets.filter(t => t.userEmail && t.userEmail.toLowerCase() === wallet.email.toLowerCase()).length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400 font-bold italic">
                          No active priority tickets generated yet.
                        </div>
                      ) : (
                        csTickets
                          .filter(t => t.userEmail && t.userEmail.toLowerCase() === wallet.email.toLowerCase())
                          .map((t, index) => (
                            <div
                              key={t.id}
                              onClick={() => {
                                setSelectedTicketIdForUser(t.id);
                                setUserTicketReplyText('');
                              }}
                              className="pt-2 first:pt-0 space-y-1 cursor-pointer hover:bg-slate-900/60 p-2 rounded-xl transition-all border border-transparent hover:border-slate-800"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-black text-slate-500">{t.id}</span>
                                <span className={`text-[9px] uppercase px-2 py-0.5 rounded-md font-bold tracking-wider ${
                                  t.status === 'resolved'
                                    ? 'bg-emerald-950 text-emerald-450 border border-emerald-900/30'
                                    : 'bg-amber-950/40 text-amber-500 border border-amber-900/40 animate-pulse'
                                }`}>
                                  {t.status}
                                </span>
                              </div>
                              <h5 className="text-xs font-extrabold text-white leading-tight block">{t.subject}</h5>
                              <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                  <span>{t.category}</span>
                                  <span>•</span>
                                  <span>{new Date(t.date).toLocaleDateString()}</span>
                                </div>
                                <span className="text-blue-400 underline font-black text-[8px] tracking-wide uppercase">Open Chat &rarr;</span>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProfileView
              wallet={wallet}
              onUpdateProfile={handleUpdateUserWalletByAdmin}
              simulatedTime={simulatedTime}
              adminApprovalSettings={adminApprovalSettings}
              registeredUsers={registeredUsers}
              referralsList={referrals}
              onLogout={handleLogout}
            />
          </motion.div>
        )}

         {activeTab === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <AdminPortal
              transactions={transactions}
              activeInvestments={activeInvestments}
              wallet={wallet}
              simulatedTime={simulatedTime}
              adminApprovalSettings={adminApprovalSettings}
              onSaveSettings={(settings) => setAdminApprovalSettings({
                requireDepositApproval: settings.requireDepositApproval,
                requireInvestmentApproval: settings.requireInvestmentApproval,
                requireWithdrawalApproval: settings.requireWithdrawalApproval,
                customReferralLink: settings.customReferralLink || '',
                isReferralLinkStatic: !!settings.isReferralLinkStatic,
                csNumber: settings.csNumber || '08158432605',
                officialWhatsAppGroup: settings.officialWhatsAppGroup || 'https://chat.whatsapp.com/KHZgCi1h24154DqIIHz3VE',
                minReferralWithdrawal: Number(settings.minReferralWithdrawal) || 5000,
                allowAnytimeWithdrawal: !!settings.allowAnytimeWithdrawal
              })}
              onApproveDeposit={handleApproveDeposit}
              onDeclineDeposit={handleDeclineDeposit}
              onApproveWithdrawal={handleApproveWithdrawal}
              onDeclineWithdrawal={handleDeclineWithdrawal}
              onApproveInvestment={handleApproveInvestment}
              onDeclineInvestment={handleDeclineInvestment}
              onUpdateUserWallet={handleUpdateUserWalletByAdmin}
              onAdminUpdateSpecificUser={handleUpdateSpecificUser}
              registeredUsers={registeredUsers}
              onSelectUser={handleSelectUser}
              onDeleteUser={handleDeleteUser}
              depositAccounts={depositAccounts}
              onAddDepositAccount={handleAddDepositAccount}
              onRemoveDepositAccount={handleRemoveDepositAccount}
              onToggleDepositAccount={handleToggleDepositAccount}
              csTickets={csTickets}
              onReplyToTicket={handleReplyToTicket}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              userChatThreads={userChatThreads}
              onSendAdminChat={handleSendAdminChatBySupervisor}
              referralsList={referrals}
              onApproveReferral={handleApproveReferral}
              onDeclineReferral={handleDeclineReferral}
              bonusCodes={bonusCodes}
              onAddBonusCode={handleAddBonusCode}
              onDeleteBonusCode={handleDeleteBonusCode}
            />
          </motion.div>
        )}

      </main>

      {/* Global banking/deposit drawer */}
      <DepositWithdrawModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        walletBalance={wallet.walletBalance}
        onConfirm={handleConfirmDepositWithdraw}
        simulatedTime={simulatedTime}
        wallet={wallet}
        depositAccounts={depositAccounts}
        registeredUsers={registeredUsers}
        transactions={transactions}
        adminApprovalSettings={adminApprovalSettings}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        simulatedTime={simulatedTime}
        onRegisterSuccess={handleRegisterSuccess}
      />

      <PromoReferralModal
        isOpen={showPromoModal}
        onClose={() => {
          setShowPromoModal(false);
          setShowWelcomeModal(true);
        }}
        wallet={wallet}
        adminApprovalSettings={adminApprovalSettings}
      />

      <WelcomeXenaModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        hasActiveInvestments={activeInvestments.length > 0}
      />

      {/* Premium Floating Bottom Navigation Dock (Visible on Desktop & Mobile) */}
      <div className="fixed bottom-0 sm:bottom-6 left-0 sm:left-1/2 sm:-translate-x-1/2 w-full sm:max-w-2xl bg-[#0c1222]/98 backdrop-blur-lg border-t sm:border border-slate-700/80 z-50 px-1.5 sm:px-4 py-2 sm:py-3 shadow-[0_12px_45px_rgba(0,0,0,0.9),0_0_25px_rgba(99,102,241,0.22)] sm:rounded-2xl overflow-x-auto scrollbar-none">
        <div className="flex justify-between sm:justify-around items-center min-w-max sm:min-w-0 w-full gap-1 sm:gap-2 px-1">
          {[
            { name: 'Portfolio', id: 'dashboard', icon: Landmark },
            { name: 'Shares', id: 'invest', icon: Compass },
            { name: 'Wallet', id: 'crypto', icon: Wallet },
            { name: 'Simulator', id: 'simulator', icon: TrendingUp },
            { name: 'Profile', id: 'profile', icon: User },
            { name: 'Support', id: 'cs', icon: Headphones },
            ...(isAdmin ? [{ name: 'Admin', id: 'admin', icon: ShieldCheck }] : [])
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`mobile-tab-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex-1 sm:flex-initial flex flex-col items-center gap-1 py-1 px-2.5 sm:px-4 rounded-xl transition-all cursor-pointer border text-center group whitespace-nowrap ${
                  isActive 
                    ? 'bg-indigo-550/15 border-indigo-500/40 text-cyan-400 shadow-[0_0_12px_rgba(99,102,241,0.25)]' 
                    : 'border-transparent text-slate-250 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform ${isActive ? 'text-cyan-450 scale-110 drop-shadow-[0_0_5px_rgba(34,211,238,0.7)]' : 'text-slate-300 group-hover:text-white'}`} />
                <span className={`text-[7.5px] sm:text-[9.5px] uppercase tracking-wider font-extrabold mt-0.5 ${isActive ? 'text-cyan-300' : 'text-slate-400 font-bold'}`}>
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
