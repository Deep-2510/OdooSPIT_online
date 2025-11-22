import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Printer, Download } from 'lucide-react'
import { useQuery } from '../../hooks/useApi'
import LoadingSpinner from '../common/UI/LoadingSpinner'
import { useNotification } from '../../contexts/NotificationContext'

const TransferDetails = () => {
  const { id } = useParams()
  const { addNotification } = useNotification()
  const { data: transferData, loading, refetch } = useQuery(`/api/transfers/${id}`)

  const handleComplete = async () => {
    if (window.confirm('Are you sure you want to complete this transfer?')) {
      try {
        // Completion API call would go here
        addNotification('Transfer completed successfully!', 'success')
        refetch()
      } catch (error) {
        addNotification('Failed to complete transfer', 'error')
      }
    }
  }

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this transfer?')) {
      try {
        // Cancellation API call would go here
        addNotification('Transfer cancelled successfully!', 'success')
        refetch()
      } catch (error) {
        addNotification('Failed to cancel transfer', 'error')
      }
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <LoadingSpinner size="lg" />
        <p className="text-center text-gray-600 mt-4">Loading transfer details...</p>
      </div>
    )
  }

  const transfer = transferData?.data

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/transfers"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transfer #{transfer?.reference}</h1>
            <p className="text-gray-600">Internal transfer details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </button>
          <button
            onClick={() => {/* Export logic */}}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          {transfer?.status === 'PENDING' && (
            <>
              <button
                onClick={handleComplete}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Complete</span>
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700"
              >
                <XCircle className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Transfer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                <p className="text-gray-900 font-medium">{transfer?.reference}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transfer?.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  transfer?.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' :
                  transfer?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {transfer?.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Warehouse</label>
                <p className="text-gray-900">{transfer?.sourceWarehouse?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Warehouse</label>
                <p className="text-gray-900">{transfer?.destinationWarehouse?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Date</label>
                <p className="text-gray-900">
                  {transfer?.expectedDate ? new Date(transfer.expectedDate).toLocaleDateString() : '-'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <p className="text-gray-900">{transfer?.notes || 'No notes provided'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Transfer Items</h2>
            {transfer?.items?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Stock (Source)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transfer.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.product?.name || `Product #${item.productId}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.currentStock || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'TRANSFERRED' ? 'bg-green-100 text-green-800' :
                            item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status || 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No items in this transfer</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium">{transfer?.totalItems || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Quantity:</span>
                <span className="font-medium">
                  {transfer?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {transfer?.createdAt ? new Date(transfer.createdAt).toLocaleDateString() : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created By:</span>
                <span className="font-medium">{transfer?.user?.email || 'System'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to={`/transfers/${id}/edit`}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-center block hover:bg-blue-700"
              >
                Edit Transfer
              </Link>
              <button
                onClick={handlePrint}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              >
                Print Transfer Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferDetails