import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import mine1 from '../../assets/img/mine1.png'
import mine2 from '../../assets/img/mine2.png'
import mine3 from '../../assets/img/mine3.png'
import mine4 from '../../assets/img/mine4.png'
import mine5 from '../../assets/img/mine5.png'
import mine6 from '../../assets/img/mine6.png'
import Bg from '../../assets/img/bg-mine.png'
import NavItem from '../../base/navItem/index'
import JTabBar from '../../base/TabBar'
import UserApi from '../../apis/user'
import { connect } from '@tarojs/redux'
import { SetTab } from '../../store/actions'

type PropsType = {
  countCar: number,
  setTab: (num: number) => any

}
interface IPerson {
  balance: string | number
  coupon_number: string | number,
  history_total_integral: string | number,
  current_integral: string | number
}
type StateType = {
  personInfo: IPerson
}
@connect(({ reducer }) => ({
  countCar: reducer.countCar
}), (dispatch) => ({
  setTab(num: number) {
    dispatch(SetTab(num))
  }
}))
export default class Mine extends Component<PropsType, StateType> {
  config: Config = {
    navigationBarTitleText: '个人中心'
  }
  state = {
    personInfo: {
      balance: '--',
      coupon_number: '--',
      history_total_integral: '--',
      current_integral: '--'
    }
  }
  componentDidShow() {
    this.props.setTab(3)
  }
  componentWillMount() {
    this.getPersonInfo()
  }
  getPersonInfo = () => {
    UserApi.getPersonalConfig().then(data => {
      this.setState({ personInfo: data })
    })
  }
  navTo(url: any) {
    Taro.navigateTo({ url })
  }
  render() {
    let { personInfo } = this.state
    return (
      <View className='person_wrap'>
        <View className='user'>
          <Image className='user_bg' src={Bg}></Image>
          <View className='user_info flex-center'><Image src={mine6}></Image>
            <Text className='f-34 color-fff mar-l-30'>随心所欲</Text></View>
        </View>
        <View className='account'>
          <View className='account_item' onClick={this.navTo.bind(this, '/pages/balance/index')}>
            <Text className='f-34 color-theme'>{personInfo.balance}<Text className='f-22 mar-l-4'></Text></Text>
            <Text className='f-26 color-6'>账户余额</Text>
            <View className='line'></View>
          </View>
          <View className='account_item' onClick={this.navTo.bind(this, '/pages/couponList/index')}>
            <Text className='f-34 color-theme'>{personInfo.coupon_number}<Text className='f-22 mar-l-4'>张</Text></Text>
            <Text className='f-26 color-6'>优惠券</Text>
            <View className='line'></View>
          </View>
          <View className='account_item' onClick={this.navTo.bind(this, '/pages/integralList/index')}>
            <Text className='f-34 color-theme'>{personInfo.history_total_integral}<Text className='f-22 mar-l-4'></Text></Text>
            <Text className='f-26 color-6'>历史积分</Text>
            <View className='line'></View>
          </View>
          <View className='account_item' onClick={this.navTo.bind(this, '/pages/integral/index')}>
            <Text className='f-34 color-theme'>{personInfo.current_integral}<Text className='f-22 mar-l-4'></Text></Text>
            <Text className='f-26 color-6'>可用积分</Text>
          </View>
        </View>
        <View className='nav_wrap'>
          <NavItem icon={mine1} title='我的订单' url='/pages/orderMy/index' />
          <NavItem icon={mine2} title='收货地址' url='/pages/address/index' />
          <NavItem icon={mine3} title='充值送礼' url='/pages/balance/index' />
          <NavItem icon={mine4} title='邀请得现金' url='/pages/balance/index' />
          <NavItem icon={mine5} title='关于每味十足' url='/pages/balance/index' />
          <NavItem icon={mine6} title='联系我们' url='/pages/balance/index' />
        </View>
        <JTabBar />
      </View>
    )
  }
}
