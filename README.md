# 🎓 Nation Card — Liceo Pertini Ladispoli

Sito per la tessera studentesca del Liceo Pertini di Ladispoli.  
Stack: **React + Vite + Tailwind + Supabase**

---

## 🚀 Setup

### 1. Installa le dipendenze
```bash
npm install
```

### 2. Configura Supabase
Copia il file `.env.example` in `.env`:
```bash
cp .env.example .env
```
Poi compila con i tuoi valori dal pannello Supabase (Settings → API):
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 3. Crea le tabelle nel database
Nel **SQL Editor** di Supabase, esegui il contenuto di `supabase/schema.sql`.

### 4. Avvia in locale
```bash
npm run dev
```

---

## 📁 Struttura

```
src/
├── api/
│   └── entities.js          # Layer dati (Venue, ProposedVenue, ClassRepReport)
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLocali.jsx   ← CRUD completo locali convenzionati
│   │   ├── AdminTessere.jsx  ← Report adesioni + export CSV
│   │   ├── AdminProposte.jsx ← Proposte dalla community
│   │   └── AdminImpostazioni.jsx
│   ├── hero/HeroSection.jsx
│   ├── venues/VenueSection.jsx
│   ├── faq/FAQSection.jsx
│   ├── map/VenuesMap.jsx
│   └── forms/
│       ├── ProposeVenueForm.jsx
│       └── ClassRepReportForm.jsx
├── lib/
│   └── supabase.js           # Client Supabase
└── pages/
    ├── Home.jsx
    ├── AdminPanel.jsx        ← /AdminPanel (protetto da password)
    ├── ProposeVenue.jsx
    ├── ClassRepReport.jsx
    └── ThankYou.jsx
```

---

## 🔐 Pannello Admin

Accedi su: `/AdminPanel`  
Password default: `PertiniRapp2025.6`

Per cambiarla: modifica `ADMIN_PASSWORD` in `src/pages/AdminPanel.jsx`.

### Funzioni admin:
- **Dashboard** — statistiche locali, adesioni, proposte
- **Locali** — aggiungi / modifica / elimina locali convenzionati con preview immagine
- **Tessere** — visualizza report adesioni per classe, esporta CSV
- **Proposte** — gestisci le proposte inviate dagli studenti
- **Impostazioni** — stato connessione Supabase, zona pericolosa

---

## 🌍 Deploy su Vercel

```bash
npm run build
```
Poi collega il repo a Vercel e imposta le env vars:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Il file `vercel.json` è già configurato per il routing SPA.
