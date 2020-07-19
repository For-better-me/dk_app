import { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import './index.scss'
interface Props {
    value: number ,
    // disabled?: boolean,
    max?: number,
    min?: number,
    isHidden?: boolean,
    isZero?:boolean,
    extra?:any,
    changeNumber: (num: number,extra:any,type:string,event:any) => void,

}
class InputNumber extends Component<Props> {
    sub = (event) => {
        let { isZero = true, value = 0, min = 1,extra } = { ...this.props }
        if (isZero) {
            value = value > min ? value - 1 : 0
        }
        if (!isZero && value >= min) {
            value = value > min ? value - 1 : min
        }
        this.props.changeNumber(value,extra,'sub',event)

    }
    add = (event) => {
        let { max = 99, value, min = 1,extra } = { ...this.props }
        
        if (value == 0) {
            value = min>0?value + min:value+1
        } else if (value < max) {
            value = value + 1
        } else {
            return
        }
        this.props.changeNumber(value,extra,'add',event)
    }
    render() {
        let { value, isHidden = false } = { ...this.props }
        let flag
        if(isHidden){
            flag = value>0?true:false
        }else{
            flag = true
        }
        return (
            <View className='count'>
                {
                    
                    flag ?
                        (<View className='minus' onClick={this.sub}>-</View>) : null
                }
                {
                    flag ?
                        (<View className='f-28 color-3 num'>{value}</View>) : null
                }
                <View className='plus' onClick={this.add}>+</View>
            </View>
        );
    }
}

export default InputNumber;