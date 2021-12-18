import _http from '../utils/http'
export default class CommonApi {
    public static login(data: {}) {
        return _http({
            url: '/api/user/login',
            method: 'POST',
            data,
            loading:false
        })
    }
    public static updateUserInfo(data?: {}) {
        return _http({
            url: '/api/user/updateUserInfo',
            data
        })
    }
    public static aboutUs() {
        return _http({
            url: '/api/about/info',
        })
    }
}