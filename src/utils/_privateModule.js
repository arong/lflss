// 简单模块合并
function _moduleExtend(source, ...targets) {
  source = source || {};

  for (let i = 0, len = targets.length; i < len; ++i) {
    let target = targets[i];

    for (let p in target) {

      // 已经有同名方法了
      if (source[p]) {
        throw new Error(`已经有同名方法: ${p}, 在${target.toString()}中!`);
      }

      source[p] = target[p];
    }
  }

  return source;
}

export {
  _moduleExtend
};