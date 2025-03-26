import * as React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import BtnLogin from '../../../assets/images/btn-login.svg';
import BtnRegister from '../../../assets/images/btn-register.svg';
import Bell from '../../../assets/images/header-bell.svg';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from "@react-native-community/masked-view";
import FastImage from 'react-native-fast-image';
import { g } from '../../g';
import Config from 'react-native-config';

const styles = StyleSheet.create({
    headerButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        //flex:3,
    },
})
const GradientText = (props: any) => {
    return (
        <MaskedView maskElement={<Text {...props} />}>
            <LinearGradient
                colors={["#FDF9C0", "#FCE07C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <Text {...props} style={[props.style, { opacity: 0 }]} />
            </LinearGradient>
        </MaskedView>
    );
};
// const handleGoNavigation = (navigation:string, data:any)=>()=>{
//     g.sound.play('bet_click'); data.navigation.navigate(navigation);
// }
const backgroundColorEvent = (level: string)=>{
    if(level.includes('Thanh Long'))
        return '#fff3dd';
    if(level.includes('Chu Tước'))
        return '#d5e7ff';
    if(level.includes('Bạch Hổ'))
        return '#ffe8df';
    return '#f1dff9';
}
const borderNumberColorEvent = (level: string)=>{
    if(level.includes('Thanh Long'))
        return '#ee9d00';
    if(level.includes('Chu Tước'))
        return '#157aff';
    if(level.includes('Bạch Hổ'))
        return '#ff6224';
    return '#7c05b4';
}

export function headerRight(data: any) {
    return (
        data?.user?.user?.username === ""
            ? <View style={styles.headerButton}>
                <TouchableOpacity onPress={() => { g.sound.play('bet_click'); data.navigation.navigate('LoginAndRegister', { data: 0 }) }}>
                    <BtnLogin width={86} height={28} style={{ marginRight: 15, marginTop: 12 }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { g.sound.play('bet_click'); data.navigation.navigate('LoginAndRegister', { data: 1 }) }}>
                    < BtnRegister width={86} height={28} style={{ marginRight: 8, marginTop: 12 }} />
                </TouchableOpacity>
            </View>
            : <View style={[styles.headerButton, { marginTop: 10 }]}>
                <TouchableOpacity onPress={() => { g.sound.play('bet_click'); data.navigation.navigate('Account') }} style={{ flexDirection: 'row' }}>
                    <View style={{ marginRight: 13 }}>
                        {/* <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 13, fontWeight: '500', color: '#3d434d' }}>{data?.user?.user?.level}</Text> */}
                        <View style={{ backgroundColor: backgroundColorEvent(data?.user?.user?.level), width: 73, height:16, borderRadius: 9, padding: 2 , borderColor:borderNumberColorEvent(data?.user?.user?.level), borderWidth: 1}}>
                            <View style={{ width: 14, height: 14, borderRadius: 16, backgroundColor: borderNumberColorEvent(data?.user?.user?.level), position: 'absolute', right: 0 }} />
                            <View style={{ flexDirection: 'row',justifyContent:'center' }}>
                                <Text numberOfLines={1} style={{ color: borderNumberColorEvent(data?.user?.user?.level), fontWeight: '600', fontSize: 10, fontFamily: 'Roboto-Medium',marginRight: 12, marginTop:-1 }}>{data?.user?.user?.level.substr(0, data?.user?.user?.level.length - 1)}</Text>
                                <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 10, fontFamily: 'Roboto-Medium', position: 'absolute', right: 1, top:-1 }}>{data?.user?.user?.level.substr(-1)}</Text>
                            </View>
                        </View>
                        <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 13, fontWeight: '500', color: '#3d434d', marginTop: 2 }}>{data?.user?.user?.fullname}</Text>
                        {/* <GradientText style={{ fontFamily: 'Roboto-Regular', fontSize: 13, fontWeight: '900', textAlign: 'right', marginTop: 3 }}>{g.fn.currencyFormatK(parseInt(data?.user?.user?.balance) || 0)} đ</GradientText> */}
                    </View>
                    {/* <Image source={require('../../../assets/images/header-avatar.png')} style={{ width: 32, height: 32, marginRight: 16 }} /> */}
                    <FastImage style={{ width: 32, height: 32, marginRight:24 }}
                        source={{ uri: Config.API_ENTRY_POINT + 'static-assets/assets/img/header/avatar-header.png' }}
                        resizeMode={FastImage.resizeMode.stretch} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { g.sound.play('bet_click'); data.navigation.navigate('Notification') }} style={{ marginLeft: -10, marginRight: 10, }}>
                    <Bell width={20} height={22} style={{ marginTop: 8 }} />
                    {g.value.notificationCount !== 0 && <View style={{ backgroundColor: '#a61d1d', width: 12, height: 12, borderRadius: 50, position: 'absolute', right: -2, top: 2, justifyContent: 'center' }}>
                        <Text style={{ color: '#FFF', fontFamily: 'Roboto-Bold', textAlign: 'center', fontSize: 8 }}>{g.value.notificationCount}</Text>
                    </View>}
                </TouchableOpacity>
            </View>
    )
}