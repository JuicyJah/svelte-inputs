exports.guid = function () {
  let alpha = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let ret = ''
  for (let i = 0; i < 6; i++)
    ret += alpha.charAt(Math.floor(Math.random() * alpha.length))
  return ret
}

exports.Mask = function (config) {
  this.config = config
  this._mask = getMask(config.mask || null)
  this.rvalue = null
  this.mvalue = null

  this.setValue = function (value) {
    this.mvalue = getMaskedValue(this.rvalue = value, this._mask)
  }

  this.getValue = function () {
    return config.override === true ? this.mvalue : this.rvalue
  }

  this.getDisplayValue = function () {
    return this.mvalue
  }

  this.onKeyEvent = function (event) {
    if (event.key == "Backspace")
      this.setValue(this.rvalue.substring(0, this.rvalue.length - 1))
    else if ((this.config.enforceLength === true && this.rvalue.length < this._mask.length) || !this.config.enforceLength)
      this.setValue(this.rvalue + event.target.value.charAt(event.target.value.length - 1))
  }

  function getMask(str) {
    if (!str || str.trim().length == 0)
      return null
    let ret = { mask: "", regex: "", length: 0, unmask: [] }
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) === 'x') {
        ret.mask += '$' + (++ret.length)
        ret.regex += "(.{1})"
      } else {
        ret.mask += str.charAt(i)
        ret.unmask.push(i)
      }
    }
    ret.regex = RegExp(ret.regex)
    return ret
  }

  function getMaskedValue(str, mask) {
    if (!mask || !str || str.trim().length == 0 || !mask.mask || mask.mask.trim().length == 0)
      return null
    let ret = Array(mask.length + 1).join(' ')
    for (let i = 0; i < str.length; i++)
      ret = ret.slice(0, i) + str.charAt(i) + ret.slice(i + 1)
    ret = ret.replace(mask.regex, mask.mask).trim()
    while (mask.unmask.indexOf(ret.length - 1) > -1)
      ret = ret.substring(0, ret.length - 1).replace(mask.regex, mask.mask).trim()
    return ret
  }

  function getValueFromMask(str, unmask) {
    for (let i = 0, j = 0; i < unmask.length; i++)
      str = str.slice(0, unmask[i] - j) + str.slice(unmask[i] - (j++) + 1)
    return str
  }
}
