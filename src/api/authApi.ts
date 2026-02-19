import axiosClient from './axiosClient';

export const logout = () => axiosClient.post('/auth/logout');

export const logoutAll = () => axiosClient.post('/auth/logout-all');
