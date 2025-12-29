// API管理器
// 负责加载和调用各个API模块

// 导入API模块
import audioApi from '../api/audio';

// API模块映射
const apiModules = {
  '/audio': audioApi,
  // 其他API模块可以在这里继续添加
  // 例如：
  // '/playlist': playlistApi,
  // '/search': searchApi,
};

// API请求处理函数
export const handleApiRequest = async (req) => {
  try {
    // 获取请求路径
    const url = new URL(req.url, 'http://localhost');
    const path = url.pathname;
    
    // 查找对应的API模块
    const apiModule = apiModules[path];
    if (!apiModule) {
      return { status: 404, body: { code: 404, msg: 'API not found' } };
    }
    
    // 解析请求参数
    const params = {
      ...url.searchParams,
      ...req.body,
      cookie: req.headers.cookie || {},
    };
    
    // 调用API模块
    const result = await apiModule(params);
    
    return { status: 200, body: result.body };
  } catch (error) {
    console.error('API request error:', error);
    return { status: 500, body: { code: 500, msg: 'Internal server error' } };
  }
};

// 模拟axios实例，用于替换原有的httpClient
class MockHttpClient {
  constructor() {
    this.baseURL = '';
  }
  
  get(url, config = {}) {
    return this.request({ ...config, url, method: 'GET' });
  }
  
  post(url, data = {}, config = {}) {
    return this.request({ ...config, url, method: 'POST', data });
  }
  
  async request(config) {
    // 模拟请求处理
    const req = {
      url: config.url,
      method: config.method,
      body: config.data || {},
      headers: config.headers || {},
    };
    
    // 处理API请求
    const result = await handleApiRequest(req);
    
    // 模拟axios响应
    return {
      data: result.body,
      status: result.status,
      statusText: result.status === 200 ? 'OK' : 'Error',
      headers: {},
      config,
    };
  }
}

// 创建模拟的httpClient实例
export const mockHttpClient = new MockHttpClient();

export default {
  handleApiRequest,
  mockHttpClient,
};
