"use client"
import React from 'react'
import { User, Mail, Phone } from 'lucide-react'

function UserDetails() {
  const usersData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234-567-8901', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+1 234-567-8902', role: 'User', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 234-567-8903', role: 'User', status: 'Inactive' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', phone: '+1 234-567-8904', role: 'Moderator', status: 'Active' }
  ]

  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-red-100 text-red-800'
      case 'Moderator': return 'bg-blue-100 text-blue-800'
      case 'User': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usersData.map((user) => (
          <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {getInitials(user.name)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">{user.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  user.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.status}
                </span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                View Profile
              </button>
              <button className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserDetails