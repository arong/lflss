
function trim(str) {
  return typeof str === 'string'
    ? (str.trim ? str.trim(): str.replace(/^\s*|\s*$/i, ''))
    : str;
}

export {
  trim
};
