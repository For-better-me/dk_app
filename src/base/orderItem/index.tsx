import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView, Button } from '@tarojs/components'
import ImageCancel from '../../assets/img/bg-cancel.png'
import ImageIng from '../../assets/img/bg-ordering.png'
import ImageUnPay from '../../assets/img/bg-unpay.png'
import ImageOver from '../../assets/img/bg-over.png'
import img1 from '../../assets/img/1.png'
import './index.scss'
import '../../app.scss'
type Props = {
    orderInfo?: any,
}
class OrderItem extends Component<Props> {
    navTo(url: string) {
        Taro.navigateTo({ url })
    }
    render() {
        let { orderInfo } = { ...this.props }

        return (
            <View className='order_item'>
                <View className='order_flag'>
                    <Image src={ImageCancel} className='bg-img'></Image>
                    <Text>已取消</Text>
                </View>
                <View className='border_bottom f-26 color-3 align-r h_87 pad_lr_20'>订单号：23365555555596654465</View>
                <ScrollView className='goods_list' scroll-x="true" enable-flex>
                    <Image src={img1}></Image>
                    <Image src={img1}></Image>
                    <Image src={img1}></Image>
                    <Image src={img1}></Image>
                    <Image src={img1}></Image>
                    <Image src={img1}></Image>
                    <Image src={img1}></Image>
                </ScrollView>
                <View className='f-24 color-3 align-r pad_lr_20 price line-h-1.8'>
                    共1件商品 实付金额：<Text className='bold'>$34</Text>
                </View>
                <View className='align-r pad-20 border_top '>
                    <Button className='btn_mini_hollow'>删除订单</Button>
                    <Button className='btn_mini'>去支付</Button>
                </View>

            </View>
        );
    }
}

export default OrderItem;