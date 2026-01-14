import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './styles/dasNav.css'
import App from './App.jsx'
import './styles/platform.css'
import './styles/hero.css'
import './styles/live.css'
import './styles/liveMetal.css'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)