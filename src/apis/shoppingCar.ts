import _http from '../utils/http'
export default class ShoppingCarApi {
    public static shoppingCarAdd(data: {}) {
        return _http({
            url: '/api/Goodscart/addInfo',
            data
        })
    }
    public static shoppingCountUpdate(data: {}) {
        return _http({
            url: '/api/Goodscart/changeGoodsCartNumber',
            data
        })
    }
    public static shoppingCarDel(data: {}) {
        return _http({
            url: '/api/Goodscart/delInfo',
            data
        })
    }
    public static shoppingCarList() {
        return _http({
            url: '/api/Goodscart/getList',
        })
    }

}