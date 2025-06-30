import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Users, Settings, Plus, Edit3, Trash2, ArrowLeft } from 'lucide-react'
import { getRoles, getUsers, createRole, updateRole, deleteRole, updateUserRole } from '../utils/api'
import { Role, UserAccount } from '../types'
import toast from 'react-hot-toast'

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [users, setUsers] = useState<UserAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateRole, setShowCreateRole] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [newRole, setNewRole] = useState<Role>({
    id: '',
    name: '',
    description: '',
    permissions: [],
    level: 1
  })

  const availablePermissions = [
    'read_businesses', 'write_businesses', 'delete_businesses',
    'manage_claims', 'approve_claims', 'view_analytics',
    'manage_users', 'manage_roles', 'view_admin_dashboard',
    'export_data', 'manage_leads', 'view_intelligence',
    'manage_surveys', 'data_quality_control'
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [rolesData, usersData] = await Promise.all([
        getRoles(),
        getUsers()
      ])
      setRoles(rolesData)
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading role data:', error)
      toast.error('Failed to load role data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createRole(newRole)
      toast.success('Role created successfully!')
      setShowCreateRole(false)
      setNewRole({ id: '', name: '', description: '', permissions: [], level: 1 })
      await loadData()
    } catch (error) {
      console.error('Error creating role:', error)
      toast.error('Failed to create role')
    }
  }

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRole) return
    
    try {
      await updateRole(editingRole.id, editingRole)
      toast.success('Role updated successfully!')
      setEditingRole(null)
      await loadData()
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('Failed to update role')
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(roleId)
        toast.success('Role deleted successfully!')
        await loadData()
      } catch (error) {
        console.error('Error deleting role:', error)
        toast.error('Failed to delete role')
      }
    }
  }

  const handleUpdateUserRole = async (userId: string, roleId: string) => {
    try {
      await updateUserRole(userId, roleId)
      toast.success('User role updated successfully!')
      await loadData()
    } catch (error) {
      console.error('Error updating user role:', error)
      toast.error('Failed to update user role')
    }
  }

  const togglePermission = (permission: string, target: 'new' | 'edit') => {
    if (target === 'new') {
      const permissions = newRole.permissions.includes(permission)
        ? newRole.permissions.filter(p => p !== permission)
        : [...newRole.permissions, permission]
      setNewRole({ ...newRole, permissions })
    } else if (editingRole) {
      const permissions = editingRole.permissions.includes(permission)
        ? editingRole.permissions.filter(p => p !== permission)
        : [...editingRole.permissions, permission]
      setEditingRole({ ...editingRole, permissions })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Role & Access Management</h1>
              <p className="text-gray-600">Manage user roles, permissions, and access control</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateRole(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Role</span>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Roles Management */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">System Roles</h3>
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{role.name}</h4>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            Level {role.level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.map((permission) => (
                            <span key={permission} className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                              {permission.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingRole(role)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-error-600 hover:text-error-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Users Management */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">User Access Control</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Current Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-primary-600" />
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            user.active ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                          }`}>
                            {user.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={user.role_id}
                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            {roles.map((role) => (
                              <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Create Role Modal */}
      {showCreateRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Role</h3>
            
            <form onSubmit={handleCreateRole} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                  <input
                    type="text"
                    required
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    className="input"
                    placeholder="Role name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                  <select
                    value={newRole.level}
                    onChange={(e) => setNewRole({ ...newRole, level: parseInt(e.target.value) })}
                    className="input"
                  >
                    <option value={1}>Level 1 - Basic</option>
                    <option value={2}>Level 2 - Advanced</option>
                    <option value={3}>Level 3 - Admin</option>
                    <option value={4}>Level 4 - Super Admin</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  className="input h-20 resize-none"
                  placeholder="Role description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availablePermissions.map((permission) => (
                    <label key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newRole.permissions.includes(permission)}
                        onChange={() => togglePermission(permission, 'new')}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{permission.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateRole(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Role</h3>
            
            <form onSubmit={handleUpdateRole} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                  <input
                    type="text"
                    required
                    value={editingRole.name}
                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                  <select
                    value={editingRole.level}
                    onChange={(e) => setEditingRole({ ...editingRole, level: parseInt(e.target.value) })}
                    className="input"
                  >
                    <option value={1}>Level 1 - Basic</option>
                    <option value={2}>Level 2 - Advanced</option>
                    <option value={3}>Level 3 - Admin</option>
                    <option value={4}>Level 4 - Super Admin</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  className="input h-20 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availablePermissions.map((permission) => (
                    <label key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingRole.permissions.includes(permission)}
                        onChange={() => togglePermission(permission, 'edit')}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{permission.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoleManagement