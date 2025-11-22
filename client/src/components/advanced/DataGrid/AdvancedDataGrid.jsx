// components/advanced/DataGrid/AdvancedDataGrid.jsx
import { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ViewColumn,
  FilterList,
  Sort,
  MoreVert,
} from '@mui/icons-material';
import ColumnSelector from './ColumnSelector';
import GridFilters from './GridFilters';

const AdvancedDataGrid = ({
  columns,
  data,
  selectable = false,
  onSelectionChange,
  onSort,
  onFilter,
  actions = [],
}) => {
  const [selectedColumns, setSelectedColumns] = useState(
    columns.map(col => col.id)
  );
  const [selectedRows, setSelectedRows] = useState([]);
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);

  const visibleColumns = useMemo(() => 
    columns.filter(col => selectedColumns.includes(col.id)),
    [columns, selectedColumns]
  );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.id);
      setSelectedRows(newSelecteds);
      onSelectionChange?.(newSelecteds);
    } else {
      setSelectedRows([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (event, id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }

    setSelectedRows(newSelected);
    onSelectionChange?.(newSelected);
  };

  const isSelected = (id) => selectedRows.indexOf(id) !== -1;

  return (
    <Box>
      {/* Grid Toolbar */}
      <Box sx={{ p: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
        {selectable && (
          <Checkbox
            indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
            checked={data.length > 0 && selectedRows.length === data.length}
            onChange={handleSelectAll}
          />
        )}
        
        <Tooltip title="Column Settings">
          <IconButton onClick={(e) => setColumnMenuAnchor(e.currentTarget)}>
            <ViewColumn />
          </IconButton>
        </Tooltip>

        <Tooltip title="Filter">
          <IconButton onClick={(e) => setFilterMenuAnchor(e.currentTarget)}>
            <FilterList />
          </IconButton>
        </Tooltip>

        <Box sx={{ flexGrow: 1 }} />

        <Typography variant="body2" color="text.secondary">
          {selectedRows.length} of {data.length} selected
        </Typography>
      </Box>

      {/* Data Grid */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                    checked={data.length > 0 && selectedRows.length === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {visibleColumns.map((column) => (
                <TableCell key={column.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {column.label}
                    {column.sortable && (
                      <IconButton size="small" onClick={() => onSort?.(column.id)}>
                        <Sort />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              ))}
              {actions.length > 0 && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              const isItemSelected = isSelected(row.id);
              return (
                <TableRow
                  hover
                  key={row.id}
                  selected={isItemSelected}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => handleSelectRow(event, row.id)}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id}>
                      {column.render ? column.render(row) : row[column.id]}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>
                      <IconButton>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Column Management Menu */}
      <ColumnSelector
        anchorEl={columnMenuAnchor}
        columns={columns}
        selectedColumns={selectedColumns}
        onClose={() => setColumnMenuAnchor(null)}
        onColumnsChange={setSelectedColumns}
      />

      {/* Filter Menu */}
      <GridFilters
        anchorEl={filterMenuAnchor}
        columns={columns}
        onClose={() => setFilterMenuAnchor(null)}
        onFilter={onFilter}
      />
    </Box>
  );
};

export default AdvancedDataGrid;