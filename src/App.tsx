import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ShieldCheck, Lock, Delete, ChevronRight } from 'lucide-react';

type AppState = 'input' | 'processing' | 'result';

interface NumberButtonProps {
  value: string | React.ReactNode;
  onClick: () => void;
  className?: string;
}

const NumberButton: React.FC<NumberButtonProps> = ({ value, onClick, className = "" }) => (
  <motion.button
    whileTap={{ scale: 0.9, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
    onClick={onClick}
    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl font-medium backdrop-blur-md bg-white/10 border border-white/10 shadow-lg transition-colors hover:bg-white/15 ${className}`}
  >
    {value}
  </motion.button>
);

export default function App() {
  const [step, setStep] = useState<AppState>('input');
  const [pin, setPin] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'processing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (step === 'processing' && timeLeft === 0) {
      setStep('result');
    }
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const handleNumberClick = (num: string) => {
    if (pin.length < 16) {
      setPin(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    if (pin.length > 0) {
      setStep('processing');
      setTimeLeft(30);
    }
  };

  const handleCancel = () => {
    setPin('');
    setStep('input');
  };

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden font-sans text-white selection:bg-white/30 select-none touch-none">
      {/* Liquid Glass Background */}
      <div className="absolute inset-0 -z-10 bg-[#0a0a0a]">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-pink-600/15 blur-[100px] animate-pulse delay-1000" />
      </div>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(15px)" }}
            className="h-full flex flex-col items-center justify-between py-8 px-6 max-w-md mx-auto w-full"
          >
            {/* Header */}
            <div className="text-center mt-4 sm:mt-8">
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Lock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 text-white/50" />
                <h1 className="text-2xl sm:text-3xl font-light tracking-tight mb-1">Verify that it's you</h1>
                <p className="text-white/30 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium">Enter your current pin</p>
              </motion.div>
            </div>

            {/* PIN Display (Dots) */}
            <div className="flex-1 flex items-center justify-center w-full py-4">
              <div className="flex flex-wrap gap-3 sm:gap-4 min-h-[40px] items-center justify-center max-w-full px-4">
                {pin.length === 0 ? (
                  <span className="text-white/20 text-sm sm:text-base tracking-[0.4em] animate-pulse font-light">ENTER PIN</span>
                ) : (
                  pin.split('').map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                    />
                  ))
                )}
              </div>
            </div>

            {/* Number Pad Area */}
            <div className="w-full flex flex-col gap-6 sm:gap-8 mb-4 sm:mb-8">
              <div className="grid grid-cols-3 gap-y-4 sm:gap-y-6 gap-x-6 sm:gap-x-10 justify-items-center">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <NumberButton key={num} value={num} onClick={() => handleNumberClick(num)} />
                ))}
                <button 
                  onClick={handleCancel}
                  className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center text-xs sm:text-sm font-medium text-white/40 hover:text-white transition-colors active:scale-95"
                >
                  Cancel
                </button>
                <NumberButton value="0" onClick={() => handleNumberClick('0')} />
                <NumberButton 
                  value={<Delete className="w-5 h-5 sm:w-6 sm:h-6" />} 
                  onClick={handleBackspace} 
                  className="bg-white/5 border-transparent"
                />
              </div>

              {/* Enter Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEnter}
                disabled={pin.length === 0}
                className={`w-full py-4 sm:py-5 rounded-2xl flex items-center justify-center gap-2 text-base sm:text-lg font-medium transition-all duration-500 backdrop-blur-2xl border ${
                  pin.length > 0 
                  ? "bg-white text-black border-white shadow-[0_0_40px_rgba(255,255,255,0.15)]" 
                  : "bg-white/5 text-white/20 border-white/5 cursor-not-allowed"
                }`}
              >
                Enter <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center px-8 max-w-md mx-auto w-full"
          >
            <div className="relative mb-10 p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <div className="absolute inset-0 blur-2xl bg-blue-500/20 rounded-full" />
                <Loader2 className="w-16 h-16 sm:w-24 sm:h-24 text-blue-400 relative z-10" />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white/30" />
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-light mb-3 tracking-tight">Verifying Identity</h2>
            <p className="text-white/30 text-center mb-10 text-base sm:text-lg font-light">
              Securing your session...
            </p>
            
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden backdrop-blur-md border border-white/5">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 30, ease: "linear" }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              />
            </div>
            <p className="mt-6 text-lg sm:text-xl font-mono text-blue-400/70">
              {timeLeft}s
            </p>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center px-8 max-w-md mx-auto w-full"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 100 }}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500/20 backdrop-blur-2xl border border-green-500/30 rounded-full flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(34,197,94,0.15)]"
            >
              <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-green-400" />
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl font-light mb-3 tracking-tight">Access Granted</h2>
            <p className="text-white/30 text-center mb-12 text-base sm:text-lg font-light">
              Identity verified successfully.
            </p>

            <div className="bg-white/5 backdrop-blur-3xl p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] w-full text-center border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-white/20 mb-4 sm:mb-6 font-bold">Your Secure PIN</p>
              <p className="text-4xl sm:text-6xl font-mono tracking-[0.2em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] break-all px-2">
                {pin}
              </p>
            </div>

            <button
              onClick={handleCancel}
              className="mt-12 sm:mt-16 px-10 sm:px-12 py-3 sm:py-4 bg-white/10 backdrop-blur-2xl border border-white/10 text-white rounded-full text-base sm:text-lg font-light hover:bg-white/20 transition-all duration-300 shadow-xl active:scale-95"
            >
              Start Over
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
