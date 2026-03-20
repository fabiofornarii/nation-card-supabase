import React from 'react';
import { motion } from 'framer-motion';
import ProposeVenueForm from '@/components/forms/ProposeVenueForm';

export default function ProposeVenue() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#255ff1]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4"
          >
            <span className="text-[#255ff1] font-bold tracking-widest uppercase text-sm bg-[#255ff1]/10 px-4 py-2 rounded-full border border-[#255ff1]/20">
              Community
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter"
          >
            PROPONI UN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#255ff1] to-purple-600">LOCALE</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Conosci un posto figo che dovrebbe entrare nel circuito NationCard? 
            Compila il form e faccelo sapere! Se il locale entra, ci sono sorprese per te.
          </motion.p>
        </div>

        <ProposeVenueForm />
      </div>
    </div>
  );
}