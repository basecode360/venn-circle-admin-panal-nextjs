import React from 'react';
import { Users, Eye, AlertCircle, Plus } from 'lucide-react';

const Sidebar = ({ user, onLogout }) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block h-[calc(100vh-72px)] sticky top-[72px]">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Welcome, {user?.user_metadata?.name || user?.email}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email}
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
  );
};

export default Sidebar;