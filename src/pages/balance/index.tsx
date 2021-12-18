import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button,RichText } from '@tarojs/components'
import './index.scss'
import BgBalance from '../../assets/img/bg-ye.png'
import UserApi from '../../apis/user'
type StateType = {
  rechargeList: Array<{
    id: number | string,
    title: string,
    price: number | string,
    gift_price: number | string
  }>,
  balance: string | number,
  choosedId: number | string,
  rechargeDesc:string
}
export default class Balance extends Component<{}, StateType> {
  config: Config = {
    navigationBarTitleText: '余额充值'
  }
  state = {
    balance: '--',
    rechargeList: [],
    choosedId: '',
    rechargeDesc:''
  }
  getBalance() {
    UserApi.recharge().then(data => {
      this.setState({
        balance: data.balance,
        rechargeList: data.recharge_list,
        rechargeDesc:data.recharge_desc
      })
    })
  }
  componentWillMount() {
    this.getBalance()
  }
  moreLog = () => {
    Taro.navigateTo({
      url: '/pages/balanceList/index'
    })
  }
  selectRecharge(choosedId) {
    this.setState({
      choosedId
    })
  }
  rechargeEvent = () => {
    if (!this.state.choosedId) {
      Taro.showToast({
        title: '请选择你要充值的数额',
        icon: 'none'
      })
      return
    }
    let data = { id: this.state.choosedId }
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
    UserApi.rechargePay(data).then(res => {
      Taro.requestPayment({
        ...res,
        success() {
          this.getBalance()
          Taro.hideLoading()
          Taro.showToast({ title: '支付成功' })
        },
        fail() {
          Taro.hideLoading()
          Taro.showToast({ title: '支付失败', icon: 'none' })
        }
      })
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
    let { balance, choosedId } = this.state
    let rechargeList: any[] = this.state.rechargeList
    return (
      <View className='balance'>
        <View className='balance_sum  color-fff'>
          <Text className='f-24 link_more' onClick={this.moreLog}>余额明细 ></Text>
          <Image src={BgBalance} className='bg-img'></Image>
          <Text className='f-32'>我的余额</Text>
          <Text className='f-42 mar-t-20'>￥<Text className='f-67'>{balance}</Text></Text>
        </View>
        <View className='recharge'>
          <View className='f-34 color-3 line-h-2'>充值金额</View>
          {
            rechargeList.map((el, index) => {
              return (
                <View className={choosedId == el.id ? 'recharge_item on' : 'recharge_item'} key={el.id} onClick={this.selectRecharge.bind(this, el.id)}>
                  <Text className='f-34'>{el.price}</Text>
                  <Text className='f-24'>充值{el.price}元送{el.gift_price}元</Text>
                </View>
              )
            })
          }
        </View>
        <View className='recharge mar-t-20'>
          <View className='f-34 color-3 line-h-2'>充值说明</View>
          <View className='tip_wrap mar-t-10'>
            <RichText nodes={this.state.rechargeDesc}></RichText>
            {/* <View className='tip_item'>
              <View className='dot'></View>
              <View className='tip f-28 color-3'>商城上线，除了常见药商城上线，除了常见药商城上线，除了常见药品，还为您精选各种健康黑科技。</View>
            </View>
            <View className='tip_item'>
              <View className='dot'></View>
              <View className='tip f-28 color-3'>商城上线，除了常见药品，还为您精选各种健康黑科技。</View>
            </View> */}
          </View>

        </View>
        <View className='btn_wrap' onClick={this.rechargeEvent}>
          <Button>立即充值</Button>
        </View>
      </View>
    )
  }
}
