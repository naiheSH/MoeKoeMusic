// API代理层
// 将前端的API请求直接转发到第三方API

import { getAudioInfo, searchSongs } from './kgApiService';

// API映射关系，将本地API路径映射到对应的第三方API调用
const apiMap = {
  '/everyday/recommend': async () => {
    // 模拟每日推荐数据
    return {
      status: 1,
      data: {
        song_list: [
          {
            hash: '123456',
            ori_audio_name: '示例歌曲1',
            author_name: '示例歌手1',
            sizable_cover: 'https://example.com/cover1.jpg',
            time_length: 300
          },
          {
            hash: '789012',
            ori_audio_name: '示例歌曲2',
            author_name: '示例歌手2',
            sizable_cover: 'https://example.com/cover2.jpg',
            time_length: 240
          }
        ]
      }
    };
  },
  '/top/playlist': async (params) => {
    // 模拟歌单数据
    return {
      status: 1,
      data: {
        special_list: [
          {
            global_collection_id: 'collection_1',
            specialname: '示例歌单1',
            intro: '这是一个示例歌单',
            flexible_cover: 'https://example.com/playlist1.jpg'
          },
          {
            global_collection_id: 'collection_2',
            specialname: '示例歌单2',
            intro: '这是另一个示例歌单',
            flexible_cover: 'https://example.com/playlist2.jpg'
          }
        ]
      }
    };
  },
  '/top/card': async (params) => {
    // 模拟FM数据
    return {
      status: 1,
      data: {
        song_list: [
          {
            hash: '345678',
            songname: 'FM示例歌曲1',
            author_name: 'FM示例歌手1',
            sizable_cover: 'https://example.com/fm1.jpg',
            time_length: 280
          },
          {
            hash: '901234',
            songname: 'FM示例歌曲2',
            author_name: 'FM示例歌手2',
            sizable_cover: 'https://example.com/fm2.jpg',
            time_length: 320
          }
        ]
      }
    };
  },
  '/privilege/lite': async (params) => {
    // 模拟歌曲权限数据
    return {
      status: 1,
      data: [
        {
          hash: params.hash,
          albumname: '示例专辑',
          singername: '示例歌手',
          info: {
            image: 'https://example.com/album.jpg'
          }
        }
      ]
    };
  }
};

/**
 * 处理API请求
 * @param {string} url API路径
 * @param {Object} params 请求参数
 * @returns {Promise<any>} 响应数据
 */
export const handleApiRequest = async (url, params = {}) => {
  // 查找对应的API处理函数
  const handler = apiMap[url];
  if (handler) {
    return handler(params);
  }

  // 如果没有找到对应的API处理函数，返回404
  return {
    status: 404,
    msg: 'API not found'
  };
};

export default handleApiRequest;
