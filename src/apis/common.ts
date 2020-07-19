import _http from '../utils/http'
export default class CommonApi {
    public static login(data: {}) {
        return _http({
            url: '/api/user/login',
            method: 'POST',
            data
        })
    }
    public static getUser(data: {}) {
        return _http({
            url: '/api/user/getUserData',
            method: 'GET',
            data
        })
    }
}