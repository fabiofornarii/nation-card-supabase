import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const faqs = [
    {
      question: "Come faccio a ottenere la Nation Card?",
      answer: "Parlane con il tuo rappresentante di classe e comunicagli che vuoi la Nation Card.\nLui ci invierà la richiesta e, con un contributo simbolico di €2, la tessera sarà tua."
    },
    {
      question: "In quanto tempo riceverò la Nation Card?",
      answer: "Super veloce 🚀\nUna volta che il rappresentante di classe ci ha inoltrato la richiesta, riceverai la Nation Card entro massimo 2 giorni, direttamente in classe."
    },
    {
      question: "Perché devo pagare €2?",
      answer: "Il costo è simbolico, ma importante.\nCi aiuta a finanziare altri progetti e iniziative che porteremo avanti durante tutto l’anno scolastico."
    },
    {
      question: "Sono un rappresentante di classe: dove trovo il modulo per richiedere le Nation Card?",
      answer: "Puoi trovare il form nella bacheca delle comunicazioni dei Rappresentanti di classe.\nIn alternativa, scrivi in privato a uno dei rappresentanti d’istituto e te lo rimandiamo subito."
    },
    {
      question: "Devo rinnovare la Nation Card ogni anno?",
      answer: "Sì, la Nation Card è valida per l’anno scolastico in corso.\nOgni anno viene rinnovata per garantire nuove convenzioni e progetti sempre aggiornati."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      {/* Decorative blurry blob */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#255ff1]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-4">
            <HelpCircle className="w-6 h-6 text-[#255ff1]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
            DOMANDE? <br/>
            <span className="text-gray-500">NO STRESS.</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <AccordionItem value={`item-${index}`} className="border border-white/10 bg-white/5 rounded-2xl px-6">
                <AccordionTrigger className="text-white hover:text-[#255ff1] font-bold text-lg py-6 hover:no-underline transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-6 text-base leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}