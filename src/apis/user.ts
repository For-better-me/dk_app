import _http from '../utils/http'
export default class UserApi {
    public static getPersonalConfig() {
        return _http({
            url: '/api/user/personal',
            method: 'POST',
        })
    }
    public static recharge() {
        return _http({
            url: '/api/Recharge/getList',
            method: 'POST',
        })
    }
    public static rechargeLog(data) {
        return _http({
            url: '/api/Balancelog/info',
            method: 'POST',
            data
        })
    }
    public static IntegralLog(data) {
        return _http({
            url: '/api/Integrallog/getList',
            method: 'POST',
            data
        })
    }
    public static CouponLog() {
        return _http({
            url: '/api/Coupon/getList',
            method: 'POST',
        })
    }
}