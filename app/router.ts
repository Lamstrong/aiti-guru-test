import { createRouter } from '@tanstack/react-router';
import { routeTree } from '../types/routeTree.gen';
import type { AuthContextType } from '../library/auth/context';
import { NotFoundComponent } from './-not-found.component';

interface RouterContext {
  auth: AuthContextType | null;
}

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundComponent,
  context: {
    auth: undefined!,
  } as RouterContext,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
