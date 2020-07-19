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
}