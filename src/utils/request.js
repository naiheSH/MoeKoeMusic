// src/services/request.js
import { MoeAuthStore } from '../stores/store';
import { handleApiRequest } from './apiProxy';

// 创建一个模拟的 axios 实例，用于调用本地 API 代理层
const httpClient = {
    baseURL: import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:6521',
    
    // 模拟 GET 请求
    async get(url, config = {}) {
        const params = config.params || {};
        const response = await handleApiRequest(url, params);
        return {
            data: response
        };
    },
    
    // 模拟 POST 请求
    async post(url, data = {}, config = {}) {
        const params = { ...data, ...config.params };
        const response = await handleApiRequest(url, params);
        return {
            data: response
        };
    },
    
    // 模拟 PUT 请求
    async put(url, data = {}, config = {}) {
        const params = { ...data, ...config.params };
        const response = await handleApiRequest(url, params);
        return {
            data: response
        };
    },
    
    // 模拟 DELETE 请求
    async delete(url, config = {}) {
        const params = config.params || {};
        const response = await handleApiRequest(url, params);
        return {
            data: response
        };
    },
    
    // 模拟 PATCH 请求
    async patch(url, data = {}, config = {}) {
        const params = { ...data, ...config.params };
        const response = await handleApiRequest(url, params);
        return {
            data: response
        };
    },
    
    // 模拟请求拦截器
    interceptors: {
        request: {
            use: (successHandler, errorHandler) => {
                // 不做任何处理，直接返回
            }
        },
        response: {
            use: (successHandler, errorHandler) => {
                // 不做任何处理，直接返回
            }
        }
    }
};

// 封装 GET 请求
export const get = async (url, params = {}, config = {}, onSuccess = null, onError = null) => {
    try {
        const response = await httpClient.get(url, { params, ...config });
        if (onSuccess) onSuccess(response);
        return response;
    } catch (error) {
        if (onError) onError(error);
        throw error;
    }
};

// 封装 POST 请求
export const post = async (url, data = {}, config = {}, onSuccess = null, onError = null) => {
    try {
        const response = await httpClient.post(url, data, config);
        if (onSuccess) onSuccess(response);
        return response;
    } catch (error) {
        if (onError) onError(error);
        throw error;
    }
};

// 封装 PUT 请求
export const put = async (url, data = {}, config = {}, onSuccess = null, onError = null) => {
    try {
        const response = await httpClient.put(url, data, config);
        if (onSuccess) onSuccess(response);
        return response;
    } catch (error) {
        if (onError) onError(error);
        throw error;
    }
};

// 封装 DELETE 请求
export const del = async (url, config = {}, onSuccess = null, onError = null) => {
    try {
        const response = await httpClient.delete(url, config);
        if (onSuccess) onSuccess(response);
        return response;
    } catch (error) {
        if (onError) onError(error);
        throw error;
    }
};

// 封装 PATCH 请求
export const patch = async (url, data = {}, config = {}, onSuccess = null, onError = null) => {
    try {
        const response = await httpClient.patch(url, data, config);
        if (onSuccess) onSuccess(response);
        return response;
    } catch (error) {
        if (onError) onError(error);
        throw error;
    }
};

// 封装上传图片请求
export const uploadImage = async (url, file, additionalData = {}, config = {}, onSuccess = null, onError = null) => {
    try {
        // 模拟上传图片请求
        const response = {
            data: {
                status: 1,
                msg: 'Upload successful',
                data: {
                    url: 'https://example.com/uploaded-image.jpg'
                }
            }
        };
        if (onSuccess) onSuccess(response);
        return response;
    } catch (error) {
        if (onError) onError(error);
        throw error;
    }
};

// 导出 httpClient 以便在需要的时候直接使用
export default httpClient;