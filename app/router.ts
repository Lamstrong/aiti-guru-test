import { createRouter, createHashHistory } from '@tanstack/react-router';
import { routeTree } from '../types/routeTree.gen';
import type { AuthContextType } from '../library/auth/context';
import { NotFoundComponent } from './-not-found.component';

interface RouterContext {
  auth: AuthContextType | null;
}

const hashHistory = createHashHistory();

export const router = createRouter({
  routeTree,
  history: hashHistory,
  basepath: import.meta.env.BASE_URL,
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
