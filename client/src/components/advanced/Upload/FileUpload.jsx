// components/advanced/Upload/FileUpload.jsx
import { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  CloudUpload,
  InsertDriveFile,
  CheckCircle,
  Error,
  Delete,
} from '@mui/icons-material';

const FileUpload = ({
  onFilesSelect,
  acceptedFileTypes = '.csv,.xlsx,.xls',
  maxFileSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = (fileList) => {
    const validFiles = fileList.filter(file => {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize / 1024 / 1024}MB`);
        return false;
      }
      return true;
    });

    const processedFiles = validFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0,
      error: null,
    }));

    setFiles(prev => multiple ? [...prev, ...processedFiles] : processedFiles);
    onFilesSelect?.(multiple ? [...files, ...processedFiles] : processedFiles);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateFileProgress = (index, progress, status = 'uploading') => {
    setFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, progress, status } : file
    ));
  };

  const getFileIcon = (file) => {
    switch (file.status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <InsertDriveFile />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Paper
        variant="outlined"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          p: 3,
          textAlign: 'center',
          border: isDragging ? '2px dashed #1976d2' : '2px dashed #e0e0e0',
          backgroundColor: isDragging ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drag & Drop files here
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          or click to select files
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Supported formats: {acceptedFileTypes} (Max: {maxFileSize / 1024 / 1024}MB)
        </Typography>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedFileTypes}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Paper>

      {/* File List */}
      {files.length > 0 && (
        <List sx={{ mt: 2 }}>
          {files.map((file, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton onClick={() => removeFile(index)}>
                  <Delete />
                </IconButton>
              }
            >
              <ListItemIcon>
                {getFileIcon(file)}
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={
                  <Box>
                    <Typography variant="body2">
                      {formatFileSize(file.size)}
                    </Typography>
                    {file.status === 'uploading' && (
                      <LinearProgress
                        variant="determinate"
                        value={file.progress}
                        sx={{ mt: 1 }}
                      />
                    )}
                    {file.error && (
                      <Typography variant="caption" color="error">
                        {file.error}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FileUpload;