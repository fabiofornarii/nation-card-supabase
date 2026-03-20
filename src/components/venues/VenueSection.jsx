import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Search, MapPin, Tag, Utensils, Scissors, BookOpen, Smartphone, Gem, Dumbbell, Glasses, Shirt, Plane, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Venue } from '@/api/entities';
import { useQuery } from '@tanstack/react-query';

const CATEGORY_ICONS = {
  "Food & Drink": Utensils,
  "Parrucchieri": Scissors,
  "Libreria": BookOpen,
  "Telefonia": Smartphone,
  "Gioielleria": Gem,
  "Palestra": Dumbbell,
  "Occhiali": Glasses,
  "Abbigliamento": Shirt,
  "Travel": Plane
};

export default function VenueSection() {
  const [activeCategory, setActiveCategory] = useState("Tutti");
  const [searchTerm, setSearchTerm] = useState("");

const { data: venues = [], isLoading } = useQuery({
  queryKey: ['venues'],
  queryFn: () => Venue.list('name'),
});

  const categories = ["Tutti", "Food & Drink", "Parrucchieri", "Libreria", "Telefonia", "Gioielleria", "Palestra", "Occhiali", "Abbigliamento", "Travel"];

  const filteredVenues = Array.isArray(venues) ? venues.filter(venue => {
    const matchesCategory = activeCategory === "Tutti" || venue.category === activeCategory;
    const matchesSearch = venue.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          venue.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }) : [];

  return (
    <section id="locali" className="py-20 bg-black relative">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
            I Nostri <span className="text-[#255ff1]">Partner</span>
          </h2>

          <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all duration-300 border ${
                    activeCategory === cat
                      ? 'bg-[#255ff1] text-white border-[#255ff1] shadow-[0_0_15px_rgba(37,95,241,0.4)]'
                      : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Cerca locale..."
                className="bg-white/5 border-white/10 text-white pl-10 rounded-full focus:ring-[#255ff1] focus:border-[#255ff1]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-80 bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredVenues.map((venue) => {
                const Icon = CATEGORY_ICONS[venue.category] || Tag;
                return (
                  <motion.div
                    key={venue.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full bg-[#111] border-white/5 overflow-hidden group hover:border-[#255ff1]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,95,241,0.2)]">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={venue.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"}
                          alt={venue.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-black/70 hover:bg-black text-white backdrop-blur-md border-0">
                            <Icon className="w-3 h-3 mr-1" />
                            {venue.category}
                          </Badge>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                          <div className="inline-block bg-[#255ff1] text-white px-3 py-1 rounded-md font-bold text-sm transform -rotate-2 shadow-lg">
                            {venue.discount}
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#255ff1] transition-colors">{venue.name}</h3>
                        <p className="text-gray-400 text-sm mb-4 min-h-[3rem]">{venue.description}</p>

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address || '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-500 text-sm hover:text-[#255ff1] transition-colors cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MapPin className="w-4 h-4 mr-1 text-[#255ff1] shrink-0" />
                          <span className="truncate hover:underline">{venue.address}</span>
                        </a>

                        {venue.cta_url && (
                          <a
                            href={venue.cta_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center bg-[#255ff1] hover:bg-[#1e4cd8] text-white font-bold py-2 rounded-lg text-sm transition-colors mt-4 shadow-lg shadow-blue-900/20"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {venue.cta_label || 'Richiedi il tuo sconto'}
                          </a>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {filteredVenues.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">Nessun locale trovato. Prova a cambiare filtro.</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center flex flex-col items-center gap-6"
        >
          <Link to={createPageUrl('ProposeVenue')}>
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#255ff1] transition-colors group">
              <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Non trovi il tuo locale preferito? <span className="underline decoration-[#255ff1]/50 group-hover:decoration-[#255ff1]">Proponilo qui!</span></span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
