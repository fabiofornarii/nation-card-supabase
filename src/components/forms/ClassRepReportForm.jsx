import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClassRepresentativeReport } from '@/api/entities';
import { toast } from 'sonner';
import { Loader2, Send, Users } from 'lucide-react';

export default function ClassRepReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const classes = [];
  for (let num = 1; num <= 5; num++) {
    for (let letter of ['A', 'B', 'D', 'E', 'F', 'G', 'H']) {
      classes.push(`${num}${letter}`);
    }
  }

  const onSubmit = async (data) => {
    if (!selectedClass) { toast.error("Seleziona la classe"); return; }
    setIsSubmitting(true);
    try {
      await ClassRepresentativeReport.create({
        ...data,
        student_class: selectedClass,
        adhesions_count: Number(data.adhesions_count)
      });
      reset();
      navigate(createPageUrl('ThankYou'), {
        state: {
          title: "REPORT INVIATO!",
          message: "Grazie per il tuo prezioso lavoro. I dati delle adesioni sono stati registrati correttamente."
        }
      });
    } catch (error) {
      console.error("Error submitting report:", error);
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
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />
      <h2 className="text-2xl font-bold text-white mb-6 relative z-10 flex items-center gap-2">
        <Users className="text-[#255ff1]" />Report Adesioni Classe
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-300">Nome Rappresentante</Label>
            <Input {...register("first_name", { required: "Il nome è obbligatorio" })}
              className="bg-white/5 border-white/10 text-white focus:border-[#255ff1]" placeholder="Mario" />
            {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Cognome Rappresentante</Label>
            <Input {...register("last_name", { required: "Il cognome è obbligatorio" })}
              className="bg-white/5 border-white/10 text-white focus:border-[#255ff1]" placeholder="Rossi" />
            {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-300">Classe</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="Seleziona classe" /></SelectTrigger>
              <SelectContent>{classes.map(cls => <SelectItem key={cls} value={cls}>{cls}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Numero Adesioni</Label>
            <Input type="number" min="0"
              {...register("adhesions_count", { required: "Obbligatorio", min: 0 })}
              className="bg-white/5 border-white/10 text-white focus:border-[#255ff1]" placeholder="0" />
            {errors.adhesions_count && <p className="text-red-500 text-xs">{errors.adhesions_count.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Note Aggiuntive (Opzionale)</Label>
          <Textarea {...register("notes")}
            className="bg-white/5 border-white/10 text-white focus:border-[#255ff1] min-h-[100px]"
            placeholder="Eventuali segnalazioni o richieste particolari..." />
        </div>

        <Button type="submit" disabled={isSubmitting}
          className="w-full bg-[#255ff1] hover:bg-[#1e4cd8] text-white font-bold py-6 rounded-xl shadow-[0_0_20px_rgba(37,95,241,0.3)]">
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Invio in corso...</> : <><Send className="mr-2 h-5 w-5" />Invia Report Adesioni</>}
        </Button>
      </form>
    </motion.div>
  );
}
