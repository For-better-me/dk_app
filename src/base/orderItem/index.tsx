import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView, Button } from '@tarojs/components'
import ImageCancel from '../../assets/img/bg-cancel.png'
import ImageIng from '../../assets/img/bg-ordering.png'
import ImageUnPay from '../../assets/img/bg-unpay.png'
import ImageOver from '../../assets/img/bg-over.png'
import './index.scss'
import '../../app.scss'
import OrderApi from '../../apis/order'
type Props = {
    orderInfo: any,
    eventListener: (id: string, type: number) => void

}
class OrderItem extends Component<Props> {
    static defaultProps = {
        orderInfo: {
            total_price:0
        }
    } 
    navTo(url: string) {
        Taro.navigateTo({ url })
    }
    typeText(type) {
        let typeText = ''
        let img = ''
        switch (type) {
            case 10:
                typeText = '待支付'
                img = ImageUnPay
                break;
            case 20:
                typeText = '已支付'
                img = ImageIng
                break;
            case 30:
                typeText = '已取消'
                img = ImageCancel
                break;
            case 40:
                typeText = '已发货'
                img = ImageIng
                break;
            case 50:
                typeText = '已收货'
                img = ImageOver
                break;
            case 60:
                typeText = '已完成'
                img = ImageOver
                break;
            default:
                break;
        }
        return { typeText, img }
    }
    orderCancel(order_id) {
        let self = this
        Taro.showModal({
            title: '温馨提示',
            content: '确定要取消该订单吗？',
            success: function (res) {
                if (res.confirm) {
                    OrderApi.orderCancel({ order_id }).then(res => {
                        self.props.eventListener(order_id, 30)
                        Taro.showToast({ title: '取消成功' })
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }
    orderDel(order_id) {
        let self = this
        Taro.showModal({
            title: '温馨提示',
            content: '确定要删除该订单吗？',
            success: function (res) {
                if (res.confirm) {
                    OrderApi.orderDel({ order_id }).then(res => {
                        self.props.eventListener(order_id, 0)
                        Taro.showToast({ title: '删除成功' })
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }
    orderPay(sn, price) {
        Taro.navigateTo({
            url: '/pages/pay/index?sn=' + sn + '&&price=' + price

        })
    }
    orderDetail(id) {
        Taro.navigateTo({
            url: '/pages/orderDetail/index?id=' + id
        })
    }
    render() {
        let { orderInfo } = { ...this.props }
        let payPrice = (Number(orderInfo.total_price * 1000) + Number(orderInfo.freight* 1000))/1000

        return (
            <View className='order_item'>
                <View onClick={this.orderDetail.bind(this, orderInfo.id)}>
                    <View className='order_flag'>
                        <Image src={this.typeText(orderInfo.status).img} className='bg-img'></Image>
                        <Text>{this.typeText(orderInfo.status).typeText}</Text>
                    </View>
                    <View className='border_bottom f-26 color-3 align-r h_87 pad_lr_20'>订单号：{orderInfo.sn}</View>
                    <ScrollView className='goods_list' scroll-x="true" enable-flex>
                        {
                            orderInfo.order_goods.map(img => {
                                return <Image src={img} key={img}></Image>
                            })
                        }
                    </ScrollView>
                    <View className='f-24 color-3 align-r pad_lr_20 price line-h-1.8'>
                        共{orderInfo.total_number}件商品 实付金额：<Text className='bold'>￥{payPrice}</Text>
                    </View>
                </View>
                <View className='align-r pad-20 border_top '>
                    {
                        orderInfo.status == 30 || orderInfo.status == 50 || orderInfo.status == 60 ? <Button className='btn_mini_hollow' onClick={this.orderDel.bind(this, orderInfo.id)}>删除订单</Button> : null
                    }
                    {
                        orderInfo.status == 10 ?
                            <Button className='btn_mini_hollow' onClick={this.orderCancel.bind(this, orderInfo.id)}>取消订单</Button>
                            : null
                    }
                    {
                        orderInfo.status == 10 ?
                            <Button className='btn_mini mar-l-20' onClick={this.orderPay.bind(this, orderInfo.sn,payPrice)}>去支付</Button> : null
                    }

                </View>

            </View>
        );
    }
}

export default OrderItem;