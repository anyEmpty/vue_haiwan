/* api接口 */
// 开发环境
// const apiUrl = 'http://172.16.107.232:8080'
// 测试环境
const apiUrl = 'http://172.16.107.224:8080'
// 线上环境
// const apiUrl = 'http://linktownfront.cdxzhi.com'
// uat环境
// const apiUrl = 'http://uat.linktownfront.cdxzhi.com'
/* 支付接口 */
// 测试环境
   // const payUrl = 'http://test.xylbn.cn'
// 线上环境
const payUrl = 'http://pay.xylbn.cn'
// uat环境
// const payUrl = 'http://uat.pay.xylbn.cn'
export default {
  payUrl: payUrl + '/lincombPay/cashier/pubPay',
  // apiUrl: apiUrl + '/linktownFront/'
  apiUrl: apiUrl
}
