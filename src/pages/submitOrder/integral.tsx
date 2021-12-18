import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Textarea, Image } from '@tarojs/components'
import JInputNumber from '../../base/InputNumber'
import './index.scss'
type Props = {
    integralNum: number
    integralInfo: any
    change: (num: number, price: number,integral:number) => void,
}
class IntegralComp extends Component<Props> {
    constructor(props) {
        super(props)
    }
    static defaultProps = {
        integralInfo: {
            max_current_integral:0,
            integral_scale:100
        }
    } 
    state = {
        // integral: 0,
        // price: 0,
        // value: 0
    }
   
    changeIngetral = (num) => {
        let integralInfo: any = this.props.integralInfo
        let integral = num * integralInfo.integral_scale
        let price = integral / integralInfo.integral_use_price
       
        this.props.change(num, price,integral)
    }
    render() {
        let integralInfo: any = this.props.integralInfo
        let num = this.props.integralNum
        let integral = num * integralInfo.integral_scale
        let price = integral / integralInfo.integral_use_price
        let min = 0
        let max = Math.floor(integralInfo.max_current_integral / integralInfo.integral_scale)
        console.log(max);
        
        return (
            <View className='integral_wrap f-30 color-3'>
                <View className='pad_tb_20'><Text>当前积分：{integralInfo.current_integral}</Text><Text className='mar-l-10'>当前可用积分：{integralInfo.max_current_integral}</Text></View>
                <View className='flex pad_tb_20'>
                    <View>积分抵扣数量</View>
                    <JInputNumber min={min} max={max} value={num} changeNumber={this.changeIngetral} />
                </View>
                <View className='flex pad_tb_20'>
                    <View>{integral}积分</View>
                    <View>抵现金：<Text className='color-red'>￥{price}</Text></View>
                </View>
                <View className='flex pad_tb_20'>
                    <View></View>
                    <View>抵扣后剩余积分：{integralInfo.current_integral - integral}</View>
                </View>
            </View>
        );
    }
}

export default IntegralComp;