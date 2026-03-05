import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 会员相关API
export const memberAPI = {
  // 导入会员名单
  importMembers: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/members/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 获取会员统计
  getStats: async () => {
    const response = await api.get('/api/members/stats');
    return response.data;
  },

  // 获取所有会员
  getAllMembers: async () => {
    const response = await api.get('/api/members');
    return response.data;
  },
};

// 观看记录相关API
export const viewRecordAPI = {
  // 导入观看名单
  importViewRecord: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/view-records/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 获取未观看会员列表
  getMissedMembers: async (recordId) => {
    const response = await api.get(`/api/view-records/${recordId}/result`);
    return response.data;
  },

  // 获取观看记录列表
  getViewRecords: async () => {
    const response = await api.get('/api/view-records');
    return response.data;
  },

  // 获取单个观看记录
  getViewRecord: async (recordId) => {
    const response = await api.get(`/api/view-records/${recordId}`);
    return response.data;
  },
};

export default api;
