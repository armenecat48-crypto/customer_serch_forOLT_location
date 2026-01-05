
import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress, Paper, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { dataService } from '../services/dataService';
import { useOltStore } from '../oltStore';

export const SearchPanel: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { setHighlightedOlt, setMapView } = useOltStore();

  useEffect(() => {
    if (inputValue.length < 2) {
      setOptions([]);
      return;
    }

    const fetchOptions = () => {
      setLoading(true);
      try {
        const results = dataService.getAutocompleteOptions(inputValue);
        setOptions(results);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchOptions, 200);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const handleSearch = async (catId: string) => {
    if (!catId) return;

    const result = await dataService.searchByCatId(catId);
    if (result) {
      const { olt } = result;
      setHighlightedOlt(olt.id);
      setMapView({
        center: [olt.DV_lat!, olt.DV_lng!],
        zoom: 16
      });
    } else {
      // In a real enterprise app, we'd use a Snackbar here
      console.warn(`CAT ID ${catId} not found`);
    }
  };

  return (
    <Paper 
      elevation={4} 
      className="absolute top-4 left-4 z-[1000] p-4 w-80 md:w-96 rounded-xl border border-gray-200"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <SearchIcon className="text-white text-sm" fontSize="small" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 tracking-tight">ค้นหา OLT</h2>
      </div>
      
      <Autocomplete
        fullWidth
        freeSolo
        options={options}
        loading={loading}
        onInputChange={(_, value) => setInputValue(value)}
        onChange={(_, value) => {
          if (value && typeof value === 'string') {
            handleSearch(value);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            placeholder="ระบุ CAT ID เช่น 5030..."
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" className="text-gray-400" />
                </InputAdornment>
              ),
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                '&:hover fieldset': { borderColor: '#3b82f6' },
              }
            }}
          />
        )}
      />
      <p className="text-[10px] text-gray-400 mt-2 italic">
        ค้นหารหัสลูกค้า (CAT ID) เพื่อหาตำแหน่ง OLT อัตโนมัติ
      </p>
    </Paper>
  );
};
