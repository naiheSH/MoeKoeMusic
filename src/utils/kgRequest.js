// 酷狗音乐API请求工具
// 移植自后端request.js

import axios from 'axios';
import { cryptoMd5 } from './kgCrypto';
import { signKey, signatureAndroidParams, signatureRegisterParams, signatureWebParams } from './kgHelper';
import { parseCookieString } from './kgUtil';

// 应用配置
const appid = '1005';
const clientver = '10051308';
const liteAppid = '1008';
const liteClientver = '10081000';

/**
 * 请求创建
 * @param {Object} options
 * @param {'get' | 'GET' | 'post' | 'POST'} options.method 请求方法
 * @param {string} options.url 请求 url
 * @param {string?} options.baseURL
 * @param {Record<string, any>?} options.params 请求参数
 * @param {Record<string, any>?} options.data 请求Body
 * @param {Record<string, string | number>?} options.headers 请求headers
 * @param {'android' | 'web' | 'register'} options.encryptType signature加密方式
 * @param {{ [key: string]: string | number }} options.cookie 请求cookie
 * @param {boolean?} options.encryptKey
 * @param {boolean?} options.clearDefaultParams 清除默认请求参数
 * @param {boolean?} options.notSignature
 * @param {string?} options.ip
 * @param {string?} options.realIP
 * @returns {Promise<{status: number;body: any, cookie: string[], headers?: Record<string, string>}>}
 */
export const kgCreateRequest = (options) => {
  return new Promise(async (resolve, reject) => {
    const isLite = false; // 可以根据需要调整
    const dfid = options?.cookie?.dfid || '-'; // 自定义
    const mid = cryptoMd5(dfid); // 可以自定义
    const uuid = cryptoMd5(`${dfid}${mid}`); // 可以自定义
    const token = options?.cookie?.token || '';
    const userid = options?.cookie?.userid || 0;
    const clienttime = Math.floor(Date.now() / 1000);
    const ip = options?.realIP || options?.ip || '';
    const headers = { dfid, clienttime, mid };

    if (ip) {
      headers['X-Real-IP'] = ip;
      headers['X-Forwarded-For'] = ip;
    }

    const defaultParams = {
      dfid,
      mid,
      uuid,
      appid: isLite ? liteAppid : appid,
      clientver: isLite ? liteClientver : clientver,
      userid,
      clienttime,
    };

    if (token) defaultParams['token'] = token;
    const params = options?.clearDefaultParams ? options?.params || {} : Object.assign({}, defaultParams, options?.params || {});

    headers['clienttime'] = params.clienttime;

    if (options?.encryptKey) {
      params['key'] = signKey(params['hash'], params['mid'], params['userid'], params['appid']);
    }

    const data = typeof options?.data === 'object' ? JSON.stringify(options.data) : options?.data || '';

    if (!params['signature'] && !options.notSignature) {
      switch (options?.encryptType) {
        case 'register':
          params['signature'] = signatureRegisterParams(params);
          break;
        case 'web':
          params['signature'] = signatureWebParams(params);
          break;
        case 'android':
        default:
          params['signature'] = signatureAndroidParams(params, data);
          break;
      }
    }

    const requestOptions = {
      params,
      data: options?.data,
      method: options.method || 'GET',
      baseURL: options?.baseURL || 'https://gateway.kugou.com',
      url: options.url,
      headers: Object.assign({ 
        'User-Agent': 'Android15-1070-11083-46-0-DiscoveryDRADProtocol-wifi' 
      }, options?.headers || {}, headers),
      withCredentials: true,
      responseType: options.responseType,
    };

    if (options.baseURL?.includes('openapicdn')) {
      const url = requestOptions.url;
      const _params = Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join('&');
      requestOptions.url = `${url}?${_params}`;
      requestOptions.params = {};
    }

    const answer = { status: 500, body: {}, cookie: [], headers: {} };
    try {
      const response = await axios(requestOptions);

      const body = response.data;

      answer.cookie = (response.headers['set-cookie'] || []).map((x) => parseCookieString(x));

      if (response.headers['ssa-code']) {
        answer.headers['ssa-code'] = response.headers['ssa-code'];
      }

      try {
        answer.body = typeof body === 'string' ? JSON.parse(body) : body;
      } catch (error) {
        answer.body = body;
      }

      if (answer.body.status === 0 || (answer.body?.error_code && answer.body.error_code !== 0)) {
        answer.status = 502;
        reject(answer);
      } else {
        answer.status = 200;
        resolve(answer);
      }
    } catch (e) {
      answer.status = 502;
      answer.body = { status: 0, msg: e.message };
      reject(answer);
    }
  });
};

export default kgCreateRequest;
