import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Vacancies from './pages/Vacancies';
import VacancyDetail from './pages/VacancyDetail';
import AdminLogin from './pages/AdminLogin';
import AdminList from './pages/AdminList';
import AdminDetail from './pages/AdminDetail';
import AdminAnalytics from './pages/AdminAnalytics';
import VerificationSuccess from './pages/VerificationSuccess';
import VerificationFailed from './pages/VerificationFailed';

function AdminRoutes() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('hiremzanzi_admin_auth') === 'true');

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <AdminLayout onLogout={() => setLoggedIn(false)}>
      <Routes>
        <Route index element={<AdminList />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path=":id" element={<AdminDetail />} />
      </Routes>
    </AdminLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vacancies" element={<Vacancies />} />
            <Route path="/vacancies/:id" element={<VacancyDetail />} />
            <Route path="/verification-success" element={<VerificationSuccess />} />
            <Route path="/verification-failed" element={<VerificationFailed />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
