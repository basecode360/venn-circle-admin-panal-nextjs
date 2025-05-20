import { Button } from "@/components/ui/button";

export default function Header({ user, onLogout }) {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 dark:bg-gray-900 dark:text-white transition-all duration-300 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title - Always at start */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Admin Dashboard
            </h1>
          </div>

          {/* Navigation - Center on larger screens */}
          <nav className="hidden md:flex items-center justify-center flex-1 px-8">
            <ul className="flex space-x-8 text-gray-600 dark:text-gray-300 font-medium">
              <li>
                <a
                  href="#circles"
                  className="relative px-3 py-2 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                >
                  Circles
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a
                  href="#members"
                  className="relative px-3 py-2 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                >
                  Members
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a
                  href="#analytics"
                  className="relative px-3 py-2 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                >
                  Analytics
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                </a>
              </li>
            </ul>
          </nav>

          {/* User Info and Logout Button */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.user_metadata?.name || 'User'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </div>
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {(user?.user_metadata?.name || user?.email)?.charAt(0).toUpperCase()}
            </div>

            {/* Logout Button */}
            <Button 
              onClick={onLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-4">
            <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}