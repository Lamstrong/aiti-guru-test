import { Box, Typography, Button, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../library/auth/context';
import { useSearchState } from '../hooks/useSearchState';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  
  const { searchValue, handleSearchChange } = useSearchState();
  
  if (!isAuthenticated) return null;

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        py: 2,
        backgroundColor: '#fff',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        height: '80px',
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '20px', color: '#111827' }}>
        Товары
      </Typography>

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#F3F4F6',
          borderRadius: '8px',
          px: 2,
          width: '1023px',
          height: '48px',
        }}
      >
        <SearchIcon sx={{ color: '#9CA3AF', mr: 1 }} />
        <InputBase
          placeholder="Найти"
          value={searchValue}
          onChange={handleSearchChange}
          fullWidth
          sx={{ fontSize: '14px' }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#333' }}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => logout()}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            borderColor: '#E5E7EB',
            color: '#374151',
            '&:hover': {
              borderColor: '#D1D5DB',
              backgroundColor: '#F9FAFB',
            }
          }}
        >
          Выйти
        </Button>
      </Box>
    </Box>
  );
}

