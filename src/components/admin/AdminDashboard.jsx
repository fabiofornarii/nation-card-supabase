import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Venue, ClassRepresentativeReport, ProposedVenue } from '@/api/entities';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MapPin, Users, Lightbulb, TrendingUp } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#255ff1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function AdminDashboard() {
  const { data: venues = [] } = useQuery({ queryKey: ['venues'], queryFn: () => Venue.list() });
  const { data: reports = [] } = useQuery({ queryKey: ['class-rep-reports'], queryFn: () => ClassRepresentativeReport.list('-created_at') });
  const { data: proposals = [] } = useQuery({ queryKey: ['proposed-venues'], queryFn: () => ProposedVenue.list('-created_at') });

  const totalAdhesions = Array.isArray(reports) ? reports.reduce((s, r) => s + (r.adhesions_count || 0), 0) : 0;

  // Category distribution of venues
  const categoryData = Array.isArray(venues) ? Object.entries(
    venues.reduce((acc, v) => { acc[v.category] = (acc[v.category] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value })) : [];

  // Adhesions by class
  const adhesionsByClass = Array.isArray(reports) ? reports
    .reduce((acc, r) => { acc[r.student_class] = (acc[r.student_class] || 0) + (r.adhesions_count || 0); return acc; }, {}) : {};
  const classData = Object.entries(adhesionsByClass).map(([classe, adesioni]) => ({ classe, adesioni })).sort((a, b) => b.adesioni - a.adesioni).slice(0, 10);

  const stats = [
    { label: 'Locali Convenzionati', value: venues.length, Icon: MapPin, color: '#255ff1', bg: 'bg-[#255ff1]/10' },
    { label: 'Adesioni Tessere', value: totalAdhesions, Icon: Users, color: '#10b981', bg: 'bg-green-600/10' },
    { label: 'Classi Partecipanti', value: new Set(reports.map(r => r.student_class)).size, Icon: TrendingUp, color: '#8b5cf6', bg: 'bg-purple-600/10' },
    { label: 'Proposte Community', value: proposals.length, Icon: Lightbulb, color: '#f59e0b', bg: 'bg-amber-600/10' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-black text-white mb-1">Dashboard</h2>
        <p className="text-gray-400">Panoramica generale della Nation Card</p>
      </motion.div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, Icon, color, bg }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="bg-[#111] border-white/10 p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{label}</p>
                  <p className="text-3xl font-bold text-white">{value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#111] border-white/10 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Locali per Categoria</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-[280px] flex items-center justify-center text-gray-500">Nessun locale ancora</div>}
        </Card>

        <Card className="bg-[#111] border-white/10 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Adesioni per Classe</h3>
          {classData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={classData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="classe" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} />
                <Bar dataKey="adesioni" fill="#255ff1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-[280px] flex items-center justify-center text-gray-500">Nessun dato adesioni</div>}
        </Card>
      </div>

      {/* Ultime proposte */}
      {proposals.length > 0 && (
        <Card className="bg-[#111] border-white/10 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Ultime Proposte Community</h3>
          <div className="space-y-3">
            {proposals.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <span className="text-white font-medium">{p.venue_name}</span>
                  <span className="text-gray-400 text-sm ml-2">— {p.first_name} {p.last_name}, {p.student_class}</span>
                </div>
                <span className="text-gray-500 text-xs">{new Date(p.created_at).toLocaleDateString('it-IT')}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
