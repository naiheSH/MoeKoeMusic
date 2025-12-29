// 歌曲信息API
// 移植自后端module/audio.js

import { kgCreateRequest } from '../utils/kgRequest';

/**
 * 获取歌曲信息
 * @param {Object} params
 * @param {string} params.hash 歌曲hash
 * @param {Object} params.cookie cookie信息
 * @param {string} params.token token
 * @param {string} params.userid 用户ID
 * @returns {Promise<any>}
 */
export default async (params) => {
  const dateTime = Date.now();
  const dfid = params?.cookie?.dfid || '-';
  const userid = params?.cookie?.userid || params?.userid || 0;
  const token = params?.cookie?.token || params?.token || 0;

  const dataMap = {
    appid: '1005',
    clienttime: dateTime,
    clientver: '10051308',
    data: (params.hash || '').split(',').map((s) => ({ hash: s, audio_id: 0 })),
    dfid,
    key: '', // 这里需要使用signParamsKey生成，暂时留空
    mid: '', // 这里需要使用cryptoMd5生成，暂时留空
  };

  if (token) dataMap['token'] = token;
  if (userid) dataMap['userid'] = userid;

  return kgCreateRequest({
    baseURL: 'http://kmr.service.kugou.com',
    url: '/v1/audio/audio',
    method: 'POST',
    data: dataMap,
    encryptType: 'android',
    cookie: params?.cookie || {},
    headers: { 
      'x-router': 'kmr.service.kugou.com', 
      'Content-Type': 'application/json' 
    },
  });
};
