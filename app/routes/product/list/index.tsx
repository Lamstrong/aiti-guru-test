import { useState, useMemo } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Stack,
} from '@mui/material';
import {
  useReactTable,
  getCoreRowModel,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table';
import refreshIcon from '../../../../assets/ArrowsClockwise.svg'
import AddIcon from '@mui/icons-material/Add';
import SquareIcon from '@mui/icons-material/Square';
import toast from 'react-hot-toast';

import { useProductsList, type Product } from '../../../queries/products';
import { TableTemplate } from '../../../../library/table';

export type ProductSearch = {
  q?: string;
  page?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
};

export const Route = createFileRoute('/product/list/')({
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    return {
      q: (search.q as string) || undefined,
      page: Number(search.page) || 1,
      sortBy: (search.sortBy as string) || undefined,
      order: (search.order as 'asc' | 'desc') || 'asc',
    };
  },
  beforeLoad: ({ context }) => {
    if (!context.auth?.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: IndexComponent,
});

function IndexComponent() {
  const navigate = Route.useNavigate();
  const { q, page: urlPage, sortBy: urlSortBy, order: urlOrder } = Route.useSearch();

  const page = urlPage || 1;
  const sortBy = urlSortBy || '';
  const order = urlOrder || 'asc';
  
  const pageSize = 8;
  const skip = (page - 1) * pageSize;

  const sorting: SortingState = sortBy ? [{ id: sortBy, desc: order === 'desc' }] : [];

  const { data, isLoading, refetch, isRefetching } = useProductsList(
    skip, 
    pageSize, 
    sortBy, 
    order, 
    q || ''
  );

  const setPage = (newPage: number) => {
    navigate({
      search: (prev: ProductSearch) => ({ ...prev, page: newPage }),
    });
  };

  const onSortingChange = (updaterOrValue: SortingState | ((prev: SortingState) => SortingState)) => {
    const next = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;
    const newSort = next.length > 0 ? next[0] : null;
    
    navigate({
      search: (prev: ProductSearch) => ({
        ...prev,
        sortBy: newSort?.id || undefined,
        order: newSort?.desc ? 'desc' : 'asc',
        page: 1,
      }),
    });
  };
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            size="small"
            checkedIcon={<SquareIcon sx={{ color: '#3C538E' }} />}
            sx={{
              color: '#d1d5db',
              '&.Mui-checked': {
                color: '#3C538E',
              },
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            size="small"
            checkedIcon={<SquareIcon sx={{ color: '#3C538E' }} />}
            sx={{
              color: '#d1d5db',
              '&.Mui-checked': {
                color: '#3C538E',
              },
            }}
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'title',
        header: 'Наименование',
        cell: ({ row }) => (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={row.original.thumbnail} variant="rounded" />
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {row.original.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.original.category}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        accessorKey: 'brand',
        header: 'Вендор',
        cell: ({ getValue }) => (
          <Typography variant="body2" fontWeight={600}>
            {(getValue() as string) || '-'}
          </Typography>
        ),
      },
      {
        accessorKey: 'sku',
        header: 'Артикул',
      },
      {
        accessorKey: 'rating',
        header: 'Оценка',
        cell: ({ getValue }) => {
          const val = getValue() as number;
          return (
            <Typography
              variant="body2"
            >
              <span style={{ color: val < 3.5 ? '#F11010' : '#000000' }}>{val}</span>/5
            </Typography>
          );
        },
      },
      {
        accessorKey: 'price',
        header: 'Цена, ₽',
        cell: ({ getValue }) => {
          const formatted = new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 2,
          }).format(getValue() as number);
          return <Typography variant="body2">{formatted}</Typography>;
        },
      },
      {
        id: 'actions',
        header: '',
        cell: () => (
          <Stack direction="row" spacing={1}>
            <IconButton size="small" sx={{ bgcolor: '#242EDB', color: '#fff', width: '52px', height:'27px', borderRadius: '23px'}}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.products || [],
    columns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: data ? Math.ceil(data.total / pageSize) : 0,
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddModalOpen(false);
    toast.success('Товар успешно добавлен!');
  };

  return (
    <Box sx={{ p: 4 }}>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Все позиции</Typography>
        
        <Box display="flex" gap={2}>
          <IconButton sx={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
          }} onClick={() => refetch()} disabled={isRefetching || isLoading}>
            <img src={refreshIcon} alt="Refresh" />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
            sx={{ textTransform: 'none', borderRadius: 2, height: '42px', width: '147px', backgroundColor: '#242EDB'}}
          >
            Добавить
          </Button>
        </Box>
      </Box>

      <Box sx={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px' }}>
        <TableTemplate
          table={table}
          isLoading={isLoading || isRefetching}
          total={data?.total || 0}
          pageSize={pageSize}
          page={page}
          onPageChange={setPage}
        />
      </Box>

      <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleAddProduct}>
          <DialogTitle>Добавить новый товар</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3} mt={1}>
              <TextField label="Наименование" required fullWidth size="small" />
              <TextField label="Цена" type="number" required fullWidth size="small" />
              <TextField label="Вендор" required fullWidth size="small" />
              <TextField label="Артикул" required fullWidth size="small" />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsAddModalOpen(false)} color="inherit">
              Отмена
            </Button>
            <Button type="submit" variant="contained" disableElevation>
              Сохранить
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}