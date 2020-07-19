import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'
import './index.scss'
import carBg from '../../assets/img/bg-car.png'
import nodataImg from '../../assets/img/nodata-car.png'
import NoData from '../../base/nodata/nodata'
import JCheckbox from '../../base/checkBox/index'
import JTabBar from '../../base/TabBar'
import JInputNumber from '../../base/InputNumber'
import { AtIcon } from 'taro-ui'
import ShoppingCarApi from '../../apis/shoppingCar'
import { connect } from '@tarojs/redux'
import { SetCountCar,SetTab } from '../../store/actions'

type PropsType = {
  countCar: number,
  setCountCar: (num: number) => any,
  setTab: (num: number) => any

}
type StateType = {
  shoppingCarList: any[],
  isDel: boolean,
  totalPrice: number
}
@connect(({ reducer }) => ({
  countCar: reducer.countCar
}), (dispatch) => ({
  setCountCar(num: number) {
    dispatch(SetCountCar(num))
  },
  setTab(num: number) {
    dispatch(SetTab(num))
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
    // expressNum:0

  }
  componentWillMount() {
    this.getList()
  }
  
  componentDidShow() { 
    this.props.setTab(1)
  }
  //为什么不可以
  getListDiv = (data: any[]) => {

  }
  computePrice(){
    let list:any[] = this.state.shoppingCarList.filter(el=>el.isCheck)
    let totalPrice = 0
    list.forEach(el=>{
      totalPrice+=el.price * el.goods_cart_number
    })
    totalPrice = Number(totalPrice.toFixed(2))
    this.setState({totalPrice})
  }
  getList() {
    ShoppingCarApi.shoppingCarList().then(data => {
      let shoppingCarList = data.goods_list.map(el => {
        el.isCheck = true
        return el
      })
      this.setState({
        shoppingCarList,
        totalPrice:data.total_price
      })
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
      el.isCheck = !state
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
    if(this.state.shoppingCarList.length == 0){
      return
    }
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
  render() {
    let { totalPrice, isDel } = this.state
    let shoppingCarList: any[] = this.state.shoppingCarList
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
                return (
                  <View className='item_goods_wrap' key={el.id}>
                    <JCheckbox disabled={el.status == 1} value={el.isCheck} extra={el.id} change={this.changeOne} />
                    <Image src={el.img} className='goods_img'></Image>
                    <View className='item_goods'>
                      <Text className='f-28 color-3'>{el.title}</Text>
                      <Text className='f-22 color-9 mar-t-10'>{el.is_freight == 2 ? '不参与免配送费活动' : el.status == '2' ? '库存不足' : '-'}</Text>
                      <Text className='f-30 color-red mar-t-30'>{el.status == 1 ? '商品已下架' : `￥${el.price}`}</Text>
                    </View>
                    <View className='input_number'><JInputNumber extra={el.id} value={el.goods_cart_number} changeNumber={this.changeNumber} /></View>

                  </View>
                )
              })}
              {/* <View className='flex-lr  yf-tip'>
                <View className='flex-lr'><AtIcon className='icon-tip' value='alert-circle' size='12' color='#FAB62C'></AtIcon><Text className='f-24 color-3'>还差3元免配送费</Text></View>
                <Text className='f-24 color-jb' onClick={this.switchTo}>去凑单 ></Text>
              </View> */}
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
                  <Button className='f-30 color-fff js'>结算</Button>
                </View>)
            }

          </View> : null
        }
        <JTabBar />
      </View>
    )
  }
}
