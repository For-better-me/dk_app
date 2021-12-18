import Taro, { Component, Config } from '@tarojs/taro'
import { View,} from '@tarojs/components'
import CommonApi from '../../apis/common'

export default class Login extends Component {
  config: Config = {
    navigationBarTitleText: '正在登录'
  }
  componentDidMount() { 
    this.login()
  }
  login() {
    Taro.showLoading({
      title:'正在登录'
    })
    Taro.login({
      success(res) {
        if (res.code) {
          CommonApi.login({ code: res.code }).then(data => {
            Taro.setStorageSync('token', data.token)
            Taro.navigateBack()
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
  render() {
    return (
      <View>
      </View>
    )
  }
}
