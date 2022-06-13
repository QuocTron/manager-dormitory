import { ToastContainer, toast } from 'react-toastify';

export const showToastError = (errorMessage, milliseconds) => {
    toast.error(errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: milliseconds,
    });
};

export const showToastSuccess = (successMessage, milliseconds) => {
    toast.success(successMessage, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: milliseconds,
    });
};