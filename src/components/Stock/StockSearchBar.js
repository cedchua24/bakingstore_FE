import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const StockSearchBar = ({ value, onChange, placeholder = 'Search products...' }) => (
    <div style={{ margin: '18px 0' }}>
        <TextField
            fullWidth
            size="small"
            value={value}
            onChange={event => onChange(event.target.value)}
            placeholder={placeholder}
            inputProps={{ 'aria-label': placeholder }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon color="action" />
                    </InputAdornment>
                )
            }}
            sx={{
                maxWidth: 480,
                backgroundColor: '#fff',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
        />
    </div>
);

export const matchesStockSearch = (item, query) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return true;

    return Object.values(item || {}).some(value => {
        if (value == null || typeof value === 'object') return false;
        return String(value).toLowerCase().includes(normalizedQuery);
    });
};

export default StockSearchBar;
