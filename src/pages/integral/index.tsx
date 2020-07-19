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
      this.setState({ list: data.integral_list, currentIntegral: data.current_integral })
    })

  }
  linkToMore(){
    Taro.navigateTo({
      url:'/pages/integralList/index'
    })
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
              <View className='integral_item'  key={el.id}>
                <View>
                  <Text className='f-30 color-3'>购买商品</Text>
                  <Text className='f-24 color-9 mar-t-20'>时间：2020-06-07  17:52</Text>
                </View>
                <View className='f-30 color-3'>-30</View>
              </View>
            )
          })
        }

      </View>
    )
  }
}
