
import Home from './pages/Home'
import About from './pages/About'
import { Route, Routes } from 'react-router-dom'
const App = () => {
  return (
    <div className='w-full h-full'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path= '/About' element = {<About/>}/>
      </Routes>
    </div>
  )
}

export default App
