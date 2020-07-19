import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import './index.scss'
import UserApi from '../../apis/user'
import Coupon from '../../base/Coupon'
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
      this.setState({ list:data })
    })
  }
  render() {
    let list: any[] = this.state.list
    return (
      <View className='balance_list'>
        {list.map(el => {
          return (
          <Coupon coupon={el} key={el.id}/>
          )
        })}
      </View>
    )
  }
}
