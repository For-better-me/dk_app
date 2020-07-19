import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Textarea, Input, Switch, Button } from '@tarojs/components'
import './index.scss'
import { AtIcon } from 'taro-ui'
import OrderApi from '../../apis/order'


type State = {
  addr: any
}
export default class AddressEdit extends Component<{}, State> {
  config: Config = {
    navigationBarTitleText: '编辑地址'
  }
  constructor(props) {
    super(props)
    this.state = {
      addr: {}
    }
  }


  componentWillMount() {
    if (this.$router.params.id != '0') {
      this.init(this.$router.params.id)
    }

  }
  init(id) {
    OrderApi.addrInfo({ id }).then(addr => {
      this.setState({ addr })
    })
  }
  save = ()=>{
    console.log(this.state.addr);
    
  }
  render() {
    let addr: any = this.state.addr
    return (
      <View className='addr_edit'>
        <View>
          <View className='item_edit border-bottom'>
            <Text className='edit_label'>收货人</Text><Input placeholder='请填写姓名' value={addr.name}></Input>
          </View>
          <View className='item_edit  border-bottom'>
            <Text className='edit_label'>联系方式</Text><Input type='number' placeholder='请填写联系电话' value={addr.phone}></Input>
          </View>
          <View className='item_edit  border-bottom'>
            <Text className='edit_label'>所在地区</Text><Input placeholder='请选择省、市、区' disabled></Input>
            <AtIcon value='chevron-right' size='20' color='#999'></AtIcon>
          </View>
          <View className='item_edit '>
            <Text className='edit_label'>详细地址</Text><Textarea  value={addr.address_detail} placeholder='如道路、门牌号、小区、楼栋号、单元室'></Textarea>

          </View>
        </View>
        <View className='mar-t-20 pad_lr_30 flex-lr is_default'>
          <Text className='f-28 color-3'>设为默认地址</Text>
          <Switch checked={addr.is_default == 2}></Switch>
        </View>
        <View className='btn_wrap' onClick={this.save}>
          <Button >保存</Button>
        </View>
      </View>
    )
  }
}
