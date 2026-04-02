import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Box,
  Pagination,
  Stack,
  IconButton,
  Typography,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ImportExportIcon from '@mui/icons-material/ImportExport';

interface TableTemplateProps<T> {
  table: TanstackTable<T>;
  isLoading?: boolean;
  total?: number;
  pageSize?: number;
  page?: number;
  onPageChange?: (page: number) => void;
}

export function TableTemplate<T>({
  table,
  isLoading,
  total = 0,
  pageSize = 10,
  page = 1,
  onPageChange,
}: TableTemplateProps<T>) {
  return (
    <Box>
    <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ overflowY: 'hidden' }}>
      {isLoading && (
        <Box sx={{ width: '100%', position: 'absolute' }}>
          <LinearProgress />
        </Box>
      )}
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  sx={{
                    color: '#8a92a6',
                    fontWeight: 600,
                    userSelect: 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() && (
                      <IconButton
                        size="small"
                        onClick={header.column.getToggleSortingHandler()}
                        sx={{ 
                          p: 0.25,
                          color: header.column.getIsSorted() ? 'primary.main' : 'inherit'
                        }}
                      >
                        {{
                          asc: <ArrowUpwardIcon sx={{ fontSize: 18 }} />,
                          desc: <ArrowDownwardIcon sx={{ fontSize: 18 }} />,
                        }[header.column.getIsSorted() as string] ?? (
                          <ImportExportIcon sx={{ fontSize: 18, opacity: 0.5 }} />
                        )}
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow 
                key={row.id} 
                hover
                sx={{
                  borderLeft: row.getIsSelected() ? '4px solid #3C538E' : '4px solid transparent',
                  backgroundColor: row.getIsSelected() ? 'rgba(60, 83, 142, 0.05) !important' : 'inherit',
                  transition: 'all 0.15s ease-in-out',
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} sx={{ py: 1 }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} align="center">
                {isLoading ? 'Загрузка...' : 'Нет данных'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </TableContainer>
      {onPageChange && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 3, mb: 1, px: 1 }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Показано {total === 0 ? 0 : (page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} из {total}
          </Typography>
          <Pagination
            count={Math.ceil(total / pageSize)}
            page={page}
            onChange={(_, value) => onPageChange(value)}
            shape="rounded"
            color="primary"
          />
        </Stack>
      )}
    </Box>
);
}