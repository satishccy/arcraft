import { type Id, toast, type ToastOptions } from 'react-toastify';

// Custom toast configurations
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Success toast with custom styling
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    ...defaultOptions,
    ...options,
  });
};

// Error toast with custom styling
export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    ...defaultOptions,
    ...options,
  });
};

// Info toast with custom styling
export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast.info(message, {
    ...defaultOptions,
    ...options,
  });
};

// Warning toast with custom styling
export const showWarningToast = (message: string, options?: ToastOptions) => {
  return toast.warn(message, {
    ...defaultOptions,
    ...options,
  });
};

// Loading toast that can be updated
export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    ...defaultOptions,
  });
};

// Update an existing toast (useful for loading states)
export const updateToast = (
  toastId: Id,
  message: string,
  type: 'success' | 'error' | 'info' | 'warning'
) => {
  return toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    ...defaultOptions,
  });
};
