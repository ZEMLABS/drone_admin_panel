import axiosInstance from './axiosInstance';

export const getProductsApi = () =>
    axiosInstance.get('/product');

export const getProductByIdApi = (id) =>
    axiosInstance.get(`/product/${id}`);

export const createProductApi = (payload) =>
    axiosInstance.post('/product', payload);

export const updateProductApi = (id, payload) =>
    axiosInstance.put(`/product/${id}`, payload);

export const deleteProductApi = (id) =>
    axiosInstance.delete(`/product/${id}`);

export const getCategoriesApi = () =>
    axiosInstance.get('/categories');