// 酷狗音乐API服务层
// 移植自后端API模块

import { cryptoMd5 } from './kgCrypto';
import httpClient from './request';

// 应用配置
const appid = '1005';
const clientver = '10051308';

// 生成签名密钥
function signParamsKey(dateTime) {
  return cryptoMd5(`KGAPPID${appid}TIMESTAMP${dateTime}`).substring(0, 16);
}

// 直接调用酷狗音乐API的方法
export const kgApi = {
  // 获取歌曲信息
  async getAudioInfo(params) {
    const dateTime = Date.now();
    const dfid = params.dfid || '-';
    const userid = params.userid || 0;
    const token = params.token || 0;

    const dataMap = {
      appid,
      clienttime: dateTime,
      clientver,
      data: (params.hash || '').split(',').map((s) => ({ hash: s, audio_id: 0 })),
      dfid,
      key: signParamsKey(dateTime),
      mid: cryptoMd5(dfid),
    };

    if (token) dataMap['token'] = token;
    if (userid) dataMap['userid'] = userid;

    return httpClient.post('http://kmr.service.kugou.com/v1/audio/audio', dataMap, {
      headers: { 
        'x-router': 'kmr.service.kugou.com', 
        'Content-Type': 'application/json' 
      },
      // 注意：实际调用时需要处理加密，这里简化处理
    });
  },

  // 其他API方法可以在这里继续添加
  // 例如：获取歌单详情、搜索歌曲等
};

export default kgApi;
