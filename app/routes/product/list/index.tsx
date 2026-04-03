import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
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
import dots from '../../../../assets/DotsThreeCircle.svg'
import {AddCircleOutlineRounded } from '@mui/icons-material';

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
          <Stack direction="row" spacing={4} alignItems="center">
            <IconButton
              size="small"
              sx={{
                bgcolor: '#242EDB',
                color: '#fff',
                width: '52px',
                height: '27px',
                borderRadius: '23px',
                '&:hover': { bgcolor: '#1a237e' }
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ p: 0 }}>
              <img src={dots} alt="Dots" />
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

  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    mode: 'onChange',
  });

  const handleAddProduct = () => {
    setIsAddModalOpen(false);
    reset();
    toast.success('Товар успешно добавлен!');
  };

  return (
    <Box sx={{ p: 4 }}>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography style={{ fontWeight: 600, fontSize: '14px' }} variant="h4">Все позиции</Typography>
        
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
            startIcon={<AddCircleOutlineRounded />}
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

      <Dialog
        open={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); reset(); }}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
      >
        <form onSubmit={handleSubmit(handleAddProduct)}>
          <DialogTitle sx={{ fontWeight: 600, textAlign: 'center', pt: 3 }}>
            Добавить новый товар
          </DialogTitle>
          <DialogContent sx={{ border: 'none' }}>
            <Stack spacing={2.5} mt={1}>
              <TextField
                label="Наименование"
                fullWidth
                {...register('title', { required: 'Введите наименование' })}
                error={!!errors.title}
                helperText={errors.title?.message as string}
                InputProps={{ sx: { borderRadius: '12px' } }}
              />
              <TextField
                label="Цена"
                type="number"
                fullWidth
                {...register('price', {
                  required: 'Введите цену',
                  min: { value: 0.01, message: 'Цена должна быть больше 0' },
                })}
                error={!!errors.price}
                helperText={errors.price?.message as string}
                InputProps={{ sx: { borderRadius: '12px' } }}
              />
              <TextField
                label="Вендор"
                fullWidth
                {...register('brand', { required: 'Введите вендора' })}
                error={!!errors.brand}
                helperText={errors.brand?.message as string}
                InputProps={{ sx: { borderRadius: '12px' } }}
              />
              <TextField
                label="Артикул"
                fullWidth
                {...register('sku', { required: 'Введите артикул' })}
                error={!!errors.sku}
                helperText={errors.sku?.message as string}
                InputProps={{ sx: { borderRadius: '12px' } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, flexDirection: 'column', gap: 1.5 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid}
              fullWidth
              disableElevation
              sx={{
                borderRadius: '12px',
                height: '54px',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                backgroundColor: '#242EDB',
                '&:hover': { backgroundColor: '#1a237e' },
              }}
            >
              Сохранить
            </Button>
            <Button
              fullWidth
              onClick={() => { setIsAddModalOpen(false); reset(); }}
              sx={{ textTransform: 'none', color: '#9E9E9E' }}
            >
              Отмена
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}