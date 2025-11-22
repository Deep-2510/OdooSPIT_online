// components/advanced/Search/AdvancedSearch.jsx
import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  MenuItem,
} from '@mui/material';
import {
  Search,
  ExpandMore,
  FilterList,
  Clear,
} from '@mui/icons-material';

const AdvancedSearch = ({
  onSearch,
  filters = [],
  searchFields = [],
  defaultFilters = {},
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState(defaultFilters);
  const [activeFilters, setActiveFilters] = useState([]);

  const handleSearch = () => {
    const searchData = {
      search: searchTerm,
      filters: advancedFilters,
    };
    onSearch(searchData);
    
    // Update active filters display
    const newActiveFilters = Object.entries(advancedFilters)
      .filter(([_, value]) => value !== '' && value !== null)
      .map(([key, value]) => ({ key, value }));
    setActiveFilters(newActiveFilters);
  };

  const handleClear = () => {
    setSearchTerm('');
    setAdvancedFilters(defaultFilters);
    setActiveFilters([]);
    onSearch({ search: '', filters: defaultFilters });
  };

  const removeFilter = (filterKey) => {
    const newFilters = { ...advancedFilters };
    delete newFilters[filterKey];
    setAdvancedFilters(newFilters);
    
    setActiveFilters(activeFilters.filter(f => f.key !== filterKey));
    
    onSearch({
      search: searchTerm,
      filters: newFilters,
    });
  };

  const handleFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      {/* Quick Search */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button onClick={handleClear} startIcon={<Clear />}>
          Clear
        </Button>
      </Box>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Active Filters:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {activeFilters.map((filter) => (
              <Chip
                key={filter.key}
                label={`${filter.key}: ${filter.value}`}
                onDelete={() => removeFilter(filter.key)}
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Advanced Filters */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList />
            <Typography>Advanced Filters</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {filters.map((filter) => (
              <Grid item xs={12} sm={6} md={4} key={filter.key}>
                <TextField
                  fullWidth
                  select={filter.type === 'select'}
                  type={filter.type === 'number' ? 'number' : 'text'}
                  label={filter.label}
                  value={advancedFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  size="small"
                >
                  {filter.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={handleSearch}>
              Apply Filters
            </Button>
            <Button onClick={() => setAdvancedFilters(defaultFilters)}>
              Reset Filters
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default AdvancedSearch;