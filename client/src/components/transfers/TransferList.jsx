import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Edit, Move, CheckCircle, XCircle } from 'lucide-react'
import DataTable from '../common/UI/DataTable'
import SearchBar from '../common/UI/SearchBar'
import { useQuery } from '../../hooks/useApi'

const TransferList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  
  const { data: transfersData, loading, refetch } = useQuery('/api/transfers', {
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
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'COMPLETED' ? 'bg-green-100 text-green-800' :
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
      key: 'fromWarehouse',
      title: 'From Warehouse',
      sortable: true,
      render: (value, row) => row.sourceWarehouse?.name || '-'
    },
    {
      key: 'toWarehouse',
      title: 'To Warehouse',
      sortable: true,
      render: (value, row) => row.destinationWarehouse?.name || '-'
    },
    {
      key: 'totalItems',
      title: 'Items',
      sortable: true,
      render: (value) => value || 0
    },
    {
      key: 'createdAt',
      title: 'Created',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'createdBy',
      title: 'Created By',
      sortable: true,
      render: (value, row) => row.user?.email || 'System'
    }
  ]

  const actions = (transfer) => (
    <div className="flex space-x-2 justify-end">
      <Link
        to={`/transfers/${transfer.id}`}
        className="text-blue-600 hover:text-blue-900 p-1 rounded"
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </Link>
      {transfer.status === 'PENDING' && (
        <>
          <Link
            to={`/transfers/${transfer.id}/edit`}
            className="text-green-600 hover:text-green-900 p-1 rounded"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleComplete(transfer.id)}
            className="text-green-600 hover:text-green-900 p-1 rounded"
            title="Complete Transfer"
          >
            <CheckCircle className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleCancel(transfer.id)}
            className="text-red-600 hover:text-red-900 p-1 rounded"
            title="Cancel Transfer"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  )

  const handleComplete = async (transferId) => {
    if (window.confirm('Are you sure you want to complete this transfer?')) {
      // Completion logic would go here
      console.log('Complete transfer:', transferId)
      refetch()
    }
  }

  const handleCancel = async (transferId) => {
    if (window.confirm('Are you sure you want to cancel this transfer?')) {
      // Cancellation logic would go here
      console.log('Cancel transfer:', transferId)
      refetch()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Internal Transfers</h2>
          <p className="text-gray-600">Manage stock transfers between warehouses</p>
        </div>
        <Link
          to="/transfers/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Move className="h-4 w-4" />
          <span>New Transfer</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div className="relative flex-1 max-w-md">
            <SearchBar
              placeholder="Search transfers..."
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
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={transfersData?.data || []}
          loading={loading}
          actions={actions}
          pagination={transfersData?.pagination && {
            currentPage: transfersData.pagination.page,
            totalPages: transfersData.pagination.pages
          }}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

export default TransferList