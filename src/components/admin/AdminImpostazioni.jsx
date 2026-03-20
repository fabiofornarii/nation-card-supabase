import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Key, ExternalLink, Database, AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminImpostazioni() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const isConfigured = !!supabaseUrl;

  const handleDeleteAllReports = async () => {
    setIsDeleting(true);
    try {
      const { error: e1 } = await supabase.from('class_representative_reports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (e1) throw e1;
      const { error: e2 } = await supabase.from('proposed_venues').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (e2) throw e2;
      queryClient.invalidateQueries();
      toast.success('Tutti i dati sono stati eliminati');
      setShowDeleteDialog(false);
    } catch (err) {
      toast.error('Errore: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Impostazioni</h2>
        <p className="text-gray-400 text-sm mt-1">Configurazione e gestione del sistema</p>
      </div>

      {/* Supabase status */}
      <Card className="bg-[#111] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-[#255ff1]" />Stato Connessione Supabase
          </CardTitle>
          <CardDescription className="text-gray-400">Verifica la configurazione del database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${isConfigured ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
            <CheckCircle2 className={`w-5 h-5 ${isConfigured ? 'text-green-400' : 'text-red-400'}`} />
            <div>
              <p className={`font-medium ${isConfigured ? 'text-green-300' : 'text-red-300'}`}>
                {isConfigured ? 'Connesso' : 'Non configurato'}
              </p>
              <p className="text-gray-400 text-sm">
                {isConfigured ? supabaseUrl : 'Imposta VITE_SUPABASE_URL nel file .env'}
              </p>
            </div>
          </div>
          <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
              <ExternalLink className="w-4 h-4 mr-2" />Apri Supabase Dashboard
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* Password admin info */}
      <Card className="bg-[#111] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><Key className="w-5 h-5 text-[#255ff1]" />Credenziali Admin</CardTitle>
          <CardDescription className="text-gray-400">La password è definita direttamente nel codice sorgente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-300 text-sm">Per cambiare la password di accesso al pannello admin, modifica la costante <code className="text-[#255ff1] bg-[#255ff1]/10 px-1 rounded">ADMIN_PASSWORD</code> nel file <code className="text-[#255ff1] bg-[#255ff1]/10 px-1 rounded">src/pages/AdminPanel.jsx</code>.</p>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="bg-[#111] border-red-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />Zona Pericolosa
          </CardTitle>
          <CardDescription className="text-gray-400">Azioni irreversibili — usare con cautela</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/20 flex items-start justify-between gap-4">
            <div>
              <p className="text-white font-medium">Elimina Report e Proposte</p>
              <p className="text-gray-400 text-sm mt-1">Rimuove tutti i report adesioni e le proposte community. I locali convenzionati NON vengono eliminati.</p>
            </div>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="shrink-0">
              <Trash2 className="w-4 h-4 mr-2" />Elimina
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#111] border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />Sei assolutamente sicuro?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Questa azione eliminerà permanentemente tutti i report adesioni e le proposte community. Non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAllReports} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? 'Eliminazione...' : 'Sì, Elimina Tutto'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
