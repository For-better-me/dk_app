import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import './index.scss'
import UserApi from '../../apis/user'
type StateType = {
  list: any[]
}

export default class BalanceList extends Component<{}, StateType> {
  config: Config = {
    navigationBarTitleText: '余额明细'
  }
  limit: number = 10
  page: number = 1
  total: number = 0
  state = {
    list: []
  }
  componentWillMount() {
    this.init()
  }
  init() {
    let data = { limit: this.limit, page: this.page }
    UserApi.rechargeLog(data).then(data => {
      // 1充值，2商品购买，3商品退款，4项目购买，5项目退款
      let list = data.map(el => {
        switch (el.type) {
          case 1:
            el.typeDesc = '充值'
            break;
          case 2:
            el.typeDesc = '商品购买'
            break;
          case 3:
            el.typeDesc = '商品退款'
            break;
          case 4:
            el.typeDesc = '项目购买'
            break;
          case 5:
            el.typeDesc = '项目退款'
            break;
          default:
            el.typeDesc = '--'
            break;
        }
        return el
      })
      list = this.state.list.concat(list)
      this.setState({ list })
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
    let list: any[] = this.state.list
    return (
      <View className='balance_list'>
        {list.map(el => {
          return (
            <View className='balance_item' key={el.id}>
              <Text className='f-28 color-9'>订单编号： {el.sn}</Text>
              <View className='flex-lr'>
                <Text className='f-30 color-3'>{el.typeDesc}</Text>
                <Text className={el.type == 2 || el.type == 4 ? 'f-30 color-3' : 'f-30 color-red'}>{el.type == 2 || el.type == 4 ? '-' : '+'}{el.price}</Text>
              </View>
              <Text className='f-24 color-9'>时间： {el.create_time}</Text>
            </View>
          )
        })}
      </View>
    )
  }
}
