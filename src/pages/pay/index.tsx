import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image,Button } from '@tarojs/components'
import './index.scss'
import IconBalance from '../../assets/img/icon-balance.png'
import IconWx from '../../assets/img/icon-wx.png'
import BgPay from '../../assets/img/bg-pay.png'
import CheckboxJ from '../../base/checkBox/index'
export default class Pay extends Component {
  config: Config = {
    navigationBarTitleText: '支付订单'
  }
  componentWillMount() { }

  render() {
    return (
      <View className='pay_page'>
        <View className='pay_time'>
          <Image src={BgPay} className='bg-img'></Image>
          <Text className='f-30 color-fff'>支付剩余时间</Text>
          <View className='down_time '>
            <Text>1</Text>
            <Text>2</Text>
            <Text>:</Text>
            <Text>2</Text>
            <Text>2</Text>
          </View>
        </View>
        <View className='mar-t-20'>
          <View className='border_bottom pad_lr_20 flex-lr pay_sort '>
            <View className='flex-center'>
              <Image src={IconBalance} className='ye' ></Image>
              <View className='mar-l-30'>
                <Text className='f-28 color-3'>余额支付</Text>
                <Text className='f-22 color-red mar-t-10'>余额：¥200.00</Text>
              </View>
            </View>
            <CheckboxJ value={true} />
          </View>
          <View className='pad_lr_20 flex-lr pay_sort'>
            <View className='flex-center'>
              <Image src={IconWx} className='wx'></Image>
              <Text className='f-28 color-3 mar-l-30'>微信支付</Text>
            </View>
            <CheckboxJ value={true} />
          </View>
        </View>
        <View className='btn_wrap'>
          <Button><Text className='f-26 color-fff'>确认支付</Text><Text className='f-34 color-fff'>￥130.0</Text></Button>
        </View>
      </View>
    )
  }
}
