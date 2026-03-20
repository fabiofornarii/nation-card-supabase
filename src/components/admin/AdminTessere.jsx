import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClassRepresentativeReport } from '@/api/entities';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Users, TrendingUp, Hash, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminTessere() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['class-rep-reports'],
    queryFn: () => ClassRepresentativeReport.list('-created_at'),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => ClassRepresentativeReport.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['class-rep-reports'] }); toast.success('Report eliminato'); },
  });

  const classes = [];
  for (let num = 1; num <= 5; num++)
    for (let letter of ['A', 'B', 'D', 'E', 'F', 'G', 'H'])
      classes.push(`${num}${letter}`);

  const filteredReports = Array.isArray(reports) ? reports.filter(r => {
    const matchSearch = (r.first_name + ' ' + r.last_name + ' ' + r.student_class).toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = classFilter === 'all' || r.student_class === classFilter;
    return matchSearch && matchClass;
  }) : [];

  const totalAdhesions = Array.isArray(reports) ? reports.reduce((s, r) => s + (r.adhesions_count || 0), 0) : 0;
  const totalClasses = Array.isArray(reports) ? new Set(reports.map(r => r.student_class)).size : 0;

  const grouped = filteredReports.reduce((acc, r) => {
    if (!acc[r.student_class]) acc[r.student_class] = [];
    acc[r.student_class].push(r);
    return acc;
  }, {});

  const exportCSV = () => {
    const rows = [['Nome', 'Cognome', 'Classe', 'Adesioni', 'Note', 'Data']];
    reports.forEach(r => rows.push([r.first_name, r.last_name, r.student_class, r.adhesions_count, r.notes || '', new Date(r.created_at).toLocaleDateString('it-IT')]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'tessere_nation_card.csv'; a.click();
  };

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#255ff1]"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Tessere Studentesche</h2>
          <p className="text-gray-400 text-sm mt-1">Report adesioni dai rappresentanti di classe</p>
        </div>
        <Button onClick={exportCSV} variant="outline" className="border-white/10 text-white hover:bg-white/5">
          <Download className="w-4 h-4 mr-2" />Esporta CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#111] border-white/10 p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#255ff1]/10 rounded-xl"><Users className="w-6 h-6 text-[#255ff1]" /></div>
            <div><p className="text-gray-400 text-sm">Adesioni Totali</p><p className="text-3xl font-bold text-white">{totalAdhesions}</p></div>
          </div>
        </Card>
        <Card className="bg-[#111] border-white/10 p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-600/10 rounded-xl"><Hash className="w-6 h-6 text-purple-400" /></div>
            <div><p className="text-gray-400 text-sm">Classi Partecipanti</p><p className="text-3xl font-bold text-white">{totalClasses}</p></div>
          </div>
        </Card>
        <Card className="bg-[#111] border-white/10 p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-600/10 rounded-xl"><TrendingUp className="w-6 h-6 text-green-400" /></div>
            <div><p className="text-gray-400 text-sm">Media per Classe</p><p className="text-3xl font-bold text-white">{totalClasses > 0 ? (totalAdhesions / totalClasses).toFixed(1) : 0}</p></div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Cerca per nome o classe..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10 text-white"><SelectValue placeholder="Tutte le classi" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte le classi</SelectItem>
            {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Report groups */}
      <div className="space-y-4">
        {Object.keys(grouped).sort().map(className => {
          const classTotal = grouped[className].reduce((s, r) => s + (r.adhesions_count || 0), 0);
          return (
            <div key={className} className="space-y-2">
              <h3 className="text-lg font-bold text-[#255ff1] flex items-center gap-2">
                <Hash className="w-5 h-5" />Classe {className}
                <Badge className="bg-green-600/20 text-green-400 border-green-600/30 ml-1">{classTotal} {classTotal === 1 ? 'tessera' : 'tessere'}</Badge>
              </h3>
              {grouped[className].map((report) => (
                <motion.div key={report.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="bg-[#111] border-white/10 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white">{report.first_name} {report.last_name}</h4>
                          <Badge className="bg-[#255ff1]/20 text-[#255ff1] border-[#255ff1]/30 text-xs">{report.student_class}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{report.adhesions_count} adesioni</span>
                          <span>{new Date(report.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        {report.notes && <p className="mt-2 text-xs text-gray-300 bg-white/5 rounded-lg px-3 py-2">{report.notes}</p>}
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => { if (confirm('Eliminare questo report?')) deleteMutation.mutate(report.id); }}
                        className="text-red-500 hover:bg-red-500/10 h-8 w-8">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          );
        })}
        {filteredReports.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Nessun report trovato</p>
          </div>
        )}
      </div>
    </div>
  );
}
