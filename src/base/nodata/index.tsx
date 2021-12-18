import  { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import Img from '../../assets/img/no_data.png'
type Props = {
    tip:string
    imgSrc?:any,
}
class nodata extends Component<Props> {
    render() {
        return (
            <View className='no_data'>
                <Image src={this.props.imgSrc?this.props.imgSrc:Img} mode='widthFix'></Image>
                <Text className='f-30 color-9'>{this.props.tip}</Text>
            </View>
        );
    }
}

export default nodata;