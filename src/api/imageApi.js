import axiosInstance from './axiosInstance';

export const uploadImageApi = (file) => {
    const formData = new FormData();

    formData.append('image', file);

    return axiosInstance.post('/image/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getAllImagesApi = () =>
    axiosInstance.get('/admin/images');

export const deleteImageApi = (id) =>
    axiosInstance.delete(`/image/${id}`);

export const getImageUrl = (id) =>
    `${process.env.REACT_APP_API_URL}/image/${id}`;