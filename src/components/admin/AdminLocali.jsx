import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Venue } from '@/api/entities';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Save, X, MapPin, Tag, Image, Link } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY_FORM = {
  name: '', description: '', category: 'Food & Drink',
  discount: '', address: '', lat: '', lng: '', image_url: '',
  cta_url: '', cta_label: ''
};

const CATEGORIES = [
  "Food & Drink", "Parrucchieri", "Libreria", "Telefonia",
  "Gioielleria", "Palestra", "Occhiali", "Abbigliamento", "Travel"
];

export default function AdminLocali() {
  const [editingVenue, setEditingVenue] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [previewImg, setPreviewImg] = useState(false);
  const queryClient = useQueryClient();

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: () => Venue.list('name'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => Venue.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['venues'] }); resetForm(); toast.success('Locale creato con successo ✓'); },
    onError: (e) => toast.error('Errore: ' + e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => Venue.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['venues'] }); resetForm(); toast.success('Locale aggiornato ✓'); },
    onError: (e) => toast.error('Errore: ' + e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => Venue.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['venues'] }); toast.success('Locale eliminato'); },
    onError: (e) => toast.error('Errore: ' + e.message),
  });

  const resetForm = () => { setFormData(EMPTY_FORM); setEditingVenue(null); setShowForm(false); setPreviewImg(false); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData, lat: formData.lat ? parseFloat(formData.lat) : null, lng: formData.lng ? parseFloat(formData.lng) : null };
    if (editingVenue) updateMutation.mutate({ id: editingVenue.id, data });
    else createMutation.mutate(data);
  };

  const handleEdit = (venue) => {
    setFormData({ ...EMPTY_FORM, ...venue, lat: venue.lat?.toString() || '', lng: venue.lng?.toString() || '' });
    setEditingVenue(venue);
    setShowForm(true);
    setPreviewImg(!!venue.image_url);
  };

  const set = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target?.value ?? e }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Locali Convenzionati</h2>
          <p className="text-gray-400 text-sm mt-1">{venues.length} locali nel circuito</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingVenue(null); setFormData(EMPTY_FORM); }}
          className="bg-[#255ff1] hover:bg-[#1e4cd8]">
          <Plus className="w-4 h-4 mr-2" />Nuovo Locale
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-[#111] border-[#255ff1]/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{editingVenue ? '✏️ Modifica Locale' : '➕ Nuovo Locale'}</h3>
              <Button size="icon" variant="ghost" onClick={resetForm}><X className="w-4 h-4 text-gray-400" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-1"><Tag className="w-3 h-3"/>Nome Locale *</Label>
                  <Input value={formData.name} onChange={set('name')} className="bg-white/5 border-white/10 text-white" required placeholder="es. Pizzeria Napoli" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Sconto *</Label>
                  <Input value={formData.discount} onChange={set('discount')} placeholder="es. 20% oppure 2x1" className="bg-white/5 border-white/10 text-white" required />
                </div>
              </div>

              {/* Row 2 */}
              <div className="space-y-2">
                <Label className="text-gray-300">Descrizione</Label>
                <Textarea value={formData.description} onChange={set('description')} className="bg-white/5 border-white/10 text-white" placeholder="Breve descrizione del locale e dell'offerta..." />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Categoria</Label>
                  <Select value={formData.category} onValueChange={set('category')}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-1"><MapPin className="w-3 h-3"/>Indirizzo</Label>
                  <Input value={formData.address} onChange={set('address')} className="bg-white/5 border-white/10 text-white" placeholder="Via Roma 1, Ladispoli" />
                </div>
              </div>

              {/* Row 4 – Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 text-xs">Latitudine (opzionale)</Label>
                  <Input type="number" step="any" value={formData.lat} onChange={set('lat')} className="bg-white/5 border-white/10 text-white text-sm" placeholder="41.9535..." />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-xs">Longitudine (opzionale)</Label>
                  <Input type="number" step="any" value={formData.lng} onChange={set('lng')} className="bg-white/5 border-white/10 text-white text-sm" placeholder="12.0733..." />
                </div>
              </div>

              {/* Row 5 – Image */}
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-1"><Image className="w-3 h-3"/>URL Immagine</Label>
                <div className="flex gap-2">
                  <Input type="url" value={formData.image_url} onChange={set('image_url')} className="bg-white/5 border-white/10 text-white flex-1" placeholder="https://..." />
                  {formData.image_url && (
                    <Button type="button" size="sm" variant="outline" onClick={() => setPreviewImg(!previewImg)} className="shrink-0 text-xs">
                      {previewImg ? 'Nascondi' : 'Preview'}
                    </Button>
                  )}
                </div>
                {previewImg && formData.image_url && (
                  <div className="mt-2 rounded-xl overflow-hidden h-32 w-full">
                    <img src={formData.image_url} alt="preview" className="w-full h-full object-cover" onError={() => setPreviewImg(false)} />
                  </div>
                )}
              </div>

              {/* Row 6 – CTA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-1"><Link className="w-3 h-3"/>URL Pulsante (opzionale)</Label>
                  <Input type="url" value={formData.cta_url} onChange={set('cta_url')} className="bg-white/5 border-white/10 text-white" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Testo Pulsante</Label>
                  <Input value={formData.cta_label} onChange={set('cta_label')} className="bg-white/5 border-white/10 text-white" placeholder="es. Richiedi il tuo sconto" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="bg-[#255ff1] hover:bg-[#1e4cd8]" disabled={createMutation.isPending || updateMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />{createMutation.isPending || updateMutation.isPending ? 'Salvataggio...' : 'Salva'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}><X className="w-4 h-4 mr-2" />Annulla</Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="grid gap-3">
          {venues.map((venue) => (
            <Card key={venue.id} className="bg-[#111] border-white/10 p-4 hover:border-white/20 transition-colors">
              <div className="flex gap-4 items-start">
                {venue.image_url && (
                  <img src={venue.image_url} alt={venue.name} className="w-16 h-16 rounded-lg object-cover shrink-0" onError={(e) => e.target.style.display='none'} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-lg font-bold text-white truncate">{venue.name}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge className="bg-[#255ff1]/20 text-[#255ff1] border-[#255ff1]/30 text-xs">{venue.discount}</Badge>
                        <Badge className="bg-white/5 text-gray-400 border-white/10 text-xs">{venue.category}</Badge>
                        {venue.lat && venue.lng && <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">📍 Geo</Badge>}
                        {venue.cta_url && <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">🔗 CTA</Badge>}
                      </div>
                      {venue.address && <p className="text-gray-500 text-xs mt-1 truncate">{venue.address}</p>}
                      {venue.description && <p className="text-gray-400 text-xs mt-1 line-clamp-1">{venue.description}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(venue)} className="text-[#255ff1] hover:bg-[#255ff1]/10 h-8 w-8">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => { if (confirm(`Eliminare "${venue.name}"?`)) deleteMutation.mutate(venue.id); }}
                        className="text-red-500 hover:bg-red-500/10 h-8 w-8" disabled={deleteMutation.isPending}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {venues.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Nessun locale ancora. Aggiungine uno!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
