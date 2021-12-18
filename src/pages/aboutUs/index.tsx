import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'
import CommonApi from '../../apis/common'
export default class Pay extends Component {
  config: Config = {
    navigationBarTitleText: '关于每味十足'
  }
  componentDidMount() {
    this.init()
  }
  state = {
    type: 1,
    ambient: [],
    seniority: []
  }
  init = () => {
    CommonApi.aboutUs().then(res => {
      this.setState({
        ambient: res.ambient,
        seniority: res.seniority
      })
    })
  }
  switchType(type) {
    this.setState({ type)
  }
  preview(current) {
    let urls: string[] = []
    if (this.state.type == 1) {
      urls = this.state.ambient.map(el => el.ambient_images_url)
    } else {
      urls = this.state.seniority.map(el => el.seniority_images_url)

    }
    Taro.previewImage({
      current,
      urls
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
    let { type, ambient, seniority } = this.state
    return (
      <View className='about_us'>
        <View>
          <View className={type == 1 ? 'btn on' : 'btn'} onClick={this.switchType.bind(this, 1)}>店铺环境</View>
          <View className={type == 2 ? 'btn on' : 'btn'} onClick={this.switchType.bind(this, 2)}>营业资格</View>
        </View>
        <View className='list'>
          {
            type == 1 ?
              ambient.map((el,index) => {
                return <Image key={index} src={el.ambient_images_url} onClick={this.preview.bind(this, el.ambient_images_url)}></Image>
              }) : null
          }
          {
            type == 2 ?
              seniority.map((el,index) => {
                return <Image  key={index} src={el.seniority_images_url} onClick={this.preview.bind(this, el.seniority_images_url)}></Image>
              }) : null
          }
        </View>
      </View>
    )
  }
}
