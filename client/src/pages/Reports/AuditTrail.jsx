import { useState } from 'react'
import { Search, Download, Calendar } from 'lucide-react'
import DataTable from '../../components/common/UI/DataTable'
import SearchBar from '../../components/common/UI/SearchBar'
import { useQuery } from '../../hooks/useApi'

const AuditTrail = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })
  
  const { data: auditData, loading } = useQuery('/api/reports/audit', {
    params: { 
      search: searchTerm,
      startDate: dateRange.start,
      endDate: dateRange.end
    }
  })

  const columns = [
    {
      key: 'action',
      title: 'Action',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'CREATE' ? 'bg-green-100 text-green-800' :
          value === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
          value === 'DELETE' ? 'bg-red-100 text-red-800' :
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
      key: 'description',
      title: 'Description',
      sortable: true
    },
    {
      key: 'user',
      title: 'User',
      sortable: true,
      render: (value, row) => row.user?.email || 'System'
    },
    {
      key: 'timestamp',
      title: 'Timestamp',
      sortable: true,
      render: (value) => new Date(value).toLocaleString()
    },
    {
      key: 'ipAddress',
      title: 'IP Address',
      sortable: true
    }
  ]

  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting audit trail...')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
          <p className="text-gray-600">Track all system activities and changes</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
        >
          <Download className="h-4 w-4" />
          <span>Export Audit</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <SearchBar
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="End Date"
            />
          </div>
        </div>

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
                <span className="text-gray-600">Creates:</span>
                <span className="font-medium text-green-600 ml-2">{auditData.summary.creates}</span>
              </div>
              <div>
                <span className="text-gray-600">Updates:</span>
                <span className="font-medium text-blue-600 ml-2">{auditData.summary.updates}</span>
              </div>
              <div>
                <span className="text-gray-600">Deletes:</span>
                <span className="font-medium text-red-600 ml-2">{auditData.summary.deletes}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditTrail