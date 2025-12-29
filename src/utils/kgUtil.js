// 酷狗音乐API工具函数
// 移植自后端util.js

import pako from 'pako';

/**
 * 随机字符串
 * @param {number} len
 * @returns {string}
 */
export const randomString = (len = 16) => {
  const keyString = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const _key = [];
  const keyStringArr = keyString.split('');
  for (let i = 0; i < len; i += 1) {
    const ceil = Math.ceil((keyStringArr.length - 1) * Math.random());
    const _tmp = keyStringArr[ceil];
    _key.push(_tmp);
  }

  return _key.join('');
};

/**
 * 格式化cookie
 * @param {string} cookie
 * @returns {string}
 */
export const parseCookieString = (cookie) => {
  const t = cookie.replace(/\s*(Domain|domain|path|expires)=[^(;|$)]+;*/g, '');
  return t.replace(/;HttpOnly/g, '');
};

/**
 * cookie 转 json
 * @param {string} cookie
 * @returns {Object}
 */
export const cookieToJson = (cookie) => {
  if (!cookie) return {};
  let cookieArr = cookie.split(';');
  let obj = {};
  cookieArr.forEach((i) => {
    let arr = i.split('=');
    obj[arr[0]] = arr[1];
  });
  return obj;
};

/**
 * krc解码
 * @param {string | Uint8Array | Buffer} val
 * @returns {string}
 */
export const decodeLyrics = (val) => {
  let bytes = null;
  if (val instanceof Uint8Array) bytes = val;
  if (typeof val === 'string') bytes = new Uint8Array(Buffer.from(val, 'base64'));
  if (bytes === null) return '';
  const enKey = [64, 71, 97, 119, 94, 50, 116, 71, 81, 54, 49, 45, 206, 210, 110, 105];
  const krcBytes = bytes.slice(4);
  const len = krcBytes.byteLength;
  for (let index = 0; index < len; index += 1) {
    krcBytes[index] = krcBytes[index] ^ enKey[index % enKey.length];
  }
  try {
    const inflate = pako.inflate(krcBytes);
    return new TextDecoder().decode(inflate);
  } catch {
    return '';
  }
};
