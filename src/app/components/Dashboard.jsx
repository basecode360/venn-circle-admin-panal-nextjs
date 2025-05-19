"use client"
import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Circles from './Contant-Components/Circles'
import Reports from './Contant-Components/Reports'
import UserDetails from './Contant-Components/UserDetails'

function Dashboard() {
  const [activeContent, setActiveContent] = useState('circles')
  const [circles, setCircles] = useState([])

  // Test circle add kar dete hain
  React.useEffect(() => {
    setCircles([{
      id: 1,
      name: 'Sample Circle',
      description: 'Test description',
      members: 5,
      type: 'Public',
      questions: []
    }])
  }, [])

  const renderContent = () => {
    switch(activeContent) {
      case 'circles':
        return <Circles circles={circles} setCircles={setCircles} />
      case 'reports':
        return <Reports />
      case 'users':
        return <UserDetails />
      default:
        return <Circles circles={circles} setCircles={setCircles} />
    }
  }

  return (
    <div className='h-[875px] overflow-hidden  flex'>
      <div className='w-1/4 h-full border-r'>
        <Sidebar 
          activeContent={activeContent} 
          setActiveContent={setActiveContent}
          circlesCount={circles.length}
        />
      </div>
      <div className='w-3/4 h-full   overflow-auto'>
        {renderContent()}
      </div>
    </div>
  )
}

export default Dashboard