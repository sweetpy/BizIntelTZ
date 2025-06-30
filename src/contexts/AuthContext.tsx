import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', username) // Debug log
      
      // Try multiple formats to ensure compatibility
      const loginAttempts = [
        // Format 1: URLSearchParams (form-encoded)
        () => {
          const formData = new URLSearchParams()
          formData.append('username', username)
          formData.append('password', password)
          return fetch('/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
          })
        },
        // Format 2: JSON
        () => {
          return fetch('/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          })
        }
      ]

      let response
      let success = false

      for (const attempt of loginAttempts) {
        try {
          response = await attempt()
          if (response.ok) {
            success = true
            break
          }
        } catch (err) {
          console.log('Login attempt failed, trying next format...', err)
          continue
        }
      }

      if (success && response && response.ok) {
        const data = await response.json()
        const newUser = { username, token: data.access_token }
        setUser(newUser)
        localStorage.setItem('user', JSON.stringify(newUser))
        console.log('Login successful!') // Debug log
        return true
      }
      
      // Log the response for debugging
      if (response) {
        const errorText = await response.text()
        console.error('Login failed:', response.status, errorText)
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}