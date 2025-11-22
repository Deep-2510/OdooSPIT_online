import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Edit, Truck, CheckCircle, XCircle } from 'lucide-react'
import DataTable from '../common/UI/DataTable'
import SearchBar from '../common/UI/SearchBar'
import { useQuery } from '../../hooks/useApi'

const DeliveryList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  
  const { data: deliveriesData, loading, refetch } = useQuery('/api/deliveries', {
    params: { 
      search: searchTerm, 
      page: currentPage, 
      limit: 10,
      status: statusFilter 
    }
  })

  const columns = [
    {
      key: 'reference',
      title: 'Reference',
      sortable: true
    },
    {
      key: 'customer',
      title: 'Customer',
      sortable: true
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'DELIVERED' ? 'bg-green-100 text-green-800' :
          value === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' :
          value === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
          value === 'CANCELLED' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'totalItems',
      title: 'Items',
      sortable: true,
      render: (value) => value || 0
    },
    {
      key: 'totalValue',
      title: 'Total Value',
      sortable: true,
      render: (value) => value ? `$${value.toFixed(2)}` : '$0.00'
    },
    {
      key: 'deliveryDate',
      title: 'Delivery Date',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    },
    {
      key: 'createdAt',
      title: 'Created',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ]

  const actions = (delivery) => (
    <div className="flex space-x-2 justify-end">
      <Link
        to={`/deliveries/${delivery.id}`}
        className="text-blue-600 hover:text-blue-900 p-1 rounded"
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </Link>
      {delivery.status === 'PENDING' && (
        <>
          <Link
            to={`/deliveries/${delivery.id}/edit`}
            className="text-green-600 hover:text-green-900 p-1 rounded"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleValidate(delivery.id)}
            className="text-green-600 hover:text-green-900 p-1 rounded"
            title="Validate Delivery"
          >
            <CheckCircle className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleCancel(delivery.id)}
            className="text-red-600 hover:text-red-900 p-1 rounded"
            title="Cancel Delivery"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  )

  const handleValidate = async (deliveryId) => {
    if (window.confirm('Are you sure you want to validate this delivery?')) {
      // Validation logic would go here
      console.log('Validate delivery:', deliveryId)
      refetch()
    }
  }

  const handleCancel = async (deliveryId) => {
    if (window.confirm('Are you sure you want to cancel this delivery?')) {
      // Cancellation logic would go here
      console.log('Cancel delivery:', deliveryId)
      refetch()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Deliveries</h2>
          <p className="text-gray-600">Manage outgoing stock deliveries</p>
        </div>
        <Link
          to="/deliveries/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Truck className="h-4 w-4" />
          <span>New Delivery</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div className="relative flex-1 max-w-md">
            <SearchBar
              placeholder="Search deliveries..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={deliveriesData?.data || []}
          loading={loading}
          actions={actions}
          pagination={deliveriesData?.pagination && {
            currentPage: deliveriesData.pagination.page,
            totalPages: deliveriesData.pagination.pages
          }}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

export default DeliveryList