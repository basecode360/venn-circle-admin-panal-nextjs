"use client"
import React from 'react'
import { ChevronRight, Circle, FileText, User } from 'lucide-react'
import Newbutton from './ReUseable-Component/Newbutton'

function Sidebar({ activeContent, setActiveContent, circlesCount = 0, reportsCount = 0, usersCount = 0 }) {
  const menuItems = [
    {
      id: 'circles',
      label: 'Circles',
      icon: Circle,
      count: circlesCount
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      count: reportsCount
    },
    {
      id: 'users',
      label: 'User Details',
      icon: User,
      count: usersCount
    }
  ]

  return (
    <div className="w-full h-[100%] bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
    
      {/* Menu Items */}
      <div className="p-4 space-y-2 flex-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon
          const isActive = activeContent === item.id

          return (
            <Newbutton
              key={item.id}
              onClick={() => setActiveContent(item.id)}
              variant={isActive ? "ghost" : "ghost"}
              className={`w-full justify-between p-3 h-auto ${
                isActive
                  ? 'bg-blue-100 text-blue-700 shadow-sm hover:bg-blue-100'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <IconComponent 
                  size={20} 
                  className={
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }
                />
                <span className="font-medium">{item.label}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-sm px-2 py-1 rounded-full ${
                  isActive 
                    ? 'bg-blue-200 text-blue-800' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {item.count}
                </span>
                <ChevronRight 
                  size={16} 
                  className={`transition-transform duration-200 ${
                    isActive ? 'rotate-90 text-blue-600' : 'text-gray-400'
                  }`}
                />
              </div>
            </Newbutton>
          )
        })}
      </div>

      {/* Bottom Section */}
      <div className="p-4">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Need Help?</p>
          <p className="text-xs text-blue-600 mt-1">Contact support team</p>
          <Newbutton
            variant="link"
            size="sm"
            text="Contact Support"
            className="mt-2 p-0 h-auto text-blue-600 underline"
          />
        </div>
      </div>
    </div>
  )
}

export default Sidebar