import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FaceRecognition from './Features/FaceExpression/components/FaceExpresstion'

function App() {
  const [count, setCount] = useState(0)

  return (
    <FaceRecognition/>
  )
}

export default App
