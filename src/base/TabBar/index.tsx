import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import { connect } from '@tarojs/redux'
import ShoppingCarApi from '../../apis/shoppingCar'
import { SetCountCar } from '../../store/actions'


const list: any[] = [
    {
        "pagePath": "/pages/index/index",
        "iconPath": require("../../assets/img/icon-index.png"),
        "selectedIconPath": require("../../assets/img/icon-index2.png"),
        "text": "首页"
    }, {
        "pagePath": "/pages/shoppingCar/index",
        "iconPath": require("../../assets/img/icon-car.png"),
        "selectedIconPath": require("../../assets/img/icon-car2.png"),
        "text": "购物车",
        'extra': true
    }, {
        "pagePath": "/pages/activity/index",
        "iconPath": require("../../assets/img/icon-activity.png"),
        "selectedIconPath": require("../../assets/img/icon-activity2.png"),
        "text": "活动"
    }, {
        "pagePath": "/pages/mine/index",
        "iconPath": require("../../assets/img/icon-mine.png"),
        "selectedIconPath": require("../../assets/img/icon-mine2.png"),
        "text": "我的"
    }
]

type PropsDispatchType = {
    countCar: number,
    tab: number,
    setCountCar: (num: number) => any,

}
type PropsType = {
    index?:number,
    path?: string
}
type IProps = PropsDispatchType & PropsType
@connect(({ reducer }) => ({
    countCar: reducer.countCar,
    tab: reducer.tab
}), (dispatch) => ({
    setCountCar(num: number) {
        dispatch(SetCountCar(num))
    },


}))
class TabBar extends Component<IProps, {}> {
    switchTab(url) {
        Taro.switchTab({
            url
        })
    }
    render() {
        return (
            <View className='tabbar'>
                {
                    list.map((el, i) => {
                        return (
                            <View className={this.props.index == i ? 'item on' : 'item'} onClick={this.switchTab.bind(this, el.pagePath)} key={i}>
                                <Image src={this.props.index == i ? el.selectedIconPath : el.iconPath} mode='aspectFit'></Image>
                                <Text>{el.text}</Text>
                                {
                                    el.extra && this.props.countCar > 0 ? <View className='dot_count'>{this.props.countCar}</View> : null
                                }
                            </View>
                        )
                    })
                }
            </View>
        );
    }
}

export default TabBar;