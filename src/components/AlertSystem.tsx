import React, { useState, useEffect } from 'react'
import { Bell, X, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'
import { getAlerts, markAlertAsRead, dismissAlert } from '../utils/api'
import { Alert } from '../types'
import toast from 'react-hot-toast'

const AlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [showAlerts, setShowAlerts] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadAlerts()
    const interval = setInterval(loadAlerts, 30000) // Check for new alerts every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadAlerts = async () => {
    try {
      const alertData = await getAlerts()
      setAlerts(alertData)
      setUnreadCount(alertData.filter(alert => !alert.read).length)
    } catch (error) {
      console.error('Error loading alerts:', error)
    }
  }

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await markAlertAsRead(alertId)
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking alert as read:', error)
      toast.error('Failed to mark alert as read')
    }
  }

  const handleDismiss = async (alertId: string) => {
    try {
      await dismissAlert(alertId)
      setAlerts(alerts.filter(alert => alert.id !== alertId))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error dismissing alert:', error)
      toast.error('Failed to dismiss alert')
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-error-600" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getAlertBorderColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-warning-200'
      case 'error':
        return 'border-error-200'
      case 'success':
        return 'border-success-200'
      default:
        return 'border-blue-200'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowAlerts(!showAlerts)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showAlerts && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
              <button
                onClick={() => setShowAlerts(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border-l-4 ${getAlertBorderColor(alert.type)} ${
                    !alert.read ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${!alert.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {alert.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{alert.timestamp}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!alert.read && (
                        <button
                          onClick={() => handleMarkAsRead(alert.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No alerts at this time</p>
              </div>
            )}
          </div>

          {alerts.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  alerts.forEach(alert => {
                    if (!alert.read) handleMarkAsRead(alert.id)
                  })
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AlertSystem