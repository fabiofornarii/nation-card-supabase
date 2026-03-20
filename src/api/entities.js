import { supabase } from '@/lib/supabase';

// ─── Venues ────────────────────────────────────────────────────────────────
export const Venue = {
  list: async (orderBy = 'name') => {
    const col = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
    const asc = !orderBy.startsWith('-');
    const { data, error } = await supabase.from('venues').select('*').order(col, { ascending: asc });
    if (error) throw error;
    return data ?? [];
  },
  create: async (payload) => {
    const { data, error } = await supabase.from('venues').insert([payload]).select().single();
    if (error) throw error;
    return data;
  },
  update: async (id, payload) => {
    const { data, error } = await supabase.from('venues').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const { error } = await supabase.from('venues').delete().eq('id', id);
    if (error) throw error;
  },
};

export const ProposedVenue = {
  list: async (orderBy = '-created_at') => {
    const col = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
    const asc = !orderBy.startsWith('-');
    const { data, error } = await supabase.from('proposed_venues').select('*').order(col, { ascending: asc });
    if (error) throw error;
    return data ?? [];
  },
  create: async (payload) => {
    const { data, error } = await supabase.from('proposed_venues').insert([payload]).select().single();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const { error } = await supabase.from('proposed_venues').delete().eq('id', id);
    if (error) throw error;
  },
};

export const ClassRepresentativeReport = {
  list: async (orderBy = '-created_at') => {
    const col = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
    const asc = !orderBy.startsWith('-');
    const { data, error } = await supabase.from('class_representative_reports').select('*').order(col, { ascending: asc });
    if (error) throw error;
    return data ?? [];
  },
  create: async (payload) => {
    const { data, error } = await supabase.from('class_representative_reports').insert([payload]).select().single();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const { error } = await supabase.from('class_representative_reports').delete().eq('id', id);
    if (error) throw error;
  },
};
