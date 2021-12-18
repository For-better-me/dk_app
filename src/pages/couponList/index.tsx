import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import './index.scss'
import UserApi from '../../apis/user'
import Coupon from '../../base/Coupon'
import NoData from '../../base/nodata'
type StateType = {
  list: any[]
}

export default class CouponList extends Component<{}, StateType> {
  config: Config = {
    navigationBarTitleText: '优惠券'
  }
  state = {
    list: []
  }
  componentWillMount() {
    this.init()
  }
  init() {
    UserApi.CouponLog().then(data => {
      this.setState({ list: data })
    })
  }
  onShareAppMessage() {
    return {
      title: "每味十足",
      path: '/pages/index/index',  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
      imageUrl: '' // 图片路径
    };
  }
  render() {
    let list: any[] = this.state.list
    let len = list.filter(el => el.expire_status == 2).length
    return (
      <View className='balance_list'>
        {
          len > 0 ? <View className='f-28 color-6 list_pad'>您有<Text className='color-red'>{len}</Text>个红包即将过期</View> : null
        }
        <View className='list_pad'>
          {list.map(el => {
            return (
              <Coupon coupon={el} key={el.id} />
            )
          })}
        </View>
        {
          list.length == 0 ? <NoData tip='暂无优惠券' /> : null
        }
      </View>
    )
  }
}
