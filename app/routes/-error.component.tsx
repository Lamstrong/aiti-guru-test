
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {ErrorRouteComponent } from '@tanstack/react-router';

import { RouterLink } from '../../components/link';


export const ErrorComponent: ErrorRouteComponent = ({ error }) => {


  return (
    <Box
      component='main'
      sx={{
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          gap: 2,
          width: 800,
          minHeight: 600,
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <ErrorOutlineIcon
          sx={{
            width: 56,
            height: 56,
            color: 'error.main',
          }}
        />
        <Typography
          variant='h4'
          sx={{
            fontWeight: 'bold',
            color: 'error.main',
          }}
        >
          {'Произошла ошибка'}
        </Typography>
        <RouterLink
          to='/'
          variant='h6'
          sx={{
            textDecoration: 'none',
          }}
        >
          {'На главную'}
        </RouterLink>


          <Paper
            variant='outlined'
            sx={{
              marginTop: 3,
              // backgroundColor: 'rgba(0, 0, 0, 0.05)',
              // borderRadius: 1,
              p: 4,
              width: '100%',
            }}
          >
            <Typography
              variant='h5'
              color='error'
            >
              {`${error.name}: ${error.message}`}
            </Typography>

            {error.stack && (
              <Typography
                color='error'
                component='pre'
                variant='caption'
              >
                {error.stack}
              </Typography>
            )}
          </Paper>
      </Box>
    </Box>
  );
};
