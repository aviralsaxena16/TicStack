import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/Auth'
import Routers from './Routes/Routers'

const App = () => {
  return (
    <AuthProvider>
    <BrowserRouter>
    <Routers/>  
    </BrowserRouter>
    </AuthProvider>
   
  )
}

export default App