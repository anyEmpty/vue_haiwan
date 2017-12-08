import Qs from 'qs'
// import URL from '../../../config'

export default{

  // url: 'http://172.16.107.224:8080',

  // baseURL: URL.apiUrl,
  method: 'post',

  transformRequest: [
    function (data) {
      // 为了避免qs格式化时对内层对象的格式化先把内层的对象转为
      // data.strSQL = base64encode(data.strSQL)
      // 由于使用的form-data传数据所以要格式化
      data = Qs.stringify(data)
      return data
    }
  ],

  transformResponse: [
  ],

  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Requested-With': 'XMLHttpRequest',
    'app': 'h5',
    'version': '2.6.0'
    // token: (function () {
    //   let token = cookie.get('_token_');
    //   if (token) return token;
    // })()
  },

  params: {},

  paramsSerializer: function (params) {
    return Qs.stringify(params)
  },

  data: {
  },

  timeout: 10000,

  // 是否允许跨域
  withCredentials: true,

  responseType: 'json',

  maxContentLength: 2000,

  validateStatus: function (status) {
    return status >= 200 && status < 300
  },

  maxRedirects: 5

  // proxy: {
  //   host: 'http://172.16.107.224',
  //   port: 8080,
  //   auth: {
  //   }
  // }
}
