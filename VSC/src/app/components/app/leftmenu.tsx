import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { g } from '../../g';

import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('screen').width;

export default class LeftMenu extends React.Component<{
    propsData: any,
    closeMenu: () => void,
}, {
    arrTop: string[],
    topIndex: number,
    arrText: number[];
}> {
    constructor(props: LeftMenu['props']) {
        super(props);
        this.state = {
            arrTop: ['HOT NHẤT', 'REWARDS', 'THỂ THAO', 'SÒNG BÀI', 'GAME NHANH', 'CỔNG GAME', 'BẮN CÁ'],
            topIndex: 0,
            arrText: [0, 0, 0, 0],
        };
    }

    checkAndGoESportLobby(type: string) {
        g.sound.play('bet_click');
        g.value.canPlay = g.fn.gotoLink(this.props, true, false);
        if (g.value.canPlay !== 'login') {
            g.api.getRealLinkESport(type).then(res => {
                if (res.data.status === 'OK') {
                    if (res.data?.data?.url) {
                        if (type === 'vsports')
                            g.value.currentGoToLink = res.data?.data?.url?.virtualsports;
                        else
                            g.value.currentGoToLink = res.data?.data?.url;
                        this.props.propsData.navigation.navigate('Webview');
                    }
                    //else
                    //showMessage({ message: 'Chưa có dữ liệu!', type: "warning", icon: { icon: "warning", position: "left" } });
                }
            })
        }
    }

    onClickItem(name: string, data: any) {
        g.sound.play('bet_click');
        this.props.closeMenu();
        if (name === 'THỂ THAO') this.props.propsData.navigation.navigate('Sport');
        if (name === 'LIVE CASINO') this.props.propsData.navigation.navigate('Casino');
        if (name === 'GAME BÀI') this.props.propsData.navigation.navigate('GameBai');
        if (name === 'LÔ ĐỀ') this.props.propsData.navigation.navigate('LoDe');
        if (name === 'KENO') this.props.propsData.navigation.navigate('QuickGames', { data: 1 });
        if (name === 'QUAY SỐ') this.props.propsData.navigation.navigate('QuickGames', { data: 3 });
        if (name === 'NUMBERS GAME') this.props.propsData.navigation.navigate('QuickGames', { data: 2 });
        if (name === 'VIRTUAL GAMES') this.props.propsData.navigation.navigate('QuickGames', { data: 5 });
        if (name === 'TABLE GAMES') this.props.propsData.navigation.navigate('QuickGames', { data: 4 });
        if (name === 'NỔ HŨ') this.props.propsData.navigation.navigate('CongGame', { data: 1 });
        if (name === 'SLOTS') this.props.propsData.navigation.navigate('CongGame', { data: 2 });
        if (name === 'INGAME') this.props.propsData.navigation.navigate('CongGame', { data: 3 });
        if (name === 'SPRIBE GAMES') this.props.propsData.navigation.navigate('CongGame', { data: 4 });
        if (name === 'CỜ ÚP') this.props.propsData.navigation.navigate('CongGame', { data: 5 });
        if (name === 'TRADING GAME') this.props.propsData.navigation.navigate('CongGame', { data: 6 });
        if (name === 'BẮN CÁ') this.props.propsData.navigation.navigate('BanCa', { data: 1 });
        if (name === 'BẮN MÁY BAY') this.props.propsData.navigation.navigate('BanCa', { data: 2 });
        if (name === 'E-SPORTS') this.checkAndGoESportLobby('');
        if (name === 'THỂ THAO ẢO') this.checkAndGoESportLobby('vsports');
    }

    render() {
        

        return (
            <SafeAreaView>
            <TouchableOpacity onPress={() => { this.props.closeMenu() }}  style={{ paddingTop:90}}>
                
                <TouchableOpacity style={{ backgroundColor: '#080247'  }} onPress={() => { this.props.closeMenu(); g.sound.play('bet_click'); this.props.propsData.navigation.navigate('LeftMenuTrungTamThongTin', { data: 1 }) }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 15 }}>
                        <Text numberOfLines={1} style={[styles.itemText3,{color:'#ffbc15'}]}>Trực Tiếp Bóng Đá</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ backgroundColor: '#080247'  }} onPress={() => { this.props.closeMenu(); g.sound.play('bet_click'); this.props.propsData.navigation.navigate('LeftMenuTrungTamThongTin', { data: 1 }) }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 15 }}>
                        <Text numberOfLines={1} style={styles.itemText3}>Bảng Tỉ Lệ Kèo</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ backgroundColor: '#080247' }} onPress={() => { this.props.closeMenu(); g.sound.play('bet_click'); this.props.propsData.navigation.navigate('LeftMenuTinTuc') }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 15 }}>
                        <Text numberOfLines={1} style={styles.itemText3}>Lịch Thi Đấu</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ backgroundColor: '#080247' }} onPress={() => { this.props.closeMenu(); g.sound.play('bet_click'); this.props.propsData.navigation.navigate('LeftMenuTrungTamThongTin', { data: 1 }) }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 15 }}>
                        <Text numberOfLines={1} style={styles.itemText3}>Kết Quả Bóng Đá</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ backgroundColor: '#080247',paddingBottom:16 }} onPress={() => { this.props.closeMenu(); g.sound.play('bet_click'); this.props.propsData.navigation.navigate('LeftMenuTinTuc') }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 15 }}>
                        <Text numberOfLines={1} style={styles.itemText3}>Soi Kèo</Text>
                    </View>
                </TouchableOpacity>
                <Text style={{backgroundColor: '#080247', color: 'rgba(255, 187, 23, 1)', fontSize: 10, paddingLeft:16 }}>V 1.250324</Text>
            </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFDFD',
    },
    item: {
        flex: 1, height: 84, backgroundColor: '#FFF', shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 8,
        justifyContent: 'center',
    },
    itemText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        fontWeight: '500',
        color: '#141414',
        textAlign: 'center',
        marginTop: 8
    },
    itemText3: {
        width: '95%',
        marginTop: 16,
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        fontWeight:'800',
        color: '#FFF'
    },
    arrow: {
        marginRight: 16,
        marginTop: 20,
    }
});
