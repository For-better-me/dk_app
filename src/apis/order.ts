import _http from '../utils/http'
export default class OrderApi {
    public static submitOrder(data: {}) {
        return _http({
            url: '/api/order/cartOrderGoodsList',
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
            url: '/api/Collectaddress/getInfo',
            data
        })
    }
    public static addrNew(data: {}) {
        return _http({
            url: '/api/Collectaddress/addInfo',
            data
        })
    }
}