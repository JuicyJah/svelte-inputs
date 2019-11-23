exports.guid = function () {
  let alpha = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let ret = ''
  for (let i = 0; i < 6; i++) {
    ret += alpha.charAt(Math.floor(Math.random() * alpha.length));
  }
  return ret
}
