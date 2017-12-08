export function phoneType () {
  let u = navigator.userAgent
  if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
    return 0
  } else if (u.indexOf('iPhone') > -1) {
    return 1
  } else if (u.indexOf('iPad') > -1 || u.indexOf('iPod') > -1) {
    return 2
  } else if (u.indexOf('Windows Phone') > -1) {
    return 4
  } else {
    return -1
  }
}
