import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Textarea, Image } from '@tarojs/components'
import IconChecked from '../../assets/img/icon-checked.png'
import './index.scss'
type Props = {
    deliveryType:number,
    deliveryTime:number,
    deliveryFast:number,
    deliveryTimeList: string[]
    switch: (type: number, desc:string,level:number,delivery_time?: string,delivery_time_index?:number) => void,
}
class Distribution extends Component<Props> {
    constructor(props) {
        super(props)
    }
    state = {
        delivery_type: 2,
        delivery_time: 0,
    }
    switchType(delivery_type, desc) {
        let delivery_time = delivery_type == 2 ? this.props.deliveryTimeList[this.props.deliveryTime] : ''
        this.props.switch(delivery_type, desc,1)
    }
    chooseHandle(index, time) {
        this.props.switch(3, '加急配送',2, '',0)
    }
    switchTime(index, time) {
        this.props.switch(2, '普通配送',2, time,index)
    }
    render() {
        // let deliveryTimeList = this.props.deliveryTimeList
        let { deliveryType, deliveryTime,deliveryTimeList,deliveryFast } = this.props
        return (
            <View className='distribution'>
                <View className='type'>
                    {/* <Text onClick={this.switchType.bind(this, 1, '到店自提')} className={deliveryType == 1 ? 'on' : ''}>到店自提 </Text> */}
                    <Text onClick={this.switchType.bind(this, 2, '普通配送')} className={deliveryType == 2 ? 'on' : ''}>普通配送 </Text>
                    <Text onClick={this.switchType.bind(this, 3, '加急配送')} className={deliveryType == 3 ? 'on' : ''}>加急配送</Text>
                </View>
                {/* <Text className='color_red'>配送费2元</Text> */}
                <View className='options'>
                    {
                        // deliveryType == 3 ? (<View className='options_item'> <Text className='on_item'>1小时内送达</Text></View>) : null
                        deliveryType == 3 ? (<View onClick={this.chooseHandle.bind(this, 0, '')} className={deliveryFast == 0 ? 'options_item on' : 'options_item'}> <Text>1小时内送达</Text> <Image src={IconChecked}></Image></View>) : null
                    }
                    {
                        deliveryType == 2 ?
                            (
                                deliveryTimeList.map((time, index) => {
                                    return <View onClick={this.switchTime.bind(this, index, time)} className={deliveryTime == index ? 'options_item on' : 'options_item'}> <Text>{time}</Text> <Image src={IconChecked}></Image></View>
                                })
                            ) : null
                    }
                    {/* {
                        deliveryType == 3 ? (<View className='options_item'> <Text className='on_item'>任何时间</Text></View>) : null
                    } */}
                </View>
            </View>
        );
    }
}

export default Distribution;