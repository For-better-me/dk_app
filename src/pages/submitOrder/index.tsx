import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Textarea, Image, Button, CoverView, CoverImage } from '@tarojs/components'
import './index.scss'
import IconAddr from '../../assets/img/icon-addr.png'
import { AtIcon, AtFloatLayout } from 'taro-ui'
import Coupon from '../../base/Coupon/index'
import Distribution from './distribution'
import IntegralComp from './integral'
import { connect } from '@tarojs/redux'
import OrderApi from '../../apis/order'
import { SetGoodsBuying } from '../../store/actions'
import BgBtn from '../../assets/img/bg_btn.png'

type State = {
  isShowFloat: Boolean,
  address: any,
  couponList: any[],
  deliveryTime: string[],
  submitInfo: any,
  delivery_type: number,
  delivery_time: string,
  floatLayoutTitle: string,
  floatLayoutType: number,
  integralInfo: any,
  delivery: string,
  couponPrice: number,
  integralPrice: number,
  remark: string,
  integralNum: number,
  weather:string
}
type PropsType = {
  deliveryType: number,
  goodsBuyingList: any[],
  addrId: string,
  setGoodsBuying: (list: any[]) => any
}
@connect(({ reducer }) => ({
  deliveryType: reducer.deliveryType,
  goodsBuyingList: reducer.goodsBuyingList,
  addrId: reducer.addrId,
}), (dispatch) => ({
  setGoodsBuying(list: any[]) {
    dispatch(SetGoodsBuying(list))
  }
}))
export default class SubmitOrder extends Component<PropsType, State> {
  config: Config = {
    navigationBarTitleText: '确认订单'
  }
  constructor(props) {
    super(props)
    this.state = {
      isShowFloat: false,
      address: null,
      couponList: [],
      deliveryTime: [],
      submitInfo: {},
      delivery_type: 2,
      delivery_time: '',
      floatLayoutTitle: '',
      floatLayoutType: 1,
      integralInfo: {},
      delivery: '',
      couponPrice: 0,
      integralPrice: 0,
      remark: '',
      integralNum: 0,
      weather:''
    }
  }
  postData = {
    user_coupon_id: 0,
    delivery_type: 2,
    integral_number: 0,
    delivery_time: '17:00',
    collect_address_id: '0',
    avoid_price: 0,
    desc: ""
  }
  delivery_time_index = -1
  deliveryFast = -1
  openPoints = (floatLayoutType, floatLayoutTitle, enable) => {
    if (enable) {
      this.setState({ isShowFloat: true, floatLayoutType, floatLayoutTitle })

    }
  }
  componentDidShow() {
    this.getInfo()
  }
  getInfo = () => {
    let collect_address_id: string = '0'
    let goods_cart_id = this.props.goodsBuyingList.map(el => {
      return el.id
    })
    if (this.props.addrId == '') {
      let list: any[] = []
      let data = { limit: 999, page: 1 }
      OrderApi.addrList(data).then(res => {
        Taro.showLoading({
          title: '加载中',
          mask: true
        })
        setTimeout(function () {
          Taro.hideLoading()
        }, 4000)
        list = res.list
        let addrDefault = list.filter(el => el.is_default == 2).length > 0 ? list.filter(el => el.is_default == 2)[0] : list[0]
        if (list.length > 0) {
          collect_address_id = addrDefault.id
          this.postData.collect_address_id = collect_address_id
          let data = Object.assign({}, this.postData, { goods_cart_id })
          this.getSubmitInfo(data).then((res: any) => {
            if (this.props.deliveryType == 1) {
              this.setState({
                delivery: '到店自提'
              })
            }
          })
        } else {
          let data = Object.assign({}, this.postData, { goods_cart_id })
          this.getSubmitInfo(data).then((res: any) => {
            if (this.props.deliveryType == 1) {
              this.setState({
                delivery: '到店自提'
              })
            }
          })
        }
      })
    } else {
      collect_address_id = this.props.addrId
      this.postData.collect_address_id = collect_address_id
      let data = Object.assign({}, this.postData, { goods_cart_id })
      this.getSubmitInfo(data).then((res: any) => {
        if (this.props.deliveryType == 1) {
          this.setState({
            delivery: '到店自提'
          })
        }

      })
    }


  }
  getSubmitInfo(dataR?) {
    let goods_cart_id = this.props.goodsBuyingList.map(el => {
      return el.id
    })
    let delivery_type = this.props.deliveryType == 1 ? 1 : this.postData.delivery_type
    let dataDefault = Object.assign({}, this.postData, { goods_cart_id })
    let data = dataR || dataDefault
    data.delivery_type = delivery_type
    console.log('delivery_type', delivery_type, data);
    return new Promise((resolve, reject) => {
      OrderApi.getSubmitInfo(data).then(res => {
        let integralInfo = {
          current_integral: res.current_integral,
          max_current_integral: res.max_current_integral,
          integral_scale: res.integral_scale,
          integral_use_price: res.integral_use_price,
          integral_number: res.integral_number ? res.integral_number : 0
        }
        this.setState({
          address: res.collect_address_info,
          deliveryTime: res.delivery_time,
          couponList: res.available_list,
          submitInfo: res,
          integralInfo,
          weather:res.weather
        })
        resolve(res)
      }).catch(err => {
        reject(err)
      })

    })
  }
  newOrder = () => {
    if (!this.state.address && this.props.deliveryType != 1) {
      Taro.showToast({
        title: '请填写收货地址',
        icon: 'none'
      })
      return
    }
    if (!this.state.delivery) {
      Taro.showToast({
        title: '请选择配送方式',
        icon: 'none'
      })
      return
    }
    let invite_user_id = Taro.getStorageSync('invite_user_id')
    let goods_cart_id = this.props.goodsBuyingList.map(el => {
      return el.id
    })
    let delivery_type = this.props.deliveryType == 1 ? 1 : this.postData.delivery_type
    let data = Object.assign({}, this.postData, { delivery_type, goods_cart_id, invite_user_id })
    OrderApi.submitOrder(data).then(sn => {
      this.props.setGoodsBuying([])
      Taro.redirectTo({
        url: '/pages/pay/index?sn=' + sn + '&&price=' + this.state.submitInfo.payment_total_price
      })
    })

  }
  chooseAddr() {
    Taro.navigateTo({ url: '/pages/address/index?flag=1' })
  }
  deliveryTimeChange = (type, desc, level, delivery_time, delivery_time_index) => {
    if (level == 1) {
      this.setState({
        delivery_type: type,
      })
    } else if (level == 2) {
      this.postData.delivery_type = type
      this.postData.delivery_time = delivery_time ? delivery_time : 0
      this.delivery_time_index = type == 2 ? delivery_time_index : -1
      this.deliveryFast = type == 3 ? delivery_time_index : -1
      this.getSubmitInfo()
      this.setState({
        delivery: desc + ' ' + delivery_time,
        isShowFloat: false
      })
    }
  }
  integralChange = (num, integralPrice, integral) => {
    this.postData.integral_number = integral || 0
    this.getSubmitInfo()
    this.setState({ integralPrice, integralNum: num })
  }

  onCloseFloat = () => {
    this.setState({
      isShowFloat: false
    })
    if (this.state.floatLayoutType == 1) {

    } else if (this.state.floatLayoutType == 2) {

    } else if (this.state.floatLayoutType == 3) {
      // if (this.state.delivery == '') {
      //   let delivery = '普通配送' + ' ' + this.state.deliveryTime[0]
      //   this.setState({ delivery })
      // }
      this.getSubmitInfo()
    }
  }
  couponHandle = (id) => {
    this.postData.user_coupon_id = id
    this.getSubmitInfo().then((res: any) => {
      this.setState({
        isShowFloat: false,
        couponPrice: res.avoid_price
      })
    }).catch(err => {
      this.postData.user_coupon_id = 0
    })

  }
  changeRemark(e) {
    this.postData.desc = e.detail.value
  }
  onShareAppMessage() {
    return {
      title: "每味十足",
      path: '/pages/index/index',  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
      imageUrl: '' // 图片路径
    };
  }
  render() {
    let goodsBuyingList: any[] = this.props.goodsBuyingList
    let address: any = this.state.address
    let allInfo: any = this.state.submitInfo
    return (
      <View className='submit_order'>
        {
          this.props.deliveryType != 1 ?
            <View className='addr flex-center bg'>
              <Image src={IconAddr}></Image>
              <View className='addr_info' onClick={this.chooseAddr}>
                {
                  address ? (<View> <View>
                    <Text className='f-28 color-3'>{address.name}</Text>
                    <Text className='f-28 color-3 mar-l-10'>{address.phone}</Text>
                  </View>
                    <View>
                      <Text className='f-28 color-3 ellipsis_2'>{address.address} {address.address_detail}</Text>
                    </View></View>) : <Text className='f-28 color-6'>请选择地址</Text>
                }
              </View>
              <AtIcon value='chevron-right' size='20' color='#999'></AtIcon>

            </View> : null
        }

        <View className='goods_list bg'>
          {
            goodsBuyingList.map(goods => {
              return (
                <View className='goods_info flex-lr' key={goods.id}>
                  <View className='flex-center'>
                    <Image src={goods.img} className='goods_img'></Image>
                    <View className='item_goods'>
                      <Text className='f-26 color-3'>{goods.title}</Text>
                      <Text className='f-26 color-3 mar-t-30'>￥{goods.price}</Text>
                    </View>
                  </View>
                  <Text className='goods_count f-30 color-3'>x{goods.goods_cart_number}</Text>
                </View>
              )
            })
          }

          <View className='f-28 color-3 align-r'><Text>共 {goodsBuyingList.length} 件</Text><Text className='mar-l-20'>金额：</Text><Text className='color-red'>￥{allInfo.total_price}</Text></View>


        </View>
        <View className='bg'>
          <View className='flex-lr pad_tb_30' onClick={this.openPoints.bind(this, 1, '优惠券', Boolean(this.state.couponList.length))}>
            <Text className='f-26 color-3'>优惠券</Text>
            <View className='flex-center'>
              {
                this.state.couponPrice == 0 ?
                  (
                    <Text className={allInfo.max_current_integral == 0 ? 'f-26 color-9' : 'f-26 color-3'}>{this.state.couponList.length > 0 ? '有可用优惠券' : '暂无优惠券'}</Text>
                  ) :
                  <Text className='f-26 color-red'>-￥{this.state.couponPrice}</Text>
              }
              <AtIcon value='chevron-right' size='16' color='#999' className='mar-l-10'></AtIcon>
            </View>
          </View>
          <View className='flex-lr pad_tb_30' onClick={this.openPoints.bind(this, 2, '积分抵扣', Boolean(allInfo.max_current_integral && allInfo.max_current_integral > allInfo.integral_scale))}>
            <Text className='f-26 color-3'>积分抵扣</Text>
            <View className='flex-center'>
              {
                this.state.integralPrice == 0 ?
                  (
                    <Text className={allInfo.max_current_integral == 0 ? 'f-26 color-9' : 'f-26 color-3'}>{allInfo.max_current_integral > 0 && allInfo.max_current_integral > allInfo.integral_scale ? '有积分可以使用' : '暂无积分可以使用'}</Text>

                  ) :
                  <Text className='f-26 color-red'>-￥{this.state.integralPrice}</Text>
              }
              <AtIcon value='chevron-right' size='16' color='#999' className='mar-l-10'></AtIcon>
            </View>
          </View>
          <View className='flex-lr pad_tb_30' onClick={this.openPoints.bind(this, 3, '配送方式', this.props.deliveryType !== 1)}>
            <Text className='f-26 color-3'>配送方式</Text>
            <View className='flex-center'>
              <Text className={this.state.delivery == '' ? 'f-26 color-9' : 'f-26 color-3'}>{this.state.delivery == '' ? '请选择配送方式' : `${this.state.delivery}`}</Text>
              <AtIcon value='chevron-right' size='16' color='#999' className='mar-l-10'></AtIcon>
            </View>
          </View>
          {
            this.state.weather?
              <View className='flex-lr  yf-tip'>
                <View className='flex-lr'><AtIcon className='icon-tip' value='alert-circle' size='12' color='#FAB62C'></AtIcon><Text className='f-24'>{this.state.weather}</Text></View>
              </View> : null
          }
        </View>
        <View className='bg remark flex-lr' style={{ display: this.state.isShowFloat ? 'none' : 'flex' }}>
          <Text className='f-26 color-3'>备注</Text>
          <Textarea value='' placeholder='给卖家留言' onInput={this.changeRemark} ></Textarea>
        </View>
        {
          this.state.isShowFloat ? <AtFloatLayout isOpened title={this.state.floatLayoutTitle} onClose={this.onCloseFloat} >
            {
              this.state.floatLayoutType == 1 ?
                <View className='mar-t-20'>{
                  this.state.couponList.map(el => {
                    return (<Coupon coupon={el} choosedHandle={this.couponHandle} isChoose={true} />)
                  })} </View> : null
            }
            {
              this.state.floatLayoutType == 2 ?
                <IntegralComp integralNum={this.state.integralNum} integralInfo={this.state.integralInfo} change={this.integralChange} />
                : null
            }
            {
              this.state.floatLayoutType == 3 ?
                <Distribution deliveryFast={this.deliveryFast} deliveryType={this.state.delivery_type} deliveryTime={this.delivery_time_index} deliveryTimeList={this.state.deliveryTime} switch={this.deliveryTimeChange} />
                : null
            }
          </AtFloatLayout> : null
        }
        <CoverView className='block-fixed-b pad_lr_30 flex-lr flex-center' style={{ display: this.state.isShowFloat ? 'none' : 'flex' }}>
          <CoverView className='flex-center'>
            <CoverView className='f-28 color-3'>实际支付：</CoverView>
            <CoverView className='f-30 color-red'>¥{allInfo.payment_total_price}</CoverView>
            <CoverView className='f-24 color-9 mar-l-10'>{allInfo.freight > 0 ? `运费:￥${allInfo.freight}` : '（免运费）'}</CoverView>
          </CoverView>
          <CoverView className='btn-style' onClick={this.newOrder}>
            <CoverImage src={BgBtn} className='bg-img'></CoverImage>
            <CoverView className='btn-style text_btn'>去支付</CoverView>
          </CoverView>
        </CoverView>
      </View>

    )
  }
}
