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
import MarketMapping from './pages/MarketMapping'
import CreditworthinessIntelligence from './pages/CreditworthinessIntelligence'
import DistributionHeatmaps from './pages/DistributionHeatmaps'
import LeadGeneration from './pages/LeadGeneration'
import InformalEconomyAnalytics from './pages/InformalEconomyAnalytics'
import BusinessChangeMonitoring from './pages/BusinessChangeMonitoring'
import CompetitiveIntelligence from './pages/CompetitiveIntelligence'
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
        <Route
          path="/intelligence/market-mapping"
          element={
            <ProtectedRoute>
              <MarketMapping />
            </ProtectedRoute>
          }
        />
        <Route
          path="/intelligence/creditworthiness"
          element={
            <ProtectedRoute>
              <CreditworthinessIntelligence />
            </ProtectedRoute>
          }
        />
        <Route
          path="/intelligence/distribution"
          element={
            <ProtectedRoute>
              <DistributionHeatmaps />
            </ProtectedRoute>
          }
        />
        <Route
          path="/intelligence/lead-generation"
          element={
            <ProtectedRoute>
              <LeadGeneration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/intelligence/informal-economy"
          element={
            <ProtectedRoute>
              <InformalEconomyAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/intelligence/business-monitoring"
          element={
            <ProtectedRoute>
              <BusinessChangeMonitoring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/intelligence/competitive"
          element={
            <ProtectedRoute>
              <CompetitiveIntelligence />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  )
}

export default App