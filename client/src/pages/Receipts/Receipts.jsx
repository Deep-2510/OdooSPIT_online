import React from 'react'
import DataTable from '../../components/common/UI/DataTable'
import useApiQuery from '../../hooks/useApiQuery'
import { listReceipts } from '../../services/api/receipts'

const Receipts = () => {
  const { data, loading, error } = useApiQuery(() => listReceipts(), [])
  const rows = (data && (data.data || data)) || []

  const columns = [
    { header: 'Receipt #', accessor: 'receiptNumber' },
    { header: 'Supplier', accessor: 'supplier' },
    { header: 'Total', accessor: 'total' },
    { header: 'Date', accessor: 'date' },
    { header: 'Status', accessor: 'status' }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 className="text-xl font-semibold">Receipts</h2>
      </div>

      {loading && <div>Loading receipts...</div>}
      {error && <div style={{ color: 'red' }}>Error loading receipts: {error.message || String(error)}</div>}

      {!loading && !error && (
        <DataTable columns={columns} data={rows} />
      )}
    </div>
  )
}

export default Receipts
