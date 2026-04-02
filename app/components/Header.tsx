import { Box, Typography, Button, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../library/auth/context';
import { useSearchState } from '../hooks/useSearchState';
import logo from '../../assets/logo.svg';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  
  const { searchValue, handleSearchChange } = useSearchState();

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
        boxSizing: 'border-box'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img src={logo} alt="Logo" style={{ width: 40, height: 40 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#111827' }}>
            AITI GURU
          </Typography>
        </Box>

        {isAuthenticated && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
             <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '20px', color: '#111827' }}>
              Товары
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F3F4F6',
                borderRadius: '8px',
                px: 2,
                width: '1200px',
                height: '44px',
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
          </Box>
        )}
      </Box>

      {isAuthenticated && (
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
      )}
    </Box>
  );
}

