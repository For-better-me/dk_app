import { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.scss'
type Props = {
    value: boolean,
    change: (value: boolean, extra: any) => void,
    extra?: any,
    disabled?: boolean
}
class Checkbox extends Component<Props> {
    changeCheck(val, extra) {
        if(this.props.disabled){
            return
        }
        this.props.change(val, extra)
    }
    render() {
        let { value, disabled, extra = null } = { ...this.props }
        let className = 'checkbox '
        if (disabled) {
            className = className + 'disabled '
        } else {
            className = value ? className + 'checked ' : className + 'uncheck '
        }
        return (
            <View className={className} onClick={this.changeCheck.bind(this, !value, extra)}>
                {value && !disabled ? <AtIcon value='check' size='14' color='#fff'></AtIcon> : null}
            </View>
        );
    }
}

export default Checkbox;