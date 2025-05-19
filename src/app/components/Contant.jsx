"use client"
import React from 'react'
import Circles from './Contant-Components/Circles'
// import Reports from './Reports'
// import UserDetails from './UserDetails'

function Content({ activeContent, circles = [], setCircles = () => {}, reports = [], setReports = () => {}, users = [], setUsers = () => {} }) {
  
  // Debug log
  console.log('Content component - Received props:')
  console.log('- circles:', circles)
  console.log('- setCircles type:', typeof setCircles)
  console.log('- activeContent:', activeContent)

  const renderContent = () => {
    switch(activeContent) {
      case 'circles':
        console.log('Content - Rendering Circles with:', circles)
        return <Circles  circles={circles} setCircles={setCircles} />
      case 'reports':
        return <Reports reports={reports} setReports={setReports} />
      case 'users':
        return <UserDetails users={users} setUsers={setUsers} />
      default:
        return <Circles circles={circles} setCircles={setCircles} />
    }
  }

  return (
    <div className="w-full h-screen bg-gray-50 overflow-y-auto">
      {renderContent()}
    </div>
  )
}

export default Content