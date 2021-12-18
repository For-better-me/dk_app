import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'
import BgIntegral from '../../assets/img/bg-jf.png'
import UserApi from '../../apis/user'
export default class Integral extends Component {
  config: Config = {
    navigationBarTitleText: '可用积分'
  }
  limit: number = 10
  page: number = 1
  total: number = 0
  state = {
    list: [],
    currentIntegral: '--'
  }
  componentWillMount() {
    this.init()
  }
  init() {
    let data = { limit: this.limit, page: this.page }
    UserApi.IntegralLog(data).then(data => {
      let arr = ['积分抵现金', '购买商品',]
      let list = data.integral_list.map((el, index) => {
        el.desc = arr[index + 1]
        return el
      })
      this.setState({ list, currentIntegral: data.current_integral })
    })

  }
  linkToMore() {
    Taro.navigateTo({
      url: '/pages/integralList/index'
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
    let { currentIntegral, list } = this.state
    return (
      <View className='integral'>
        <View className='integral_sum  color-333'>
          <Text className='f-24 link_more' onClick={this.linkToMore}>历史积分 ></Text>
          <Image src={BgIntegral} className='bg-img'></Image>
          <Text className='f-32'>可用积分</Text>
          <Text className='f-60 mar-t-20'>{currentIntegral}</Text>

        </View>
        {
          list.map(el => {
            return (
              <View className='integral_item' key={el.id}>
                <View>
                  <Text className='f-30 color-3'>{el.desc}</Text>
                  <Text className='f-24 color-9 mar-t-20'>时间：{el.create_time}</Text>
                </View>
                <View className={el.type == 2 ? 'f-30 color-red' : 'f-30 color-3'}>{el.type == 2 ? '+' : '-'}{el.integral}</View>
              </View>
            )
          })
        }

      </View>
    )
  }
}
