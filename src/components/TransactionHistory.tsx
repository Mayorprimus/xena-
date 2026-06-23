import { useState } from 'react';
import { Transaction } from '../types';
import { formatNGN, formatTime } from '../utils';
import { Search, ArrowDownLeft, ArrowUpRight, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdraw' | 'invest' | 'payout'>('all');

  // Filter transactions
  const filteredTx = transactions.filter(tx => {
    // search filter
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    // type filter
    const matchesType = filterType === 'all' || tx.type === filterType;

    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="bg-emerald-950/20 text-emerald-405 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-900/30 inline-flex items-center gap-1 w-max">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="bg-amber-955/20 text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-900/30 inline-flex items-center gap-1 w-max animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Processing
          </span>
        );
      default:
        return (
          <span className="bg-rose-955/20 text-rose-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-rose-900/30 inline-flex items-center gap-1 w-max">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Failed
          </span>
        );
    }
  };

  const getTxIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <div className="p-2 bg-emerald-950/40 rounded-xl text-emerald-400 border border-emerald-900/20"><ArrowDownLeft className="w-4 h-4" /></div>;
      case 'withdraw':
        return <div className="p-2 bg-rose-955/20 rounded-xl text-rose-400 border border-rose-900/20"><ArrowUpRight className="w-4 h-4" /></div>;
      case 'invest':
        return <div className="p-2 bg-blue-950/30 rounded-xl text-blue-400 border border-blue-900/20"><RefreshCw className="w-4 h-4 shrink-0 rotate-180" /></div>;
      case 'payout':
        return <div className="p-2 bg-emerald-950/40 rounded-xl text-emerald-450 border border-emerald-900/20"><CheckCircle className="w-4 h-4" /></div>;
      default:
        return <div className="p-2 bg-emerald-950/40 rounded-xl text-emerald-400 border border-emerald-900/20"><CheckCircle className="w-4 h-4" /></div>;
    }
  };

  return (
    <div className="bg-[#0b0e14] border border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-xl space-y-5 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/50 pb-5">
        <div>
          <h3 className="text-lg font-black text-white font-sans">Transaction Log</h3>
          <p className="text-xs text-slate-400 font-semibold">Verifiable transaction ledger of your XENA INVESTMENT LTD company share positions.</p>
        </div>
      </div>

      {/* Filters and Search toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="transaction-search"
            type="text"
            placeholder="Search by ref or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-black/45 border border-slate-800/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 rounded-xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-600 text-white"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto shrink-0 pb-1 sm:pb-0">
          {(['all', 'deposit', 'withdraw', 'invest', 'payout'] as const).map((type) => (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={type}
              id={`filter-tx-${type}`}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 text-xs font-black rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                filterType === type
                  ? 'bg-blue-600 border-transparent text-white shadow-lg'
                  : 'bg-[#101424]/60 border-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              {type.toUpperCase()}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Transactions list layout */}
      {filteredTx.length === 0 ? (
        <div className="text-center py-12 px-6 border border-dashed border-slate-800 bg-[#0a0d14]/40 rounded-2xl space-y-3">
          <div className="p-2 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl w-10 h-10 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-black text-white">No Logs Discovered</p>
            <p className="text-xs text-slate-500 font-semibold">No transactions match your search filter criteria.</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800/50">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-[#101424]/40">
                <th className="py-3 px-4">Transaction Details</th>
                <th className="py-3 px-4 font-mono">Ref Number</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Processing status</th>
                <th className="py-3 px-4 text-right">Processed Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/60">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#101424]/20 transition-colors text-xs text-slate-300">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    {getTxIcon(tx.type)}
                    <div className="text-left font-sans">
                      <span className="font-extrabold text-white block">{tx.description}</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{tx.type}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <code className="text-[10px] font-mono bg-black border border-slate-800 px-2.5 py-1 rounded-lg text-blue-400 font-black">{tx.reference}</code>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-semibold font-mono text-[10px]">
                    {formatTime(tx.date)}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className={`py-3.5 px-4 text-right font-black font-mono text-[13px] ${
                    tx.type === 'withdraw' || tx.type === 'invest' ? 'text-slate-200' : 'text-emerald-400'
                  }`}>
                    {tx.type === 'withdraw' || tx.type === 'invest' ? '-' : '+'}{formatNGN(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
