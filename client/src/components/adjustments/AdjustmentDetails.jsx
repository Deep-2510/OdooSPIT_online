import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Printer, Download } from 'lucide-react'
import { useQuery } from '../../hooks/useApi'
import LoadingSpinner from '../common/UI/LoadingSpinner'
import { useNotification } from '../../contexts/NotificationContext'

const AdjustmentDetails = () => {
  const { id } = useParams()
  const { addNotification } = useNotification()
  const { data: adjustmentData, loading, refetch } = useQuery(`/api/adjustments/${id}`)

  const handleApprove = async () => {
    if (window.confirm('Are you sure you want to approve this adjustment?')) {
      try {
        // Approval API call would go here
        addNotification('Adjustment approved successfully!', 'success')
        refetch()
      } catch (error) {
        addNotification('Failed to approve adjustment', 'error')
      }
    }
  }

  const handleReject = async () => {
    if (window.confirm('Are you sure you want to reject this adjustment?')) {
      try {
        // Rejection API call would go here
        addNotification('Adjustment rejected successfully!', 'success')
        refetch()
      } catch (error) {
        addNotification('Failed to reject adjustment', 'error')
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
        <p className="text-center text-gray-600 mt-4">Loading adjustment details...</p>
      </div>
    )
  }

  const adjustment = adjustmentData?.data

  const totalAdjustment = adjustment?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/adjustments"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Adjustment #{adjustment?.reference}</h1>
            <p className="text-gray-600">Stock adjustment details</p>
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
          {adjustment?.status === 'PENDING' && (
            <>
              <button
                onClick={handleApprove}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Approve</span>
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Adjustment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                <p className="text-gray-900 font-medium">{adjustment?.reference}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  adjustment?.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  adjustment?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {adjustment?.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                <p className="text-gray-900">{adjustment?.warehouse?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <p className="text-gray-900">{adjustment?.reason}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <p className="text-gray-900">{adjustment?.notes || 'No notes provided'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Adjustment Items</h2>
            {adjustment?.items?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Adjustment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Previous Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        New Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {adjustment.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.product?.name || `Product #${item.productId}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={item.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                            {item.quantity > 0 ? '+' : ''}{item.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity > 0 ? 'Increase' : 'Decrease'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.reason || adjustment.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.previousStock || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.newStock || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="1" className="px-6 py-4 text-sm font-medium text-gray-900">
                        Net Adjustment:
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        <span className={totalAdjustment > 0 ? 'text-green-600' : totalAdjustment < 0 ? 'text-red-600' : 'text-gray-600'}>
                          {totalAdjustment > 0 ? '+' : ''}{totalAdjustment}
                        </span>
                      </td>
                      <td colSpan="4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No items in this adjustment</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adjustment Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium">{adjustment?.totalItems || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Net Adjustment:</span>
                <span className={`font-medium ${
                  totalAdjustment > 0 ? 'text-green-600' : 
                  totalAdjustment < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {totalAdjustment > 0 ? '+' : ''}{totalAdjustment} units
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {adjustment?.createdAt ? new Date(adjustment.createdAt).toLocaleDateString() : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created By:</span>
                <span className="font-medium">{adjustment?.user?.email || 'System'}</span>
              </div>
              {adjustment?.approvedBy && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Approved By:</span>
                  <span className="font-medium">{adjustment.approvedBy}</span>
                </div>
              )}
              {adjustment?.approvedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Approved At:</span>
                  <span className="font-medium">
                    {new Date(adjustment.approvedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to={`/adjustments/${id}/edit`}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-center block hover:bg-blue-700"
              >
                Edit Adjustment
              </Link>
              <button
                onClick={handlePrint}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              >
                Print Adjustment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdjustmentDetails