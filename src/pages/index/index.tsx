import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components'
import { AtNoticebar } from 'taro-ui'
import './index.scss'
import BgTitle from '../../assets/img/sort_tit_bg.png'
import JInputNumber from '../../base/InputNumber'
import JTabBar from '../../base/TabBar'
import { connect } from '@tarojs/redux'
import { SetCountCar, SetTab } from '../../store/actions'
import GoodsApi from '../../apis/goods'
import ShoppingCarApi from '../../apis/shoppingCar'

type PropsType = {
  orderNum: string,
  countCar: number,
  setCountCar: (num: number) => any,
  setTab: (num: number) => any
}
type StatesType = {
  bannerList: Array<{
    img: string,
    id: string
  }>,
  goodsList: any[],
  notices: string,
  currentSort: number,
}
@connect(({ reducer }) => ({
  countCar: reducer.countCar,
  orderNum: reducer.orderNum
}), (dispatch) => ({
  setCountCar(num: number) {
    dispatch(SetCountCar(num))
  },
  setTab(num: number) {
    dispatch(SetTab(num))
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
  }
  goodsHeightArr: string[] = []
  componentWillMount() {
    this.getPageData()
  }
  componentDidShow() {
    this.props.setTab(0)
    this.getCarList(this.state.goodsList)
  }

  componentDidMount() { }
  changeNumber = (num, extra, type,event) => {
    event.stopPropagation();
    let { countCar } = this.props
    let [i, j] = extra
    let goodsList: any[] = this.state.goodsList
    let data = {
      goods_id: goodsList[i].goods_list[j].id,
      goods_extend_id: goodsList[i].goods_list[j].goods_extend_list[0].goods_extend_id,
      number: num
    }
    ShoppingCarApi.shoppingCarAdd(data).then(res => {
      if (num == 1 && type == 'add' && num == 0 && type == 'sub') {
        this.props.setCountCar(type == 'add' ? countCar + 1 : countCar - 1)
      }
      goodsList[i].goods_list[j].goods_extend_list[0].count = num
      this.setState({ goodsList })
    })

  }
  getPageData() {
    let goodsHeightArr: string[] = []
    let h = 0
    GoodsApi.getShop().then(data => {
      data.goods_list.forEach(el => {
        let max_h = el.goods_list.length * 88 + 54
        console.log(h, max_h, el.goods_list.length * 180 + 70);
        goodsHeightArr.push(`${h}-${h + max_h}`)
        h = h + max_h

      })
      console.log(goodsHeightArr);

      this.goodsHeightArr = goodsHeightArr
      this.getCarList(data.goods_list)
      this.setState({
        bannerList: data.focus,
        goodsList: data.goods_list,
        notices: data.lantern.join('/n')
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
        data.goods_list.forEach(el => {
          goodsData = goodsData.map(goods => {
            goods.goods_list = goods.goods_list.map(goodsItem => {
              goodsItem.goods_extend_list = goodsItem.goods_extend_list.map(goodsExtend => {
                if (el.goods_id == goodsItem.id && el.goods_extend_id == goodsExtend.goods_extend_id) {
                  goodsExtend.count = el.goods_cart_number
                } else {
                  goodsExtend.count = 0
                }
                return goodsExtend
              })
              return goodsItem
            })

            return goods
          })
        });
      }
      this.setState({
        goodsList: goodsData,
      })

    })
  }
  navTo(id, num) {
    Taro.navigateTo({
      url: `/pages/goodsDetail/index?id=${id}&num=${num}`
    })
  }
  switchSort(currentSort) {
    this.setState({ currentSort })
  }
  scroll(e) {
    console.log(e);

  }
  render() {
    let self = this
    let { notices, goodsList, bannerList, currentSort } = this.state
    return (
      <View className='pad_lr_20'>
        <View className='noticebar_wrap'>
          <AtNoticebar marquee icon='volume-plus'>
            {notices}
          </AtNoticebar>
        </View>
        <View className='bor-radius mar-t-20'>
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
        </View>
        <View className='sort_wrap mar-t-20'>
          <ScrollView className='sort_title' scroll-y="true">
            {
              goodsList.map((item, index) => {
                return (<View className={currentSort == index ? 'item_title on' : 'item_title'} key={index} onClick={this.switchSort.bind(this, index)}>
                  {item.title}
                  <Image src={BgTitle} className='swiper-img'></Image>
                </View>)
              })
            }
          </ScrollView>
          <ScrollView className='sort_content' scroll-y="true" scroll-into-view={`view_${currentSort}`} scroll-with-animation={true} onScroll={self.scroll.bind(self)}>
            {
              goodsList.map((first, index) => {
                return (
                  <View className='item_con mar-b-10' key={index + '_' + first.id} id={`view_${index}`}>
                    <Text className='f-28 color-3 item_con_tit'>{first.title}</Text>
                    {
                      first.goods_list.map((goods, j) => {
                        return (
                          <View className='pad_tb_20 flex-lr border_bottom item_goods_wrap' key={goods.id} >
                            <Image src={goods.img} className='goods_img' onClick={this.navTo.bind(this, goods.id, goods.goods_extend_list[0].count)}></Image>
                            <View className='item_goods'>
                              <Text className='f-28 color-3' onClick={this.navTo.bind(this, goods.id, goods.goods_extend_list[0].count)}>{goods.goods_extend_list[0].title}</Text>
                              <Text className='f-22 color-9 mar-t-10' onClick={this.navTo.bind(this, goods.id, goods.goods_extend_list[0].count)}>月售{goods.goods_extend_list[0].stock}</Text>
                              <View className='flex-lr flex-center mar-t-30'>
                                <Text className='f-30 color-red'>￥{goods.goods_extend_list[0].price}</Text>
                                <JInputNumber value={goods.goods_extend_list[0].count} isHidden={true} extra={[index, j]} changeNumber={this.changeNumber} />
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
        </View>
        <JTabBar />
        {/* <TabBar/> */}
      </View>
    )
  }
}
