import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.auth?.isAuthenticated) {
      throw redirect({ 
        to: '/product/list', 
        search: { page: 1, q: '', sortBy: '', order: 'asc' } 
      });
    } else {
      throw redirect({ to: '/login' });
    }
  },
});
