import { useState, useEffect } from 'react';
import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import Workflow from './components/landing/Workflow';
import DashboardPreview from './components/landing/DashboardPreview';
import Security from './components/landing/Security';
import CTA from './components/landing/CTA';
import Footer from './components/landing/Footer';
import Onboarding from './components/Onboarding';
import AdminDashboard from './components/dashboard/AdminDashboard';
import MemberDashboard from './components/dashboard/MemberDashboard';
import { useAuth, Role } from './contexts/AuthContext';
import { LogOut, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { user, firebaseUser, loading, error, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertCircle size={48} />
        </div>
        <h1 className="mb-4 text-3xl font-bold text-slate-900 tracking-tight">Access Restricted</h1>
        <p className="mb-8 max-w-md text-slate-600">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white shadow-xl hover:bg-indigo-700 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  // If logged in and role not selected
  if (firebaseUser && user && !user.roleSelected) {
    return <Onboarding />;
  }

  // If logged in and role selected
  if (firebaseUser && user && user.roleSelected) {
    return user.role === Role.ADMIN ? <AdminDashboard /> : <MemberDashboard />;
  }

  // Public Landing Page
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Navbar />
      
      <main>
        <Hero />
        <Features />
        <Workflow />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
