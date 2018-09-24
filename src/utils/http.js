import axios from 'axios';
import Qs from 'qs';
import * as object from "./object.js";

import { PROXY_TABLE_PREIFIX } from "@/config/index.js";

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

  // options.data = Qs.stringify(options.data);
  options.data = JSON.stringify(options.data);

  // 如果是post请求, 删除查询字符串, 一般都是这样,
  // 如果有另外的情况, 直接在url上拼
  if (/post/i.test(options.method)) {
    delete options.params;
  }

  // 发送 POST 请求
  return axios(options).then(res => {
    return res.data; // 这才是实际返回的数据
  }).catch(err => {
    console.log(err);
  });
}

/**
 * 简单post请求
 * @param {*} path
 * @param {*} data
 *
 * pathIsUrl: path是不是看作url, 这样会自动域名, 简单一些
 */
async function simplePost(url, data, pathIsUrl = true) {
  let res = await http({
    url: pathIsUrl ? PROXY_TABLE_PREIFIX + url : url,
    method: 'POST',
    data: data
  });
  return res;
}

export {
  http,
  simplePost
};
