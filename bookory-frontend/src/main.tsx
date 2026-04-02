/**
 * main.tsx – applikationens startpunkt.
 * Renderar App-komponenten inuti StrictMode och BrowserRouter.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Monterar React-appen på #root-elementet i index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
