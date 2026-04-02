import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { AuthContextType } from '../../library/auth/context';

interface MyRouterContext {
  auth: AuthContextType | null;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
