import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Printer, Download, MapPin } from 'lucide-react'
import { useQuery } from '../../hooks/useApi'
import LoadingSpinner from '../common/UI/LoadingSpinner'
import { useNotification } from '../../contexts/NotificationContext'

const DeliveryDetails = () => {
  const { id } = useParams()
  const { addNotification } = useNotification()
  const { data: deliveryData, loading, refetch } = useQuery(`/api/deliveries/${id}`)

  const handleValidate = async () => {
    if (window.confirm('Are you sure you want to validate this delivery?')) {
      try {
        // Validation API call would go here
        addNotification('Delivery validated successfully!', 'success')
        refetch()
      } catch (error) {
        addNotification('Failed to validate delivery', 'error')
      }
    }
  }

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this delivery?')) {
      try {
        // Cancellation API call would go here
        addNotification('Delivery cancelled successfully!', 'success')
        refetch()
      } catch (error) {
        addNotification('Failed to cancel delivery', 'error')
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
        <p className="text-center text-gray-600 mt-4">Loading delivery details...</p>
      </div>
    )
  }

  const delivery = deliveryData?.data

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/deliveries"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Delivery #{delivery?.reference}</h1>
            <p className="text-gray-600">Delivery order details</p>
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
          {delivery?.status === 'PENDING' && (
            <>
              <button
                onClick={handleValidate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Validate</span>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                <p className="text-gray-900 font-medium">{delivery?.reference}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  delivery?.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  delivery?.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' :
                  delivery?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {delivery?.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <p className="text-gray-900">{delivery?.customer}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                <p className="text-gray-900">
                  {delivery?.deliveryDate ? new Date(delivery.deliveryDate).toLocaleDateString() : '-'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Delivery Address
                </label>
                <p className="text-gray-900">{delivery?.address || 'No address provided'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <p className="text-gray-900">{delivery?.notes || 'No notes provided'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Items</h2>
            {delivery?.items?.length > 0 ? (
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
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {delivery.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.product?.name || `Product #${item.productId}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${item.unitPrice?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        Total:
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        ${delivery?.totalValue?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No items in this delivery</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium">{delivery?.totalItems || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-medium">${delivery?.totalValue?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {delivery?.createdAt ? new Date(delivery.createdAt).toLocaleDateString() : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created By:</span>
                <span className="font-medium">{delivery?.user?.email || 'System'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to={`/deliveries/${id}/edit`}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-center block hover:bg-blue-700"
              >
                Edit Delivery
              </Link>
              <button
                onClick={handlePrint}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              >
                Print Delivery Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryDetails