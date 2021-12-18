import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, } from '@tarojs/components'
import { AtIcon, AtInput } from 'taro-ui'
import JInputNumber from '../../base/InputNumber'
import { connect } from '@tarojs/redux'
import { SetCountCar, } from '../../store/actions'
import GoodsApi from '../../apis/goods'
import ShoppingCarApi from '../../apis/shoppingCar'
import '../index/index.scss'
import './index.scss'
import NoData from '../../base/nodata'

type PropsType = {
  countCar: number,
  setCountCar: (num: number) => any,
}
@connect(({ reducer }) => ({
  countCar: reducer.countCar,
}), (dispatch) => ({
  setCountCar(num: number) {
    dispatch(SetCountCar(num))
  }
}))
export default class Search extends Component<PropsType> {
  config: Config = {
    navigationBarTitleText: '搜索'
  }
  componentDidMount() {

  }
  state = {
    goodsList: [],
    keyWords:''
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
        goods_id: goodsList[i].id,
        goods_extend_id: goodsList[i].goods_extend_list[0].goods_extend_id,
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
  getList(keyword) {
    GoodsApi.getSearchGoods({ keyword }).then(data => {
      this.getCarList(data)
      this.setState({
        goodsList: data,
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
          goods.goods_extend_list = goods.goods_extend_list.map(goodsExtend => {
            goodsExtend.count = 0
            return goodsExtend
          })

          return goods
        })
      } else {
        goodsData = goodsData.map(goodsItem => {
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
        });
      }
      this.setState({
        goodsList: goodsData,
      })

    })
  }
  navTo(id, num) {
   
  }
  handleChange(e) {
    this.getList(e)
    this.setState({
      keyWords:e
    })
  }
  cancel() {
    Taro.navigateBack()
  }
  onShareAppMessage() {
    return {
      title: "每味十足",
      path: '/pages/index/index',  // 自定义的分享路径，点击分享的卡片之后会跳转这里定义的路由
      imageUrl: '' // 图片路径
    };
  }
  render() {
    return (
      <View className='search wrap'>
        <View className='flex-lr flex-center'>
          <View className='flex-center search_box'>
            <AtIcon value='search' size='16' color='#666'></AtIcon>
            <AtInput
              autoFocus
              name='search'
              type='text'
              placeholder='请输入商品名称'
              onChange={this.handleChange.bind(this)}
            />
          </View>
          <View className='f-28 color-6' onClick={this.cancel.bind(this)}>取消</View>
        </View>
        {
          this.state.goodsList.length == 0 && this.state.keyWords != ''?
          <NoData tip='没有相关商品'/>:null
        }
        <View className='pad_tb_30'>
          {
            this.state.goodsList.map((goods, index) => {
              return (
                <View className='item_con' key={index + '_' + goods.id} >
                  <View className='pad_tb_20 flex-lr  item_goods_wrap' key={goods.id} >
                    <Image src={goods.img} className='goods_img' onClick={this.navTo.bind(this, goods.id, goods.goods_extend_list[0].count)}></Image>
                    <View className='item_goods'>
                      <View onClick={this.navTo.bind(this, goods.id, goods.goods_extend_list[0].count)}>
                        <Text className='f-28 color-3' >{goods.goods_extend_list[0].title}</Text>
                        <Text className='f-22 color-9' >月售{goods.total_volume}</Text>
                        <Text className='f-22 color-9' >销售时间：{goods.place_order_time}</Text>
                      </View>
                      <View className='flex-lr flex-center mar-t-10'>
                        <Text className='f-30 color-red'>￥{goods.goods_extend_list[0].price}</Text>
                        <JInputNumber value={goods.goods_extend_list[0].count} isHidden={true} extra={[index, 0, goods.goods_extend_list[0].carId]} changeNumber={this.changeNumber} />
                      </View>
                    </View>
                  </View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}
