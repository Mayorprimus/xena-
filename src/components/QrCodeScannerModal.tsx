import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, RefreshCw, AlertCircle, Check, Users, Search, Scan } from 'lucide-react';
import { UserWallet } from '../types';
import jsQR from 'jsqr';

interface QrCodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  registeredUsers: UserWallet[];
  currentWallet: UserWallet;
  onScanSuccess: (scannedUid: string) => void;
}

export default function QrCodeScannerModal({
  isOpen,
  onClose,
  registeredUsers,
  currentWallet,
  onScanSuccess,
}: QrCodeScannerModalProps) {
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [simulatedMatch, setSimulatedMatch] = useState<UserWallet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream helper
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Start camera stream helper
  const startCamera = async () => {
    setCameraError('');
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      
      // Delay slightly or wait for ref to ensure it's loaded
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
          videoRef.current.play().catch(err => {
            console.error("Video play failed:", err);
          });
        }
      }, 50);

      setUseRealCamera(true);
    } catch (err: any) {
      console.warn("Camera access failed/denied", err);
      setCameraError(
        'Unable to initialize physical camera device. Utilizing high-fidelity mesh simulator stream instead.'
      );
      setUseRealCamera(false);
    }
  };

  // Trigger simulated/real scanning logic when modal is open
  useEffect(() => {
    if (isOpen) {
      setScanStatus('scanning');
      setSimulatedMatch(null);
      startCamera();
    } else {
      stopCamera();
      setScanStatus('idle');
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Real-time canvas frame analysis for QR decoding
  useEffect(() => {
    let animationFrameId: number;
    let isMounted = true;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const scanFrame = () => {
      if (!isMounted) return;

      if (
        useRealCamera &&
        scanStatus === 'scanning' &&
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
      ) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        
        if (context) {
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          
          try {
            const decoded = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });

            if (decoded && decoded.data) {
              const scannedUid = decoded.data.trim();
              console.log("QR decoded successfully:", scannedUid);

              // Look for a match in registered users
              const matchedUser = registeredUsers.find(
                (u) => u.uid?.toLowerCase() === scannedUid.toLowerCase() ||
                       (u.referralCode && scannedUid.toLowerCase().includes(u.referralCode.toLowerCase()))
              );

              if (matchedUser) {
                setSimulatedMatch(matchedUser);
                setScanStatus('success');
              } else if (scannedUid.toUpperCase().startsWith('XENA-') || scannedUid.toUpperCase().startsWith('XNC-')) {
                // Construct a temporary placeholder for external nodes
                const tempUser: UserWallet = {
                  uid: scannedUid,
                  fullName: `Decoded Node: ${scannedUid}`,
                  email: 'External Shareholder',
                  country: 'Nigeria',
                  referralCode: scannedUid.split('-').pop() || '49104',
                  usdtBalance: 0,
                  solBalance: 0,
                  btcBalance: 0,
                  ethBalance: 0,
                  bnbBalance: 0,
                  walletBalance: 0,
                  investedBalance: 0,
                  withdrawnBalance: 0,
                  earnedBalance: 0,
                  referralsCount: 0,
                  referralEarnings: 0,
                  accountNumber: '0000000000',
                };
                setSimulatedMatch(tempUser);
                setScanStatus('success');
              }
            }
          } catch (e) {
            console.error("Error decoding QR Frame:", e);
          }
        }
      }

      if (scanStatus === 'scanning') {
        animationFrameId = requestAnimationFrame(scanFrame);
      }
    };

    if (isOpen && useRealCamera && scanStatus === 'scanning') {
      animationFrameId = requestAnimationFrame(scanFrame);
    }

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, useRealCamera, scanStatus, registeredUsers]);

  const handleSimulateScan = (user: UserWallet) => {
    setScanStatus('scanning');
    setSimulatedMatch(user);
    
    // Animate a short "processing/finding" phase for realism
    setTimeout(() => {
      setScanStatus('success');
    }, 1500);
  };

  const handleConfirmScan = () => {
    if (simulatedMatch && simulatedMatch.uid) {
      onScanSuccess(simulatedMatch.uid);
      onClose();
    }
  };

  // Filter other users excluding the current logged-in user
  const otherUsers = registeredUsers.filter(
    (u) => u.uid && u.uid !== currentWallet.uid &&
    (u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.uid.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative text-left"
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-850 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-2">
            <Scan className="w-4.5 h-4.5 text-blue-400 animate-pulse" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
              XENA QR Security Scanner
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="p-5 space-y-4">
          
          {/* Main Visual Scanning Box */}
          <div className="relative aspect-video w-full bg-black rounded-2xl border-2 border-slate-800 overflow-hidden group shadow-inner">
            
            {/* Real Camera Stream - Always mounted so videoRef is bound, display controlled dynamically */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ display: useRealCamera ? 'block' : 'none' }}
            />
            
            {/* Animated Simulation Grid fallback */}
            {!useRealCamera && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="absolute inset-0 bg-blue-500/2 animate-pulse pointer-events-none" />
                <Camera className="w-8 h-8 text-slate-700 mb-2 animate-bounce" />
                <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest text-center px-6">
                  {cameraError ? "Mesh Simulator Stream Active" : "Initializing Scanner HUD..."}
                </span>
              </div>
            )}

            {/* Target Area Finder Frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-40 h-40 border-2 border-dashed border-blue-500/50 rounded-2xl flex items-center justify-center relative">
                {/* 4 Corner Markers */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-400 -mt-1.5 -ml-1.5" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-400 -mt-1.5 -mr-1.5" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-400 -mb-1.5 -ml-1.5" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-400 -mb-1.5 -mr-1.5" />
                
                {/* Neon Laser Line Scan Animation */}
                {scanStatus === 'scanning' && (
                  <motion.div
                    animate={{ top: ['4%', '96%', '4%'] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    className="absolute left-[2%] right-[2%] h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  />
                )}
              </div>
            </div>

            {/* Sub-indicator Status Pill */}
            <div className="absolute bottom-3 left-3 bg-black/75 border border-slate-850 px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase font-black text-slate-400 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${scanStatus === 'scanning' ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
              <span>{scanStatus === 'scanning' ? 'LOCKING TARGET...' : 'TARGET ACQUIRED'}</span>
            </div>

            {/* Simulated target acquired pop-up inside scanner box */}
            <AnimatePresence>
              {scanStatus === 'success' && simulatedMatch && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute inset-x-3 bottom-3 p-3 bg-slate-900/95 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white block font-black leading-tight">{simulatedMatch.fullName}</strong>
                      <span className="text-[9.5px] text-blue-400 font-mono tracking-wider">{simulatedMatch.uid}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleConfirmScan}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Confirm Recipient
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sibling node simulator panel */}
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-850 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Simulated Shareholder Nodes Nearby
              </span>
              <span className="text-[9px] font-mono text-slate-500">
                {otherUsers.length} Online
              </span>
            </div>

            {/* Quick Filter */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sibling investor node..."
                className="w-full bg-slate-900 border border-slate-850 rounded-lg py-1.5 pl-8 pr-2 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none"
              />
            </div>

            {/* Interactive Grid of other shareholders to select & auto scan */}
            <div className="max-h-28 overflow-y-auto divide-y divide-slate-850/40 pr-1 scrollbar-thin">
              {otherUsers.length > 0 ? (
                otherUsers.map((u) => (
                  <button
                    key={u.uid}
                    type="button"
                    onClick={() => handleSimulateScan(u)}
                    className="w-full py-2 px-2.5 hover:bg-slate-900/60 transition-all rounded-lg flex items-center justify-between text-left cursor-pointer group"
                  >
                    <div>
                      <span className="text-white text-xs font-bold block group-hover:text-blue-400 transition-colors">
                        {u.fullName}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">{u.email}</span>
                    </div>
                    <span className="bg-slate-900 border border-slate-800 text-blue-450 font-mono text-[9px] font-black px-2 py-0.5 rounded-md group-hover:border-blue-500/20">
                      {u.uid}
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-center py-4 text-[10px] font-mono text-slate-600">
                  No sibling investor nodes matched.
                </div>
              )}
            </div>
          </div>

          {/* Camera Reset and troubleshooting line */}
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono px-1">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Scan recipient's custom QR leaf card.
            </span>
            <button
              onClick={startCamera}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 animate-spin-slow" />
              Reset Camera
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
