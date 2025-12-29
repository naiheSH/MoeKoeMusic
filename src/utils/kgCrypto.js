// 酷狗音乐API加密工具
// 移植自后端crypto.js

import crypto from 'crypto-js';

// 公钥
const publicRasKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIAG7QOELSYoIJvTFJhMpe1s/gbjDJX51HBNnEl5HXqTW6lQ7LC8jr9fWZTwusknp+sVGzwd40MwP6U5yDE27M/X1+UR4tvOGOqp94TJtQ1EPnWGWXngpeIW5GxoQGao1rmYWAu6oi1z9XkChrsUdC6DJE5E221wf/4WLFxwAtRQIDAQAB
-----END PUBLIC KEY-----`;

const publicLiteRasKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDECi0Np2UR87scwrvTr72L6oO01rBbbBPriSDFPxr3Z5syug0O24QyQO8bg27+0+4kBzTBTBOZ/WWU0WryL1JSXRTXLgFVxtzIY41Pe7lPOgsfTCn5kZcvKhYKJesKnnJDNr5/abvTGf+rHG3YRwsCHcQ08/q6ifSioBszvb3QiwIDAQAB
-----END PUBLIC KEY-----`;

// 生成随机字符串
function randomString(length = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// MD5加密
function cryptoMd5(data) {
  const buffer = typeof data === 'object' ? JSON.stringify(data) : data;
  return crypto.MD5(buffer).toString();
}

// Sha1加密
function cryptoSha1(data) {
  const buffer = typeof data === 'object' ? JSON.stringify(data) : data;
  return crypto.SHA1(buffer).toString();
}

// AES加密
function cryptoAesEncrypt(data, opt = {}) {
  if (typeof data === 'object') data = JSON.stringify(data);
  let key, iv, tempKey = '';
  if (opt.key && opt.iv) {
    key = opt.key;
    iv = opt.iv;
  } else {
    tempKey = opt.key || randomString(16).toLowerCase();
    key = cryptoMd5(tempKey).substring(0, 32);
    iv = key.substring(key.length - 16, key.length);
  }

  const encrypted = crypto.AES.encrypt(data, crypto.enc.Utf8.parse(key), {
    iv: crypto.enc.Utf8.parse(iv),
    mode: crypto.mode.CBC,
    padding: crypto.pad.Pkcs7
  });

  if (opt.key && opt.iv) return encrypted.ciphertext.toString();
  return { str: encrypted.ciphertext.toString(), key: tempKey };
}

// AES解密
function cryptoAesDecrypt(data, key, iv) {
  if (!iv) key = cryptoMd5(key).substring(0, 32);
  iv = iv || key.substring(key.length - 16, key.length);

  const decrypted = crypto.AES.decrypt(data, crypto.enc.Utf8.parse(key), {
    iv: crypto.enc.Utf8.parse(iv),
    mode: crypto.mode.CBC,
    padding: crypto.pad.Pkcs7
  });

  const result = decrypted.toString(crypto.enc.Utf8);
  try {
    return JSON.parse(result);
  } catch (e) {
    return result;
  }
}

// RSA加密（简化版，使用Web Crypto API）
async function cryptoRSAEncrypt(data) {
  // 注意：完整的RSA加密需要Web Crypto API，这里返回简化版
  // 实际使用时需要实现完整的RSA加密
  const isLite = false; // 可以根据需要调整
  const useData = typeof data === 'object' ? JSON.stringify(data) : data;
  return useData; // 简化处理，实际需要实现完整的RSA加密
}

// 播放列表AES加密
function playlistAesEncrypt(data) {
  const useData = typeof data === 'object' ? JSON.stringify(data) : data;
  const key = randomString(6).toLowerCase();
  const encryptKey = cryptoMd5(key).substring(0, 16);
  const iv = cryptoMd5(key).substring(16, 32);

  const encrypted = crypto.AES.encrypt(useData, crypto.enc.Utf8.parse(encryptKey), {
    iv: crypto.enc.Utf8.parse(iv),
    mode: crypto.mode.CBC,
    padding: crypto.pad.Pkcs7
  });

  return { key, str: encrypted.toString() };
}

// 播放列表AES解密
function playlistAesDecrypt(data) {
  const encryptKey = cryptoMd5(data.key).substring(0, 16);
  const iv = cryptoMd5(data.key).substring(16, 32);

  const decrypted = crypto.AES.decrypt(data.str, crypto.enc.Utf8.parse(encryptKey), {
    iv: crypto.enc.Utf8.parse(iv),
    mode: crypto.mode.CBC,
    padding: crypto.pad.Pkcs7
  });

  const result = decrypted.toString(crypto.enc.Utf8);
  try {
    return JSON.parse(result);
  } catch (e) {
    return result;
  }
}

export {
  cryptoAesDecrypt,
  cryptoAesEncrypt,
  cryptoMd5,
  cryptoRSAEncrypt,
  cryptoSha1,
  playlistAesEncrypt,
  playlistAesDecrypt,
  randomString
};
