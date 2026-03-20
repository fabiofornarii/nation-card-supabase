import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animation for mouse movement
  const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    x.set(clientX - left);
    y.set(clientY - top);
  }

  // Dynamic gradient background that follows mouse
  const background = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(37, 95, 241, 0.15), transparent 80%)`;

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-10 group">

      {/* Interactive Background */}
      <motion.div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background }} />

      
      <div className="container mx-auto px-4 text-center relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">

          <Star className="w-4 h-4 text-[#255ff1] fill-[#255ff1]" />
          <span className="text-sm font-medium text-gray-300">La card #1 per studenti</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 select-none">

          VIVI LA CITTÀ <br />
          <span className="relative inline-block text-white mt-2">
            <motion.span
              className="absolute -inset-1 md:-inset-2 bg-[#255ff1] opacity-70 blur-lg rounded-lg"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                rotate: [2, -2, 2]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}>
            </motion.span>
            <span className="relative z-10 text-white px-2 md:px-4 italic transform -skew-x-12 inline-block bg-[#255ff1]">SENZA LIMITI</span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">Cibo, shopping, tempo libero.
Gli sconti giusti per noi studenti del Pertini.



        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center mt-12">

          <a href="#locali" className="flex flex-col items-center gap-3 group cursor-pointer text-gray-400 hover:text-white transition-colors">
            <span className="text-sm uppercase tracking-widest font-bold">Scorri per scoprire di più</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="p-3 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm group-hover:border-[#255ff1]/50 group-hover:bg-[#255ff1]/10 transition-colors">

              <ArrowRight className="w-5 h-5 rotate-90 text-[#255ff1]" />
            </motion.div>
          </a>
        </motion.div>
      </div>
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
    </section>);

}