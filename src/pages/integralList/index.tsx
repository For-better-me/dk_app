import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import './index.scss'
import UserApi from '../../apis/user'
type StateType = {
  list: any[],
  integralDesc:string
}

export default class IntegralList extends Component<{}, StateType> {
  config: Config = {
    navigationBarTitleText: '历史积分'
  }
  limit: number = 10
  page: number = 1
  total: number = 0
  state = {
    list: [],
    integralDesc: ''
  }
  componentWillMount() {
    this.init()
  }
  init() {
    let data = { limit: this.limit, page: this.page }
    UserApi.IntegralLog(data).then(data => {
      // 积分获得类型：1每日签到，2治疗签到，3购买商品，4商品退款，5积分兑换， 6抽奖扣除，7订单取消, 8分享获取
      let arr = ['每日签到', '治疗签到', '购买商品', '商品退款', '积分兑换', '抽奖扣除', '订单取消', '分享获取',]
      let list = data.integral_list.map((el, index) => {
        el.desc = arr[index + 1]
        return el
      })
      list = this.state.list.concat(list)
      this.setState({ list,integralDesc:data.integral_desc })
    })
  }
  onReachBottom() {
    if ((this.page++) > this.total) {
      Taro.showToast({
        title: '没有更多了',
        icon: 'none'
      })
      return
    }
    this.init()
  }
  render() {
    let { integralDesc, list } = this.state
    return (
      <View className='integral'>
        <View className='color-6 pad-30'>{integralDesc}</View>
        {
          list.map(el => {
            return (
              <View className='integral_item' key={el.id}>
                <View>
                  <Text className='f-30 color-3'>{el.desc}</Text>
                  <Text className='f-24 color-9 mar-t-20'>时间：{el.create_time}</Text>
                </View>
                <View className='f-30 color-3'>-{el.integral}</View>
              </View>
            )
          })
        }

      </View>
    )
  }
}
