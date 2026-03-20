import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ProposedVenue } from '@/api/entities';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

export default function ProposeVenueForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const categories = [
    "Food & Drink", "Parrucchieri", "Libreria", "Telefonia",
    "Gioielleria", "Palestra", "Occhiali", "Abbigliamento", "Travel", "Altro"
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await ProposedVenue.create(data);
      reset();
      setValue("category", "Food & Drink");
      navigate(createPageUrl('ThankYou'));
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast.error("Qualcosa è andato storto. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#255ff1]/5 rounded-full blur-[80px] pointer-events-none" />

      <h2 className="text-2xl font-bold text-white mb-6 relative z-10">Proponi una Collaborazione</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-300">Nome</Label>
            <Input {...register("first_name", { required: "Il nome è obbligatorio" })}
              className="bg-white/5 border-white/10 text-white focus:border-[#255ff1]" placeholder="Mario" />
            {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Cognome</Label>
            <Input {...register("last_name", { required: "Il cognome è obbligatorio" })}
              className="bg-white/5 border-white/10 text-white focus:border-[#255ff1]" placeholder="Rossi" />
            {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-300">Classe</Label>
            <Input {...register("student_class", { required: "La classe è obbligatoria" })}
              className="bg-white/5 border-white/10 text-white focus:border-[#255ff1]" placeholder="es. 5A" />
            {errors.student_class && <p className="text-red-500 text-xs">{errors.student_class.message}</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Categoria Locale</Label>
            <Select onValueChange={(val) => setValue("category", val)} defaultValue="Food & Drink">
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Nome Locale</Label>
          <Input {...register("venue_name", { required: "Il nome del locale è obbligatorio" })}
            className="bg-white/5 border-white/10 text-white focus:border-[#255ff1]" placeholder="es. Pizzeria da Marco" />
          {errors.venue_name && <p className="text-red-500 text-xs">{errors.venue_name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Perché vorresti questo locale?</Label>
          <Textarea {...register("reason", { required: "Motivazione obbligatoria" })}
            className="bg-white/5 border-white/10 text-white focus:border-[#255ff1] min-h-[120px]"
            placeholder="Raccontaci perché sarebbe una buona aggiunta alla NationCard..." />
          {errors.reason && <p className="text-red-500 text-xs">{errors.reason.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting}
          className="w-full bg-[#255ff1] hover:bg-[#1e4cd8] text-white font-bold py-6 rounded-xl shadow-[0_0_20px_rgba(37,95,241,0.3)] hover:shadow-[0_0_30px_rgba(37,95,241,0.5)]">
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Invio in corso...</> : <><Send className="mr-2 h-5 w-5" />Invia Proposta</>}
        </Button>
      </form>
    </motion.div>
  );
}
