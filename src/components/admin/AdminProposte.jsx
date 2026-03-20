import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProposedVenue } from '@/api/entities';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Lightbulb, Trash2, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProposte() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ['proposed-venues'],
    queryFn: () => ProposedVenue.list('-created_at'),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => ProposedVenue.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['proposed-venues'] }); toast.success('Proposta eliminata'); },
  });

  const filtered = proposals.filter(p =>
    (p.venue_name + ' ' + p.first_name + ' ' + p.last_name + ' ' + p.category).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CATEGORY_COLORS = {
    "Food & Drink": "bg-orange-500/20 text-orange-400 border-orange-500/30",
    "Parrucchieri": "bg-pink-500/20 text-pink-400 border-pink-500/30",
    "Palestra": "bg-green-500/20 text-green-400 border-green-500/30",
    "Abbigliamento": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#255ff1]"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Proposte della Community</h2>
          <p className="text-gray-400 text-sm mt-1">{proposals.length} proposte ricevute</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input placeholder="Cerca proposte..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
      </div>

      <div className="grid gap-3">
        {filtered.map((p) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-[#111] border-white/10 p-5 hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h4 className="font-bold text-white text-lg">{p.venue_name}</h4>
                    <Badge className={CATEGORY_COLORS[p.category] || "bg-white/10 text-gray-300 border-white/10"}>{p.category}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{p.first_name} {p.last_name} — Classe {p.student_class}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(p.created_at).toLocaleDateString('it-IT')}</span>
                  </div>
                  {p.reason && (
                    <div className="bg-white/5 rounded-lg px-4 py-3 border border-white/5">
                      <p className="text-gray-300 text-sm italic">"{p.reason}"</p>
                    </div>
                  )}
                </div>
                <Button size="icon" variant="ghost" onClick={() => { if (confirm('Eliminare questa proposta?')) deleteMutation.mutate(p.id); }}
                  className="text-red-500 hover:bg-red-500/10 shrink-0 h-8 w-8">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Nessuna proposta ancora ricevuta</p>
          </div>
        )}
      </div>
    </div>
  );
}
