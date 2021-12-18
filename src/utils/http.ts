import Taro from '@tarojs/taro'
interface optsType {
    url: string,
    loading?: boolean,
    method?: any,
    data?: any,
    header?: any
}
let _http = function (opt: optsType):any {//封装请求
    const _promise = new Promise((resolve, reject) => {
        let defaultOpt = {
            loading: true, // 是否显示Loading提示窗
            method: 'POST', // 请求方法，必须大写！！
            data: {}, // 入参
            header: {
                token: Taro.getStorageSync('token') ? Taro.getStorageSync('token') : ''
            }
        }
        // 合并
        opt = Object.assign({}, defaultOpt, opt)
        opt.url = 'https://www.tjitfw.com'+opt.url
        let loading = opt.loading // 是否显示加载提示弹窗
        Taro.request({
            url: opt.url,
            method: opt.method,
            data: opt.data,
            header: opt.header,
            success: (res:any) => {
                if (res.data.code == 1001) {
                    reject({
                        code: 1001,
                        msg: opt.url + '接口需要token参数3，但系统中不存在token'
                    })
                } else if (res.data.code == 0) {
                    Taro.hideLoading()
                    resolve(res.data.data)
                    console.log('请求成功', opt.url, res.data);
                } else {
                    Taro.hideLoading()
                    reject(res.data)
                }
            },
            fail: (res:any) => {
                reject(res)
                console.log(opt.url, '通信接口失败')
            }
        })
        if (loading) {
            Taro.showLoading({
                title: '加载中',
                mask: true
            })
        }
    })

    return _promise.catch(err => {
        Taro.hideLoading()
        if (err.code == 1001) {
            Taro.hideLoading()
            console.log('err1001', err.msg)
            Taro.setStorageSync('token','')
            // Taro.navigateTo({ url: '/pages/login/index' })
        }
        else if (err.code == -1) {
            Taro.showToast({
                title: err.msg,
                icon: 'none',
                duration: 2000
            })
            console.log('非err1001', err.msg, opt.url)
        }
        return Promise.reject({
            code: err.code,
            msg: err.msg
        })
    })

}


export default _http