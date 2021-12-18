import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components'
import { AtNoticebar, AtCurtain, AtIcon } from 'taro-ui'
import './index.scss'
import BgTitle from '../../assets/img/sort_tit_bg.png'
import IconSearch from '../../assets/img/icon_search.png'
import JInputNumber from '../../base/InputNumber'
import JTabBar from '../../base/TabBar'
import { connect } from '@tarojs/redux'
import { SetCountCar, SetTab, SetDeliveryType } from '../../store/actions'
import GoodsApi from '../../apis/goods'
import UserApi from '../../apis/user'
import ShoppingCarApi from '../../apis/shoppingCar'
import bgHB from '../../assets/img/bg_hb.png'
import shopState from '../../assets/img/shop_state.png'
import bgFFF from '../../assets/img/bg_fff.png'

type PropsType = {
  orderNum: string,
  countCar: number,
  deliveryType: number
  setCountCar: (num: number) => any,
  setTab: (num: number) => any
  setDeliveryType: (num: number) => any
}
type StatesType = {
  bannerList: Array<{
    img: string,
    id: string
  }>,
  goodsList: any[],
  notices: string,
  currentSort: number,
  currentSortClass: number,
  isOpened: boolean,
  coupon: any[],
  shop: any,
  shopState: boolean,
  shopStateMsg: string,
  is_focus: number,
  translateX: number,
  translateTime: number,
}
@connect(({ reducer }) => ({
  countCar: reducer.countCar,
  orderNum: reducer.orderNum,
  deliveryType: reducer.deliveryType,
}), (dispatch) => ({
  setCountCar(num: number) {
    dispatch(SetCountCar(num))
  },
  setTab(num: number) {
    dispatch(SetTab(num))
  },
  setDeliveryType(num: number) {
    dispatch(SetDeliveryType(num))
  }

}))
export default class Index extends Component<PropsType, StatesType> {
  config: Config = {
    navigationBarTitleText: '每味十足',
  }
  state = {
    bannerList: [],
    goodsList: [],
    notices: '',
    currentSort: 0,
    currentSortClass: 0,
    isOpened: false,
    coupon: [],
    shop: {},
    shopState: false,
    shopStateMsg: '',
    is_focus: 2,
    translateX: 320,
    translateTime: 2,
  }
  shoppingCarList: any[] = []
  goodsHeightArr: string[] = []
  componentWillMount() {
  }
  componentDidShow() {
    this.getPageData()
    this.getFocusList()
    this.getCarList(this.state.goodsList)
    if (this.$router.params && this.$router.params.invite_user_id) {
      Taro.setStorageSync('invite_user_id', this.$router.params.invite_user_id)
      console.log('被邀请了');
    }
  }

  componentDidMount() {
    Taro.hideTabBar()
    this.getGS()

  }
  componentDidHide(){
    this.timer && clearInterval(this.timer)
  }
  changeNumber = (num, extra, type, event) => {
    event.stopPropagation();
    let { countCar } = this.props
    let [i, j, goodsCarId] = extra
    let goodsList: any[] = this.state.goodsList

    if (num == 0 && type == 'sub') {
      let data = {
        ids: [goodsCarId]
      }
      ShoppingCarApi.shoppingCarDel(data).then(res => {
        this.props.setCountCar(countCar - 1)
        this.getCarList(goodsList)

      })
    }
    else if (num == 1 && type == 'add') {
      let data = {
        goods_id: goodsList[i].goods_list[j].id,
        goods_extend_id: goodsList[i].goods_list[j].goods_extend_list[0].goods_extend_id,
        number: num
      }
      ShoppingCarApi.shoppingCarAdd(data).then(res => {
        this.props.setCountCar(countCar + 1)
        this.getCarList(goodsList)
      })
    }
    else {
      let data = {
        id: goodsCarId,
        type: type == 'add' ? 1 : 2
      }
      ShoppingCarApi.shoppingCountUpdate(data).then(res => {
        this.getCarList(goodsList)
      })
    }

  }
  getFocusList() {
    GoodsApi.getFocusList().then(data => {
      this.setState({
        bannerList: data.focus,
        notices: data.lantern.join(';'),
        is_focus: data.is_focus
      }, () => {
        this.notices()
      })
    })
  }
  getGS() {
    let self = this
    Taro.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      isHighAccuracy: true,
      success(res) {
        const lat = res.latitude + ''
        const lng = res.longitude + ''
        self.getShopSite(lng, lat)
      },
      fail() {
        self.getShopSite()
      }
    })
  }
  getShopSite(lng = '', lat = '') {
    GoodsApi.getShopInfo({ lng, lat }).then(res => {
      this.setState({
        shop: res
      })
    })
  }
  getPageData() {

    GoodsApi.getShop().then(data => {
      this.getCarList(data.goods_list)
      this.setState({
        goodsList: data.goods_list,
        coupon: data.coupon.list,
        isOpened: data.coupon.list.length > 0 && data.coupon.is_home_coupon == 2,
        shopState: data.shop_state.status == 2,
        shopStateMsg: data.shop_state.date
      }, () => {
        this.computedHeight()
      })
    })
  }
  getCarList(goodsData) {
    if (goodsData.length == 0) {
      return
    }
    ShoppingCarApi.shoppingCarList().then(data => {
      if (data.goods_list.length == 0) {
        goodsData = goodsData.map(goods => {
          goods.goods_list = goods.goods_list.map(goodsItem => {
            goodsItem.goods_extend_list = goodsItem.goods_extend_list.map(goodsExtend => {
              goodsExtend.count = 0
              return goodsExtend
            })
            return goodsItem
          })

          return goods
        })
      } else {
        goodsData = goodsData.map(goods => {
          goods.goods_list = goods.goods_list.map(goodsItem => {
            goodsItem.goods_extend_list = goodsItem.goods_extend_list.map(goodsExtend => {
              for (let i = 0; i < data.goods_list.length; i++) {
                let el = data.goods_list[i]
                if (el.goods_id == goodsItem.id && el.goods_extend_id == goodsExtend.goods_extend_id) {
                  goodsExtend.count = el.goods_cart_number
                  goodsExtend.carId = el.id
                  break;
                } else {
                  goodsExtend.count = 0
                  goodsExtend.carId = null
                }
              }
              return goodsExtend
            })
            return goodsItem
          })
          return goods
        });
      }
      this.setState({
        goodsList: goodsData,
      })

    })
  }
  navTo(id, num) {
    // Taro.navigateTo({
    //   url: `/pages/goodsDetail/index?id=${id}&num=${num}`
    // })
  }
  switchSort(currentSort) {
    this.setState({ currentSort, currentSortClass: currentSort })
  }
  scroll(e) {
    let scrollTop = e.detail.scrollTop
    for (let i = 0; i < this.goodsHeightArr.length; i++) {
      let [min, max] = this.goodsHeightArr[i].split('-')
      if (scrollTop < max && scrollTop > min) {
        this.setState({
          currentSortClass: i
        })
        break;
      }
    }


  }
  onClose() {
    let coupon_id = this.state.coupon.map(el => el.id)
    UserApi.CouponAdd({ coupon_id }).then(res => {
      this.setState({
        isOpened: false
      })
    })

  }
  onCloseShop() {
    this.setState({
      shopState: false
    })
  }
  setType(type) {
    this.props.setDeliveryType(type)
  }
  toSearch() {
    Taro.navigateTo({
      url: '/pages/search/index'
    })
  }
  onShareAppMessage() {
    return {
      title: "每味十足",
      path: '/pages/index/index',  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
      imageUrl: '' // 图片路径
    };
  }
  computedHeight() {
    let goodsHeightArr: string[] = []
    let h = 0
    let self = this
    const query = Taro.createSelectorQuery()
    query.selectAll('.item_con').boundingClientRect(function (res) {
      res.forEach(el => {
        let max_h = el.height+3
        goodsHeightArr.push(`${h}-${h + max_h}`)
        h = h + max_h
      })
      self.goodsHeightArr = goodsHeightArr

    }).exec()
  }
  timer:any = null
  notices() {
    let self = this
    let width = self.state.notices.length * 6.5
    if (width > 320) {
      this.timer = setInterval(() => {
        let translateX = 320
        let translateTime = 2
        if (self.state.translateX > (-width)) {
          translateX = self.state.translateX - 90
        } else {
          translateTime = 0
        }
        console.log(translateX, translateTime, width);
        self.setState({ translateX, translateTime })
      }, 2000)
    } else {
      self.setState({ translateX: 0 })
    }


  }
  render() {
    let self = this
    let { notices, goodsList, bannerList, currentSort, coupon, shop } = this.state
    return (
      <View className='pad_lr_20'>
        <View className='noticebar_wrap' >
          <AtIcon value='volume-plus' size='18' color='#FF541F'></AtIcon>
          <View className='notices'><Text style={{ transform: `translateX(${this.state.translateX}px)`, transition: `all linear ${this.state.translateTime}s` }} id='noticebar_wrap'>{notices}</Text></View>
        </View>
        {
          this.state.is_focus == 2 ?
            (<View className='banner mar-t-20'>
              <Swiper
                indicatorColor='#000'
                indicatorActiveColor='#fff'
                circular
                indicatorDots
                autoplay>
                {
                  bannerList.map(banner => {
                    return (<SwiperItem key={banner.id}>
                      <Image src={banner.img} className='swiper-img'></Image>
                    </SwiperItem>)
                  })
                }
              </Swiper>
            </View>) : null
        }
        <View className='flex-center flex-lr site'>
          <View>
            <View className='f-28 color-1'>{shop.title}</View>
            <View className='f-24 color-3'>{shop.address}</View>
            {
              shop.kilometre ? <View className='f-24 color-9'>距您{shop.kilometre}km</View> : null
            }
          </View>
          <View className='flex-center flex-lr sort'>
            <Text className={this.props.deliveryType == 1 ? 'on' : ''} onClick={this.setType.bind(this, 1)}>到店</Text>
            <Text className={this.props.deliveryType == 2 ? 'on' : ''} onClick={this.setType.bind(this, 2)}>外卖</Text>
          </View>
        </View>
        <View className='sort_wrap mar-t-20'>
          <ScrollView className='sort_title' scroll-y="true">
            <View className='style_search' onClick={this.toSearch.bind(this)}>
              <Image src={IconSearch} className='swiper-img'></Image>
              <Text>搜索</Text>
            </View>
            {
              goodsList.map((item, index) => {
                return (<View className={currentSortClass == index ? 'item_title on' : 'item_title'} key={index} onClick={this.switchSort.bind(this, index)}>
                  {item.title}
                  <Image src={BgTitle} className='swiper-img'></Image>
                </View>)
              })
            }
          </ScrollView>
          <ScrollView className='sort_content' scroll-y="true" scroll-into-view={`view_${currentSort}`} scroll-with-animation={true} onScroll={self.scroll.bind(this)}>
            {
              goodsList.map((first, index) => {
                return (
                  <View id={`sort_${index}`} className='item_con mar-b-10' key={index + '_' + first.title} id={`view_${index}`}>
                    <Text className='f-28 color-3 item_con_tit'>{first.title}</Text>
                    {
                      first.goods_list.map((goods, j) => {
                        return (
                          <View className='pad_tb_20 flex-lr border_bottom item_goods_wrap' key={goods.id} >
                            <Image src={goods.img} className='goods_img' onClick={this.navTo.bind(this, goods.id, goods.goods_extend_list[0].count)}></Image>
                            <View className='item_goods'>
                              <View onClick={this.navTo.bind(this, goods.id, goods.goods_extend_list[0].count)}>
                                <Text className='f-28 color-3' >{goods.goods_extend_list[0].title}</Text>
                                <Text className='f-22 color-9' >月售{goods.total_volume}</Text>
                                <Text className='f-22 color-9' >销售时间：{goods.place_order_time}</Text>
                              </View>
                              <View className='flex-lr flex-center mar-t-6'>
                                <Text className='f-30 color-red'>￥{goods.goods_extend_list[0].price}</Text>
                                <JInputNumber value={goods.goods_extend_list[0].count} isHidden={true} extra={[index, j, goods.goods_extend_list[0].carId]} changeNumber={this.changeNumber} />
                              </View>
                            </View>
                          </View>
                        )
                      })
                    }


                  </View>
                )
              })
            }


          </ScrollView>
          <AtCurtain
            closeBtnPosition='bottom'
            isOpened={this.state.isOpened}
            onClose={this.onClose.bind(this)}
          >
            <View className='coupon_list'>
              <View className='text_hb'>一份新手大礼包赠送给你</View>
              <View className='text_hb_s'>快去探寻未知的世界吧！</View>
              <Image src={bgHB} className='bg-img' mode='widthFix'></Image>
              <View className='list_wrap'>
                {
                  coupon.map(el => {
                    return (
                      <View className='item'>
                        <Image src={bgFFF} className='bg-img'></Image>
                        <View className='div_l'>
                          {el.coupon_type == 1 ? el.avoid_price : el.avoid_price * 10}<Text>{el.coupon_type == 1 ? '元' : '折'}</Text>
                        </View>
                        <View className='div_r'>
                          <Text className='f-30 color-3'>{el.use_threshold == 1 ? '无门槛' : `满${el.threshold_price}元可用`}</Text>
                          <Text className='f-24 color-9 mar-t-10'>{el.expire}</Text>
                          <View className='btn_use' onClick={this.onClose.bind(this)}>去使用</View>
                        </View>
                      </View>
                    )
                  })
                }
              </View>

            </View>
          </AtCurtain>
          <AtCurtain
            isOpened={this.state.shopState}
            onClose={this.onCloseShop.bind(this)}
          >
            <View className='shop_state'>
              <Image src={shopState} className='bg-img' mode='widthFix'></Image>
              <View className='shop_state_wrap'>
                <Text className='title'>休店通知</Text>
                <Text className='f-32 color-fff'>店主马上要休假啦~~休店期间暂时无法购买哦~~</Text>
                <Text className='f-28 color-fff'>休店时间：{this.state.shopStateMsg}</Text>
                <Text className='f-28 color-fff'>开店时间：短信通知</Text>
              </View>
              <View className='gg' onClick={this.onCloseShop.bind(this)}>去购物</View>

            </View>
          </AtCurtain>

        </View>
        <JTabBar index={0} />
        {/* <TabBar/> */}
      </View>
    )
  }
}
