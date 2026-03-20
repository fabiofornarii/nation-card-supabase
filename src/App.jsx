import './App.css'
import { Toaster } from 'sonner'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from './pages/Home.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import ProposeVenue from './pages/ProposeVenue.jsx';
import ClassRepReport from './pages/ClassRepReport.jsx';
import ThankYou from './pages/ThankYou.jsx';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          {/* Pages with main layout */}
          <Route path="/" element={<Layout currentPageName="Home"><Home /></Layout>} />
          <Route path="/ProposeVenue" element={<Layout currentPageName="ProposeVenue"><ProposeVenue /></Layout>} />
          <Route path="/ClassRepReport" element={<Layout currentPageName="ClassRepReport"><ClassRepReport /></Layout>} />

          {/* Pages without layout */}
          <Route path="/ThankYou" element={<ThankYou />} />
          <Route path="/AdminPanel" element={<AdminPanel />} />

          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
              <div className="text-center">
                <h1 className="text-8xl font-black text-[#255ff1] mb-4">404</h1>
                <p className="text-gray-400 text-xl mb-8">Pagina non trovata</p>
                <a href="/" className="bg-[#255ff1] hover:bg-[#1e4cd8] text-white font-bold px-6 py-3 rounded-xl transition-colors">Torna alla Home</a>
              </div>
            </div>
          } />
        </Routes>
      </Router>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
