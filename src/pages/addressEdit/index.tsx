import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Textarea, Input, Switch, Button, Picker, } from '@tarojs/components'
import './index.scss'
import { AtIcon, AtCurtain } from 'taro-ui'
import OrderApi from '../../apis/order'

type State = {
  addr: any,
  isOpened: boolean
}
export default class AddressEdit extends Component<{}, State> {
  config: Config = {
    navigationBarTitleText: '新建地址'
  }
  constructor(props) {
    super(props)
    this.state = {
      addr: {
        is_default: 1
      },
      isOpened: false
    }
  }


  componentWillMount() {
    if (this.$router.params.id != '0') {
      Taro.setNavigationBarTitle({ 'title': '编辑地址' })
      this.init(this.$router.params.id)
    }

  }
  init(id) {
    OrderApi.addrInfo({ id }).then(addr => {
      this.setState({ addr })
    })
  }
  save = () => {
    let data = this.state.addr
    let id = this.$router.params.id
    if (data.name && data.phone && data.address && data.address_detail) {
      if (id == '0') {
        OrderApi.addrNew(data).then(res => {
          Taro.showToast({
            title: '新建地址成功',
            complete() {
              Taro.navigateBack()
            }
          })
        })
      } else {
        data.id = id
        OrderApi.addrUpdate(data).then(res => {
          Taro.showToast({
            title: '更新地址成功',
            complete() {
              Taro.navigateBack()
            }
          })
        })
      }
    } else {
      Taro.showToast({
        title: '请完善地址信息',
        icon: 'none'
      })
    }
    console.log(this.state.addr);

  }
  onRegionChange = (e) => {
    let [province_id, city_id, area_id] = e.detail.code
    let addr = Object.assign({}, this.state.addr, { 'address': e.detail.value.join(' '), province_id, city_id, area_id })
    this.setState({
      addr
    })
  }
  blurEvent(key: string, e: any) {
    let addr = Object.assign({}, this.state.addr, { [key]: e.detail.value })
    this.setState({
      addr
    })
  }
  switchChange = (e) => {
    console.log(e.detail.value);

    let addr = Object.assign({}, this.state.addr, { is_default: e.detail.value ? 2 : 1 })
    this.setState({
      addr
    })
  }
  location = () => {
    let self = this
    if (self.state.addr.lat && self.state.addr.lng) {
      const latitude = self.state.addr.lat
      const longitude = self.state.addr.lng
      Taro.chooseLocation({
        latitude,
        longitude,
        success(res) {
          let addr = Object.assign({}, self.state.addr, { lng: res.longitude, lat: res.latitude, address: res.name })
          self.setState({ addr })
        },
      })
    } else {
      Taro.showLoading({
        title:'正在加载地图...'
      })
      Taro.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        isHighAccuracy: true,
        success(res) {
          setTimeout(()=>{
            Taro.hideLoading()
          },3000)
          const latitude = res.latitude
          const longitude = res.longitude
          Taro.chooseLocation({
            latitude,
            longitude,
            success(res) {
              let addr = Object.assign({}, self.state.addr, { lng: res.longitude, lat: res.latitude, address: res.name })
              self.setState({ addr })
            },
          })
        },
        fail() {
          self.setState({
            isOpened: true
          })
        }
      })
    }

  }
  openSetting(e) {
    if (e.detail.authSetting['scope.userLocation']) {
      this.location()
      this.setState({
        isOpened: false
      })
    }

  }
  onClose() {
    this.setState({
      isOpened: false
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
    let addr: any = this.state.addr
    return (
      <View className='addr_edit'>
        <View>
          <View className='item_edit border-bottom'>
            <Text className='edit_label'>收货人</Text><Input placeholder='请填写姓名' value={addr.name} onBlur={this.blurEvent.bind(this, 'name')}></Input>
          </View>
          <View className='item_edit  border-bottom'>
            <Text className='edit_label'>联系方式</Text><Input type='number' placeholder='请填写联系电话' value={addr.phone} onBlur={this.blurEvent.bind(this, 'phone')}></Input>
          </View>
          <View className='border-bottom' onClick={this.location}>
            {/* <Picker mode='region' value={regionIndex} onChange={this.onRegionChange} > */}
            <View className='item_edit'>
              <Text className='edit_label'>所在地区</Text><Input placeholder='请选择地址' disabled value={addr.address}></Input>
              <AtIcon value='chevron-right' size='20' color='#999'></AtIcon>
            </View>
            {/* </Picker> */}
          </View>
          <View className='item_edit '>
            <Text className='edit_label'>详细地址</Text><Textarea value={addr.address_detail} placeholder='如道路、门牌号、小区、楼栋号、单元室' onInput={this.blurEvent.bind(this, 'address_detail')}></Textarea>

          </View>
        </View>
        <View className='mar-t-20 pad_lr_30 flex-lr is_default'>
          <Text className='f-28 color-3'>设为默认地址</Text>
          <Switch checked={addr.is_default == 2} onChange={this.switchChange}></Switch>
        </View>
        <View className='btn_wrap' onClick={this.save}>
          <Button >保存</Button>
        </View>
        <AtCurtain
          closeBtnPosition='top-right'
          isOpened={this.state.isOpened}
          onClose={this.onClose.bind(this)}
        >
          <View className='btn_setting'>
            <View className='f-30 color-6'>无法获取当前位置，请手动开启授权</View>
            <Button open-type='openSetting' onOpenSetting={this.openSetting.bind(this)}>设置</Button>
          </View>
        </AtCurtain>

      </View>
    )
  }
}
