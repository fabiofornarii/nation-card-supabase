import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Lock, Users, BarChart3, Settings, Lightbulb, LogOut } from 'lucide-react';
import AdminLocali from '@/components/admin/AdminLocali';
import AdminTessere from '@/components/admin/AdminTessere';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminProposte from '@/components/admin/AdminProposte';
import AdminImpostazioni from '@/components/admin/AdminImpostazioni';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const ADMIN_PASSWORD = 'PertiniRapp2025.6';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      toast.success('Accesso consentito ✓');
    } else {
      toast.error('Password errata');
      setPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#255ff1]/10 rounded-full blur-[120px]" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full relative z-10">
          <div className="w-16 h-16 bg-[#255ff1]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#255ff1]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1 text-center">Pannello Amministratore</h1>
          <p className="text-gray-400 mb-8 text-center text-sm">Inserisci la password per accedere</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Input type={showPass ? 'text' : 'password'} placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white focus:border-[#255ff1] pr-20" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs hover:text-white transition-colors">
                {showPass ? 'Nascondi' : 'Mostra'}
              </button>
            </div>
            <Button type="submit" className="w-full bg-[#255ff1] hover:bg-[#1e4cd8] font-bold py-5">Accedi</Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#255ff1]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 py-10 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-1">Pannello Admin</h1>
            <p className="text-gray-400">Nation Card — Liceo Pertini Ladispoli</p>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5">
            <LogOut className="w-4 h-4 mr-2" />Esci
          </Button>
        </motion.div>

        <Tabs defaultValue="dashboard" className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="bg-[#111] border border-white/10 mb-8 w-max">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#255ff1] data-[state=active]:text-white">
                <BarChart3 className="w-4 h-4 mr-2" />Dashboard
              </TabsTrigger>
              <TabsTrigger value="locali" className="data-[state=active]:bg-[#255ff1] data-[state=active]:text-white">
                <MapPin className="w-4 h-4 mr-2" />Locali
              </TabsTrigger>
              <TabsTrigger value="tessere" className="data-[state=active]:bg-[#255ff1] data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />Tessere
              </TabsTrigger>
              <TabsTrigger value="proposte" className="data-[state=active]:bg-[#255ff1] data-[state=active]:text-white">
                <Lightbulb className="w-4 h-4 mr-2" />Proposte
              </TabsTrigger>
              <TabsTrigger value="impostazioni" className="data-[state=active]:bg-[#255ff1] data-[state=active]:text-white">
                <Settings className="w-4 h-4 mr-2" />Impostazioni
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard"><AdminDashboard /></TabsContent>
          <TabsContent value="locali"><AdminLocali /></TabsContent>
          <TabsContent value="tessere"><AdminTessere /></TabsContent>
          <TabsContent value="proposte"><AdminProposte /></TabsContent>
          <TabsContent value="impostazioni"><AdminImpostazioni /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
