import React from 'react'
import Header from './Header'

function Dashbord() {
  return (
<div>
      <div className=''><Header/></div>
      <div className='flex w-[100%] '>
        <div  className='w-[25%] h-screen border'>sidebar</div>
        <div className='w-[75%]  h-screen  border'>contant</div>
      </div>
    </div>  )
}

export default Dashbord
