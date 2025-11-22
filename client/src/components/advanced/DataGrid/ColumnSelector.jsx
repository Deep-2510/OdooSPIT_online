// components/advanced/DataGrid/ColumnSelector.jsx
import {
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  Box,
} from '@mui/material';
import { useState } from 'react';

const ColumnSelector = ({
  anchorEl,
  columns,
  selectedColumns,
  onClose,
  onColumnsChange,
}) => {
  const [tempSelection, setTempSelection] = useState(selectedColumns);

  const handleToggleColumn = (columnId) => {
    const newSelection = tempSelection.includes(columnId)
      ? tempSelection.filter(id => id !== columnId)
      : [...tempSelection, columnId];
    setTempSelection(newSelection);
  };

  const handleApply = () => {
    onColumnsChange(tempSelection);
    onClose();
  };

  const handleReset = () => {
    setTempSelection(columns.map(col => col.id));
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{ sx: { width: 320 } }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button size="small" onClick={handleReset}>
            Reset
          </Button>
          <Button size="small" variant="contained" onClick={handleApply}>
            Apply
          </Button>
        </Box>
        
        {columns.map((column) => (
          <MenuItem
            key={column.id}
            onClick={() => handleToggleColumn(column.id)}
            dense
          >
            <Checkbox checked={tempSelection.includes(column.id)} />
            <ListItemText primary={column.label} />
          </MenuItem>
        ))}
      </Box>
    </Menu>
  );
};

export default ColumnSelector;