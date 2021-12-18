import _http from '../utils/http'
export default class GoodsApi {
    public static getShop() {
        return _http({
            url: '/api/shop/info',
        })
    }
    public static getGoodsInfo(data) {
        return _http({
            url: '/api/goods/getInfo',
            data
        })
    }
    public static getSearchGoods(data) {
        return _http({
            url: '/api/Goods/getList',
            data
        })
    }
    public static getFocusList() {
        return _http({
            url: '/api/shop/getFocusList',
        })
    }
    public static getShopInfo(data) {
        return _http({
            url: '/api/shop/getShopInfo',
            data
        })
    }
}