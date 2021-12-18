import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'
import './index.scss'
import carBg from '../../assets/img/bg-car.png'
import nodataImg from '../../assets/img/nodata-car.png'
import NoData from '../../base/nodata'
import JCheckbox from '../../base/checkBox/index'
import JTabBar from '../../base/TabBar'
import JInputNumber from '../../base/InputNumber'
import { AtIcon } from 'taro-ui'
import ShoppingCarApi from '../../apis/shoppingCar'
import { connect } from '@tarojs/redux'
import { SetCountCar, SetTab, SetGoodsBuying } from '../../store/actions'

type PropsType = {
  deliveryType: number,
  countCar: number,
  setCountCar: (num: number) => any,
  setTab: (num: number) => any
  setGoodsBuying: (list: any[]) => any

}
type StateType = {
  shoppingCarList: any[],
  isDel: boolean,
  totalPrice: number,
  totalPrice2: number,
  deliverStandard: string | number
}
@connect(({ reducer }) => ({
  countCar: reducer.countCar,
  deliveryType: reducer.deliveryType
}), (dispatch) => ({
  setCountCar(num: number) {
    dispatch(SetCountCar(num))
  },
  setTab(num: number) {
    dispatch(SetTab(num))
  },
  setGoodsBuying(list: any[]) {
    dispatch(SetGoodsBuying(list))
  }
}))
export default class ShoppingCar extends Component<PropsType, StateType> {
  config: Config = {
    navigationBarTitleText: '购物车'
  }
  constructor(props) {
    super(props)
  }

  state = {
    shoppingCarList: [],
    isDel: false,
    totalPrice: 0,
    totalPrice2: 0,
    deliverStandard: 0

  }
  componentDidMount() {
    Taro.hideTabBar()
  }

  componentDidShow() {
    this.getList()
    this.setState({ isDel: false })
  }
  //为什么不可以
  getListDiv = (data: any[]) => {

  }
  computePrice() {
    let list: any[] = this.state.shoppingCarList.filter(el => el.isCheck && el.stock >= el.goods_cart_number)
    let totalPrice = 0
    let totalPrice2 = 0
    list.forEach(el => {
      totalPrice += el.price * el.goods_cart_number * 100000
    })
    list.forEach(el => {
      if (el.is_special == 1) {
        totalPrice2 += el.price * el.goods_cart_number * 100000
      }
    })
    totalPrice = Number(totalPrice.toFixed(2)) / 100000
    totalPrice2 = Number(totalPrice2.toFixed(2)) / 100000
    this.setState({ totalPrice,totalPrice2 })
  }
  getList() {
    ShoppingCarApi.shoppingCarList().then(data => {
      let shoppingCarList = data.goods_list.map(el => {
        el.isCheck = !(el.status == 1 || el.status == 2 || el.status == 3)
        return el
      })
      this.props.setCountCar(data.goods_list.length)
      this.setState({
        shoppingCarList,
        deliverStandard: data.deliver_standard
      },this.computePrice)
    })
  }
  allCheckState() {
    let list = this.state.shoppingCarList
    let state = true
    for (let i = 0; i < list.length; i++) {
      if (list[i].isCheck == false) {
        state = false
        break;
      }
    }
    return state
  }
  changeTotal = () => {
    let state = this.allCheckState()
    let shoppingCarList = this.state.shoppingCarList.map(el => {
      if (!(el.status == 1 || el.status == 2 || el.status == 3)) {
        el.isCheck = !state
      }
      return el
    })
    this.computePrice()
    this.setState({
      shoppingCarList
    })
  }
  changeOne = (val, id) => {
    let shoppingCarList = this.state.shoppingCarList.map(el => {
      if (el.id == id) {
        el.isCheck = val
      }
      return el
    })
    this.computePrice()
    this.setState({
      shoppingCarList
    })
  }
  switchTo = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }
  changeNumber = (val: number, id: any, type: string) => {
    let self = this
    let data = {
      id,
      type: type == 'add' ? 1 : 2
    }
    let num = 0
    ShoppingCarApi.shoppingCountUpdate(data).then(res => {
      let shoppingCarList = self.state.shoppingCarList.map(el => {
        if (el.id == id) {
          el.goods_cart_number = val
        }
        num += el.goods_cart_number
        return el
      })
      this.computePrice()
      this.setState({
        shoppingCarList
      })
    })

  }
  del = () => {
    let delArr = this.state.shoppingCarList.filter(el => el.isCheck)
    let delNum = 0
    let self = this
    let ids = delArr.map(el => {
      return el.id
    })
    ShoppingCarApi.shoppingCarDel({ ids }).then(res => {
      let num = Math.round(self.props.countCar - ids.length)
      self.props.setCountCar(num)
      self.computePrice()
      self.setState({ shoppingCarList: this.state.shoppingCarList.filter(el => !el.isCheck) })
    })
  }
  manageEvent(isDel) {
    // if (this.state.shoppingCarList.length == 0) {
    //   return
    // }
    this.setState({ isDel })
  }
  delConfirm() {
    let self = this
    Taro.showModal({
      content: '确定将这些商品删除吗？',
      success: function (res) {
        if (res.confirm) {
          self.del()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
  settlement = () => {
    let buyArr = this.state.shoppingCarList.filter(el => el.isCheck && el.stock >= el.goods_cart_number)
    if (buyArr.length == 0) {
      Taro.showToast({
        title: '请至少选择一样商品',
        icon: 'none'
      })
      return
    }
    this.props.setGoodsBuying(buyArr)
    Taro.navigateTo({ url: '/pages/submitOrder/index' })
  }
  navTo(id, num) {
    // Taro.navigateTo({
    //   url: `/pages/goodsDetail/index?id=${id}&num=${num}`
    // })
  }
  onShareAppMessage() {
    return {
      title: "每味十足",
      path: '/pages/index/index',  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
      imageUrl: '' // 图片路径
    };
  }
  render() {
    let { totalPrice,totalPrice2, isDel, deliverStandard } = this.state
    let shoppingCarList: any[] = this.state.shoppingCarList
    let diffVal = (deliverStandard * 1000 - totalPrice2 * 1000) / 1000
    return (
      <View className='shopping_car'>
        <View className='car-top'>
          <Image src={carBg}></Image>
          <View className='flex-lr'>
            <Text className='f-30 color-fff'>共 {this.props.countCar} 件商品</Text>
            <Text className='f-30 color-fff' onClick={this.manageEvent.bind(this, !isDel)}>{isDel ? '完成' : '管理'}</Text>
          </View>
        </View>
        {
          shoppingCarList.length > 0 ?
            <ScrollView className='shopping_list' scroll-y="true">
              {shoppingCarList.map((el) => {
                let disabledFlag = el.status == 3 || el.status == 1 || el.stock < el.goods_cart_number
                return (
                  <View className='item_goods_wrap' key={el.id}>
                    <JCheckbox disabled={disabledFlag && !this.state.isDel} value={el.isCheck} extra={el.id} change={this.changeOne} />
                    <Image src={el.img} className='goods_img' onClick={this.navTo.bind(this, el.goods_id, el.goods_cart_number)}></Image>
                    <View className='item_goods' onClick={this.navTo.bind(this, el.goods_id, el.goods_cart_number)}>
                      <Text className='f-28 color-3'>{el.title}</Text>
                      <Text className='f-22 color-9 mar-t-10'>{el.is_freight == 2 ? '不参与免配送费活动' : el.status == '2' || el.stock < el.goods_cart_number ? '库存不足' : el.status == 3 ? '商品不在售卖时间' : '-'}</Text>
                      <Text className='f-30 color-red mar-t-30'>{el.status == 1 ? '商品已下架' : `￥${el.price}`}</Text>
                    </View>
                    <View className='input_number'><JInputNumber extra={el.id} value={el.goods_cart_number} changeNumber={this.changeNumber} isZero={false} /></View>

                  </View>
                )
              })}
              {
                diffVal > 0 && this.props.deliveryType == 2 ?
                  <View className='flex-lr  yf-tip'>
                    <View className='flex-lr'><AtIcon className='icon-tip' value='alert-circle' size='12' color='#FAB62C'></AtIcon><Text className='f-24 color-3'>还差{diffVal}元可配送(特价商品不参与配送标准金额)</Text></View>
                    <Text className='f-24 color-jb' onClick={this.switchTo}>去凑单 ></Text>
                  </View> : null
              }

            </ScrollView>
            : <NoData imgSrc={nodataImg} tip='购物车还没添加商品哦~'></NoData>
        }

        {shoppingCarList.length > 0 ?
          <View className='footer flex-lr'>
            <View className='flex-center'>
              <View><JCheckbox value={this.allCheckState()} change={this.changeTotal} /></View>
              <Text className='f-30 color-3 mar-l-10'>全选</Text>
            </View>
            {
              isDel ?
                <Button className='f-26 color-3 del' onClick={this.delConfirm}>删除</Button> :
                (<View className='flex-center'>
                  <Text className='f-30 color-3'>合计</Text>
                  <Text className='f-30 color-red'>￥{totalPrice}</Text>
                  {
                    diffVal > 0 && this.props.deliveryType == 2 ?
                      <Button className='f-30 color-fff js disabled' disabled>结算</Button> :
                      <Button className='f-30 color-fff js' onClick={this.settlement}>结算</Button>
                  }

                </View>)
            }

          </View> : null
        }
        <JTabBar index={1} />
      </View>
    )
  }
}
