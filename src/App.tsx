import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Search from './pages/Search'
import BusinessProfile from './pages/BusinessProfile'
import CreateBusiness from './pages/CreateBusiness'
import EditBusiness from './pages/EditBusiness'
import AdminDashboard from './pages/AdminDashboard'
import ClaimsManagement from './pages/ClaimsManagement'
import Analytics from './pages/Analytics'
import LeadsManagement from './pages/LeadsManagement'
import BIVerification from './pages/BIVerification'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/business/:id" element={<BusinessProfile />} />
        <Route path="/verify" element={<BIVerification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-business" element={<CreateBusiness />} />
        <Route
          path="/edit-business/:id"
          element={
            <ProtectedRoute>
              <EditBusiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/claims"
          element={
            <ProtectedRoute>
              <ClaimsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leads"
          element={
            <ProtectedRoute>
              <LeadsManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  )
}

export default App