import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Textarea, Image, Button } from '@tarojs/components'
import './index.scss'
import BgOrder from '../../assets/img/bg-status.png'
import ICon1 from '../../assets/img/icon-status1.png'
import ICon2 from '../../assets/img/icon-status2.png'
import ICon3 from '../../assets/img/icon-status3.png'
import IConLink from '../../assets/img/icon-contact.png'
import OrderApi from '../../apis/order'

type State = {
  isShowFloat: Boolean,
  detail: any
}
export default class OrderDetail extends Component<{}, State> {
  config: Config = {
    navigationBarTitleText: '订单详情'
  }
  constructor(props) {
    super(props)
    this.state = {
      isShowFloat: false,
      detail: {}
    }
  }
  openPoints = () => {
    this.setState({ isShowFloat: true })
  }
  init() {
    let data = {
      order_id: this.$router.params.id
    }
    OrderApi.orderInfo(data).then(detail => {
      this.setState({ detail })
    })
  }
  componentDidMount() {
    this.init()
  }
  orderCancel(order_id) {
    let self = this
    Taro.showModal({
      title: '温馨提示',
      content: '确定要取消该订单吗？',
      success: function (res) {
        if (res.confirm) {
          OrderApi.orderCancel({ order_id }).then(res => {
            Taro.showToast({ title: '取消成功' })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
  orderDel(order_id) {
    let self = this
    Taro.showModal({
      title: '温馨提示',
      content: '确定要删除该订单吗？',
      success: function (res) {
        if (res.confirm) {
          OrderApi.orderDel({ order_id }).then(res => {
            Taro.showToast({ title: '删除成功' })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
  orderPay(sn,price) {
    Taro.navigateTo({
      url: '/pages/pay/index?sn=' + sn + '&&price=' + price

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
    let detail: any = this.state.detail
    let price = (detail.avoid_price *1000 + detail.integral_deduct_price*1000)/1000
    return (
      <View className='order_detail'>
        <View className='order_status'>
          <Image src={BgOrder} className='bg-img'></Image>
          {
            detail.status == 10 ?
              <View className='status_tip'>
                <Image src={ICon1} mode='aspectFit'></Image>
                <View>
                  <Text className='f-42 color-fff '>待支付</Text>
                  <Text className='f-26 color-fff mar-t-20'>请尽快支付</Text>
                </View>
              </View>
              : null
          }
          {
            detail.status == 20 ?
              <View className='status_tip'>
                <Image src={ICon1} mode='aspectFit'></Image>
                <View>
                  <Text className='f-42 color-fff '>已支付</Text>
                  <Text className='f-26 color-fff mar-t-20'>正在配货，马上配送</Text>
                </View>
              </View>
              : null
          }
          {
            detail.status == 40 ?
              <View className='status_tip'>
                <Image src={ICon2} mode='aspectFit'></Image>
                <View>
                  <Text className='f-42 color-fff '>正在拣货配送中</Text>
                  <Text className='f-26 color-fff mar-t-20'>请您耐心等待</Text>
                </View>
              </View>
              : null
          }
          {
            detail.status == 50 || detail.status == 60 ?
              <View className='status_tip'>
                <Image src={ICon3} mode='aspectFit'></Image>
                <View>
                  <Text className='f-42 color-fff '>已签收</Text>
                  <Text className='f-26 color-fff mar-t-20'>您的订单已完成，欢迎下次光临！</Text>
                </View>
              </View>
              : null
          }

        </View>
        <View className='goods_list bg'>
          <Text className='title'>商品信息</Text>
          {
            detail.goods_list.map(goods => {
              return (
                <View className='goods_info flex-lr' key={goods.order_goods_id}>
                  <View className='flex-center'>
                    <Image src={goods.goods_img} className='goods_img'></Image>
                    <View className='item_goods'>
                      <Text className='f-26 color-3'>{goods.goods_title}</Text>
                      <View className='mar-t-30 flex-center'>
                        <Text className='f-26 color-3'>￥{goods.price} </Text>
                        {/* <Text className='f-26 color-9 mar-l-10 line'>￥-- </Text> */}
                      </View>
                    </View>
                  </View>
                  <Text className='goods_count f-30 color-3'>x{goods.number}</Text>
                </View>
              )
            })
          }
          <View className='zj_wrap'>
            <View className='flex-lr f-28 color-3 pad_tb_10'>
              <Text>商品总价</Text><Text>￥{detail.total_price}</Text>
            </View>
            <View className='flex-lr f-22 color-3 pad_tb_10'>
              <Text>配送费</Text><Text>¥{detail.freight}</Text>
            </View>
          </View>
          <View className='price_wrap align-r'>
            <Text className='f-22 color-3'>已优惠</Text><Text className='f-22 color-red'>￥{price||0}</Text>
            <Text className='f-22 color-3 mar-l-20'>实付款</Text><Text className='f-34 color-red'>￥{detail.payment_price}</Text>
          </View>
        </View>
        <View className='bg'>
          <Text className='title'>订单信息</Text>
          <View className='pad-10'>
            <View className='flex-lr f-28 pad_tb_10'>
              <Text className='color-9'>订单编号</Text><Text className='color-3'>{detail.sn}</Text>
            </View>
            <View className='flex-lr f-28 pad_tb_10'>
              <Text className='color-9'>创建时间</Text><Text className='color-3'>{detail.create_time}</Text>
            </View>
            <View className='flex-lr f-28 pad_tb_10'>
              <Text className='color-9'>配送方式</Text><Text className='color-3'>{detail.delivery_type == 1 ? '自提' : detail.delivery_type == 2 ? `普通配送 (${detail.delivery_time})` : '加急配送'}</Text>
            </View>
            {
              detail.delivery_type != 1 ?
                <View className='flex-lr f-28 pad_tb_10'>
                  <Text className='color-9'>配送地址</Text><Text className='color-3'>{detail.collect_address_info.address_detail}<br />{detail.collect_address_info.name}{detail.collect_address_info.phone}</Text>
                </View> : null
            }
            {/* {
              detail.delivery_type != 1 ?
                <View className='flex-lr f-28 pad_tb_10'>
                  <Text className='color-9'>配送时间</Text><Text className='color-3'>{detail.send_time}</Text>
                </View> : null
            } */}
            <View className='flex-lr f-28 pad_tb_10'>
              <Text className='color-9'>优惠券</Text><Text className='color-red'>-￥{detail.avoid_price}</Text>
            </View>
            <View className='flex-lr f-28 pad_tb_10'>
              <Text className='color-9'>积分抵扣</Text><Text className='color-red'>-￥{detail.integral_deduct_price}</Text>
            </View>

          </View>
          <Button className='btn_link' open-type='contact'>
            <Image src={IConLink} className='icon_link'></Image>
            <Text className='f-22 color-3 mar-l-10'>联系店家</Text>
          </Button>
        </View>
        {
          detail.status == 30 || detail.status == 50 || detail.status == 60 ?
            <View className='block-fixed-b'>
              <View className='align-r pad-20 '>
                <Button className='btn_mini_hollow' onClick={this.orderDel.bind(this, detail.id)}>删除订单</Button>
              </View>
            </View>
            : null
        }
        {
          detail.status == 10 ?
            <View className='block-fixed-b'>
              <View className='align-r pad-20 '>
                <Button className='btn_mini_hollow' onClick={this.orderCancel.bind(this, detail.id)}>取消订单</Button>

              </View>
            </View>
            : null
        }
        {
          detail.status == 10 ?
            <View className='block-fixed-b'>
              <View className='align-r pad-20 '>
                <Button className='btn_mini mar-l-20' onClick={this.orderPay.bind(this, detail.sn,detail.payment_price)}>去支付</Button>

              </View>
            </View> : null
        }

      </View>


    )
  }
}
