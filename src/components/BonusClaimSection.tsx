import { useState } from 'react';
import { Gift, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';

interface BonusClaimSectionProps {
  onClaim: (code: string) => { success: boolean; message: string };
}

export default function BonusClaimSection({ onClaim }: BonusClaimSectionProps) {
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setFeedback(null);

    // Minor visual delay for premium feedback experience
    setTimeout(() => {
      const result = onClaim(code);
      setIsLoading(false);
      if (result.success) {
        setFeedback({ type: 'success', message: result.message });
        setCode('');
      } else {
        setFeedback({ type: 'error', message: result.message });
      }
    }, 800);
  };

  return (
    <div id="bonus-claim-card" className="bg-gradient-to-br from-purple-900 to-indigo-950 border border-purple-500/30 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl font-sans">
      <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-44 h-44 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-4 relative">
        <div className="flex items-center gap-2 px-2.5 py-1 bg-purple-800/30 border border-purple-500/30 rounded-full w-fit">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-200">
            PROMOTIONAL DISBURSEMENTS
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black font-sans tracking-tight">XENA Reward Claim Hub</h3>
          <p className="text-xs text-purple-200/80 leading-relaxed font-semibold">
            Got a community voucher reward, advisor bonus, or referral booster pass? Validate your promo credentials below to settle cash directly into your savings wallet.
          </p>
        </div>

        <form onSubmit={handleClaimSubmit} className="space-y-3 pt-1">
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold text-purple-300 tracking-wider">
              Enter Bonus Coupon Code
            </label>
            <div className="relative">
              <input
                id="inp-bonus-promo-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. XENA-WELCOME"
                disabled={isLoading}
                className="w-full bg-black/40 border border-purple-500/40 rounded-2xl px-4 py-3 text-sm font-bold tracking-wider placeholder-purple-300/30 text-white focus:outline-none focus:border-purple-400/90 focus:ring-1 focus:ring-purple-400/50 transition-all uppercase"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-purple-300">
                <Gift className="w-4 h-4 animate-bounce" />
              </div>
            </div>
          </div>

          <button
            id="btn-claim-bonus"
            type="submit"
            disabled={isLoading || !code.trim()}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-550 active:scale-[0.99] hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none rounded-2xl text-xs font-bold uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md border border-purple-400/30"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Verifying Voucher Coupon...</span>
              </>
            ) : (
              <span>Redeem Corporate Capital</span>
            )}
          </button>
        </form>

        {feedback && (
          <div
            id="bonus-feedback-message"
            className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5 animate-fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/45 text-emerald-250 font-bold'
                : 'bg-rose-500/15 border-rose-500/45 text-rose-250 font-bold'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
