import OrderApi from '../apis/order'
import Taro from '@tarojs/taro'
function formatNumber(n: number | string): string {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}
function formatTime(date: any): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    const t1 = [year, month, day].map(formatNumber).join('/')
    const t2 = [hour, minute, second].map(formatNumber).join(':')

    return `${t1} ${t2}`
}
function formatDate(date: any, mark: string = '-'): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const t1 = [year, month, day].map(formatNumber).join(mark)

    return `${t1}`
}

function isTel(tel: string): boolean {
    var reg = /^1[2|3|4|5|6|7|8|9]\d{9}$/;
    if (reg.test(tel)) {
        return true;
    } else {
        return false;
    }
}
//深拷贝
function deepClone(obj: any) {
    let _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
    return objClone
}


function findIndex(ary: any[], fn: any) {
    if (ary.findIndex) {
        return ary.findIndex(fn)
    }
    let index = -1
    ary.some(function (item, i, ary) {
        const ret = fn(item, i, ary)
        if (ret) {
            index = i
            return ret
        }
    })
    return index
}
// 将url后的参数组合成对象并返回
function urlParams(url?: string) {
    url = url ? url : window.location.href.split("#")[0];
    let queryStringUrl = url.slice(url.indexOf("?") + 1);
    var urlParamsObj = qs.parse(queryStringUrl, { ignoreQueryPrefix: true });
    return urlParamsObj
}

function orderPay(sn: string, payment_model: number): Promise<any> {
    Taro.showLoading({
        title: '加载中',
        mask: true
    })
    let data = { sn, payment_model }
    return new Promise((resolve, reject) => {
        OrderApi.orderPay(data).then(res => {
            Taro.requestPayment({
                ...res,
                success() {
                    Taro.hideLoading()
                    Taro.redirectTo({ url: '/pages/orderMy/index' })
                    Taro.showToast({ title: '支付成功' })
                    resolve()
                },
                fail() {
                    Taro.hideLoading()
                    Taro.showToast({ title: '支付失败', icon: 'none' })
                    reject()
                }
            })
        })
    })

}
function formatDuration(time: string): number {
    let arr: any[] = time.split(':')
    let duration: number = parseInt(arr[0]) * 60 + parseInt(arr[1])
    return duration
}


export default {
    formatNumber,
    formatTime,
    formatDate,
    isTel,
    deepClone,
    findIndex,
    urlParams,
    orderPay,
    formatDuration,

}

