import type { JSX, ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { toast, Toaster, ToastBar, type ToastType } from 'react-hot-toast';
import { Alert, type AlertColor, IconButton, CircularProgress } from '@mui/material';

function CustomAlert({
  type,
  onClose,
  children,
}: {
  type: ToastType;
  onClose: () => void;
  children: null | string | JSX.Element;
}) {
  const props: Record<
    ToastType,
    {
      type: AlertColor;
      icon?: ReactNode;
    }
  > = {
    blank: {
      type: 'info',
      icon: undefined,
    },
    error: {
      type: 'error',
      icon: undefined,
    },
    custom: {
      type: 'info',
      icon: undefined,
    },
    success: {
      type: 'success',
      icon: undefined,
    },
    loading: {
      type: 'info',
      icon: (
        <div>
          <CircularProgress
            size={20}
            color='inherit'
          />
        </div>
      ),
    },
  };

  return (
    <Alert
      icon={props[type].icon}
      severity={props[type].type}
      action={
        <IconButton
          size='small'
          color='inherit'
          onClick={onClose}
        >
          <CloseIcon fontSize='inherit' />
        </IconButton>
      }
    >
      {children}
    </Alert>
  );
}

// blank	4000
// error	4000
// success	2000
// custom	4000
// loading	Infinity

export function ToastProvider({ children }: { children?: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position='top-right'
        toastOptions={{
          blank: {
            duration: 3000,
          },
          custom: {
            duration: 2000,
          },
          success: {
            duration: 2000,
          },
          error: {
            duration: Infinity,
          },
          loading: {
            duration: Infinity,
          },
        }}
      >
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              padding: 0,
              maxWidth: 450,
            }}
          >
            {({ message }) => {
              const { type } = t;

              return (
                <CustomAlert
                  type={type}
                  onClose={() => {
                    toast.dismiss(t.id);
                  }}
                >
                  {message}
                </CustomAlert>
              );
            }}
          </ToastBar>
        )}
      </Toaster>
    </>
  );
}
