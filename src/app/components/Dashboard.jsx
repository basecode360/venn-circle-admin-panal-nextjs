"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Header from './Header';
import CircleManagement from './CircleManager';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        router.push('/auth/login');
      }
    });

    return () => subscription?.unsubscribe();
  }, [router]);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error checking user:', error);
        router.push('/auth/login');
        return;
      }
      
      if (user) {
        setUser(user);
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <Header user={user} onLogout={handleLogout} />

      {/* Main layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block h-[calc(100vh-72px)] sticky top-[72px]">
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Welcome, {user.user_metadata?.name || user.email}
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </div>
            </div>
            
            <nav className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Navigation
              </h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                <li>
                  <a 
                    href="#circles" 
                    className="flex items-center px-3 py-2 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                  >
                    <span className="mr-3">🔵</span>
                    Circle Management
                  </a>
                </li>
                <li>
                  <a 
                    href="#members" 
                    className="flex items-center px-3 py-2 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                  >
                    <span className="mr-3">👥</span>
                    Members
                  </a>
                </li>
                <li>
                  <a 
                    href="#analytics" 
                    className="flex items-center px-3 py-2 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                  >
                    <span className="mr-3">📊</span>
                    Analytics
                  </a>
                </li>
                <li>
                  <a 
                    href="#settings" 
                    className="flex items-center px-3 py-2 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                  >
                    <span className="mr-3">⚙️</span>
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 h-[calc(100vh-72px)] overflow-y-auto">
          <CircleManagement user={user} supabase={supabase} onLogout={handleLogout} />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;