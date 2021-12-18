import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, RichText, Button } from '@tarojs/components'
import './index.scss'
import JTabBar from '../../base/TabBar'
import { connect } from '@tarojs/redux'
import { SetTab } from '../../store/actions'
import UserApi from '../../apis/user'
import enjoyTit from '../../assets/img/enjoy/enjoy-tit.png'
import enjoyTit1 from '../../assets/img/enjoy/e-tit1.png'
import enjoyTit2 from '../../assets/img/enjoy/e-tit2.png'
import enjoyTit3 from '../../assets/img/enjoy/e-tit3.png'
import enjoyBg from '../../assets/img/enjoy/e-bg.png'
import enjoyLC from '../../assets/img/enjoy/enjoy_lc.png'
import enjoyBtn from '../../assets/img/enjoy/enjoy-btn.png'
type PropsType = {
  setTab: (num: number) => any
}
type StatesType = {

}
@connect(({ reducer }) => ({
}), (dispatch) => ({
  setTab(num: number) {
    dispatch(SetTab(num))
  }
}))
export default class Activity extends Component<PropsType, StatesType>  {
  config: Config = {
    navigationBarTitleText: '邀请得现金'
  }

  componentWillMount() {

  }
  componentDidShow() {
    this.getInfo()
  }
  state = {
    shareInfo: {
      invite_reward: []
    }
  }
  onShareTimeline() {
    return {
      title: "分享有礼",
      path: '/pages/index/index?invite_user_id=' + this.state.shareInfo.invite_user_id,  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
      imageUrl: '' // 图片路径
    };
  }
  getInfo() {
    UserApi.InviteInfo().then(data => {
      this.setState({ shareInfo: data })
    })
  }
  showEnjoy() {
    console.log('showShareItems');

    // Taro.showShareMenu({
    //   withShareTicket: true,
    //   showShareItems: ['shareAppMessage', 'shareTimeline']
    // })
  }
  onShareAppMessage() {
    return {
      title: "分享有礼",
      path: '/pages/index/index?invite_user_id=' + this.state.shareInfo.invite_user_id,  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
      imageUrl: '' // 图片路径
    };
  }
  render() {
    let shareInfo: any = this.state.shareInfo
    // let count: number = 14
    let count: number = shareInfo.invite_number
    let numArr = shareInfo.invite_reward.map(el => el.people_number)
    let [s, m, l] = numArr
    let type = 0
    let width = '0px'
    if (count >= s && count < m) {
      type = 1
    } else if (count >= m && count < l) {
      type = 2
    } else if (count >= l) {
      type = 3
    }
    // 30  104 104 3
    if (count > 0 && count < s) {
      width = 30 / s * count + 'px'
    } else if (count >= s && count < m) {
      width = 30 + (count - s) * (104 / (m - s)) + 'px'
    } else if (count >= m && count < l) {
      width = 134 + (count - m) * (104 / (l - m)) + 'px'
    } else if (count >= l) {
      width = '100%'
    }
    return (
      <View className='activity'>
        <Image src={enjoyTit} className='e_banner'></Image>
        <View className='enjoy_count e_block'>
          <Image src={enjoyTit1} className='e_tit'></Image>
          <View className='f-30 color-3 mar-t-30'>已邀请 <Text className='color-red'>{shareInfo.invite_number}</Text> 人，还差 <Text className='color-red'>{shareInfo.surplus}</Text> 人得 <Text className='color-red'>{shareInfo.price}</Text> 元优惠券</View>
          <View className='step_wrap'>
            <View className='bar'><View className='line' style={{ width: width }}></View></View>
            <View className='flex-lr'>
              {
                shareInfo.invite_reward.map(el => {
                  return (
                    <View className='step'>
                      <View className={type >= 1 ? 'circle on' : 'circle'}></View>
                      <View className='f-28'>邀请{el.people_number}人</View>
                      <View className='price'>
                        <Image src={enjoyBg} className='bg-img'></Image>
                        <Text>{el.coupon_title}X{el.coupon_number}</Text>
                      </View>
                    </View>
                  )
                })
              }

              {/* <View className='step'>
                <View className={type >= 2 ? 'circle on' : 'circle'}></View>
                <View className='f-28'>邀请5人</View>
                <View className='price'>
                  <Image src={enjoyBg} className='bg-img'></Image>
                  <Text>10元优惠券</Text>
                </View>
              </View>
              <View className='step'>
                <View className={type == 3 ? 'circle on' : 'circle'}></View>
                <View className='f-28'>邀请15人</View>
                <View className='price'>
                  <Image src={enjoyBg} className='bg-img'></Image>
                  <Text>30元优惠券</Text>
                </View>
              </View> */}
            </View>
          </View>
          <Button open-type='share' className='enjoy_btn' onClick={this.showEnjoy}>
            <Image src={enjoyBtn}></Image>
          </Button>
        </View>
        <View className='enjoy_tip e_block'>
          <Image src={enjoyTit2} className='e_tit'></Image>
          <Image src={enjoyLC} className='e_lc'></Image>
          <Image src={enjoyTit3} className='e_tit'></Image>
          <View className='f-24 color-3 mar-t-30 line-h-2'>
            <RichText nodes={shareInfo.invite}></RichText>
          </View>

        </View>
        <JTabBar index={2}/>
      </View>
    )
  }
}
