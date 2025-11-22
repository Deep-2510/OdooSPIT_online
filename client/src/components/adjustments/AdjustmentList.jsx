import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Edit, Settings, CheckCircle, XCircle } from 'lucide-react'
import DataTable from '../common/UI/DataTable'
import SearchBar from '../common/UI/SearchBar'
import { useQuery } from '../../hooks/useApi'

const AdjustmentList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  
  const { data: adjustmentsData, loading, refetch } = useQuery('/api/adjustments', {
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
          value === 'APPROVED' ? 'bg-green-100 text-green-800' :
          value === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
          value === 'REJECTED' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'reason',
      title: 'Reason',
      sortable: true
    },
    {
      key: 'warehouse',
      title: 'Warehouse',
      sortable: true,
      render: (value, row) => row.warehouse?.name || '-'
    },
    {
      key: 'totalAdjustment',
      title: 'Net Adjustment',
      sortable: true,
      render: (value) => (
        <span className={value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'}>
          {value > 0 ? '+' : ''}{value}
        </span>
      )
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

  const actions = (adjustment) => (
    <div className="flex space-x-2 justify-end">
      <Link
        to={`/adjustments/${adjustment.id}`}
        className="text-blue-600 hover:text-blue-900 p-1 rounded"
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </Link>
      {adjustment.status === 'PENDING' && (
        <>
          <Link
            to={`/adjustments/${adjustment.id}/edit`}
            className="text-green-600 hover:text-green-900 p-1 rounded"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleApprove(adjustment.id)}
            className="text-green-600 hover:text-green-900 p-1 rounded"
            title="Approve Adjustment"
          >
            <CheckCircle className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleReject(adjustment.id)}
            className="text-red-600 hover:text-red-900 p-1 rounded"
            title="Reject Adjustment"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  )

  const handleApprove = async (adjustmentId) => {
    if (window.confirm('Are you sure you want to approve this adjustment?')) {
      // Approval logic would go here
      console.log('Approve adjustment:', adjustmentId)
      refetch()
    }
  }

  const handleReject = async (adjustmentId) => {
    if (window.confirm('Are you sure you want to reject this adjustment?')) {
      // Rejection logic would go here
      console.log('Reject adjustment:', adjustmentId)
      refetch()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Stock Adjustments</h2>
          <p className="text-gray-600">Manage stock quantity adjustments</p>
        </div>
        <Link
          to="/adjustments/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Settings className="h-4 w-4" />
          <span>New Adjustment</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
          <div className="relative flex-1 max-w-md">
            <SearchBar
              placeholder="Search adjustments..."
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
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={adjustmentsData?.data || []}
          loading={loading}
          actions={actions}
          pagination={adjustmentsData?.pagination && {
            currentPage: adjustmentsData.pagination.page,
            totalPages: adjustmentsData.pagination.pages
          }}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

export default AdjustmentList