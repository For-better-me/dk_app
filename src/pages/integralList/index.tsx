import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import './index.scss'
import UserApi from '../../apis/user'
import NoData from '../../base/nodata'

type StateType = {
  list: any[],
  integralDesc: string
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
      let arr = ['积分抵现金', '购买商品',]
      let list = data.integral_list.map((el, index) => {
        el.desc = arr[el.type - 1]
        return el
      })
      list = this.state.list.concat(list)
      this.setState({ list, integralDesc: data.integral_desc })
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
  onShareAppMessage() {
    return {
      title: "每味十足",
      path: '/pages/index/index',  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
      imageUrl: '' // 图片路径
    };
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
                <View className={el.type == 2 ? 'f-30 color-red' : 'f-30 color-3'}>{el.type == 2 ? '+' : '-'}{el.integral}</View>
              </View>
            )
          })
        }
        {
          list.length == 0 ? <NoData tip='暂无积分记录' /> : null
        }

      </View>
    )
  }
}
