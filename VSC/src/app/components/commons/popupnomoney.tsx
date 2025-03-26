import React from 'react';
import { View, StyleSheet, Text, Animated, TouchableOpacity, ScrollView, Modal } from 'react-native';
import CloseBtn from '../../../assets/images/btn-close.svg';
import { g } from '../../g';
import FastImage from 'react-native-fast-image';
import Config from 'react-native-config';

export class PopupNoMoney extends React.Component<{
    navigation: g.NavigationStackProp,
    visible: boolean,
    close: () => void,
}, {

}> {
    constructor(props: PopupNoMoney['props']) {
        super(props);
        this.state = {

        };
        this.current = this;

    }
    current: PopupNoMoney | null = null;

    private fadeAnim = new Animated.Value(1);

    fadeOut = () => {
        Animated.timing(this.fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }).start(({ finished }) => {
            /* completion callback */
            this.props.close();
            this.fadeAnim = new Animated.Value(1);
        });
    };


    render() {
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                statusBarTranslucent
                visible={this.props.visible}
                supportedOrientations={['portrait']}
            >
                <Animated.View style={{
                    width: '100%', height: '100%', position: 'absolute',
                    backgroundColor: "rgba(0,0,0,0.6)",
                    opacity: this.fadeAnim
                }}>
                    <TouchableOpacity onPress={() => {
                        g.sound.play('bet_click');
                        this.fadeOut();
                    }}
                        style={{ flex: 1 }}>
                        <View style={{ backgroundColor: this.props.visible ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.0)', width: '100%', height: '100%', position: 'absolute' }}>
                            <View style={{ backgroundColor: '#e1e0de', position: 'absolute', top: 262, left: 16, right: 16, borderRadius: 8 }}>
                                <FastImage source={{ uri: Config.API_ENTRY_POINT + 'assets/img/icon/icon-note.png' }} style={{ position:'absolute',top:-40, alignSelf:'center', width: 80, height: 80 }} />
                                <Text style={{ fontSize: 18, marginTop: 52, textAlign: 'center', fontFamily: 'Roboto-Bold', color: '#f27b11' }}>Bạn đã hết tiền !</Text>
                                <TouchableOpacity onPress={() => { g.sound.play('bet_click'); this.fadeOut(); this.props.navigation.navigate('AccountDeposit') }} 
                                style={{marginBottom:16, marginHorizontal: 16, backgroundColor: '#f27b11', marginTop: 32, borderRadius: 8, height: 44, width:163, justifyContent: 'center', alignSelf:'center' }}>
                                    <Text style={{ alignSelf: 'center', fontFamily: 'Roboto-Bold', color: '#FFFFFF', fontSize: 16 }}>NẠP TIỀN</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { g.sound.play('bet_click'); this.fadeOut() }} style={{ position: 'absolute', top: 16, right: 16 }}>
                                    <CloseBtn />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </Modal>
        )
    }
}

