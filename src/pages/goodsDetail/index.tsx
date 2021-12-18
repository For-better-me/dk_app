import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image, Button, RichText } from '@tarojs/components'
import './index.scss'
import BtnEnjoy from '../../assets/img/btn-enjoy.png'
import JInputNumber from '../../base/InputNumber'
import GoodsApi from '../../apis/goods'
import ShoppingCarApi from '../../apis/shoppingCar'
import { connect } from '@tarojs/redux'
import { SetCountCar } from '../../store/actions'
type StatesType = {
  num: number,
  goodsInfo: any
}
type PropsType = {
  countCar: number,
  setCountCar: (num: number) => any,
}
@connect(({ reducer }) => ({
  countCar: reducer.countCar
}), (dispatch) => ({
  setCountCar(num: number) {
    dispatch(SetCountCar(num))
  },


}))
export default class GoodsDetail extends Component<PropsType, StatesType> {
  config: Config = {
    navigationBarTitleText: '商品详情'
  }
  state = {
    num: Number(this.$router.params.num),
    goodsInfo: null
  }

  componentWillMount() { }

  componentDidShow() {
    this.getDetail()
    if(!Number(this.$router.params.num) && this.$router.params.num != '0'){
      this.initNum()
    }
  }
  initNum() {
    ShoppingCarApi.shoppingCarList().then(res => {
      let goodsIDArr = res.goods_list.filter(el => el.goods_id == this.$router.params.id)
      let num = 0
      if (goodsIDArr.length > 0) {
        num = goodsIDArr[0].goods_cart_number
      }
      this.setState({num})
    })
  }
  getDetail() {
    let id: string = this.$router.params.id
    GoodsApi.getGoodsInfo({ id }).then(data => {
      data.text = data.text.replace(/\<img/g,'<img style="width:100%;height:auto;display:block"')
      this.setState({ goodsInfo: data })
    })
  }
  changeNumber(num) {
    this.setState({ num })
  }
  addShoppingCar = () => {
    if (this.state.num == 0) {
      Taro.showToast({
        title: '添加数量不为0',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let data = {
      goods_id: this.state.goodsInfo.id,
      goods_extend_id: this.state.goodsInfo.goods_extend_list[0].goods_extend_id,
      number: this.state.num,
    }
    ShoppingCarApi.shoppingCarAdd(data).then(res => {
      this.props.setCountCar(this.props.countCar + data.number)
      Taro.switchTab({ url: '/pages/shoppingCar/index' })
    })
  }
  shareEvent = () => {
    Taro.showShareMenu({
      withShareTicket: true,
      showShareItems: ['wechatFriends', 'wechatMoment']
    })
  }
  onShareAppMessage() {
    return {
      title: this.state.goodsInfo.title || '每味十足',
      path: '/pages/goodsDetail/index?id=' + this.$router.params.id,  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
      imageUrl: '' // 图片路径
    };
  }
  render() {
    let { goodsInfo } = this.state
    return (
      <View className='goods_detail_wrap'>
        {
          goodsInfo ?
            <View>
              <View>
                <Swiper
                  indicatorColor='rgba(255,255,255,0.5)'
                  indicatorActiveColor='#fff'
                  circular
                  indicatorDots
                  autoplay>
                  {
                    goodsInfo.images.map(swiper => {
                      return (
                        <SwiperItem key={swiper.images_url}>
                          <Image src={swiper.images_url} className='swiper-img'></Image>
                        </SwiperItem>
                      )
                    })
                  }
                </Swiper>
              </View>
              <View className='goods_info'>
                <View className='flex-lr flex-center'>
                  <Text className='f-30 color-3'>{goodsInfo.title}</Text>
                  <Image src={BtnEnjoy} className='btn-enjoy' onClick={this.shareEvent}></Image>
                </View>
                <View className='flex-lr flex-center mar-t-10'>
                  <Text className='f-30 color-red'>￥{goodsInfo.price}</Text>
                  <Text className='f-24 color-9'>月售：{goodsInfo.total_volume}</Text>
                </View>
              </View>
              <View className='goods_detail mar-t-10'>
                <View className='f-28 color-3 bold title'>商品详情 DESCRIPTION</View>
                <View className='pad-30 rich_box'>
                  <RichText nodes={goodsInfo.text} />
                </View>
              </View>

              <View className='block-fixed-b flex-lr flex-center pad_lr_30'>
                <JInputNumber value={this.state.num} isHidden={false} changeNumber={this.changeNumber.bind(this)} />
                <Button className='btn-car' onClick={this.addShoppingCar}>加入购物车</Button>
              </View>
            </View> : null
        }
      </View>
    )
  }
}
