import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coins, 
  Zap, 
  RefreshCw, 
  TrendingUp, 
  ArrowRight, 
  Shield, 
  Copy, 
  Check, 
  CheckCircle, 
  Info,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Link,
  Lock,
  Compass,
  User,
  Users,
  Search,
  Send,
  History,
  Activity,
  Wallet,
  QrCode,
  Eye,
  EyeOff,
  ChevronRight,
  Scan,
  X
} from 'lucide-react';
import { UserWallet, Transaction } from '../types';
import { formatNGN, generateRef } from '../utils';
import QrCodeDisplay from './QrCodeDisplay';
import QrCodeScannerModal from './QrCodeScannerModal';
import { 
  AreaChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Area, 
  ResponsiveContainer
} from 'recharts';

// Conversion weights in Naira (NGN)
const ASSET_WEIGHTS = {
  NGN: 1,
  XNC: 45,         // 1 XNC = ₦45
  USDT: 1500,      // 1 USDT = ₦1,500
  SOL: 130000,     // 1 SOL = ₦130,000
  BNB: 920000,     // 1 BNB = ₦920,000
  ETH: 5200000,    // 1 ETH = ₦5,200,000
  BTC: 145000000   // 1 BTC = ₦145,000,000
};

type AssetCode = keyof typeof ASSET_WEIGHTS;

const ASSET_LABELS: Record<AssetCode, string> = {
  NGN: 'Naira Portfolio Cash',
  XNC: 'XENA Coin (Alpha Native)',
  USDT: 'Tether USD (Dollar Stable)',
  SOL: 'Solana (High-Speed L1)',
  BNB: 'BNB (Binance Smart Chain)',
  ETH: 'Ethereum (Ether L1)',
  BTC: 'Bitcoin (Digital Gold)'
};

const ASSET_SYMBOLS: Record<AssetCode, string> = {
  NGN: '₦',
  XNC: 'XNC',
  USDT: 'USDT',
  SOL: 'SOL',
  BNB: 'BNB',
  ETH: 'ETH',
  BTC: 'BTC'
};

const ASSET_TRENDS: Record<AssetCode, { change: string; isPositive: boolean }> = {
  NGN: { change: 'Stable', isPositive: true },
  XNC: { change: '+18.42%', isPositive: true },
  USDT: { change: '+0.03%', isPositive: true },
  SOL: { change: '+5.81%', isPositive: true },
  BNB: { change: '+1.12%', isPositive: true },
  ETH: { change: '-1.82%', isPositive: false },
  BTC: { change: '+4.25%', isPositive: true }
};

interface CryptoSwapSectionProps {
  wallet: UserWallet;
  registeredUsers: UserWallet[];
  onUpdateUserWallet: (updates: Partial<UserWallet>) => void;
  onUpdateSpecificUser: (email: string, updates: Partial<UserWallet>) => void;
  onAddTransaction: (txn: Transaction) => void;
}

export default function CryptoSwapSection({ 
  wallet, 
  registeredUsers,
  onUpdateUserWallet, 
  onUpdateSpecificUser,
  onAddTransaction 
}: CryptoSwapSectionProps) {
  
  const userUid = wallet.uid || `XENA-${wallet.referralCode?.split('-').pop() || '49104'}`;

  // Wallet state
  const [showBalances, setShowBalances] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'swap' | 'p2p' | 'receive'>('overview');
  const [selectedAsset, setSelectedAsset] = useState<AssetCode>('XNC');
  const [timeframe, setTimeframe] = useState<'24H' | '7D' | '1M'>('7D');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Swap Form States
  const [fromAsset, setFromAsset] = useState<AssetCode>('NGN');
  const [toAsset, setToAsset] = useState<AssetCode>('XNC');
  const [fromAmount, setFromAmount] = useState<number>(5000);
  const [toAmount, setToAmount] = useState<number>(5000 / 45);
  const [swapStep, setSwapStep] = useState<'idle' | 'broadcasting' | 'validating' | 'settling' | 'success'>('idle');
  const [successInfo, setSuccessInfo] = useState<string>('');

  // P2P Form States
  const [p2pTransferAsset, setP2pTransferAsset] = useState<AssetCode>('XNC');
  const [p2pUid, setP2pUid] = useState<string>('');
  const [p2pAmount, setP2pAmount] = useState<string>('');
  const [searchedUser, setSearchedUser] = useState<UserWallet | null>(null);
  const [p2pSearchError, setP2pSearchError] = useState<string>('');
  const [p2pTransferStep, setP2pTransferStep] = useState<'idle' | 'transmitting' | 'success'>('idle');
  const [p2pSuccessMsg, setP2pSuccessMsg] = useState<string>('');
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [showMyQrModal, setShowMyQrModal] = useState<boolean>(false);

  // Asset Context Modal (Mobile Action Drawer)
  const [activeAssetDrawer, setActiveAssetDrawer] = useState<AssetCode | null>(null);

  // Dynamic Address generation based on User UID for realism
  const addresses: Record<AssetCode, string> = {
    NGN: 'NUBAN-' + wallet.accountNumber.split('|')[0],
    XNC: 'xen_v2_' + userUid.toLowerCase() + 'bfef94ef',
    USDT: 'usdt_trc20_' + userUid.toLowerCase() + 'bb7201c1',
    SOL: 'sol_spl_' + userUid.toLowerCase() + '7f294efa',
    BNB: 'bsc_bep20_' + userUid.toLowerCase() + 'cc2379ff',
    ETH: 'eth_erc20_' + userUid.toLowerCase() + '00d11fca',
    BTC: 'btc_segwit_' + userUid.toLowerCase() + '99b2e04f'
  };

  // Live updated Balances mapping
  const balances: Record<AssetCode, number> = {
    NGN: wallet.walletBalance,
    XNC: wallet.xenaBalance || 0,
    SOL: wallet.solBalance || 0,
    BTC: wallet.btcBalance || 0,
    ETH: wallet.ethBalance || 0,
    USDT: wallet.usdtBalance || 0,
    BNB: wallet.bnbBalance || 0
  };

  const totalPortfolioValueNaira = Object.keys(balances).reduce((sum, key) => {
    const asset = key as AssetCode;
    return sum + (balances[asset] * ASSET_WEIGHTS[asset]);
  }, 0);

  // Mock pricing charts for all coins
  const chartDataMap: Record<AssetCode, Record<'24H' | '7D' | '1M', { time: string; price: number }[]>> = {
    NGN: {
      '24H': [{ time: '00:00', price: 1 }, { time: '12:00', price: 1 }, { time: '20:00', price: 1 }],
      '7D': [{ time: 'Mon', price: 1 }, { time: 'Wed', price: 1 }, { time: 'Sun', price: 1 }],
      '1M': [{ time: 'Wk 1', price: 1 }, { time: 'Wk 2', price: 1 }, { time: 'Wk 4', price: 1 }]
    },
    XNC: {
      '24H': [
        { time: '00:00', price: 38.0 },
        { time: '04:00', price: 39.5 },
        { time: '08:00', price: 41.2 },
        { time: '12:00', price: 40.5 },
        { time: '16:00', price: 43.1 },
        { time: '20:00', price: 45.0 }
      ],
      '7D': [
        { time: 'Mon', price: 36.0 },
        { time: 'Tue', price: 38.5 },
        { time: 'Wed', price: 37.8 },
        { time: 'Thu', price: 41.0 },
        { time: 'Fri', price: 43.5 },
        { time: 'Sat', price: 44.0 },
        { time: 'Sun', price: 45.0 }
      ],
      '1M': [
        { time: 'Week 1', price: 28.5 },
        { time: 'Week 2', price: 34.0 },
        { time: 'Week 3', price: 40.5 },
        { time: 'Week 4', price: 45.0 }
      ]
    },
    SOL: {
      '24H': [
        { time: '00:00', price: 122000 },
        { time: '04:00', price: 124500 },
        { time: '08:00', price: 123000 },
        { time: '12:00', price: 126900 },
        { time: '16:00', price: 128500 },
        { time: '20:00', price: 130000 }
      ],
      '7D': [
        { time: 'Mon', price: 121000 },
        { time: 'Tue', price: 123800 },
        { time: 'Wed', price: 122500 },
        { time: 'Thu', price: 125900 },
        { time: 'Fri', price: 127505 },
        { time: 'Sat', price: 128900 },
        { time: 'Sun', price: 130000 }
      ],
      '1M': [
        { time: 'Week 1', price: 110000 },
        { time: 'Week 2', price: 118000 },
        { time: 'Week 3', price: 124000 },
        { time: 'Week 4', price: 130000 }
      ]
    },
    BTC: {
      '24H': [
        { time: '00:00', price: 141000000 },
        { time: '04:00', price: 143200000 },
        { time: '08:00', price: 142500000 },
        { time: '12:00', price: 144100000 },
        { time: '16:00', price: 143900000 },
        { time: '20:00', price: 145000000 }
      ],
      '7D': [
        { time: 'Mon', price: 138000000 },
        { time: 'Tue', price: 140500000 },
        { time: 'Wed', price: 139800000 },
        { time: 'Thu', price: 142000000 },
        { time: 'Fri', price: 144500000 },
        { time: 'Sat', price: 143800000 },
        { time: 'Sun', price: 145000000 }
      ],
      '1M': [
        { time: 'Week 1', price: 132000000 },
        { time: 'Week 2', price: 136500000 },
        { time: 'Week 3', price: 141000000 },
        { time: 'Week 4', price: 145000000 }
      ]
    },
    ETH: {
      '24H': [
        { time: '00:00', price: 5350000 },
        { time: '04:00', price: 5310000 },
        { time: '08:00', price: 5280050 },
        { time: '12:00', price: 5240000 },
        { time: '16:00', price: 5210000 },
        { time: '20:00', price: 5200000 }
      ],
      '7D': [
        { time: 'Mon', price: 5480000 },
        { time: 'Tue', price: 5390000 },
        { time: 'Wed', price: 5410000 },
        { time: 'Thu', price: 5300000 },
        { time: 'Fri', price: 5250000 },
        { time: 'Sat', price: 5220000 },
        { time: 'Sun', price: 5200000 }
      ],
      '1M': [
        { time: 'Week 1', price: 5650000 },
        { time: 'Week 2', price: 5480000 },
        { time: 'Week 3', price: 5350000 },
        { time: 'Week 4', price: 5200000 }
      ]
    },
    USDT: {
      '24H': [
        { time: '00:00', price: 1498 },
        { time: '08:00', price: 1502 },
        { time: '16:00', price: 1500 },
        { time: '20:00', price: 1500 }
      ],
      '7D': [
        { time: 'Mon', price: 1495 },
        { time: 'Wed', price: 1502 },
        { time: 'Fri', price: 1500 },
        { time: 'Sun', price: 1500 }
      ],
      '1M': [
        { time: 'Week 1', price: 1485 },
        { time: 'Week 2', price: 1495 },
        { time: 'Week 3', price: 1510 },
        { time: 'Week 4', price: 1500 }
      ]
    },
    BNB: {
      '24H': [
        { time: '00:00', price: 908000 },
        { time: '04:00', price: 914000 },
        { time: '08:00', price: 912000 },
        { time: '12:00', price: 918000 },
        { time: '16:00', price: 916000 },
        { time: '20:00', price: 920000 }
      ],
      '7D': [
        { time: 'Mon', price: 898000 },
        { time: 'Tue', price: 905000 },
        { time: 'Wed', price: 901000 },
        { time: 'Thu', price: 912000 },
        { time: 'Fri', price: 918000 },
        { time: 'Sat', price: 915000 },
        { time: 'Sun', price: 920000 }
      ],
      '1M': [
        { time: 'Week 1', price: 852000 },
        { time: 'Week 2', price: 885000 },
        { time: 'Week 3', price: 908000 },
        { time: 'Week 4', price: 920000 }
      ]
    }
  };

  // Synchronize Swap output amount dynamically
  useEffect(() => {
    const fromWeight = ASSET_WEIGHTS[fromAsset];
    const toWeight = ASSET_WEIGHTS[toAsset];
    const inNaira = fromAmount * fromWeight;
    const result = inNaira / toWeight;
    setToAmount(Number(result.toFixed(6)));
  }, [fromAmount, fromAsset, toAsset]);

  const handlePercentageClick = (pct: number) => {
    const balance = balances[fromAsset];
    const amount = balance * pct;
    const rounded = Math.floor(amount * 10000) / 10000;
    setFromAmount(rounded);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleFlippedAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
  };

  // Perform Swap Action
  const executeSwap = () => {
    const userBalance = balances[fromAsset];
    if (fromAmount > userBalance) {
      alert(`Insufficient ${fromAsset} balance. You currently have ${ASSET_SYMBOLS[fromAsset]}${userBalance.toLocaleString('en-US', { maximumFractionDigits: 6 })} available.`);
      return;
    }
    if (fromAmount <= 0) {
      alert("Please specify a validation amount greater than zero.");
      return;
    }
    if (fromAsset === toAsset) {
      alert("Source and destination assets cannot be identical.");
      return;
    }

    setSwapStep('broadcasting');

    setTimeout(() => {
      setSwapStep('validating');
      setTimeout(() => {
        setSwapStep('settling');
        setTimeout(() => {
          const nextFromBalance = userBalance - fromAmount;
          const nextToBalance = balances[toAsset] + toAmount;

          const updates: Partial<UserWallet> = {};
          
          if (fromAsset === 'NGN') updates.walletBalance = nextFromBalance;
          else if (fromAsset === 'XNC') updates.xenaBalance = nextFromBalance;
          else if (fromAsset === 'SOL') updates.solBalance = nextFromBalance;
          else if (fromAsset === 'BTC') updates.btcBalance = nextFromBalance;
          else if (fromAsset === 'ETH') updates.ethBalance = nextFromBalance;
          else if (fromAsset === 'USDT') updates.usdtBalance = nextFromBalance;
          else if (fromAsset === 'BNB') updates.bnbBalance = nextFromBalance;

          if (toAsset === 'NGN') updates.walletBalance = nextToBalance;
          else if (toAsset === 'XNC') updates.xenaBalance = nextToBalance;
          else if (toAsset === 'SOL') updates.solBalance = nextToBalance;
          else if (toAsset === 'BTC') updates.btcBalance = nextToBalance;
          else if (toAsset === 'ETH') updates.ethBalance = nextToBalance;
          else if (toAsset === 'USDT') updates.usdtBalance = nextToBalance;
          else if (toAsset === 'BNB') updates.bnbBalance = nextToBalance;

          onUpdateUserWallet(updates);

          // Add Transaction record
          const amountInNaira = fromAmount * ASSET_WEIGHTS[fromAsset];
          onAddTransaction({
            id: 'TXN-' + generateRef(),
            type: 'swap',
            amount: amountInNaira,
            status: 'completed',
            date: Date.now(),
            reference: 'SWAP-' + generateRef().slice(0, 8),
            description: `Swapped ${fromAmount.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${fromAsset} for ${toAmount.toLocaleString('en-US', { maximumFractionDigits: 6 })} ${toAsset} on XENA Brokerage.`,
            userEmail: wallet.email
          });

          // Log corporate broker execution live
          setGlobalSwaps(prev => [
            {
              id: String(Date.now()),
              hash: '0x' + generateRef().slice(0, 8).toLowerCase() + '...ee19',
              from: fromAsset,
              to: toAsset,
              value: formatNGN(amountInNaira),
              amount: `${toAmount.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${toAsset}`,
              time: 'Just now',
              block: 2014521
            },
            ...prev
          ]);

          setSuccessInfo(`Perfect! Swap settled. Credited ${toAmount.toLocaleString('en-US', { maximumFractionDigits: 6 })} ${toAsset} to your secure wallet storage.`);
          setSwapStep('success');
        }, 1200);
      }, 1000);
    }, 1000);
  };

  // Search recipient sibling shareholder
  const handleSearchRecipientByUid = () => {
    setP2pSearchError('');
    setSearchedUser(null);
    const query = p2pUid.trim().toUpperCase();

    if (!query) {
      setP2pSearchError('Please fill in a verified ledger UID.');
      return;
    }

    if (query === userUid.toUpperCase()) {
      setP2pSearchError('P2P transfers to your own active UID are restricted.');
      return;
    }

    const found = registeredUsers.find(
      (u) => (u.uid || '').toUpperCase() === query
    );

    if (found) {
      setSearchedUser(found);
    } else {
      setP2pSearchError(`UID code "${query}" does not match any registered investor account.`);
    }
  };

  // Perform multi-coin P2P Send Transfer
  const handleExecuteP2pTransfer = () => {
    if (!searchedUser) return;
    const amountNum = Number(p2pAmount);

    if (isNaN(amountNum) || amountNum <= 0) {
      alert(`Please input a valid ${p2pTransferAsset} transfer amount larger than 0.`);
      return;
    }

    const senderBalance = balances[p2pTransferAsset];
    if (amountNum > senderBalance) {
      alert(`Insufficient ${p2pTransferAsset} balance. Your current portfolio holding is ${senderBalance} ${p2pTransferAsset}.`);
      return;
    }

    setP2pTransferStep('transmitting');

    setTimeout(() => {
      const nextSenderBal = senderBalance - amountNum;
      
      // Compute recipient balance field safely
      let recipientCurrentBal = 0;
      if (p2pTransferAsset === 'NGN') recipientCurrentBal = searchedUser.walletBalance || 0;
      else if (p2pTransferAsset === 'XNC') recipientCurrentBal = searchedUser.xenaBalance || 0;
      else if (p2pTransferAsset === 'SOL') recipientCurrentBal = searchedUser.solBalance || 0;
      else if (p2pTransferAsset === 'BTC') recipientCurrentBal = searchedUser.btcBalance || 0;
      else if (p2pTransferAsset === 'ETH') recipientCurrentBal = searchedUser.ethBalance || 0;
      else if (p2pTransferAsset === 'USDT') recipientCurrentBal = searchedUser.usdtBalance || 0;
      else if (p2pTransferAsset === 'BNB') recipientCurrentBal = searchedUser.bnbBalance || 0;

      const nextReceiverBal = recipientCurrentBal + amountNum;

      // Prepare updates
      const senderUpdates: Partial<UserWallet> = {};
      const receiverUpdates: Partial<UserWallet> = {};

      if (p2pTransferAsset === 'NGN') {
        senderUpdates.walletBalance = nextSenderBal;
        receiverUpdates.walletBalance = nextReceiverBal;
      } else if (p2pTransferAsset === 'XNC') {
        senderUpdates.xenaBalance = nextSenderBal;
        receiverUpdates.xenaBalance = nextReceiverBal;
      } else if (p2pTransferAsset === 'SOL') {
        senderUpdates.solBalance = nextSenderBal;
        receiverUpdates.solBalance = nextReceiverBal;
      } else if (p2pTransferAsset === 'BTC') {
        senderUpdates.btcBalance = nextSenderBal;
        receiverUpdates.btcBalance = nextReceiverBal;
      } else if (p2pTransferAsset === 'ETH') {
        senderUpdates.ethBalance = nextSenderBal;
        receiverUpdates.ethBalance = nextReceiverBal;
      } else if (p2pTransferAsset === 'USDT') {
        senderUpdates.usdtBalance = nextSenderBal;
        receiverUpdates.usdtBalance = nextReceiverBal;
      } else if (p2pTransferAsset === 'BNB') {
        senderUpdates.bnbBalance = nextSenderBal;
        receiverUpdates.bnbBalance = nextReceiverBal;
      }

      // Update local wallet
      onUpdateUserWallet(senderUpdates);

      // Update target user
      onUpdateSpecificUser(searchedUser.email, receiverUpdates);

      const nairaEquiv = amountNum * ASSET_WEIGHTS[p2pTransferAsset];
      
      // Save sender txn record
      onAddTransaction({
        id: 'TXN-' + generateRef(),
        type: 'withdraw',
        amount: nairaEquiv,
        status: 'completed',
        date: Date.now(),
        reference: 'WIRE-' + generateRef().slice(0, 8),
        description: `Completed instant P2P transfer of ${amountNum} ${p2pTransferAsset} to shareholder ${searchedUser.fullName} (${searchedUser.uid})`,
        userEmail: wallet.email
      });

      // Add to live orders log
      setGlobalSwaps(prev => [
        {
          id: String(Date.now()),
          hash: '0x' + generateRef().slice(0, 8).toLowerCase() + '...4bb4',
          from: p2pTransferAsset,
          to: 'UID_TRANSFER',
          value: formatNGN(nairaEquiv),
          amount: `${amountNum} ${p2pTransferAsset} to ${searchedUser.uid}`,
          time: 'Just now',
          block: 2014522
        },
        ...prev
      ]);

      setP2pSuccessMsg(`Dispatched ${amountNum} ${p2pTransferAsset} securely via XENA ledger mesh to ${searchedUser.fullName}.`);
      setP2pTransferStep('success');
    }, 1500);
  };

  // Mock global orders block feed for high-fidelity interactive simulation
  const [globalSwaps, setGlobalSwaps] = useState([
    { id: '1', hash: '0x3bf5...2a91', from: 'NGN', to: 'XNC', value: '₦45,000', amount: '1,000 XNC', time: '1m ago', block: 2014491 },
    { id: '2', hash: '0xa419...f788', from: 'SOL', to: 'XNC', value: '0.15 SOL', amount: '433 XNC', time: '4m ago', block: 2014488 },
    { id: '3', hash: '0x992c...e810', from: 'XNC', to: 'NGN', value: '500 XNC', amount: '₦22,500', time: '12m ago', block: 2014474 },
    { id: '4', hash: '0xc112...009a', from: 'BTC', to: 'XNC', value: '0.0003 BTC', amount: '960 XNC', time: '18m ago', block: 2014469 },
    { id: '5', hash: '0xfa11...bc21', from: 'ETH', to: 'USDT', value: '0.02 ETH', amount: '69.3 USDT', time: '25m ago', block: 2014460 }
  ]);

  // Asset Row click options handler
  const handleAssetRowClick = (asset: AssetCode) => {
    setActiveAssetDrawer(asset);
  };

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto font-sans">
      
      {/* 1. Header Portfolio Balance Display Card (High-end Glassmorphism) */}
      <div className="bg-[#0b0e14] border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/5 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <p className="text-[10px] text-blue-400 uppercase font-mono font-black tracking-widest">
                XENA SECURED CLIENT VAULT
              </p>
            </div>
            
            <span className="text-xs text-slate-400 font-bold block">Grand Portfolio Net Worth</span>
            
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-white font-mono tracking-tight">
                {showBalances ? formatNGN(totalPortfolioValueNaira) : '₦ ••••••••'}
              </span>
              <button 
                onClick={() => setShowBalances(!showBalances)}
                className="text-slate-400 hover:text-white transition-all p-1.5 rounded-lg bg-slate-900 border border-slate-800"
                title="Toggle Visibility"
              >
                {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1.5 p-1.5 px-3 bg-slate-900/60 border border-slate-800 rounded-xl w-fit">
              <span className="text-[10px] text-slate-400 font-mono font-bold">XENA SHAREHOLDER ID:</span>
              <strong className="text-xs text-blue-400 font-mono font-black uppercase tracking-wider">{userUid}</strong>
              <button
                onClick={() => handleCopy(userUid)}
                className="p-1 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[9px] font-mono font-extrabold uppercase bg-slate-950 border border-slate-800 hover:border-slate-700 rounded px-1.5 ml-1"
                title="Copy Shareholder ID"
              >
                {copiedAddress === userUid ? (
                  <>
                    <Check className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="text-blue-400 text-[8.5px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 shrink-0" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick round buttons for instant sub-selection (highly mobile-friendly layout) */}
          <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-sm w-full font-sans">
            <button
              onClick={() => { setActiveTab('overview'); }}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600/10 border-blue-500/40 text-blue-400'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-[9.5px] font-black uppercase tracking-wider">Balances</span>
            </button>

            <button
              onClick={() => { setActiveTab('swap'); }}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'swap'
                  ? 'bg-blue-600/10 border-blue-500/40 text-blue-400'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-455 text-amber-400">
                <RefreshCw className="w-4 h-4" />
              </div>
              <span className="text-[9.5px] font-black uppercase tracking-wider">Swap</span>
            </button>

            <button
              onClick={() => { setActiveTab('p2p'); }}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'p2p'
                  ? 'bg-blue-600/10 border-blue-500/40 text-blue-400'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                <Send className="w-4 h-4" />
              </div>
              <span className="text-[9.5px] font-black uppercase tracking-wider">Transfer</span>
            </button>

            <button
              onClick={() => { setActiveTab('receive'); }}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'receive'
                  ? 'bg-blue-600/10 border-blue-500/40 text-blue-400'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="text-[9.5px] font-black uppercase tracking-wider">Deposit</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Responsive Content Container */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW SUB-TAB: Interactive Mobile Coin Balances List (The Wallet) */}
            {activeTab === 'overview' && (
              <motion.div
                key="tab-overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    My Wallet Assets
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono font-semibold">
                    7 Assets Supported
                  </span>
                </div>

                {/* Coin Balances List Container (Trust Wallet Feel) */}
                <div className="bg-[#0b0e14] border border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-850/60 shadow-lg">
                  {(['XNC', 'BTC', 'ETH', 'SOL', 'BNB', 'USDT', 'NGN'] as AssetCode[]).map((asset) => {
                    const sym = ASSET_SYMBOLS[asset];
                    const label = ASSET_LABELS[asset];
                    const trend = ASSET_TRENDS[asset];
                    const bal = balances[asset];
                    const weightVal = ASSET_WEIGHTS[asset];
                    const valInNaira = bal * weightVal;

                    // Colored coin symbol backgrounds
                    const coinBgMap: Record<AssetCode, string> = {
                      NGN: 'bg-blue-950/80 text-blue-400 border border-blue-900/40',
                      XNC: 'bg-gradient-to-br from-indigo-900/90 to-purple-800/90 text-purple-300 border border-purple-800/50 animate-pulse',
                      BTC: 'bg-amber-950/70 text-amber-500 border border-amber-900/30',
                      ETH: 'bg-indigo-950/70 text-indigo-400 border border-indigo-900/30',
                      SOL: 'bg-sky-950/70 text-sky-400 border border-sky-900/30',
                      BNB: 'bg-yellow-950/70 text-yellow-500 border border-yellow-900/30',
                      USDT: 'bg-teal-950/70 text-teal-400 border border-teal-900/30',
                    };

                    return (
                      <div
                        key={asset}
                        onClick={() => handleAssetRowClick(asset)}
                        className="p-4 hover:bg-slate-900/40 transition-all flex items-center justify-between cursor-pointer group text-left"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {/* Coin Badge Logo */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${coinBgMap[asset]} shrink-0 font-mono text-xs`}>
                            {sym}
                          </div>
                          
                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <strong className="text-white text-xs font-black tracking-tight">{asset}</strong>
                              
                              {/* Highlight XENA Native Token */}
                              {asset === 'XNC' && (
                                <span className="text-[8px] font-black uppercase text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.2 rounded-md font-mono tracking-widest scale-90">
                                  Native
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold truncate block max-w-[150px] md:max-w-none">
                              {label}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Sparklines or Prices & balance */}
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-white font-mono">
                            {showBalances ? `${bal.toLocaleString('en-US', { maximumFractionDigits: 6 })}` : '••••'} <span className="text-[10px] text-slate-400 font-mono font-medium">{asset}</span>
                          </p>
                          
                          <div className="flex items-center justify-end gap-1.5 mt-0.5 text-[9.5px] font-mono">
                            <span className="text-slate-450 font-bold">
                              {showBalances ? formatNGN(valInNaira) : '₦ ••••'}
                            </span>
                            <span className={`font-bold ${trend.isPositive ? 'text-blue-400' : 'text-rose-400'}`}>
                              {trend.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Quick Quick Guide */}
                <div className="p-4 bg-[#101424]/30 border border-slate-805/60 rounded-2xl text-xs space-y-1.5 leading-relaxed text-slate-300">
                  <span className="text-[8.5px] font-black text-blue-400 uppercase font-mono block">WALLET INTERACTION</span>
                  <p>
                    💡 <strong>Tip:</strong> Tap on any supported crypto asset row above to instantly trigger swap configs, show security ledger deposit addresses, or transmit multi-coin secure P2P transfers.
                  </p>
                </div>
              </motion.div>
            )}

            {/* SWAP SUB-TAB: Instant Broker Exchange Order Form */}
            {activeTab === 'swap' && (
              <motion.div
                key="tab-swap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#0b0e14] border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800/60 pb-3 mb-5">
                  Instant Sovereign Buy / Sell Swap
                </h3>

                {swapStep === 'idle' ? (
                  <div className="space-y-4">
                    
                    {/* FROM ASSET PANEL */}
                    <div className="p-4 bg-black/40 border border-slate-800/80 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold">From (Sold Asset)</span>
                        <span className="text-slate-500 font-mono font-medium">
                          Available: <strong className="text-slate-200">{balances[fromAsset].toLocaleString('en-US', { maximumFractionDigits: 6 })} {fromAsset}</strong>
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <input
                          type="number"
                          min="0.000001"
                          step="any"
                          value={fromAmount}
                          onChange={(e) => setFromAmount(Number(e.target.value))}
                          className="bg-transparent text-white font-black font-mono text-xl focus:outline-hidden flex-1 w-20"
                          placeholder="0.00"
                        />

                        {/* Dropdown Selection for From Asset */}
                        <select
                          value={fromAsset}
                          onChange={(e) => {
                            const val = e.target.value as AssetCode;
                            setFromAsset(val);
                            if (val === toAsset) {
                              setToAsset(val === 'XNC' ? 'NGN' : 'XNC');
                            }
                          }}
                          className="bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs font-mono font-black focus:outline-hidden"
                        >
                          {(['NGN', 'XNC', 'SOL', 'BTC', 'ETH', 'USDT', 'BNB'] as AssetCode[]).map((coin) => (
                            <option key={coin} value={coin} className="bg-[#0b0e14]">{coin}</option>
                          ))}
                        </select>
                      </div>

                      {/* Percentage slider shortcuts */}
                      <div className="flex gap-2 pt-1 text-[8.5px] font-black font-mono">
                        <button onClick={() => handlePercentageClick(0.1)} className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded hover:text-white hover:bg-slate-800 transition-all cursor-pointer">10%</button>
                        <button onClick={() => handlePercentageClick(0.25)} className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded hover:text-white hover:bg-slate-800 transition-all cursor-pointer">25%</button>
                        <button onClick={() => handlePercentageClick(0.5)} className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded hover:text-white hover:bg-slate-800 transition-all cursor-pointer">50%</button>
                        <button onClick={() => handlePercentageClick(1.0)} className="px-3 py-1 bg-blue-500/10 text-blue-405 border border-blue-500/20 rounded hover:bg-blue-500/20 hover:text-white transition-all cursor-pointer">MAX</button>
                      </div>
                    </div>

                    {/* Flipped Arrow Button */}
                    <div className="flex justify-center -my-3 relative z-10">
                      <button 
                        onClick={handleFlippedAssets}
                        className="p-3 bg-[#101424] hover:bg-[#1a203c] border border-slate-800 text-blue-400 rounded-full cursor-pointer shadow-lg transition-all active:scale-95"
                        title="Flip Direction"
                      >
                        <RefreshCw className="w-4 h-4 font-black" />
                      </button>
                    </div>

                    {/* TO ASSET PANEL */}
                    <div className="p-4 bg-black/40 border border-slate-800/80 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold">To (Acquired Asset)</span>
                        <span className="text-slate-500 font-mono font-medium">
                          Available: <strong className="text-slate-200">{balances[toAsset].toLocaleString('en-US', { maximumFractionDigits: 6 })} {toAsset}</strong>
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-white font-black font-mono text-xl select-all">
                          {toAmount.toLocaleString('en-US', { maximumFractionDigits: 6 })}
                        </span>

                        {/* Dropdown Selection for To Asset */}
                        <select
                          value={toAsset}
                          onChange={(e) => {
                            const val = e.target.value as AssetCode;
                            setToAsset(val);
                            if (val === fromAsset) {
                              setFromAsset(val === 'XNC' ? 'NGN' : 'XNC');
                            }
                          }}
                          className="bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs font-mono font-black focus:outline-hidden"
                        >
                          {(['NGN', 'XNC', 'SOL', 'BTC', 'ETH', 'USDT', 'BNB'] as AssetCode[]).map((coin) => (
                            <option key={coin} value={coin} className="bg-[#0b0e14]">{coin}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Swap calculations breakdown bill */}
                    <div className="p-4 bg-[#101424]/40 border border-slate-800/60 rounded-2xl text-[11px] space-y-2">
                      <span className="text-[8.5px] font-black text-blue-400 uppercase font-mono block">STABLE RATE INDEX</span>
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-500">Benchmark Quote:</span>
                        <span className="font-mono text-slate-300">1 {fromAsset} = {((ASSET_WEIGHTS[fromAsset]) / ASSET_WEIGHTS[toAsset]).toLocaleString('en-US', { maximumFractionDigits: 6 })} {toAsset}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-500">Naira Value Equivalent:</span>
                        <span className="font-mono text-slate-305">{formatNGN(fromAmount * ASSET_WEIGHTS[fromAsset])}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-500">Gas/Swap Brokerage Fee:</span>
                        <span className="font-mono text-blue-400 font-extrabold">₦0.00 SPONSORED BY XENA</span>
                      </div>
                    </div>

                    <button
                      onClick={executeSwap}
                      disabled={fromAmount <= 0 || fromAmount > balances[fromAsset] || fromAsset === toAsset}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:opacity-95 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Zap className="w-4 h-4 text-yellow-350 shrink-0" /> INSTANTLY SETTLE LIQUIDITY SWAP
                    </button>
                  </div>
                ) : swapStep === 'success' ? (
                  <div className="p-6 bg-blue-950/20 border border-blue-900/30 text-blue-400 rounded-2xl text-center space-y-4 font-sans">
                    <div className="mx-auto w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-6 h-6 stroke-[3.5]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase text-blue-400 tracking-wider">Order Settled</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-semibold max-w-sm mx-auto mt-2">{successInfo}</p>
                    </div>
                    <div className="p-3 bg-black/60 border border-slate-800 rounded-xl space-y-1 text-left font-mono text-[9.5px] text-slate-300">
                      <div className="flex justify-between"><span className="text-slate-500">Asset Sold:</span> <span className="font-black">{fromAmount} {fromAsset}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Asset Credited:</span> <span className="font-black">{toAmount} {toAsset}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Ledger Index:</span> <span className="font-bold text-indigo-400">0x{generateRef().slice(0, 16).toLowerCase()}</span></div>
                    </div>
                    <button 
                      onClick={() => {
                        setSwapStep('idle');
                        setFromAmount(5000);
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-750 text-white text-[10px] uppercase font-black rounded-xl cursor-pointer transition-all"
                    >
                      New Swap Request
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-5">
                    <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                      <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <Coins className="w-6 h-6 text-blue-400 animate-pulse" />
                    </div>
                    <div className="space-y-1 font-sans">
                      <span className="text-[9px] font-black uppercase font-mono text-blue-405 tracking-widest block animate-pulse">
                        {swapStep === 'broadcasting' ? '1. BROADCASTING TXN...' : swapStep === 'validating' ? '2. SECURITY VAL...' : '3. RE-ANCHORING ASSETS...'}
                      </span>
                      <h4 className="text-sm font-black text-white">
                        {swapStep === 'broadcasting' ? 'Relaying order to corporate registry' : swapStep === 'validating' ? 'Confirming liquid margin levels' : 'Minting settlement ledger indices'}
                      </h4>
                      <p className="text-[10.5px] text-slate-500 font-semibold font-mono">Blockchain processing active. Do not refresh.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* SEND P2P SUB-TAB: Multi-token Peer-to-Peer Secure Transfers */}
            {activeTab === 'p2p' && (
              <motion.div
                key="tab-p2p"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#0b0e14] border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800/60 pb-3 mb-5">
                  Multi-Token Peer-to-Peer Transfer
                </h3>

                <div className="p-4 bg-blue-950/20 border border-blue-900/30 rounded-2xl flex items-start gap-3 text-xs leading-normal">
                  <Info className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-slate-300 font-medium">
                    P2P secure transfers bypass fiat domestic channels. Transmit any asset including native <span className="text-purple-400 font-bold">XENA (XNC)</span> directly to verified sibling investors with 0 processing tax.
                  </p>
                </div>

                {p2pTransferStep === 'idle' ? (
                  <div className="space-y-5 mt-5">
                    
                    {/* ASSET SELECTION GRID */}
                    <div className="space-y-2.5">
                      <label className="text-[10.5px] font-black uppercase text-slate-400 tracking-wide block">
                        Select Asset to Transfer
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {(['XNC', 'USDT', 'NGN', 'SOL', 'BTC', 'ETH', 'BNB'] as AssetCode[]).map((coin) => {
                          const isSelected = p2pTransferAsset === coin;
                          return (
                            <button
                              key={coin}
                              type="button"
                              onClick={() => {
                                setP2pTransferAsset(coin);
                                setP2pAmount('');
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-600/10 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                                  : 'border-slate-850 bg-[#0e121a]/60 hover:bg-[#0e121a] hover:border-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-[10.5px] font-black uppercase tracking-wider ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}>
                                  {coin}
                                </span>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                              </div>
                              <div className="mt-2 text-[11px] font-mono font-bold text-white truncate">
                                {balances[coin].toLocaleString('en-US', { maximumFractionDigits: 4 })}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recipient locator UID */}
                    <div className="p-4 bg-black/35 border border-slate-800/80 rounded-2xl space-y-3 relative">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10.5px] font-black uppercase text-slate-400 tracking-wide block">
                          Verified Recipient Wallet UID
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsScannerOpen(true)}
                            className="flex items-center gap-1.5 text-[10px] text-blue-400 hover:text-blue-300 font-black uppercase transition-all cursor-pointer bg-blue-500/5 px-2.5 py-1 rounded border border-blue-500/15"
                          >
                            <Scan className="w-3 h-3" />
                            Scan QR
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowMyQrModal(true)}
                            className="flex items-center gap-1.5 text-[10px] text-purple-400 hover:text-purple-300 font-black uppercase transition-all cursor-pointer bg-purple-500/5 px-2.5 py-1 rounded border border-purple-500/15"
                          >
                            <QrCode className="w-3 h-3" />
                            My QR
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold">
                            <Search className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            value={p2pUid}
                            onChange={(e) => {
                              setP2pUid(e.target.value);
                              setSearchedUser(null);
                              setP2pSearchError('');
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs font-mono font-bold tracking-widest placeholder-slate-600 text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500/40"
                            placeholder="E.G. XENA-23453 OR SEARCH BY NAME"
                          />

                          {/* Predictive instant search overlay dropdown */}
                          {p2pUid.trim().length >= 1 && !searchedUser && (
                            (() => {
                              const suggestions = registeredUsers.filter(u => 
                                ((u.uid || '').toUpperCase().includes(p2pUid.trim().toUpperCase()) ||
                                 (u.fullName || '').toUpperCase().includes(p2pUid.trim().toUpperCase())) &&
                                (u.uid || '').toUpperCase() !== userUid.toUpperCase()
                              ).slice(0, 5);

                              if (suggestions.length === 0) return null;

                              return (
                                <div className="absolute z-20 left-0 right-0 mt-1.5 bg-[#0b0e14] border border-slate-850 rounded-xl overflow-hidden divide-y divide-slate-850/65 shadow-2xl">
                                  <div className="p-2 py-1 bg-[#101424] text-[8px] font-black text-blue-400 uppercase tracking-widest block font-mono">
                                    MATCHED SHAREHOLDERS ({suggestions.length})
                                  </div>
                                  {suggestions.map((u) => (
                                    <button
                                      key={u.uid}
                                      type="button"
                                      onClick={() => {
                                        setP2pUid(u.uid || '');
                                        setSearchedUser(u);
                                        setP2pSearchError('');
                                      }}
                                      className="w-full text-left p-3 hover:bg-slate-900 transition-all flex items-center justify-between text-xs text-slate-300 cursor-pointer"
                                    >
                                      <div className="flex flex-col">
                                        <strong className="text-white font-bold">{u.fullName}</strong>
                                        <span className="text-[9.5px] text-slate-500 font-mono">{u.email}</span>
                                      </div>
                                      <span className="bg-blue-500/10 border border-blue-500/20 text-blue-450 font-mono text-[9px] px-2 py-0.5 rounded font-black">
                                        {u.uid}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              );
                            })()
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleSearchRecipientByUid}
                          className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-750 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
                        >
                          Locate
                        </button>
                      </div>

                      {p2pSearchError && (
                        <div className="text-[10px] text-rose-400 bg-rose-950/20 border border-rose-900/30 p-2.5 rounded-xl font-semibold">
                          ⚠️ {p2pSearchError}
                        </div>
                      )}

                      {searchedUser && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-3.5 bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border border-blue-500/20 text-blue-450 rounded-xl space-y-3.5 text-left relative overflow-hidden shadow-inner font-sans"
                        >
                          <div className="absolute top-0 right-0 p-3 opacity-15">
                            <User className="w-16 h-16 text-blue-400" />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-black text-xs shrink-0">
                              {searchedUser.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-black font-mono tracking-widest text-slate-500 block">Verified Active Recipient</span>
                              <strong className="text-white font-black text-sm block leading-tight">{searchedUser.fullName}</strong>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-[10.5px] font-mono border-t border-blue-900/30 pt-2.5 mt-2">
                            <div>
                              <span className="text-slate-500 text-[8.5px] block font-sans font-extrabold">UID LEAF NODE</span> 
                              <span className="text-blue-300 font-bold block truncate">{searchedUser.uid}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 text-[8.5px] block font-sans font-extrabold">RECIPIENT EMAIL</span> 
                              <span className="text-slate-300 font-bold block truncate">{searchedUser.email}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Quantity To Send Input */}
                    <div className="p-4 bg-black/40 border border-slate-800/80 rounded-2xl space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold">Transfer Quantity</span>
                        <span className="text-slate-500 font-mono font-medium">
                          Portfolio: <strong className="text-blue-450 font-mono font-black">{balances[p2pTransferAsset].toLocaleString('en-US', { maximumFractionDigits: 6 })} {p2pTransferAsset}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="0.00001"
                          step="any"
                          value={p2pAmount}
                          onChange={(e) => setP2pAmount(e.target.value)}
                          placeholder="0.00"
                          className="bg-transparent text-white font-black font-mono text-xl focus:outline-hidden flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => setP2pAmount(String(balances[p2pTransferAsset]))}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-[10px] font-black font-mono text-slate-400 hover:text-white rounded-lg transition-all"
                        >
                          MAX
                        </button>
                      </div>

                      {/* Percentage Chips */}
                      <div className="flex gap-1.5 pt-1">
                        {[0.25, 0.5, 0.75, 1].map((pct) => {
                          const pctLabel = pct === 1 ? 'MAX' : `${pct * 100}%`;
                          return (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => {
                                const calculated = (balances[p2pTransferAsset] * pct);
                                setP2pAmount(calculated > 0 ? calculated.toFixed(5) : '');
                              }}
                              className="flex-1 py-1.5 px-1.5 bg-slate-900 border border-slate-850 hover:border-slate-700 hover:bg-slate-850 text-[9px] font-black font-mono text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer text-center"
                            >
                              {pctLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* TRANSACTION METRICS BREAKDOWN */}
                    <div className="p-3.5 bg-[#080b0f] border border-slate-800/60 rounded-2xl space-y-2.5 text-[11px] font-medium font-sans text-slate-400 shadow-inner">
                      <div className="flex justify-between">
                        <span>Ledger Protocol Fee</span>
                        <span className="text-emerald-400 font-black font-mono uppercase tracking-wider">0.00 {p2pTransferAsset} (FREE)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Settlement Speed</span>
                        <span className="text-blue-400 font-black font-mono">INSTANT (&lt; 2s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Security Level</span>
                        <span className="text-purple-400 font-black font-mono uppercase tracking-wider">End-to-End Encrypted</span>
                      </div>
                    </div>

                    <button
                      onClick={handleExecuteP2pTransfer}
                      disabled={!searchedUser || !p2pAmount || Number(p2pAmount) <= 0 || Number(p2pAmount) > balances[p2pTransferAsset]}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:opacity-95 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4 shrink-0 text-white" /> CONFIRM & BROADCAST WIRE TRANSACTION
                    </button>
                  </div>
                ) : p2pTransferStep === 'success' ? (
                  <div className="p-6 bg-blue-950/20 border border-blue-900/30 text-blue-400 rounded-2xl text-center space-y-4 font-sans">
                    <div className="mx-auto w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <Check className="w-5 h-5 stroke-[4.0]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase text-blue-400 tracking-wider">P2P Ledger Settled</h4>
                      <p className="text-xs text-slate-350 leading-relaxed font-semibold max-w-xs mx-auto mt-2">{p2pSuccessMsg}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setP2pTransferStep('idle');
                        setP2pAmount('');
                        setP2pUid('');
                        setSearchedUser(null);
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-750 text-white text-[10px] uppercase font-black rounded-xl transition-all cursor-pointer"
                    >
                      New P2P Transfer
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-5">
                    <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                      <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <Send className="w-6 h-6 text-blue-450 animate-pulse" />
                    </div>
                    <div className="space-y-1 font-sans">
                      <span className="text-[9px] font-black uppercase font-mono text-blue-405 tracking-widest block animate-pulse">
                        BROADCASTING SHARED TRANSFER...
                      </span>
                      <h4 className="text-sm font-black text-white">Re-anchoring balances in mutual ledgers</h4>
                      <p className="text-[10.5px] text-slate-500 font-semibold font-mono">Verifying cryptography. Page lock enabled.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* RECEIVE ASSETS SUB-TAB: Sovereign Deposit Vault Addresses */}
            {activeTab === 'receive' && (
              <motion.div
                key="tab-receive"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#0b0e14] border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800/60 pb-3 mb-5">
                  My Secure Deposit Vaults
                </h3>

                <p className="text-xs text-slate-400 font-semibold leading-relaxed mb-4">
                  Deploy external assets to these unique ledger endpoints. Settle investments automatically upon block conformation.
                </p>

                <div className="space-y-3 font-sans">
                  {(['XNC', 'BTC', 'ETH', 'SOL', 'BNB', 'USDT', 'NGN'] as AssetCode[]).map((coin) => {
                    const addr = addresses[coin];
                    const numDecimals = coin === 'BTC' ? 8 : coin === 'ETH' ? 6 : coin === 'SOL' ? 4 : 2;

                    return (
                      <div key={coin} className="p-3 bg-black/45 border border-slate-800/80 rounded-2xl flex flex-col gap-2 relative">
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-blue-600 flex items-center justify-center font-mono font-black text-[8px] text-white">
                              {coin[0]}
                            </span>
                            <span className="text-xs font-black text-white text-left">{ASSET_LABELS[coin]}</span>
                          </div>
                          <span className="text-[11px] font-mono font-black text-indigo-400 mt-0.5">
                            {balances[coin].toLocaleString('en-US', { maximumFractionDigits: numDecimals })} {coin}
                          </span>
                        </div>

                        <div className="bg-[#070a0f] border border-slate-800/60 p-2 rounded-xl flex items-center justify-between gap-3 text-left">
                          <span className="font-mono text-[10px] text-zinc-400 truncate select-all">{addr}</span>
                          <button
                            onClick={() => handleCopy(addr)}
                            className="p-1 px-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded-lg transition-all text-[9.5px] font-bold text-slate-300 flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            {copiedAddress === addr ? (
                              <>
                                <Check className="w-3 h-3 text-blue-400" />
                                <span className="text-blue-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Action Column: Live Market Graph Analyzer & Simulated Orders LEDGER */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* TRADING CORE CHART DESK */}
          <div className="bg-[#0b0e14] border border-slate-800/80 p-5 rounded-3xl text-left space-y-3.5 shadow-xl relative">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-800/50">
              <div className="flex items-center gap-2">
                <span className="flex bg-amber-400/10 border border-amber-400/30 rounded-lg p-1">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                </span>
                <span className="text-xs font-black uppercase text-slate-300 tracking-wider">
                  Price Index Graph
                </span>
              </div>
              
              <div className="flex gap-1.5 bg-slate-950 p-0.5 rounded-lg border border-slate-850 text-[9px] font-black font-mono">
                {(['24H', '7D', '1M'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setTimeframe(opt)}
                    className={`px-2.5 py-0.5 rounded-md cursor-pointer transition-all ${timeframe === opt ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-white bg-transparent'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector list (interactive pills) */}
            <div className="flex flex-wrap gap-1">
              {(['XNC', 'BTC', 'ETH', 'SOL', 'BNB', 'USDT'] as AssetCode[]).map((coin) => (
                <button
                  key={coin}
                  onClick={() => setSelectedAsset(coin)}
                  className={`px-2.5 py-1 text-[9.5px] font-black uppercase font-mono rounded-lg border cursor-pointer transition-all ${selectedAsset === coin ? 'bg-blue-600 border-blue-500 text-white' : 'bg-transparent border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'}`}
                >
                  {coin}
                </button>
              ))}
            </div>

            {/* Recharts responsive Area chart */}
            <div className="h-28 w-full bg-black/40 p-1.5 rounded-2xl border border-slate-900 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartDataMap[selectedAsset][timeframe]} margin={{ top: 5, right: 3, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGradientsWallet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedAsset === 'XNC' ? '#a855f7' : '#2563eb'} stopOpacity={0.35}/>
                      <stop offset="95%" stopColor={selectedAsset === 'XNC' ? '#a855f7' : '#2563eb'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={7.5} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={7.5} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={['auto', 'auto']} 
                    tickFormatter={(val) => {
                      if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
                      if (val >= 1000) return `₦${(val / 1000).toFixed(0)}k`;
                      return `₦${val}`;
                    }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#070a0e', borderColor: '#1e293b', fontSize: '9px', color: '#fff', borderRadius: '8px' }}
                    labelStyle={{ color: selectedAsset === 'XNC' ? '#c084fc' : '#60a5fa', fontWeight: 900 }}
                  />
                  <Area type="monotone" dataKey="price" stroke={selectedAsset === 'XNC' ? '#d946ef' : '#3b82f6'} strokeWidth={1.8} fillOpacity={1} fill="url(#colorGradientsWallet)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono mt-1 pt-1">
              <span>Stable Reference Node</span>
              <span className="text-blue-400 font-bold flex items-center gap-1 uppercase tracking-wider text-[8px]">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping shrink-0" />
                Live Sync Feed
              </span>
            </div>
          </div>

          {/* REALTIME BLOCK BOOK */}
          <div className="bg-[#0b0e14] border border-slate-800/85 p-5 rounded-3xl shadow-xl text-left space-y-3">
            <span className="text-[7.5px] font-mono tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg font-black uppercase block w-max">
              SOVEREIGN LEDGER EXPLORER
            </span>
            <div className="flex items-center gap-1 animate-pulse pb-1">
              <Activity className="w-3.5 h-3.5 text-blue-450 shrink-0" />
              <h4 className="text-[10px] font-black uppercase text-slate-350 tracking-wider">Mutual Order Book Feed</h4>
            </div>

            <div className="space-y-2 font-mono text-[9px]">
              {globalSwaps.map((item) => (
                <div 
                  key={item.id} 
                  className="p-2 bg-black/25 border border-slate-800/50 rounded-xl hover:border-slate-700 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <span className="text-blue-400 hover:underline font-bold block">{item.hash}</span>
                    <span className="text-[7.5px] text-slate-500 uppercase font-sans">SWAP {item.from} ➔ {item.to}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-black block">{item.amount}</span>
                    <span className="text-[7.5px] text-slate-500 block">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 3. Interactive Asset Option drawer overlay modal (extremely cool desktop + mobile custom action layout) */}
      <AnimatePresence>
        {activeAssetDrawer && (() => {
          const coin = activeAssetDrawer;
          const label = ASSET_LABELS[coin];
          const sym = ASSET_SYMBOLS[coin];
          const bal = balances[coin];
          const nairaValue = bal * ASSET_WEIGHTS[coin];

          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 z-50 text-sans"
              onClick={() => setActiveAssetDrawer(null)}
            >
              <motion.div 
                initial={{ y: 80, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 80, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm bg-[#0b0e14] border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 space-y-5 text-left text-white shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex justify-between items-center border-b border-slate-800/55 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono font-black text-[11px] flex items-center justify-center">
                      {sym}
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase text-white tracking-tight">{coin} Asset Node</h4>
                      <span className="text-[10px] text-slate-400 block">{label}</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg font-mono">
                    {sym}
                  </span>
                </div>

                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 block font-bold font-sans">Accumulated Vault holding</span>
                  <p className="text-xl font-black font-mono tracking-tight text-white">
                    {bal.toLocaleString('en-US', { maximumFractionDigits: 6 })} {coin}
                  </p>
                  <p className="text-xs text-blue-400 font-mono font-bold">
                    ≈ {formatNGN(nairaValue)} Valuation
                  </p>
                </div>

                {/* Grid of actions to trigger directly */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setFromAsset(coin);
                      setActiveTab('swap');
                      setActiveAssetDrawer(null);
                    }}
                    className="p-3 bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-250 hover:text-blue-400 transition-all rounded-xl text-center space-y-1.5 cursor-pointer flex flex-col items-center"
                  >
                    <RefreshCw className="w-4.5 h-4.5" />
                    <span className="text-[9.5px] font-black uppercase tracking-wider block">Buy / Swap</span>
                  </button>

                  <button
                    onClick={() => {
                      setP2pTransferAsset(coin);
                      setActiveTab('p2p');
                      setActiveAssetDrawer(null);
                    }}
                    className="p-3 bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-250 hover:text-blue-400 transition-all rounded-xl text-center space-y-1.5 cursor-pointer flex flex-col items-center"
                  >
                    <Send className="w-4.5 h-4.5" />
                    <span className="text-[9.5px] font-black uppercase tracking-wider block">Transfer</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedAsset(coin);
                      setActiveTab('receive');
                      setActiveAssetDrawer(null);
                    }}
                    className="p-3 bg-slate-900 border border-slate-800 hover:border-blue-505 text-slate-250 hover:text-blue-400 transition-all rounded-xl text-center space-y-1.5 cursor-pointer flex flex-col items-center"
                  >
                    <QrCode className="w-4.5 h-4.5" />
                    <span className="text-[9.5px] font-black uppercase tracking-wider block">Vault Info</span>
                  </button>
                </div>

                {/* Bottom address quickcopy panel inside modal */}
                <div className="space-y-1">
                  <span className="text-[8.5px] text-slate-400 font-black uppercase font-mono block tracking-wider">MUTUAL RECEIVING SECURE WALLET ENDPOINT</span>
                  <div className="bg-black/30 border border-slate-850 p-2 text-[9px] font-mono rounded-lg flex items-center justify-between text-zinc-400 overflow-hidden gap-2">
                    <span className="truncate flex-grow select-all">{addresses[coin]}</span>
                    <button 
                      onClick={() => handleCopy(addresses[coin])}
                      className="shrink-0 text-slate-305 hover:text-white transition-all cursor-pointer"
                    >
                      {copiedAddress === addresses[coin] ? <Check className="w-3 h-3 text-blue-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setActiveAssetDrawer(null)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-[10px] uppercase font-black tracking-widest text-[#93c5fd] hover:text-white border border-slate-850 rounded-xl transition-all cursor-pointer text-center"
                >
                  DISMISS ACTION MENU
                </button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* 1. QR CODE SCANNER MODAL */}
      <AnimatePresence>
        {isScannerOpen && (
          <QrCodeScannerModal
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            registeredUsers={registeredUsers}
            currentWallet={wallet}
            onScanSuccess={(scannedUid) => {
              setP2pUid(scannedUid);
              // Trigger a simulated search to instantly bind the recipient
              const found = registeredUsers.find(
                (u) => (u.uid || '').toUpperCase() === scannedUid.toUpperCase()
              );
              if (found) {
                setSearchedUser(found);
                setP2pSearchError('');
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* 2. MY PERSONAL QR CARD MODAL */}
      <AnimatePresence>
        {showMyQrModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm"
            >
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setShowMyQrModal(false)}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer border border-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <QrCodeDisplay
                value={userUid}
                name={wallet.fullName}
                email={wallet.email}
                size={220}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
