import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Textarea, Image } from '@tarojs/components'
import IconChecked from '../../assets/img/icon-checked.png'
import './index.scss'
class Distribution extends Component {
    render() {
        return (
            <View className='distribution'>
                <View className='type'>
                    <Text>到店自提 </Text>
                    <Text className='on'>普通配送 </Text>
                    <Text>加急配送</Text>
                </View>
                <View className='options'>
                    <View className='options_item'> <Text>11:00 - 12:00</Text> <Image src={IconChecked}></Image></View>
                    <View className='options_item on'> <Text>11:00 - 12:00</Text> <Image src={IconChecked}></Image></View>
                    <View className='options_item'> <Text>11:00 - 12:00</Text> <Image src={IconChecked}></Image></View>
                    <View className='options_item'> <Text>11:00 - 12:00</Text> <Image src={IconChecked}></Image></View>
                    <View className='options_item'> <Text>11:00 - 12:00</Text> <Image src={IconChecked}></Image></View>
                    <View className='options_item'> <Text>11:00 - 12:00</Text> <Image src={IconChecked}></Image></View>
                    <View className='options_item'> <Text>11:00 - 12:00</Text> <Image src={IconChecked}></Image></View>
                    <View className='options_item'> <Text>11:00 - 12:00</Text> <Image src={IconChecked}></Image></View>
                    <View className='options_item'> <Text>11:00 - 12:00</Text> <Image src={IconChecked}></Image></View>
                    <View className='options_item'> <Text>11:00 - 12:00</Text> <Image src={IconChecked}></Image></View>
                    <View className='options_item'> <Text>11:00 - 12:00</Text> <Image src={IconChecked}></Image></View>
                    <View className='options_item'> <Text>11:00 - 12:00</Text> <Image src={IconChecked}></Image></View>
                </View>
            </View>
        );
    }
}

export default Distribution;