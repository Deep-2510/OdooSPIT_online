import { useState, useEffect } from 'react'
import { Save, X, Plus, Trash2 } from 'lucide-react'
import LoadingSpinner from '../common/UI/LoadingSpinner'
import { useNotification } from '../../contexts/NotificationContext'

const WarehouseForm = ({ warehouse, onSubmit, onCancel, loading = false }) => {
  const { addNotification } = useNotification()
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    isActive: true,
    locations: []
  })

  const [newLocation, setNewLocation] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name || '',
        address: warehouse.address || '',
        description: warehouse.description || '',
        isActive: warehouse.isActive !== undefined ? warehouse.isActive : true,
        locations: warehouse.locations || []
      })
    }
  }, [warehouse])

  const addLocation = () => {
    if (!newLocation.name.trim()) {
      addNotification('Location name is required', 'error')
      return
    }

    setFormData(prev => ({
      ...prev,
      locations: [...prev.locations, { ...newLocation, id: Date.now() }]
    }))
    
    setNewLocation({
      name: '',
      description: ''
    })
  }

  const removeLocation = (locationId) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter(location => location.id !== locationId)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      addNotification('Warehouse name is required', 'error')
      return
    }

    try {
      await onSubmit(formData)
      addNotification(
        warehouse ? 'Warehouse updated successfully!' : 'Warehouse created successfully!',
        'success'
      )
    } catch (error) {
      addNotification(error.message || 'Failed to save warehouse', 'error')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          {warehouse ? 'Edit Warehouse' : 'Create New Warehouse'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Warehouse Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter warehouse name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter warehouse address"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter warehouse description"
            />
          </div>
        </div>

        {/* Locations Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Storage Locations</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Name *</label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Rack A1, Shelf B2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newLocation.description}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Location description"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addLocation}
                  disabled={!newLocation.name.trim()}
                  className="w-full bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Location</span>
                </button>
              </div>
            </div>
          </div>

          {formData.locations.length > 0 ? (
            <div className="space-y-2">
              {formData.locations.map((location) => (
                <div key={location.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium">{location.name}</span>
                    {location.description && (
                      <span className="text-gray-600 ml-4">- {location.description}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLocation(location.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No locations added yet</p>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <X className="h-4 w-4 inline mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Save className="h-4 w-4 inline mr-2" />
                {warehouse ? 'Update Warehouse' : 'Create Warehouse'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default WarehouseForm