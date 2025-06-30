import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, AlertTriangle, CheckCircle } from 'lucide-react'
import { getDashboardData } from '../utils/api'
import { DashboardData } from '../types'

interface DashboardProps {
  type: 'admin' | 'business' | 'public'
  businessId?: string
}

const Dashboard: React.FC<DashboardProps> = ({ type, businessId }) => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [type, businessId])

  const loadDashboardData = async () => {
    try {
      const dashboardData = await getDashboardData(type, businessId)
      setData(dashboardData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444']

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.metrics.map((metric, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                {metric.change && (
                  <div className={`flex items-center space-x-1 text-sm ${
                    metric.change > 0 ? 'text-success-600' : 'text-error-600'
                  }`}>
                    <TrendingUp className="h-3 w-3" />
                    <span>{metric.change > 0 ? '+' : ''}{metric.change}%</span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-lg ${metric.color}`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.activityTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#0ea5e9" strokeWidth={2} />
              <Line type="monotone" dataKey="interactions" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.distribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Chart */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="current" fill="#0ea5e9" />
              <Bar dataKey="previous" fill="#94a3b8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {data.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${activity.type === 'success' ? 'bg-success-100' : 
                activity.type === 'warning' ? 'bg-warning-100' : 'bg-blue-100'}`}>
                {activity.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-success-600" />
                ) : activity.type === 'warning' ? (
                  <AlertTriangle className="h-4 w-4 text-warning-600" />
                ) : (
                  <Users className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-600">{activity.description}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard