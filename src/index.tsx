import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app/app.tsx'
import './app/reset.css'
import './app/fonts.css'
import './app/global.css'
import './app/variables.css'
import { Provider } from 'react-redux'
import { store } from './services/store/store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
