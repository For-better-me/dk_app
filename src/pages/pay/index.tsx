import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image,Button } from '@tarojs/components'
import './index.scss'
import IconBalance from '../../assets/img/icon-balance.png'
import IconWx from '../../assets/img/icon-wx.png'
import BgPay from '../../assets/img/bg-pay.png'
import CheckboxJ from '../../base/checkBox/index'
import utils from '../../utils/index'
export default class Pay extends Component {
  config: Config = {
    navigationBarTitleText: '支付订单'
  }
  componentDidMount() { 

  }
  state = {
    payment_model : 1
  }
  pay = ()=>{
    let sn = this.$router.params.sn
    utils.orderPay(sn,this.state.payment_model)
  }
  onShareAppMessage() {
    return {
      title: "每味十足",
      path: '/pages/index/index',  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
      imageUrl: '' // 图片路径
    };
  }
  render() {
    return (
      <View className='pay_page'>
        <View className='pay_time'>
          <Image src={BgPay} className='bg-img'></Image>
          <Text className='f-30 color-fff'>请尽快支付</Text>
          {/* <Text className='f-30 color-fff'>支付剩余时间</Text> */}
          {/* <View className='down_time '>
            <Text>1</Text>
            <Text>2</Text>
            <Text>:</Text>
            <Text>2</Text>
            <Text>2</Text>
          </View> */}
        </View>
        <View className='mar-t-20'>
          {/* <View className='border_bottom pad_lr_20 flex-lr pay_sort '>
            <View className='flex-center'>
              <Image src={IconBalance} className='ye' ></Image>
              <View className='mar-l-30'>
                <Text className='f-28 color-3'>余额支付</Text>
                <Text className='f-22 color-red mar-t-10'>余额：¥200.00</Text>
              </View>
            </View>
            <CheckboxJ value={true} />
          </View> */}
          <View className='pad_lr_20 flex-lr pay_sort'>
            <View className='flex-center'>
              <Image src={IconWx} className='wx'></Image>
              <Text className='f-28 color-3 mar-l-30'>微信支付</Text>
            </View>
            <CheckboxJ value={true} />
          </View>
        </View>
        <View className='btn_wrap'>
        <Button onClick={this.pay}><Text className='f-26 color-fff'>确认支付</Text><Text className='f-34 color-fff'>￥{this.$router.params.price}</Text></Button>
        </View>
      </View>
    )
  }
}
