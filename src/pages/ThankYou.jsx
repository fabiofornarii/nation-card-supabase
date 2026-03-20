import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle2, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

export default function ThankYou() {
  const { state } = useLocation();
  const title = state?.title || "GRAZIE MILLE!";
  const message = state?.message;
  const returnTo = state?.returnTo || 'Home';
  const returnLabel = state?.returnLabel || 'Torna alla Home';

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#255ff1]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="max-w-lg w-full bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative z-10"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-[#255ff1]/10 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-[#255ff1]" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black text-white mb-4 tracking-tight"
        >
          {title}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 text-lg mb-8 leading-relaxed"
        >
          {message ? (
            message
          ) : (
            <>
              La tua proposta è stata registrata con successo. <br/>
              Stiamo lavorando per rendere la NationCard sempre più epica grazie al tuo aiuto! 🚀
            </>
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link to={createPageUrl(returnTo)}>
            <Button className="bg-[#255ff1] hover:bg-[#1e4cd8] text-white px-8 py-6 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(37,95,241,0.3)] hover:shadow-[0_0_30px_rgba(37,95,241,0.5)] transition-all duration-300 w-full md:w-auto">
              <CheckCircle2 className="mr-2 w-5 h-5" />
              {returnLabel}
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}