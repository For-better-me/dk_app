import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import IconOverdue from '../../assets/img/icon-overdue.png'
import './index.scss'
type Props = {
    coupon: any,
}
class Coupon extends Component<Props> {
    navTo(url: string) {
        Taro.navigateTo({ url })
    }
    render() {
        let { coupon } = { ...this.props }

        return (
            <View className='coupon' >
                <Image className='coupon-img' src={coupon.img}></Image>
                <View className='coupon-info'>
                    <Text className='f-30 color-3'>3元红包</Text>
                    <Text className='f-26 color-9 mar-t-10px'>部分特价商品不能使用</Text>
                    <Text className='f-26 color-9 time'>有效期至{coupon.expire_time}</Text>
                </View>
                {coupon.expire_status == 2 ? <Image className='icon-overdue' src={IconOverdue}></Image> : null}
            </View>
        );
    }
}

export default Coupon;