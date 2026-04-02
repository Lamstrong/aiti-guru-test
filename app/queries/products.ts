import { useQuery } from '@tanstack/react-query';

export type Product = {
  id: number;
  title: string;
  category: string;
  brand: string;
  sku: string;
  rating: number;
  price: number;
  thumbnail: string;
};

type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export const useProductsList = (
  skip: number = 0,
  limit: number = 10,
  sortBy: string = '',
  order: string = 'asc',
  search: string = ''
) => {
  return useQuery<ProductsResponse>({
    queryKey: ['products', skip, limit, sortBy, order, search],
    queryFn: async () => {
      const baseUrl = search ? 'https://dummyjson.com/products/search' : 'https://dummyjson.com/products';
      const url = new URL(baseUrl);
      url.searchParams.append('limit', limit.toString());
      url.searchParams.append('skip', skip.toString());
      if (search) {
        url.searchParams.append('q', search);
      }
      if (sortBy) {
        url.searchParams.append('sortBy', sortBy);
        url.searchParams.append('order', order);
      }
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Ошибка сети');
      return response.json();
    },
  });
};