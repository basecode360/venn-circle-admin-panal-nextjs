import React from 'react';
import { Upload } from 'lucide-react';

const ImageUpload = ({ 
  type, 
  image, 
  setImage, 
  handleImageUpload, 
  label 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="mt-1 flex items-center space-x-4">
        <label className="flex flex-col items-center px-4 py-2 bg-white dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
          <Upload className="h-5 w-5 text-gray-400 dark:text-gray-300" />
          <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Upload
          </span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, type)}
          />
        </label>
        {image && (
          <div className={`relative overflow-hidden border border-gray-300 dark:border-gray-600 ${
            type === 'banner' 
              ? 'h-20 w-36 rounded-md' 
              : 'h-16 w-16 rounded-full'
          }`}>
            <img
              src={image}
              alt={`${type} preview`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setImage("")}
              className={`absolute bg-red-600 text-white rounded-full p-1 text-xs ${
                type === 'banner' ? 'top-1 right-1' : 'top-0 right-0'
              }`}
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;