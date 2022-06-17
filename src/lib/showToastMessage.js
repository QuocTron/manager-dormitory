import { toast } from 'react-toastify';

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

export const showToastPosition = (successMessage, position, milliseconds) => {
    toast.success(successMessage, {
        position: toast.POSITION[position],
        autoClose: milliseconds,
    });
};

export const showToastMessage = (type_toast, successMessage, position, milliseconds) => {
    toast[type_toast](successMessage, {
        position: toast.POSITION[position],
        autoClose: milliseconds,
    });
};