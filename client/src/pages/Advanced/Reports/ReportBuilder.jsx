// pages/Advanced/Reports/ReportBuilder.jsx
import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  TextField,
  Chip,
} from '@mui/material';
import {
  Add,
  ExpandMore,
  Save,
  PlayArrow,
  Download,
} from '@mui/icons-material';
import { useExport } from '../../../hooks/advanced/useExport';
import { reportAPI } from '../../../services/api/reports';

const ReportBuilder = () => {
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    dataSource: 'products',
    columns: [],
    filters: {},
    grouping: [],
    sorting: [],
    format: 'excel',
    schedule: null,
  });

  const [previewData, setPreviewData] = useState([]);
  const { isExporting, exportData } = useExport();

  const dataSourceOptions = [
    { value: 'products', label: 'Products', fields: productFields },
    { value: 'stock_movement', label: 'Stock Movement', fields: movementFields },
    { value: 'receipts', label: 'Receipts', fields: receiptFields },
    { value: 'deliveries', label: 'Deliveries', fields: deliveryFields },
  ];

  const availableFields = useMemo(() => {
    const source = dataSourceOptions.find(ds => ds.value === reportConfig.dataSource);
    return source ? source.fields : [];
  }, [reportConfig.dataSource]);

  const handleAddColumn = (field) => {
    if (!reportConfig.columns.find(col => col.field === field.value)) {
      setReportConfig(prev => ({
        ...prev,
        columns: [...prev.columns, { field: field.value, label: field.label, visible: true }]
      }));
    }
  };

  const handleRemoveColumn = (field) => {
    setReportConfig(prev => ({
      ...prev,
      columns: prev.columns.filter(col => col.field !== field)
    }));
  };

  const handlePreview = async () => {
    try {
      const response = await reportAPI.previewReport(reportConfig);
      setPreviewData(response.data);
    } catch (error) {
      console.error('Failed to generate preview:', error);
    }
  };

  const handleSaveReport = async () => {
    try {
      await reportAPI.saveReport(reportConfig);
      // Show success message
    } catch (error) {
      console.error('Failed to save report:', error);
    }
  };

  const handleRunReport = async () => {
    await exportData('custom-report', reportConfig, `${reportConfig.name}.xlsx`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Report Builder
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Save />}
            onClick={handleSaveReport}
          >
            Save Report
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={handleRunReport}
            disabled={isExporting}
          >
            Run Report
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Configuration Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Report Configuration
              </Typography>

              <TextField
                fullWidth
                label="Report Name"
                value={reportConfig.name}
                onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={reportConfig.description}
                onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Data Source</InputLabel>
                <Select
                  value={reportConfig.dataSource}
                  label="Data Source"
                  onChange={(e) => setReportConfig(prev => ({ ...prev, dataSource: e.target.value, columns: [] }))}
                >
                  {dataSourceOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Columns ({reportConfig.columns.length})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {availableFields.map(field => (
                      <Box key={field.value} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                          checked={reportConfig.columns.some(col => col.field === field.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleAddColumn(field);
                            } else {
                              handleRemoveColumn(field.value);
                            }
                          }}
                        />
                        <ListItemText primary={field.label} secondary={field.type} />
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Filters</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Filter configuration would go here */}
                  <Typography variant="body2" color="text.secondary">
                    Configure filters based on selected data source
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Grouping & Sorting</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Grouping and sorting configuration */}
                  <Typography variant="body2" color="text.secondary">
                    Configure grouping and sorting options
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>

        {/* Preview Panel */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Report Preview</Typography>
                <Button
                  startIcon={<Download />}
                  onClick={handlePreview}
                  disabled={reportConfig.columns.length === 0}
                >
                  Generate Preview
                </Button>
              </Box>

              {/* Selected Columns */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Selected Columns:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {reportConfig.columns.map(column => (
                    <Chip
                      key={column.field}
                      label={column.label}
                      onDelete={() => handleRemoveColumn(column.field)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              {/* Data Preview */}
              <Paper sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
                {previewData.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {reportConfig.columns.map(column => (
                          <th key={column.field} style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e0e0e0' }}>
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 10).map((row, index) => (
                        <tr key={index}>
                          {reportConfig.columns.map(column => (
                            <td key={column.field} style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                              {row[column.field]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    Configure your report and generate a preview to see the data
                  </Typography>
                )}
              </Paper>

              {previewData.length > 10 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Showing first 10 of {previewData.length} records
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Field definitions
const productFields = [
  { value: 'name', label: 'Product Name', type: 'string' },
  { value: 'sku', label: 'SKU', type: 'string' },
  { value: 'category', label: 'Category', type: 'string' },
  { value: 'currentStock', label: 'Current Stock', type: 'number' },
  { value: 'costPrice', label: 'Cost Price', type: 'currency' },
  { value: 'sellingPrice', label: 'Selling Price', type: 'currency' },
  { value: 'reorderLevel', label: 'Reorder Level', type: 'number' },
];

const movementFields = [
  { value: 'productName', label: 'Product Name', type: 'string' },
  { value: 'movementType', label: 'Movement Type', type: 'string' },
  { value: 'quantity', label: 'Quantity', type: 'number' },
  { value: 'reference', label: 'Reference', type: 'string' },
  { value: 'warehouse', label: 'Warehouse', type: 'string' },
  { value: 'createdAt', label: 'Date', type: 'date' },
];

const receiptFields = [
  { value: 'receiptNumber', label: 'Receipt Number', type: 'string' },
  { value: 'supplierName', label: 'Supplier', type: 'string' },
  { value: 'warehouseName', label: 'Warehouse', type: 'string' },
  { value: 'totalValue', label: 'Total Value', type: 'currency' },
  { value: 'status', label: 'Status', type: 'string' },
  { value: 'receivedDate', label: 'Received Date', type: 'date' },
];

const deliveryFields = [
  { value: 'deliveryNumber', label: 'Delivery Number', type: 'string' },
  { value: 'customerName', label: 'Customer', type: 'string' },
  { value: 'warehouseName', label: 'Warehouse', type: 'string' },
  { value: 'totalValue', label: 'Total Value', type: 'currency' },
  { value: 'status', label: 'Status', type: 'string' },
  { value: 'deliveryDate', label: 'Delivery Date', type: 'date' },
];

export default ReportBuilder;