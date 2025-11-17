import { useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/login'
import AdminDashboard from './pages/adminDashboard'
import EmpresaDashboard from './pages/empresaDashboard'
import EstudianteDashboard from './pages/EstudianteDashboard'
import TutorDashboard from './pages/TutorDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}></Route>
        <Route path="/empresa-dashboard" element={<EmpresaDashboard/>}></Route>
        <Route path="/estudiante-dashboard" element={<EstudianteDashboard/>}></Route> 
        <Route path="/tutor-dashboard" element={<TutorDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App