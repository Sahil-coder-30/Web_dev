import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Ajence from './pages/Ajence'
import Project from './pages/Project'
import Navbar from './components/Navbar/Navbar'
import DropBox from './components/common/DropBox'
import Transition from './components/common/Transition'

const App = () => {
  return (
    <div className='text-white'>
      
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/agence' element={<Ajence/>} />
        <Route path='/projects' element={<Project/>} />
      </Routes>
    </div>
  )
}

export default App