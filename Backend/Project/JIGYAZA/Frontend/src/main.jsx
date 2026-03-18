import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './style.scss'
import App from './app/App.jsx'

createRoot(document.getElementById('root')).render(
  <App/>
)
