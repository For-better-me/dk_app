import  { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
type Props = {
    imgSrc:any,
    tip:String
}
class nodata extends Component<Props> {
    render() {
        return (
            <View className='no_data'>
                <Image src={this.props.imgSrc}></Image>
                <Text className='f-30 color-9'>{this.props.tip}</Text>
            </View>
        );
    }
}

export default nodata;