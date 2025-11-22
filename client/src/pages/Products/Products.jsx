import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import DataTable from '../../components/common/UI/DataTable'
import SearchBar from '../../components/common/UI/SearchBar'
import { useQuery } from '../../hooks/useApi'

const Receipts = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  const { data: receiptsData, loading } = useQuery('/api/receipts', {
    params: { search: searchTerm, page: currentPage, limit: 10 }
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
          value === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
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

  const actions = (receipt) => (
    <div className="flex space-x-2 justify-end">
      <Link
        to={`/receipts/${receipt.id}`}
        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
      >
        View
      </Link>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goods Receipts</h1>
          <p className="text-gray-600">Manage incoming stock receipts</p>
        </div>
        <Link
          to="/receipts/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>New Receipt</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <SearchBar
            placeholder="Search receipts..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        <DataTable
          columns={columns}
          data={receiptsData?.data || []}
          loading={loading}
          actions={actions}
          pagination={receiptsData?.pagination && {
            currentPage: receiptsData.pagination.page,
            totalPages: receiptsData.pagination.pages
          }}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

export default Receipts