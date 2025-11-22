// components/advanced/Upload/BulkImport.jsx
import { useState } from 'react';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CloudUpload,
  Description,
  CheckCircle,
} from '@mui/icons-material';
import FileUpload from './FileUpload';
import { useImport } from '../../../hooks/advanced/useImport';

const steps = ['Upload File', 'Review Data', 'Import Results'];

const BulkImport = ({ 
  templateType, 
  onImportComplete,
  validationSchema,
  importService 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [files, setFiles] = useState([]);
  
  const {
    data,
    errors,
    loading,
    progress,
    importData,
    validateData,
    resetImport,
  } = useImport(importService, validationSchema);

  const handleFilesSelect = (selectedFiles) => {
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      validateData(selectedFiles[0].file);
    }
  };

  const handleNext = () => {
    if (activeStep === 1) {
      importData(data);
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFiles([]);
    resetImport();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload File
            </Typography>
            <FileUpload
              onFilesSelect={handleFilesSelect}
              acceptedFileTypes=".csv,.xlsx,.xls"
              multiple={false}
            />
            {files.length > 0 && (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ mt: 2 }}
                disabled={errors.length > 0}
              >
                Next: Review Data
              </Button>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Import Data
            </Typography>
            {errors.length > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Found {errors.length} validation errors. Please fix them before importing.
              </Alert>
            )}
            
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {data.length > 0 && Object.keys(data[0]).map((key) => (
                      <TableCell key={key}>{key}</TableCell>
                    ))}
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(0, 10).map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, cellIndex) => (
                        <TableCell key={cellIndex}>{String(value)}</TableCell>
                      ))}
                      <TableCell>
                        {errors.some(error => error.row === index) ? (
                          <Typography color="error" variant="caption">
                            Error
                          </Typography>
                        ) : (
                          <Typography color="success" variant="caption">
                            Valid
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {data.length > 10 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Showing first 10 of {data.length} records
              </Typography>
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button onClick={handleBack}>Back</Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={errors.length > 0 || loading}
              >
                {loading ? 'Importing...' : 'Start Import'}
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Import Results
            </Typography>
            {progress.success > 0 && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Successfully imported {progress.success} records
              </Alert>
            )}
            {progress.errors > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {progress.errors} records failed to import
              </Alert>
            )}
            
            <Button onClick={handleReset} variant="contained">
              Import Another File
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent(activeStep)}
    </Paper>
  );
};

export default BulkImport;