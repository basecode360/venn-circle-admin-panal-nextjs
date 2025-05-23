import React from 'react';
import { Edit, Trash2, Users, Eye } from 'lucide-react';

const CircleCard = ({ circle, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      {/* Circle Banner Image */}
      {circle.banner_image && (
        <div className="h-32 w-full mb-4 rounded-lg overflow-hidden">
          <img
            src={circle.banner_image}
            alt={circle.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        {/* Circle Icon + Name */}
        <div className="flex-1 flex items-center">
          {circle.icon_image ? (
            <div className="h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
              <img
                src={circle.icon_image}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 flex items-center justify-center mr-3 flex-shrink-0">
              {circle.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {circle.name}
            </h3>
            {circle.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {circle.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-1 ml-4">
          <button
            onClick={() => onEdit(circle)}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
            title="Edit Circle"
            aria-label="Edit Circle"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(circle.id)}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
            title="Delete Circle"
            aria-label="Delete Circle"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Circle Stats */}
      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          <span>{circle.member_count || 0} members</span>
        </div>
        <div className="flex items-center">
          <Eye className="h-4 w-4 mr-1" />
          <span>{circle.visibility || "public"}</span>
        </div>
        {circle.is_filtered && (
          <div className="flex items-center">
            <span className="text-orange-600 dark:text-orange-400 text-xs bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded-full">
              Filtered
            </span>
          </div>
        )}
      </div>

      {/* Join Questions Preview - Only show for filtered circles */}
      {circle.is_filtered &&
        circle.join_questions &&
        circle.join_questions.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
              Join Questions ({circle.join_questions.length})
            </h4>
            <ul className="space-y-1">
              {circle.join_questions.slice(0, 2).map((q, index) => (
                <li
                  key={index}
                  className="text-xs text-gray-600 dark:text-gray-400 truncate"
                >
                  {index + 1}. {q.question}
                </li>
              ))}
              {circle.join_questions.length > 2 && (
                <li className="text-xs text-gray-500 dark:text-gray-500">
                  +{circle.join_questions.length - 2} more...
                </li>
              )}
            </ul>
          </div>
        )}

      {/* Creation Date */}
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-4">
        Created {new Date(circle.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};

export default CircleCard;