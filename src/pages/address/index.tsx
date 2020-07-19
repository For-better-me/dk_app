import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './index.scss'
import { AtIcon } from 'taro-ui'
import CheckboxJ from '../../base/checkBox/index'
import NoData from '../../base/nodata/nodata'
import nodataImg from '../../assets/img/nodata-car.png'
import OrderApi from '../../apis/order'
type State = {
  addressList: any[]
}
export default class Address extends Component<{}, State> {
  config: Config = {
    navigationBarTitleText: '收货地址'
  }
  constructor(props) {
    super(props)
    this.state = {
      addressList: []
    }
  }
  limit: number = 10
  page: number = 1
  total: number = 0

  componentWillMount() {
    this.init()
  }
  init() {
    let data = { limit: this.limit, page: this.page }
    OrderApi.addrList(data).then(res => {
      this.setState({ addressList: res })
    })
  }
  newAddr = (id) => {
    Taro.navigateTo({
      url: '/pages/addressEdit/index?id=' + id
    })
  }
  delAddrTip() {
    return new Promise((resolve, reject) => {
      Taro.showModal({
        title: '温馨提示',
        content: '确定要删除该地址吗？',
        success: function (res) {
          if (res.confirm) {
            resolve()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })

  }
  delAddr(id) {
    this.delAddrTip().then(() => {
      OrderApi.addrDel({ id }).then(res => {
        this.init()
        Taro.showToast({
          title: '删除成功'
        })
      })
    })
  }
  onReachBottom() {
    if ((this.page++) > this.total) {
      Taro.showToast({
        title: '没有更多了',
        icon: 'none'
      })
      return
    }
    this.init()
  }
  render() {
    let addressList: any[] = this.state.addressList
    return (
      <View className='address_list'>
        {
          addressList.length > 0 ?
            (
              addressList.map(el => {
                return (
                  <View className='address_item mar-b-10' key={el.id}>
                    <View className='border_bottom pad-30'>
                      <View className='flex-center'>
                        <Text className='f-32 color-3'>{el.name}</Text><Text className='f-28 color-6  mar-l-4'>{el.phone}</Text>
                      </View>
                      <View className='pad_tb_10'>
                        <Text className='f-32 color-3'>{el.address_detail}  </Text>
                      </View>
                    </View>
                    <View className='flex-lr  pad-25'>
                      <View className='flex-center'>
                        <CheckboxJ value={el.is_default == 2} />
                        {
                          el.is_default == 2 ? <Text className='f-24 color-red mar-l-10'>已设为默认</Text> : <Text className='f-24 color-3 mar-l-10'>设为默认</Text>
                        }
                      </View>
                      <View className='flex-center'>
                        <View className='flex-center'>
                          <View className='flex-center' onClick={this.newAddr.bind(this, el.id)}>
                            <AtIcon value='edit' size='14' color='#8A857C'></AtIcon>
                            <Text className='f-24 color-6  mar-l-10'>编辑</Text>
                          </View>
                          <View className='flex-center  mar-l-30'  onClick={this.delAddr.bind(this, el.id)}>
                            <AtIcon value='trash' size='14' color='#8A857C'></AtIcon>
                            <Text className='f-24 color-6  mar-l-10'>删除</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })
            ) : <NoData imgSrc={nodataImg} tip='客官还没有创建地址哦' />

        }


        <View className='btn_wrap'>
          <Button ><AtIcon value='add-circle' size='20' color='#fff' onClick={this.newAddr.bind(this, 0)}></AtIcon>新建收货地址</Button>
        </View>
      </View>
    )
  }
}
