import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import ProtectedRoute from './ProtectedRoute'

const Board = lazy(() => import('@/pages/Board'))
const NewBoard = lazy(() => import('@/pages/NewBoard'))
const Upload = lazy(() => import('@/pages/Upload'))
const Share = lazy(() => import('@/pages/Share'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Login = lazy(() => import('@/pages/Login'))
const Signup = lazy(() => import('@/pages/Signup'))
const Profile = lazy(() => import('@/pages/Profile'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route path="/" element={<Board />} />
        <Route path="/new" element={<NewBoard />} />
        <Route path="/b/:slug" element={<Board />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/share/:id" element={<Share />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}