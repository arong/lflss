import axios from 'axios';
import md5 from 'js-md5';
import * as object from "./object.js";

import { BASE_URL } from "@/config/index.js";

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
      'Content-Type': 'text/plain',
    }
  };

  options = object.extend(defaults, options);

  options.data = JSON.stringify(options.data);

  // 如果是post请求, 删除查询字符串, 一般都是这样,
  // 如果有另外的情况, 直接在url上拼
  if (/post/i.test(options.method)) {
    delete options.params;
  } else if (/get/i.test(options.method)) {
    delete options.data;
  }

  try {
    return axios(options).then(res => {
      return res.data; // axios会多封闭一层, res.data才是真正的数据
    });
  } catch (err) {
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
  let packet = {
    token: sessionStorage.getItem("token"),
    timestamp: Date.now(),
    data: data,
    check: '',
  }
  var hash = md5.create();
  hash.update(String(packet.token + packet.timestamp));
  console.log(hash.hex());
  packet['check'] = hash.hex();

  let res = await http({
    url: pathIsUrl ? BASE_URL + url : url,
    method: 'POST',
    data: packet
  });

  if (res.code == -2) {
    sessionStorage.removeItem("token")
    alert("账户在其他地方登陆")
  }
  return res;
}

/**
 * get请求封装
 */
async function simpleGet(url, params, pathIsUrl = false) {
  console.log(url)
  let packet = {
    token: sessionStorage.getItem('token'),
    timestamp: Date.now(),
    check:"",
  }
  var hash = md5.create();
  hash.update(String(packet.token + packet.timestamp));
  console.log(hash.hex());
  packet['check'] = hash.hex();

  let res = await http({
    url: pathIsUrl ? BASE_URL + url : url,
    method: 'GET',
    params: {...packet, ...params}
  });
  if (res.code == -2){
    sessionStorage.removeItem("token")
    alert("账户在其他地方登陆")
  }
  return res;
}

export {
  http,
  simplePost,
  simpleGet
};
