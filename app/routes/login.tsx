import { useState } from 'react';
import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../library/auth/context';
import type { LoginFormData } from '../../types/auth';
import logo from '../../assets/logo.svg';
import userIcon from '../../assets/user.svg';
import lockIcon from '../../assets/lock.svg';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ClearIcon from '@mui/icons-material/Clear';

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.auth?.isAuthenticated) {
      throw redirect({ to: '/product/list', search: { page: 1, q: '', sortBy: '', order: 'asc' } });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const usernameValue = watch('username');
  const passwordValue = watch('password');
  const handleClearUsername = () => {
    setValue('username', '', { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password, data.rememberMe);

      navigate({ to: '/product/list', search: { page: 1, q: '', sortBy: '', order: 'asc' } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#FAFAFA',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '716px',
          width: '527px',
          p: '6px',
          borderRadius: '24px',
          background: 'linear-gradient(180deg, #EDEDED 20%, rgba(237, 237, 237, 0) 100%)',
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            p: '48px',
            backgroundColor: 'white',
            borderRadius: '18px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img src={logo} alt="Logo" />
            </Box>
          </Box>

          <Typography variant="h5" textAlign="center" mb={1} sx={{ fontWeight: '600' }}>
            Добро пожаловать!
          </Typography>
          <Typography textAlign="center" mb={4} sx={{ fontSize: '14px', color: '#9E9E9E' }}>
            Пожалуйста, авторизуйтесь
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1 }}>
            <TextField
              label="Логин"
              variant="outlined"
              fullWidth
              {...register('username', { required: 'Введите логин' })}
              error={!!errors.username}
              helperText={errors.username?.message?.toString()}
              InputProps={{
                sx: { borderRadius: '12px' },
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={userIcon} alt="User" style={{ width: 24, height: 24 }} />
                  </InputAdornment>
                ),
                endAdornment: usernameValue ? (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearUsername} edge="end" size="small">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />

            <TextField
              label="Пароль"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              {...register('password', { required: 'Введите пароль' })}
              error={!!errors.password}
              helperText={errors.password?.message?.toString()}
              InputProps={{
                sx: { borderRadius: '12px' },
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={lockIcon} alt="Lock" style={{ width: 24, height: 24 }} />
                  </InputAdornment>
                ),
                endAdornment: passwordValue ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />

              <FormControlLabel
                control={<Checkbox {...register('rememberMe')} color="primary" />}
                label={<Typography sx={{ fontSize: '14px', color: '#616161' }}>Запомнить меня</Typography>}
              />
  

            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || isLoading}
              fullWidth
              disableElevation
              sx={{
                alignSelf: 'center',
                borderRadius: '12px',
                width: '399px',
                height: '54px',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                '&.Mui-disabled': {
                  backgroundColor: '#E0E0E0',
                  color: '#9E9E9E',
                },
                backgroundColor: '#242EDB',
                color: '#FFFFFF',
              }}
            >
              {isLoading ? 'Загрузка...' : 'Войти'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography sx={{ fontSize: '14px', color: '#616161' }}>
              Нет аккаунта?{' '}
              <Link href="#" underline="hover" sx={{ fontWeight: '600', cursor: 'pointer' }}>
                Создать
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
