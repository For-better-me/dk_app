import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtIcon, } from 'taro-ui'
import './index.scss'
import '../../base/navItem/index.scss'
import mine1 from '../../assets/img/mine1.png'
import mine2 from '../../assets/img/mine2.png'
import mine3 from '../../assets/img/mine3.png'
import mine4 from '../../assets/img/mine4.png'
import mine5 from '../../assets/img/mine5.png'
import mine6 from '../../assets/img/mine6.png'
import Bg from '../../assets/img/bg-mine.png'
import avatar from '../../assets/img/avatar.png'
import NavItem from '../../base/navItem/index'
import JTabBar from '../../base/TabBar'
import UserApi from '../../apis/user'
import CommonApi from '../../apis/common'
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
  current_integral: string | number,
}
type StateType = {
  personInfo: IPerson,
  userInfo: any
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
      current_integral: '--',
    },
    userInfo: {
      avatar: '',
      nickname: ''
    }
  }
  componentDidShow() {
    this.getPersonInfo()
  }
  getPersonInfo = () => {
    UserApi.getPersonalConfig().then(data => {
      this.setState({ personInfo: data, userInfo: data.user_info })
    })
  }
  getUserInfo(user) {
    let data = {
      avatar: user.detail.userInfo.avatarUrl,
      nickname: user.detail.userInfo.nickName
    }
    CommonApi.updateUserInfo(data).then(res => {
      this.setState({
        userInfo: data
      })
    })
  }

  navTo(url: any) {
    Taro.navigateTo({ url })
  }
  onShareAppMessage() {
    return {
      title: "每味十足",
      path: '/pages/index/index',  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
      imageUrl: '' // 图片路径
    };
  }
  render() {
    let personInfo = this.state.personInfo
    let user = this.state.userInfo
    return (
      <View className='person_wrap'>
        {
          user.avatar == '' ?
            <View className='user'>
              <Image className='user_bg' src={Bg}></Image>
              <View className='user_info flex-center'><Image src={avatar}></Image>
                <Button openType='getUserInfo' onGetUserInfo={this.getUserInfo} style={{ background: 'none' }}> <Text className='f-34 color-fff mar-l-30'>点击获取昵称</Text></Button>
              </View>
            </View> :
            <View className='user'>
              <Image className='user_bg' src={Bg}></Image>
              <View className='user_info flex-center'><Image src={user.avatar}></Image>
                <Text className='f-34 color-fff mar-l-30'>{user.nickname}</Text></View>
            </View>
        }

        <View className='account'>
          <View className='account_item' onClick={this.navTo.bind(this, '/pages/balance/index')}>
            <Text className='f-34 color-theme'>{personInfo.balance || '--'}<Text className='f-22 mar-l-4'></Text></Text>
            <Text className='f-26 color-6'>账户余额</Text>
            <View className='line'></View>
          </View>
          <View className='account_item' onClick={this.navTo.bind(this, '/pages/couponList/index')}>
            <Text className='f-34 color-theme'>{personInfo.coupon_number}<Text className='f-22 mar-l-4'>张</Text></Text>
            <Text className='f-26 color-6'>优惠券</Text>
            <View className='line'></View>
          </View>
          <View className='account_item' onClick={this.navTo.bind(this, '/pages/integralList/index')}>
            <Text className='f-34 color-theme'>{personInfo.history_total_integral || '--'}<Text className='f-22 mar-l-4'></Text></Text>
            <Text className='f-26 color-6'>历史积分</Text>
            <View className='line'></View>
          </View>
          <View className='account_item' onClick={this.navTo.bind(this, '/pages/integral/index')}>
            <Text className='f-34 color-theme'>{personInfo.current_integral || '--'}<Text className='f-22 mar-l-4'></Text></Text>
            <Text className='f-26 color-6'>可用积分</Text>
          </View>
        </View>
        <View className='nav_wrap'>
          <NavItem icon={mine1} title='我的订单' url='/pages/orderMy/index' />
          <NavItem icon={mine2} title='收货地址' url='/pages/address/index' />
          <NavItem icon={mine3} title='充值送礼' url='/pages/balance/index' />
          {/* <NavItem icon={mine4} title='邀请得现金' url='/pages/balance/index' /> */}
          <NavItem icon={mine6} title='关于每味十足' url='/pages/aboutUs/index' />
          {/* <NavItem icon={mine6} title='联系我们' url='/pages/aboutUs/index' /> */}
          <View className='nav_item'>
            <Button className='btn_link nav_row' open-type='contact'>
              <Image className='nav-icon' src={mine5}></Image>
              <Text className='f-30 color-3'>联系我们</Text>
            </Button>
            <AtIcon value='chevron-right' size='20' color='#999'></AtIcon>

          </View>
        </View>
        <JTabBar index={3}/>
      </View>
    )
  }
}
