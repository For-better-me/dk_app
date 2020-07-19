import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Textarea, Image, Button } from '@tarojs/components'
import './index.scss'
import BgOrder from '../../assets/img/bg-status.png'
import ICon1 from '../../assets/img/icon-status1.png'
import ICon2 from '../../assets/img/icon-status2.png'
import ICon3 from '../../assets/img/icon-status3.png'
import IConLink from '../../assets/img/icon-contact.png'
type State = {
  isShowFloat: Boolean
}
export default class OrderDetail extends Component<{}, State> {
  config: Config = {
    navigationBarTitleText: '订单详情'
  }
  constructor(props) {
    super(props)
    this.state = {
      isShowFloat: false
    }
  }
  openPoints = () => {
    this.setState({ isShowFloat: true })
  }


  componentWillMount() { }

  render() {
    return (
      <View className='order_detail'>
        <View className='order_status'>
          <Image src={BgOrder} className='bg-img'></Image>
          <View className='status_tip'>
            <Image src={ICon2} mode='aspectFit'></Image>
            <View>
              <Text className='f-42 color-fff '>请尽快支付</Text>
              <Text className='f-26 color-fff mar-t-20'>剩19分59秒自动关闭</Text>
            </View>
          </View>
        </View>
        <View className='goods_list bg'>
          <Text className='title'>商品信息</Text>
          <View className='goods_info flex-lr'>
            <View className='flex-center'>
              <Image src={BgOrder} className='goods_img'></Image>
              <View className='item_goods'>
                <Text className='f-26 color-3'>西红柿500g</Text>
                <View className='mar-t-30 flex-center'>
                  <Text className='f-26 color-3'>￥3.00 </Text>
                  <Text className='f-26 color-9 mar-l-10 line'>￥5.00 </Text>
                </View>
              </View>
            </View>
            <Text className='goods_count f-30 color-3'>x2</Text>
          </View>
          <View className='goods_info flex-lr'>
            <View className='flex-center'>
              <Image src={BgOrder} className='goods_img'></Image>
              <View className='item_goods'>
                <Text className='f-26 color-3'>西红柿500g</Text>
                <Text className='f-26 color-3 mar-t-30'>￥3.00</Text>
              </View>
            </View>
            <Text className='goods_count f-30 color-3'>x2</Text>
          </View>
          <View className='zj_wrap'>
            <View className='flex-lr f-28 color-3 pad_tb_10'>
              <Text>商品总价</Text><Text>￥23</Text>
            </View>
            <View className='flex-lr f-22 color-3 pad_tb_10'>
              <Text>配送费</Text><Text>¥0.00</Text>
            </View>
          </View>
          <View className='price_wrap align-r'>
            <Text className='f-22 color-3'>已优惠</Text><Text className='f-22 color-red'>￥23</Text>
            <Text className='f-22 color-3 mar-l-20'>实付款</Text><Text className='f-34 color-red'>￥33</Text>
          </View>
        </View>
        <View className='bg'>
          <Text className='title'>订单信息</Text>
          <View className='pad-10'>
            <View className='flex-lr f-28 pad_tb_10'>
              <Text className='color-9'>商品总价</Text><Text className='color-3'>￥23</Text>
            </View>
            <View className='flex-lr f-28 pad_tb_10'>
              <Text className='color-9'>商品总价</Text><Text className='color-3'>￥23</Text>
            </View>
            <View className='flex-lr f-28 pad_tb_10'>
              <Text className='color-9'>商品总价</Text><Text className='color-3'>￥23</Text>
            </View>
          </View>
          <Button className='btn_link' open-type='contact'>
            <Image src={IConLink} className='icon_link'></Image>
            <Text className='f-22 color-3 mar-l-10'>联系店家</Text>
          </Button>
        </View>

        <View className='block-fixed-b'>
          <View className='align-r pad-20 '>
            <Button className='btn_mini_hollow'>删除订单</Button>
            <Button className='btn_mini'>去支付</Button>
          </View>
        </View>
      </View>


    )
  }
}
