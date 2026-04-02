import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { AuthContextType } from '../../library/auth/context';
import { Header } from '../components/Header';
import { Box } from '@mui/material';

interface MyRouterContext {
  auth: AuthContextType | null;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
