import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../library/auth/context';
import { Box, Typography, Button } from '@mui/material';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>Главная страница</Typography>
      {isAuthenticated ? (
        <Box>
          <Typography variant="body1" mb={2}>
            Добро пожаловать, {user?.firstName} {user?.lastName}! 
            (Username: {user?.username})
          </Typography>
          <Button variant="contained" color="secondary" onClick={() => logout()}>
            Выйти
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="body1" mb={2}>
            Вы не авторизованы.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate({ to: '/login' })}>
            Войти
          </Button>
        </Box>
      )}
    </Box>
  );
}
