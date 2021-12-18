import _http from '../utils/http'
export default class OrderApi {
    public static getSubmitInfo(data: {}) {
        return _http({
            url: '/api/order/cartOrderGoodsList',
            data,
            loading:false
        })
    }
    public static submitOrder(data: {}) {
        return _http({
            url: '/api/order/cartCreateOrder',
            data
        })
    }
    public static addrList(data: {}) {
        return _http({
            url: '/api/Collectaddress/getList',
            data
        })
    }
    public static updateCollectStatus(data: {}) {
        return _http({
            url: '/api/Collectaddress/updateCollectStatus',
            data
        })
    }
    public static addrDel(data: {}) {
        return _http({
            url: '/api/Collectaddress/delInfo',
            data
        })
    }
    public static addrInfo(data: {}) {
        return _http({
            url: '/api/Collectaddress/getInfo',
            data
        })
    }
    public static addrUpdate(data: {}) {
        return _http({
            url: '/api/Collectaddress/updateInfo',
            data
        })
    }
    public static addrNew(data: {}) {
        return _http({
            url: '/api/Collectaddress/addInfo',
            data
        })
    }
    public static orderList(data) {
        return _http({
            url: '/api/order/getOrderlist',
            data
        })
    }
    public static orderCancel(data) {
        return _http({
            url: '/api/order/cancelOrder',
            data
        })
    }
    public static orderDel(data) {
        return _http({
            url: '/api/order/delInfo',
            data
        })
    }
    public static orderInfo(data) {
        return _http({
            url: '/api/order/getOrderInfo',
            data
        })
    }
    public static orderPay(data) {
        return _http({
            url: '/api/order/goPayment',
            data
        })
    }
}