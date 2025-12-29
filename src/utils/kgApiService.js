// 酷狗音乐API服务层
// 移植自后端API模块，让前端直接调用第三方API

import axios from 'axios';
import { cryptoMd5 } from './kgCrypto';
import { signKey, signatureAndroidParams, signatureRegisterParams, signatureWebParams } from './kgHelper';
import { parseCookieString } from './kgUtil';

// 应用配置
const appid = '1005';
const clientver = '10051308';
const liteAppid = '1008';
const liteClientver = '10081000';

// 创建axios实例
const kgApiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Android15-1070-11083-46-0-DiscoveryDRADProtocol-wifi'
  },
  withCredentials: true
});

// 请求拦截器
kgApiClient.interceptors.request.use(
  config => {
    // 处理请求参数，生成签名等
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
kgApiClient.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.error('KG API request error:', error);
    return Promise.reject(error);
  }
);

/**
 * 获取歌曲信息
 * @param {Object} params
 * @param {string} params.hash 歌曲hash
 * @returns {Promise<any>}
 */
export const getAudioInfo = async (params) => {
  const dateTime = Date.now();
  const dfid = '-';
  const userid = 0;
  const token = '';

  const dataMap = {
    appid,
    clienttime: dateTime,
    clientver,
    data: (params.hash || '').split(',').map((s) => ({ hash: s, audio_id: 0 })),
    dfid,
    key: signKey(params.hash, cryptoMd5(dfid), userid, appid),
    mid: cryptoMd5(dfid),
  };

  if (token) dataMap['token'] = token;
  if (userid) dataMap['userid'] = userid;

  return kgApiClient.post('http://kmr.service.kugou.com/v1/audio/audio', dataMap, {
    headers: { 
      'x-router': 'kmr.service.kugou.com' 
    },
  });
};

/**
 * 搜索歌曲
 * @param {Object} params
 * @param {string} params.keyword 搜索关键词
 * @param {number} params.page 页码
 * @returns {Promise<any>}
 */
export const searchSongs = async (params) => {
  const dateTime = Date.now();
  const dfid = '-';
  const userid = 0;
  const token = '';

  const dataMap = {
    appid,
    clienttime: dateTime,
    clientver,
    keyword: params.keyword,
    page: params.page || 1,
    pagesize: 30,
    dfid,
    mid: cryptoMd5(dfid),
  };

  // 生成签名
  dataMap['signature'] = signatureAndroidParams(dataMap, '');

  return kgApiClient.get('https://gateway.kugou.com/search/v2/search/song', {
    params: dataMap
  });
};

// 其他API方法可以在这里继续添加
// 例如：获取歌单详情、获取歌手信息等

export default {
  getAudioInfo,
  searchSongs
};
