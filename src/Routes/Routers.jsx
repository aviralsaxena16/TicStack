import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import ProtectedRoute from './ProtectedRoute'
const Routers = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute>
            <Home />
        </ProtectedRoute>
    }  />
    </Routes>
    )
}

export default Routers