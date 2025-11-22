import { useState } from 'react'
import { Download, Filter, Search, User, Clock } from 'lucide-react'
import DataTable from '../common/UI/DataTable'
import SearchBar from '../common/UI/SearchBar'
import { useQuery } from '../../hooks/useApi'

const AuditReport = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    action: '',
    entity: '',
    user: ''
  })

  const { data: auditData, loading } = useQuery('/api/reports/audit', {
    params: { 
      search: searchTerm,
      ...filters
    }
  })

  const columns = [
    {
      key: 'timestamp',
      title: 'Timestamp',
      sortable: true,
      render: (value) => new Date(value).toLocaleString()
    },
    {
      key: 'action',
      title: 'Action',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'CREATE' ? 'bg-green-100 text-green-800' :
          value === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
          value === 'DELETE' ? 'bg-red-100 text-red-800' :
          value === 'LOGIN' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'entity',
      title: 'Entity',
      sortable: true
    },
    {
      key: 'entityId',
      title: 'Entity ID',
      sortable: true
    },
    {
      key: 'description',
      title: 'Description',
      sortable: false,
      render: (value) => value || '-'
    },
    {
      key: 'user',
      title: 'User',
      sortable: true,
      render: (value, row) => row.user?.email || 'System'
    },
    {
      key: 'ipAddress',
      title: 'IP Address',
      sortable: true,
      render: (value) => value || '-'
    },
    {
      key: 'userAgent',
      title: 'User Agent',
      sortable: false,
      render: (value) => value ? value.substring(0, 50) + '...' : '-'
    }
  ]

  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting audit report...')
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Calculate summary statistics
  const totalActions = auditData?.data?.length || 0
  const createActions = auditData?.data?.filter(a => a.action === 'CREATE').length || 0
  const updateActions = auditData?.data?.filter(a => a.action === 'UPDATE').length || 0
  const deleteActions = auditData?.data?.filter(a => a.action === 'DELETE').length || 0
  const uniqueUsers = new Set(auditData?.data?.map(a => a.user?.email).filter(Boolean)).size

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Trail Report</h1>
          <p className="text-gray-600">Track all system activities and user actions</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
        >
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Summary Statistics */}
      {auditData?.data && auditData.data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Actions</p>
                <p className="text-2xl font-bold text-gray-900">{totalActions}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm">Creates</p>
                <p className="text-2xl font-bold text-green-800">{createActions}</p>
              </div>
              <span className="text-2xl">➕</span>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm">Updates</p>
                <p className="text-2xl font-bold text-blue-800">{updateActions}</p>
              </div>
              <span className="text-2xl">✏️</span>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm">Deletes</p>
                <p className="text-2xl font-bold text-red-800">{deleteActions}</p>
              </div>
              <span className="text-2xl">🗑️</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <SearchBar
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entity</label>
            <select
              value={filters.entity}
              onChange={(e) => handleFilterChange('entity', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Entities</option>
              <option value="PRODUCT">Product</option>
              <option value="WAREHOUSE">Warehouse</option>
              <option value="RECEIPT">Receipt</option>
              <option value="DELIVERY">Delivery</option>
              <option value="TRANSFER">Transfer</option>
              <option value="ADJUSTMENT">Adjustment</option>
              <option value="USER">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Data */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <DataTable
          columns={columns}
          data={auditData?.data || []}
          loading={loading}
        />

        {auditData?.summary && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Audit Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Records:</span>
                <span className="font-medium ml-2">{auditData.summary.totalRecords}</span>
              </div>
              <div>
                <span className="text-gray-600">Unique Users:</span>
                <span className="font-medium ml-2">{uniqueUsers}</span>
              </div>
              <div>
                <span className="text-gray-600">Period:</span>
                <span className="font-medium ml-2">
                  {filters.startDate ? new Date(filters.startDate).toLocaleDateString() : 'Start'} - 
                  {filters.endDate ? new Date(filters.endDate).toLocaleDateString() : 'End'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Most Active Entity:</span>
                <span className="font-medium ml-2">{auditData.summary.mostActiveEntity || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditReport