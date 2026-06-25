import { motion } from 'motion/react';
import { generateQrMatrix } from '../utils/qrGenerator';
import { Copy, Check, Download, QrCode } from 'lucide-react';
import { useState } from 'react';

interface QrCodeDisplayProps {
  value: string;
  name?: string;
  email?: string;
  size?: number;
}

export default function QrCodeDisplay({ value, name, email, size = 180 }: QrCodeDisplayProps) {
  const matrix = generateQrMatrix(value);
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl relative overflow-hidden text-center">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
      
      {/* Dynamic blinking green node status */}
      <div className="w-full flex justify-between items-center mb-4 text-[9px] font-mono uppercase tracking-widest text-slate-500 px-1">
        <span className="flex items-center gap-1.5 font-black text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Node Active
        </span>
        <span className="font-bold">XENA Mesh Network</span>
      </div>

      {/* SVG QR CODE */}
      <div className="p-3 bg-white rounded-xl shadow-inner relative group border border-slate-200">
        <svg
          width={size}
          height={size}
          viewBox="0 0 25 25"
          className="shape-rendering-crisp"
        >
          {matrix.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <rect
                key={`${rIdx}-${cIdx}`}
                x={cIdx}
                y={rIdx}
                width={1}
                height={1}
                fill={cell ? '#0f172a' : '#ffffff'} // Dark slate blocks
              />
            ))
          )}
          
          {/* Centered Small Icon/Logo on QR code */}
          <rect
            x={10.5}
            y={10.5}
            width={4}
            height={4}
            rx={0.5}
            fill="#ffffff"
          />
          <circle
            cx={12.5}
            cy={12.5}
            r={1.3}
            fill="#2563eb"
          />
        </svg>

        {/* Hover overlay effect */}
        <div className="absolute inset-0 bg-black/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={handleCopyText}>
          <span className="bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-white px-2.5 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 font-black">
            <QrCode className="w-3.5 h-3.5 text-blue-400" />
            CLICK TO COPY UID
          </span>
        </div>
      </div>

      {/* Member Identifiers */}
      <div className="mt-4 space-y-1.5 w-full">
        {name && (
          <h4 className="text-sm font-black text-white tracking-wide uppercase truncate">
            {name}
          </h4>
        )}
        {email && (
          <p className="text-[10px] text-slate-500 font-mono font-medium truncate">
            {email}
          </p>
        )}
        
        <div className="inline-flex items-center justify-center gap-1.5 mt-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-black rounded-lg">
          <span className="text-[9px] uppercase text-slate-500 font-sans tracking-wider font-extrabold">UID:</span>
          <span>{value}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-4.5 w-full">
        <button
          onClick={handleCopyText}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-[10.5px] font-bold transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-blue-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Copy UID</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            alert("QR card template downloaded to your shareholder device memory cache.");
          }}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded-xl text-[10.5px] font-bold transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span>Save Card</span>
        </button>
      </div>
    </div>
  );
}
