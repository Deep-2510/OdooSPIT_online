import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import DataTable from '../../components/common/UI/DataTable'
import SearchBar from '../../components/common/UI/SearchBar'
import { useQuery } from '../../hooks/useApi'

const Transfers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  const { data: transfersData, loading } = useQuery('/api/transfers', {
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
          value === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' :
          value === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'fromWarehouse',
      title: 'From',
      sortable: true,
      render: (value, row) => row.sourceWarehouse?.name
    },
    {
      key: 'toWarehouse',
      title: 'To',
      sortable: true,
      render: (value, row) => row.destinationWarehouse?.name
    },
    {
      key: 'totalItems',
      title: 'Items',
      sortable: true
    },
    {
      key: 'createdAt',
      title: 'Created',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ]

  const actions = (transfer) => (
    <div className="flex space-x-2 justify-end">
      <Link
        to={`/transfers/${transfer.id}`}
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
          <h1 className="text-3xl font-bold text-gray-900">Internal Transfers</h1>
          <p className="text-gray-600">Manage stock transfers between warehouses</p>
        </div>
        <Link
          to="/transfers/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>New Transfer</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <SearchBar
            placeholder="Search transfers..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
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

export default Transfers