import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Warehouse, MapPin } from 'lucide-react'
import { useQuery } from '../../hooks/useApi'

const Warehouses = () => {
  const { data: warehousesData, loading } = useQuery('/api/warehouses')

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Warehouses</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Warehouses</h1>
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
            
            <div className="space-y-2 text-sm">
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

            <div className="mt-4 flex space-x-2">
              <Link
                to={`/warehouses/${warehouse.id}`}
                className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg text-sm hover:bg-blue-700"
              >
                View Details
              </Link>
              <Link
                to={`/warehouses/${warehouse.id}/stock`}
                className="flex-1 border border-gray-300 text-gray-700 text-center py-2 px-3 rounded-lg text-sm hover:bg-gray-50"
              >
                View Stock
              </Link>
            </div>
          </div>
        ))}
      </div>

      {(!warehousesData?.data || warehousesData.data.length === 0) && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <Warehouse className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No warehouses</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first warehouse</p>
          <Link
            to="/warehouses/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Warehouse
          </Link>
        </div>
      )}
    </div>
  )
}

export default Warehouses