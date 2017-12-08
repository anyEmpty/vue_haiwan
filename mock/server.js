var app = require('koa')();
var router = require('koa-router')();



// 张杰  data
var Data = require('./ZJtextData/rev.js')

router.get('/api/getText', function *(next) {
    this.body = Data
    console.log('请求getText数据')
});
// post text
router.post('/api/postText', function *(next) {
    console.log('请求postText数据')
    // 获取参数
    this.body = {
        errno: 0,
        data: Data,
        msg: 'ok'
    }
})



// 李晓 data

var LxData = require('./LxData/rev.js')
var text2 = require('./LxData/details.js')
var text3 = require('./LxData/img.js')

// pageNo, size, startTimeAjax, endTimeAjax, productType, categoryType
router.post('/api/postTextLxx/:pageNo/:size/:startTimeAjax/:endTimeAjax/:productType/:categoryType', function *(next) {
    const params = this.params
    const size = params.size
    const pageNo = params.pageNo
    const startTimeAjax = params.startTimeAjax
    const endTimeAjax = params.endTimeAjax
    const type = params.type
    const productType = params.productType
    const categoryType = params.categoryType
    console.log('----------------------------------------------------------------------------')
    console.log('请求postTextLxx数据----','当前第'+pageNo+'页','每页'+size+'个','开始时间'+startTimeAjax+'---')
    console.log('请求postTextLxx数据----','结束时间'+endTimeAjax+'---','产品类型'+productType+'---','类目类型'+categoryType+'---')
    // 获取参数
    switch (productType) {
        case '1' :
            this.body = {
                code: '0000',
                data: LxData.typeALL,
                msg: 'ok'
            }
        return;
        case '2' :
            this.body = {
                code: '0000',
                data: LxData.type2,
                msg: 'ok'
            }
        return;
        case '3' :
            this.body = {
                code: '0000',
                data: LxData.type3,
                msg: 'ok'
            }
        return;
        case '4' :
            this.body = {
                code: '0000',
                data: LxData.type4,
                msg: 'ok'
            }
        return;
    }
})

var orderList = require('./LxData/order.js')

router.post('/api/order/:page/:size/:buyerId/:status', function *(next) {
    const params = this.params
    const page = params.page
    const size = params.size
    const buyerId = params.buyerId
    const status = params.status
    console.log('----------------------------------------------------------------------------')
    console.log('请求order数据----page', '当前第'+page+'页','每页'+size+'个','类型'+status+'---')
    // 获取参数
    this.body = orderList


    switch (status) {
        case '1' :
            this.body = orderList.dataAll
        return;
        case '2' :
            this.body = orderList.data1
        return;
        case '3' :
            this.body = orderList.data2
        return;
        case '4' :
            this.body = orderList.data3
        return;
        case '5' :
            this.body = orderList.data4
        return;
    }
})

router.post('/api/details/:id', function *(next) {
    const params = this.params
    const id = params.id
    console.log('请求details数据----id'+id)
    // 获取参数
    this.body = {
        errno: 0,
        data: text2,
        msg: 'ok'
    }
})

router.post('/api/images/:page', function *(next) {
    const params = this.params
    const page = params.page
    console.log('请求images数据----page'+page)
    // 获取参数
    this.body = {
        code: '0000',
        data: text3,
        msg: 'ok'
    }
})
// 开始服务并生成路由
app.use(router.routes())
   .use(router.allowedMethods());
app.listen(3000);
