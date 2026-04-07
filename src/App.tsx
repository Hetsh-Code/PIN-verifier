import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';

type AppState = 'input' | 'processing' | 'result';

export default function App() {
  const [step, setStep] = useState<AppState>('input');
  const [pin, setPin] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (step === 'input' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

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

  const handleContinue = () => {
    if (pin.length > 0) {
      setStep('processing');
      setTimeLeft(30);
    }
  };

  const handleCancel = () => {
    setPin('');
    setStep('input');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] flex flex-col font-sans text-white relative">
      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col px-8 pt-24 max-w-md mx-auto w-full"
            onClick={() => inputRef.current?.focus()}
          >
            <h1 className="text-3xl font-medium text-center mb-24 tracking-tight">
              Verify that it's you
            </h1>

            <div className="flex-1 flex flex-col items-center cursor-text">
              <p className="text-xl text-gray-300 mb-16">
                Enter your current pin
              </p>

              <div className="relative w-full">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={handleKeyDown}
                  className={`w-full bg-transparent border-none outline-none text-center font-mono tracking-widest placeholder:text-gray-600 transition-all ${
                    pin.length > 12 ? 'text-2xl' : pin.length > 6 ? 'text-4xl' : 'text-6xl'
                  }`}
                  placeholder="0000"
                  autoFocus
                />
                <div className="h-[2px] bg-white w-full mt-6"></div>
                <p className="text-center text-sm text-gray-500 mt-6">
                  {pin.length > 0 ? `${pin.length} digits entered` : 'Tap to type'}
                </p>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="fixed bottom-0 left-0 right-0 h-20 border-t border-gray-700 flex bg-[#1c1c1c]">
              <button
                onClick={handleCancel}
                className="flex-1 text-xl font-normal hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <div className="w-[1px] bg-gray-700 h-full"></div>
              <button
                onClick={handleContinue}
                className="flex-1 text-xl font-bold text-blue-400 hover:bg-white/5 transition-colors"
              >
                Enter
              </button>
            </div>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-8 max-w-md mx-auto w-full"
          >
            <div className="relative mb-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-24 h-24 text-blue-500" />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <h2 className="text-2xl font-medium mb-4">Verifying PIN</h2>
            <p className="text-gray-400 text-center mb-12 text-lg">
              This may take a few moments for security purposes.
            </p>
            
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 30, ease: "linear" }}
                className="h-full bg-blue-500"
              />
            </div>
            <p className="mt-6 text-lg font-mono text-blue-400">
              {timeLeft}s remaining
            </p>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-8 max-w-md mx-auto w-full"
          >
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-12">
              <ShieldCheck className="w-14 h-14 text-green-500" />
            </div>
            
            <h2 className="text-3xl font-medium mb-4">Verification Complete</h2>
            <p className="text-gray-400 text-center mb-16 text-lg">
              Your entered PIN has been verified.
            </p>

            <div className="bg-white/5 p-8 rounded-3xl w-full text-center border border-white/10 shadow-xl">
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-bold">Entered PIN</p>
              <p className="text-5xl font-mono tracking-widest text-white">
                {pin}
              </p>
            </div>

            <button
              onClick={() => {
                setPin('');
                setStep('input');
              }}
              className="mt-16 px-12 py-4 bg-white text-black rounded-full text-xl font-medium hover:bg-gray-200 transition-colors shadow-lg"
            >
              Start Over
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
