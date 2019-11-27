exports.guid = function () {
  let alpha = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let ret = ''
  for (let i = 0; i < 6; i++)
    ret += alpha.charAt(Math.floor(Math.random() * alpha.length))
  return ret
}

exports.Mask = function (config) {
  let _defconfig = {
    mask: null,
    override: true,
    enforceLength: true,
    alwaysVisible: false,
    defaultChar: ' '
  }
  this.config = { ..._defconfig, ...config }
  this._mask = getMask(this.config.mask || null)
  this.rvalue = null
  this.mvalue = null
  this._cursorpos = 0
  this._cursorelem = null

  this.setValue = function (value) {
    this.mvalue = this.getMaskedValue(this.rvalue = value, this._mask)
  }

  this.getValue = function () {
    return config.override === true ? this.mvalue : this.rvalue
  }

  this.getDisplayValue = function () {
    return this.mvalue
  }

  this.onKeyEvent = function (event, callback) {
    if (event.key == "Backspace")
      this.setValue(this.rvalue.substring(0, this.rvalue.length - 1))
    else if ((this.config.enforceLength === true && this.rvalue.length < this._mask.length) || !this.config.enforceLength)
      this.setValue(this.rvalue + event.target.value.charAt(event.target.value.length - 1))
    this._cursorelem = this.config.alwaysVisible === true ? event.target || null : null

    if (callback && typeof callback === 'function')
      callback()
    if (!isNavigationKey(event.key))
      this.setCursor()
  }

  this.getCursorPosition = function () {
    return this._cursorpos
  }

  this.setCursor = function (inputElem = this._cursorelem) {
    // Adapted from: http://blog.vishalon.net/index.php/javascript-getting-and-setting-caret-position-in-textarea/
    if (!inputElem)
      return
    if (inputElem.setSelectionRange) {
      inputElem.focus();
      inputElem.setSelectionRange(this._cursorpos, this._cursorpos);
    } else if (inputElem.createTextRange) {
      var range = inputElem.createTextRange();
      range.collapse(true);
      range.moveEnd('character', this._cursorpos);
      range.moveStart('character', this._cursorpos);
      range.select();
    }
  }

  function isNavigationKey(keycode) {
    return keycode == "ArrowLeft" || keycode == "ArrowRight"
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

  this.getMaskedValue = function (str, mask) {
    if (!mask || !mask.mask || mask.mask.trim().length == 0)
      return null
    return this.config.alwaysVisible === true ? this.getFullMaskedValue(str, mask) : this.getPartialMaskedValue(str, mask)
  }

  this.getFullMaskedValue = function (str, mask) {
    let ret = Array(mask.length + 1).join(this.config.defaultChar)
    for (let i = 0; i < str.length; i++) {
      ret = ret.slice(0, i) + str.charAt(i) + ret.slice(i + 1)
      this._cursorpos = i + 1
    }
    ret = ret.replace(mask.regex, mask.mask)
    while (mask.unmask.indexOf(ret.length - 1) > -1) {
      ret = ret.substring(0, ret.length - 1).replace(mask.regex, mask.mask)

    }
    return ret
  }

  this.getPartialMaskedValue = function (str, mask) {
    let ret = Array(mask.length + 1).join(this.config.defaultChar)
    for (let i = 0; i < str.length; i++) {
      ret = ret.slice(0, i) + str.charAt(i) + ret.slice(i + 1)
      this._cursorpos = i + 1
    }
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
