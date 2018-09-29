import axios from 'axios';
import Qs from 'qs';
import * as object from "./object.js";

import { PROXY_TABLE_PREFIX } from "@/config/index.js";

/**
 * 全局http调用
 * @param {*} options
 */
function http(options) {

  let defaults = {
    method: 'get',

    // add to url
    params: {},

    // add to request body
    data: {},
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    }
  };

  options = object.extend(defaults, options);

  options.data = JSON.stringify(options.data);

  // 如果是post请求, 删除查询字符串, 一般都是这样,
  // 如果有另外的情况, 直接在url上拼
  if (/post/i.test(options.method)) {
    delete options.params;
  } else if (/get/i.get(options.method)) {
    delete options.data;
  }

  try {
    return axios(options);
  } catch(err) {
    return Promise.resolve({
      code: -100, // 全局通用错误处理
      msg: err.msg || 'error',
      data: null
    });
  }
}

/**
 * 简单post请求
 *
 * pathIsUrl: path是不是看作url, 这样会自动域名, 简单一些
 */
async function simplePost(url, data, pathIsUrl = false) {
  let res = await http({
    url: pathIsUrl ? PROXY_TABLE_PREFIX + url : url,
    method: 'GET',
    params: params
  });
  return res;
}

/**
 * get请求封装
 */
async function simpleGet(url, params, pathIsUrl = false) {
  let res = await http({
    url: pathIsUrl ? PROXY_TABLE_PREFIX + url : url,
    method: 'POST',
    params: params
  });
  return res;
}

export {
  http,
  simplePost,
  simpleGet
};
