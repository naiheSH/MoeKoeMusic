// 酷狗音乐API辅助工具
// 移植自后端helper.js

import { cryptoMd5 } from './kgCrypto';

// 应用配置
const useAppid = '1005';
const liteAppid = '1008';
const useClientver = '10051308';
const liteClientver = '10081000';

/**
 * web版本 signature 加密
 * @param {Object} params
 * @returns {string} 加密后的signature
 */
export const signatureWebParams = (params) => {
  const str = 'NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt';
  const paramsString = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .sort()
    .join('');
  return cryptoMd5(`${str}${paramsString}${str}`);
};

/**
 * Android版本 signature 加密
 * @param {Object} params
 * @param {string?} data
 * @returns {string} 加密后的signature
 */
export const signatureAndroidParams = (params, data) => {
  const isLite = false; // 可以根据需要调整
  const str = isLite ? 'LnT6xpN3khm36zse0QzvmgTZ3waWdRSA' : `OIlwieks28dk2k092lksi2UIkp`;
  const paramsString = Object.keys(params)
    .sort()
    .map((key) => `${key}=${typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key]}`)
    .join('');
  return cryptoMd5(`${str}${paramsString}${data || ''}${str}`);
};

/**
 * Register版本 signature 加密
 * @param {Object} params
 * @returns {string} 加密后的signature
 */
export const signatureRegisterParams = (params) => {
  const paramsString = Object.keys(params)
    .map((key) => params[key])
    .sort()
    .join('');
  return cryptoMd5(`1014${paramsString}1014`);
};

/**
 * sign 加密
 * @param {Object} params
 * @param {string?} data
 * @returns {string} 加密后的sign
 */
export const signParams = (params, data) => {
  const str = 'R6snCXJgbCaj9WFRJKefTMIFp0ey6Gza';
  const paramsString = Object.keys(params)
    .sort()
    .map((key) => `${key}${params[key]}`)
    .join('');
  return cryptoMd5(`${paramsString}${data || ''}${str}`);
};

/**
 * signKey 加密
 * @param {string} hash
 * @param {string} mid
 * @param {(string | number)?} userid
 * @param {(string | number)?} appid
 * @returns {string} 加密后的sign
 */
export const signKey = (hash, mid, userid, appid) => {
  const isLite = false; // 可以根据需要调整
  const str = isLite ? '185672dd44712f60bb1736df5a377e82' : '57ae12eb6890223e355ccfcb74edf70d';
  return cryptoMd5(`${hash}${str}${appid || useAppid}${mid}${userid || 0}`);
};

/**
 * signKey 加密云盘key
 * @param {string} hash
 * @param {string} pid
 * @returns {string} 加密后的sign
 */
export const signCloudKey = (hash, pid) => {
  const str = 'ebd1ac3134c880bda6a2194537843caa0162e2e7';
  return cryptoMd5(`musicclound${hash}${pid}${str}`);
};

/**
 * signParams 加密
 * @param {string | number} data
 * @param {(string | number)?} appid
 * @param {(string | number)?} clientver
 * @returns {string} 加密后的signParams
 */
export const signParamsKey = (data, appid, clientver) => {
  const isLite = false; // 可以根据需要调整
  const str = isLite ? 'LnT6xpN3khm36zse0QzvmgTZ3waWdRSA' : 'OIlwieks28dk2k092lksi2UIkp';

  appid = appid || (isLite ? liteAppid : useAppid);
  clientver = clientver || (isLite ? liteClientver : useClientver);

  return cryptoMd5(`${appid}${str}${clientver}${data}`);
};
