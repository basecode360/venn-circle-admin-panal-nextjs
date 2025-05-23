import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, filteredCount }) => {
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="mb-6">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search circles by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>
      {searchTerm && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Found {filteredCount} circle
          {filteredCount !== 1 ? "s" : ""} matching "{searchTerm}"
        </p>
      )}
    </div>
  );
};

export default SearchBar;