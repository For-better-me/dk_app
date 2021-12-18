import Taro, { Component, Config } from '@tarojs/taro'
// import Index from './pages/index'
import 'taro-ui/dist/style/index.scss'
import './app.scss'
import { Provider } from '@tarojs/redux'
import configStore from './store'
const store = configStore()
import ShoppingCarApi from './apis/shoppingCar'
import UserApi from './apis/user'
import JTabBar from './base/TabBar'

type PropsType = {
  countCar: number,
  setCountCar: (num: number) => any
}


class App extends Component<PropsType, {}> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    "permission": {
      "scope.userLocation": {
        "desc": "请确认授权"
      }
    },
    pages: [
      'pages/index/index',
      'pages/address/index',
      'pages/search/index',
      'pages/couponList/index',
      'pages/activity/index',
      'pages/login/index',
      'pages/mine/index',
      'pages/aboutUs/index',
      'pages/submitOrder/index',
      'pages/integralList/index',
      'pages/shoppingCar/index',
      'pages/goodsDetail/index',
      'pages/integral/index',
      'pages/balanceList/index',
      'pages/balance/index',
      'pages/orderDetail/index',
      'pages/orderMy/index',
      'pages/pay/index',
      'pages/addressEdit/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '每味十足',
      navigationBarTextStyle: 'black',
    },
    tabBar: {
      "backgroundColor": "#fff",
      "borderStyle": "black",
      "selectedColor": "#10E6AC",
      "color": "#333",
      "list": [
        {
          "pagePath": "pages/index/index",
          "iconPath": "./assets/img/icon-index.png",
          "selectedIconPath": "./assets/img/icon-index.png",
          "text": "首页"
        }, {
          "pagePath": "pages/shoppingCar/index",
          "iconPath": "./assets/img/icon-car.png",
          "selectedIconPath": "./assets/img/icon-car.png",
          "text": "购物车"
        }, {
          "pagePath": "pages/activity/index",
          "iconPath": "./assets/img/icon-activity.png",
          "selectedIconPath": "./assets/img/icon-activity.png",
          "text": "活动"
        }, {
          "pagePath": "pages/mine/index",
          "iconPath": "./assets/img/icon-mine.png",
          "selectedIconPath": "./assets/img/icon-mine.png",
          "text": "我的"
        }
      ]
    },
  }
  componentWillMount() {
    console.log('app is componentWillMount');
    Taro.hideTabBar()
    
  }
  componentDidShow() {
    console.log('app is componentDidShow');
    Taro.hideTabBar()
    if (!Taro.getStorageSync('token')) {
      Taro.navigateTo({ url: '/pages/login/index' })
    }
  }

  componentDidMount() {
    console.log('app is componentDidMount');
    this.getCarLen()
  }
  getCarLen() {
    ShoppingCarApi.shoppingCarList().then(data => {
      store.dispatch({
        type: 'CARCOUNT',
        countCar: data.goods_list.length
      })
    })
  }

  componentWillUnmount(){
    console.log('componentWillUnmount');
    
  }
  componentDidHide() {
    console.log('componentDidHide');
  }

  componentDidCatchError() {
    console.log('componentDidCatchError');
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    console.log('render is running');
    return (
      <Provider store={store}>
        {this.props.children}
        {/* <JTabBar /> */}
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
