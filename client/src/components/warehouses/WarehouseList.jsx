import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Warehouse, MapPin, Edit, Eye } from 'lucide-react'
import { useQuery } from '../../hooks/useApi'
import LoadingSpinner from '../common/UI/LoadingSpinner'

const WarehouseList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const { data: warehousesData, loading } = useQuery('/api/warehouses', {
    params: { search: searchTerm }
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Warehouses</h2>
            <p className="text-gray-600">Manage your warehouse locations</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Warehouses</h2>
          <p className="text-gray-600">Manage your warehouse locations</p>
        </div>
        <Link
          to="/warehouses/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Warehouse</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search warehouses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Warehouse className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehousesData?.data?.map((warehouse) => (
            <div key={warehouse.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Warehouse className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{warehouse.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {warehouse.address || 'No address provided'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Locations:</span>
                  <span className="font-medium">{warehouse._count?.locations || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Products:</span>
                  <span className="font-medium">{warehouse._count?.stock || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    warehouse.isActive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {warehouse.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/warehouses/${warehouse.id}`}
                  className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center space-x-1"
                >
                  <Eye className="h-3 w-3" />
                  <span>Details</span>
                </Link>
                <Link
                  to={`/warehouses/${warehouse.id}/edit`}
                  className="flex-1 border border-gray-300 text-gray-700 text-center py-2 px-3 rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center space-x-1"
                >
                  <Edit className="h-3 w-3" />
                  <span>Edit</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {(!warehousesData?.data || warehousesData.data.length === 0) && (
          <div className="text-center py-12">
            <Warehouse className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No warehouses found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first warehouse'}
            </p>
            <Link
              to="/warehouses/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Warehouse
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default WarehouseList