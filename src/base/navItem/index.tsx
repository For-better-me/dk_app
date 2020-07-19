import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.scss'
type Props = {
    icon: any,
    url: string,
    title?: string,
}
class NavItem extends Component<Props> {
    navTo(url: string) {
        Taro.navigateTo({ url })
    }
    render() {
        let { icon, url, title } = { ...this.props }

        return (
            <View className='nav_item' onClick={this.navTo.bind(this, url)}>
                <View className='flex-center'>
                    <Image className='nav-icon' src={icon}></Image>
                    <Text className='f-30 color-3 mar-l-20'>{title}</Text>
                </View>
                <AtIcon value='chevron-right' size='20' color='#999'></AtIcon>
            </View>
        );
    }
}

export default NavItem;