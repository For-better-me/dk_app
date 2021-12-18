import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import OrderItem from '../../base/orderItem'
import OrderApi from '../../apis/order'
import NoData from '../../base/nodata'
import './index.scss'
type stateType = {
  paySort: Number,
  orderList: any[]
}
export default class Orders extends Component<{}, stateType> {
  config: Config = {
    navigationBarTitleText: '我的订单'
  }
  constructor(props) {
    super(props)
    this.state = {
      paySort: 1,
      orderList: []
    }
  }
  postData = {
    limit: 10,
    page: 1
  }
  total: number = 0
  componentWillMount() {
    this.init()
  }
  switchType(paySort) {
    this.postData.page = 1
    this.setState({ paySort, orderList: [] }, () => {
      this.init()
    })

  }
  init() {
    let data = {
      type: this.state.paySort,
      ...this.postData
    }
    OrderApi.orderList(data).then(res => {
      let orderList = this.state.orderList.concat(res.list)
      this.total = res.total_page
      this.setState({ orderList })
    })
  }
  scrollToLower = () => {
    if ((this.postData.page++) > this.total) {
      Taro.showToast({
        title: '没有更多了',
        icon: 'none'
      })
      return
    }
    this.init()
  }
  orderListener = (id, type) => {
    let orderList: any[] = []
    if (type == 0) {//删除
      orderList = this.state.orderList.filter(el => el.id != id)
    } else {
      orderList = this.state.orderList.map(el => {
        if (id == el.id) {
          el.status = type
        }
        return el
      })
    }

    this.setState({ orderList })

  }
  onShareAppMessage() {
    return {
      title: "每味十足",
      path: '/pages/index/index',  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
      imageUrl: '' // 图片路径
    };
  }
  render() {
    let { paySort } = { ...this.state }
    let orderList: any[] = this.state.orderList
    return (
      <View className='my_order'>
        <View className='order_sort'>
          <View className='flex-center flex-lr pay_tit'>
            <Text className={paySort == 1 ? 'on' : ''} onClick={this.switchType.bind(this, 1)}>全部</Text>
            <Text className={paySort == 3 ? 'on' : ''} onClick={this.switchType.bind(this, 3)}>待支付</Text>
            <Text className={paySort == 4 ? 'on' : ''} onClick={this.switchType.bind(this, 4)}>配送中</Text>
          </View>
          <View className={`bg_title sort_${paySort}`}></View>
        </View>
        {orderList.length > 0 ?
          <ScrollView className='order_list' scroll-y="true" onScrollToLower={this.scrollToLower}>
            {
              orderList.map(order => {
                return (<OrderItem orderInfo={order} key={order.id} eventListener={this.orderListener} />)
              })
            }
          </ScrollView> : null
        }

        {orderList.length == 0 ? <NoData tip='暂无记录' /> : null}
      </View>
    )
  }
}
