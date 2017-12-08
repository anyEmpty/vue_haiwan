export function saveToLocal (id, key, value) {
  let seller = getItem('__seller__')
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  setItem('__seller__', JSON.stringify(seller))
}

export function loadFromLocal (id, key, def) {
  let seller = getItem('__seller__')
  if (!seller) {
    return def
  }
  seller = JSON.parse(seller)[id]
  if (!seller) {
    return def
  }
  let ret = seller[key]
  return ret || def
}

/* eslint-disable no-unsafe-finally */
function getItem (key) {
  let value = {}
  try {
      value = window.localStorage.getItem(key)
  } catch (ex) {
      // 开发环境下提示error
      if (window.__DEV__) {
          console.error('localStorage.getItem报错, ', ex.message)
      }
  } finally {
      return value
  }
}

/* eslint-disable no-unsafe-finally */
function setItem (key, value) {
  try {
      // ios safari 无痕模式下，直接使用 localStorage.setItem 会报错
      window.localStorage.setItem(key, value)
  } catch (ex) {
      // 开发环境下提示 error
      if (window.__DEV__) {
          console.error('localStorage.setItem报错, ', ex.message)
      }
  }
}
