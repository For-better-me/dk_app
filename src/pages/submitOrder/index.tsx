import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Textarea, Image,Button } from '@tarojs/components'
import './index.scss'
import IconAddr from '../../assets/img/icon-addr.png'
import { AtIcon, AtFloatLayout } from 'taro-ui'
import Coupon from '../../base/Coupon/index'
import Distribution from './distribution'
type State = {
  isShowFloat: Boolean
}
export default class SubmitOrder extends Component<{}, State> {
  config: Config = {
    navigationBarTitleText: '确认订单'
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
      <View className='submit_order'>
        <View className='addr flex-center bg'>
          <Image src={IconAddr}></Image>
          <View className='addr_info'>
            <Text className='f-28 color-6'>请选择地址</Text>
            {/* <View>
              <Text className='f-28 color-3'>张文杰</Text>
              <Text className='f-28 color-3 mar-l-10'>19333099443</Text>
            </View>
            <View>
              <Text className='f-28 color-3 ellipsis_2'>没雨花台31楼2320</Text>
            </View> */}

          </View>
          <AtIcon value='chevron-right' size='20' color='#999'></AtIcon>

        </View>
        <View className='goods_list bg'>
          <View className='goods_info flex-lr'>
            <View className='flex-center'>
              <Image src={IconAddr} className='goods_img'></Image>
              <View className='item_goods'>
                <Text className='f-26 color-3'>西红柿500g</Text>
                <Text className='f-26 color-3 mar-t-30'>￥3.00</Text>
              </View>
            </View>
            <Text className='goods_count f-30 color-3'>x2</Text>
          </View>
          <View className='goods_info flex-lr'>
            <View className='flex-center'>
              <Image src={IconAddr} className='goods_img'></Image>
              <View className='item_goods'>
                <Text className='f-26 color-3'>西红柿500g</Text>
                <Text className='f-26 color-3 mar-t-30'>￥3.00</Text>
              </View>
            </View>
            <Text className='goods_count f-30 color-3'>x2</Text>
          </View>
          <View className='f-28 color-3 align-r'><Text>共 7 件</Text><Text className='mar-l-20'>金额：</Text><Text className='color-red'>￥23</Text></View>


        </View>
        <View className='bg'>
          <View className='flex-lr pad_tb_30'>
            <Text className='f-26 color-3'>优惠券</Text>
            <View className='flex-center'>
              <Text className='f-26 color-3'>有优惠券</Text>
              <AtIcon value='chevron-right' size='16' color='#999' className='mar-l-10'></AtIcon>
            </View>
          </View>
          <View className='flex-lr pad_tb_30' onClick={this.openPoints}>
            <Text className='f-26 color-3'>积分抵扣</Text>
            <View className='flex-center'>
              <Text className='f-26 color-3'>有优惠券</Text>
              <AtIcon value='chevron-right' size='16' color='#999' className='mar-l-10'></AtIcon>
            </View>
          </View>
          <View className='flex-lr pad_tb_30'>
            <Text className='f-26 color-3'>配送方式</Text>
            <View className='flex-center'>
              <Text className='f-26 color-6'>请选择配送方式</Text>
              <AtIcon value='chevron-right' size='16' color='#999' className='mar-l-10'></AtIcon>
            </View>
          </View>
        </View>
        <View className='bg remark flex-lr'>
          <Text className='f-26 color-3'>备注</Text>
          <Textarea value='' placeholder='给卖家留言'></Textarea>
        </View>
        {
          this.state.isShowFloat || true ? <AtFloatLayout isOpened title="优惠券" >
            {/* <Coupon coupon={{ img: IconAddr }} /> */}
            <Distribution/>
          </AtFloatLayout> : null
        }
        <View className='block-fixed-b pad_lr_30 flex-lr flex-center'>
          <View className='flex-center'>
            <Text className='f-28 color-3'>实际支付：</Text>
            <Text className='f-30 color-red'>¥18.00</Text>
            <Text className='f-24 color-9'>（免运费）</Text>
          </View>
          <Button className='btn-style'>去支付</Button>
        </View>
      </View>

    )
  }
}
