import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import OrderItem from '../../base/orderItem'
import './index.scss'
type stateType = {
  paySort: Number
}
export default class Orders extends Component<{}, stateType> {
  config: Config = {
    navigationBarTitleText: '我的订单'
  }
  constructor(props) {
    super(props)
    this.state = {
      paySort: 1
    }
  }
  componentWillMount() { }
  switchType(paySort) {
    this.setState({ paySort })
  }
  render() {
    let { paySort } = { ...this.state }
    return (
      <View className='my_order'>
        <View className='order_sort'>
          <View className='flex-center flex-lr pay_tit'>
            <Text className={paySort == 1 ? 'on' : ''} onClick={this.switchType.bind(this, 1)}>全部</Text>
            <Text className={paySort == 2 ? 'on' : ''} onClick={this.switchType.bind(this, 2)}>待支付</Text>
            <Text className={paySort == 3 ? 'on' : ''} onClick={this.switchType.bind(this, 3)}>已完成</Text>
          </View>
          <View className={`bg_title sort_${paySort}`}></View>
        </View>
        <ScrollView className='order_list' scroll-y="true">
          <OrderItem />
          <OrderItem />
          <OrderItem />
          <OrderItem />
          <OrderItem />
        </ScrollView>
      </View>
    )
  }
}
