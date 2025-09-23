import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

export const useNotification = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSuccess = useCallback((message: string) => {
    enqueueSnackbar(message, { 
      variant: 'success',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      autoHideDuration: 3000,
    });
  }, [enqueueSnackbar]);

  const showError = useCallback((message: string) => {
    enqueueSnackbar(message, { 
      variant: 'error',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      autoHideDuration: 5000,
    });
  }, [enqueueSnackbar]);

  const showWarning = useCallback((message: string) => {
    enqueueSnackbar(message, { 
      variant: 'warning',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      autoHideDuration: 4000,
    });
  }, [enqueueSnackbar]);

  const showInfo = useCallback((message: string) => {
    enqueueSnackbar(message, { 
      variant: 'info',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      autoHideDuration: 3000,
    });
  }, [enqueueSnackbar]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};