import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import IconOverdue from '../../assets/img/icon-overdue.png'
import HB from '../../assets/img/hb.png'
import DJ from '../../assets/img/dj.png'
import './index.scss'
type Props = {
    coupon: any,
    isChoose?: boolean,
    choosedHandle?: (id: number) => void
}
class Coupon extends Component<Props> {
    chooseCoupon(id) {
        if (this.props.isChoose) {
            this.props.choosedHandle ? this.props.choosedHandle(id) : null
        }
    }

    render() {
        let { coupon } = { ...this.props }

        return (
            <View className='coupon' onClick={this.chooseCoupon.bind(this, coupon.user_coupon_id)} >
                <View className='coupon-img'>
                    <View className='tj'>
                        {
                            coupon.use_threshold == 2 ?
                                <Text>满{coupon.threshold_price}元使用</Text> :
                                <Text>无门槛</Text>
                        }
                    </View>
                    <View>
                        <View className='dot'>{coupon.coupon_type == 1 ? `￥` : `折`}</View>
                        <Text className='count'>{coupon.coupon_type == 1 ? `${coupon.avoid_price}` : `${coupon.avoid_price * 10}`}</Text>
                    </View>
                    <Image className='bg-img' src={HB}></Image>
                    <Image className='dj-img' src={DJ}></Image>
                </View>
                <View className='coupon-info'>
                    <Text className='f-30 color-3 price'>{coupon.coupon_type == 1 ? `${coupon.avoid_price}元红包` : `${coupon.avoid_price * 10}折`}</Text>
                    <Text className='f-26 color-9 mar-t-10 tip'>{coupon.suit_range == 1 ? '全部商品可用' : '指定商品可用'}</Text>
                    <Text className='f-26 color-9 time'>有效期至{coupon.expire_time}</Text>
                </View>
                {coupon.expire_status == 2 ? <Image className='icon-overdue' src={IconOverdue}></Image> : null}
            </View>
        );
    }
}

export default Coupon;