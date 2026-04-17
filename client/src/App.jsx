import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SleepTracker from './pages/SleepTracker'
import WaterTracker from './pages/WaterTracker'
import MoodTracker from './pages/MoodTracker'


function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
<Route path="/sleep" element={
  <PrivateRoute>
    <SleepTracker />
  </PrivateRoute>
} />
<Route path="/water" element={
  <PrivateRoute>
    <WaterTracker />
  </PrivateRoute>
} />


<Route path="/mood" element={
  <PrivateRoute>
    <MoodTracker />
  </PrivateRoute>
} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}