import React from 'react';
import {
    View, Image, Text, Alert,
    SafeAreaView,
    TouchableOpacity,
    Modal,
    Animated, StyleSheet, Platform, Dimensions,
    NativeModules, BackHandler
} from 'react-native';
import {
    WebView
} from 'react-native-webview';
import { g } from '../../g';
import LottieView from 'lottie-react-native';

// import BtnAccountBack from '../../../assets/images/account-back.svg';
// import WebviewCancel from '../../../assets/images/webview-cancel.svg';
// import WebviewDeposit from '../../../assets/images/webview-deposit.svg';

import Draggable from 'react-native-draggable';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from "@react-native-community/masked-view";
import BackBtn from '../../../assets/images/back-btn.svg';
//import Slider from '@react-native-community/slider';
import { showMessage, hideMessage } from "react-native-flash-message";
import Config from 'react-native-config';

const { NativeModule } = NativeModules;

let screenWidth = Dimensions.get('screen').width;
let screenHeight = Dimensions.get('screen').height;

const GradientText = (props: any) => {
    return (
        <MaskedView maskElement={<Text {...props} />}>
            <LinearGradient
                colors={["#FFFBAE", "#EAA50D"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <Text {...props} style={[props.style, { opacity: 0 }]} />
            </LinearGradient>
        </MaskedView>
    );
};

export default class Webview extends React.Component<{
    navigation: g.NavigationStackProp,
    user: any,
    userTransfer: any,
}, {
    floatingVisible: boolean;
    btnPosition: any,
    modalVisible: boolean,
    localBalance: number,
    isLoading: boolean,
}> {
    constructor(props: Webview['props']) {
        super(props);
        this.state = {
            floatingVisible: false,
            btnPosition: 'right',
            modalVisible: false,
            localBalance: this.props.user?.user?.balance,
            isLoading: true,
        };
        if (g.value.isLandscape && !g.value.isContact && g.value.is_native_lib) {
            //let time = setInterval(() => {
            NativeModule.setOrientation("landscape");
            //    clearInterval(time);
            //}, 100)

        }
        this.androidButtonBack = this.androidButtonBack.bind(this);
    }

    //using for ESport
    // checkAndGoLinkESport(str_type: string) {
    //     g.value.canPlay = g.fn.gotoLink(this.props);
    //     if (g.value.canPlay !== 'login') {
    //         g.api.getRealLinkESport(str_type).then(res => {
    //             if (res.data.status === 'OK') {
    //                 if (res.data?.data?.url) {
    //                     g.value.currentGoToLink = res.data?.data?.url;
    //                     this.props.navigation.navigate('Webview');
    //                 }
    //                 else {
    //                     showMessage({
    //                         message: 'Chưa có dữ liệu!',
    //                         type: "warning",
    //                         icon: { icon: "warning", position: "left" }
    //                     });
    //                 }
    //             }
    //         })
    //     }
    // }

    fadeOut = (exit: boolean) => {
        Animated.timing(this.fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }).start(({ finished }) => {
            /* completion callback */
            this.setState({ modalVisible: false });
            this.fadeAnim = new Animated.Value(1);

            // if (exit)
            //     this.props.navigation.goBack();
        });;
    }

    componentDidMount() {
        let a = setInterval(() => {
            if (g.value.currentGoToLink !== '') {
                this.setState({ isLoading: false });
                clearInterval(a);
            }
        }, 50)

        g.value.isUsingWebViewOrNativeGame = true;
        if (Platform.OS === 'android')
            BackHandler.addEventListener("hardwareBackPress", this.androidButtonBack);
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener("hardwareBackPress", this.androidButtonBack);
            //this.actionGoBack();
        }
        g.sound.playLoop();
    }

    androidButtonBack() {
        this.props.navigation.goBack();
        this.actionGoBack();
        return true;
    }

    actionGoBack() {
        this.setState({ isLoading: true });
        g.value.isContact = false;

        let a = setInterval(() => {
            g.value.isUsingWebViewOrNativeGame = false;
            if (g.value.is_native_lib)
                NativeModule.setOrientation("portrait");
            this.props.navigation.goBack();
            g.value.isLandscape = false;
            clearInterval(a);
        }, 600)
    }
    private fadeAnim = new Animated.Value(1);

    checkAndCall(value: number) {
        let temp = value - this.props.user.user?.balance;
        if (temp > 0) {
            this.props?.userTransfer(temp, 'DEPOSIT');
        }
        if (temp < 0) {
            this.props?.userTransfer(-temp, 'WITHDRAW');
        }
    }

    runFirstStr() {
        if ((g.value.currentGoToLink === Config.API_ENTRY_POINT + 'event/sea-game')) {
            return `
            //setTimeout(function() { window.alert(document.querySelectorAll("img.img-supporter")[1] ) }, 500);
                document.querySelectorAll("header")[0].style.display = "none";
                document.querySelectorAll("div.menu-bottom")[0].style.display = "none";
                document.querySelectorAll("img.img-supporter")[0].outerHTML = '<a href="ASPORTS"><img src="https://lucky88.tv//assets/images/components/mobile/pages/event/sea-game/a-sports.webp"/></a>';
                document.querySelectorAll("img.img-supporter")[0].outerHTML = '<a href="KSPORTS"><img src="https://lucky88.tv//assets/images/components/mobile/pages/event/sea-game/k-sports.webp"/></a>';
    
                // if not found will stop
                document.querySelectorAll("div.not-login")[0].style.display = "none";
                document.querySelectorAll("div.not-login")[1].style.display = "none";
                true; // note: this is required, or you'll sometimes get silent failures
              `
        }
        if ((g.value.currentGoToLink === Config.API_ENTRY_POINT + 'event-jackpot')) {
            return `
                document.querySelectorAll("div.saleoff-header")[0].style.display = "none";    
                document.querySelectorAll("div.event__cta")[0].outerHTML = '<div><a style="padding:15px;background-color: #17a2b8; border-radius:16px" href="event-jackpot-game"><text style="color:#fff">Chơi ngay<text></a><a style="margin-left:16px;padding:15px;background-color: #cb2f3f; border-radius:16px" href="account"><text style="color:#fff">Nạp ngay</text></a></div>';
                //document.querySelectorAll("div.event__cta")[0].style.display = "none"; 
                true; // note: this is required, or you'll sometimes get silent failures
              `
        }
        if ((g.value.currentGoToLink === Config.API_ENTRY_POINT + 'event/refer-friends')) {
            return `
            //document.querySelectorAll("header")[0].style.display = "none";
                document.querySelectorAll("div.menu-bottom")[0].style.display = "none";
                
                true; // note: this is required, or you'll sometimes get silent failures
              `
        }
        //        ||g.value.currentGoToLink === Config.API_ENTRY_POINT + 'event/refer-friends'
        if (g.value.currentGoToLink === Config.API_ENTRY_POINT + 'saleoff/detail/saleoff-100k'
            || g.value.currentGoToLink === Config.API_ENTRY_POINT + 'saleoff/detail/saleoff-3'
            || g.value.currentGoToLink === Config.API_ENTRY_POINT + 'saleoff/detail/saleoff-20'
            || g.value.currentGoToLink === Config.API_ENTRY_POINT + 'saleoff/detail/saleoff-30'
            || g.value.currentGoToLink === Config.API_ENTRY_POINT + 'event-12-12'
            || g.value.currentGoToLink === Config.API_ENTRY_POINT + 'event-11-11') {
            return `
                document.querySelectorAll("div.saleoff-header")[0].style.display = "none";    
                document.querySelectorAll("div.text-center.mt-2")[0].style.display = "none";    
                true;
              `
        }

        return '';
    }
    WEBVIEW_REF: any;

    render() {
        let runFirst = this.runFirstStr();
        let loadingView = (<LinearGradient
            colors={["#001C46", "#0070C0"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{ position: 'absolute', height: '100%', width: '100%', justifyContent: 'center' }}
        >
            <Image source={require('../../../assets/images/bg-login-image.png')} style={{ alignSelf: 'center' }} />

        </LinearGradient>);

        let userData = this.props?.user?.user;

        return this.state.isLoading ? loadingView
            : <View style={{
                flex: 1
            }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: g.value.isContact ? '#FFF' : '#000' }}></SafeAreaView>
                {g.value.isContact &&
                <LinearGradient colors={["#036DA4", "#054E82"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: 58, flexDirection: 'row', justifyContent: 'space-between' }}>

                        <View style={{ flex: 1, marginLeft: 16, alignSelf: 'center' }}>
                            <TouchableOpacity onPress={() => {
                                g.sound.play('bet_click');
                                g.value.isContact = false;
                                this.props.navigation.goBack();
                            }} style={{ paddingVertical: 16 }}>
                                <BackBtn />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 10, justifyContent:'center'}}>
                            <Text style={{ alignSelf: 'center', fontSize: 16, fontFamily: 'Roboto-Bold', color: '#FFF' }}>CHAT NGAY</Text>
                        </View>
                        <View style={{ flex: 1 }}></View>

                    </LinearGradient>
                }

                <WebView
                    originWhitelist={['*']}

                    //mediaPlaybackRequiresUserAction={true}
                    allowsInlineMediaPlayback={true}


                    injectedJavaScript={runFirst}
                    //injectedJavaScriptBeforeContentLoaded={runFirst}

                    onMessage={(event) => {
                        console.log('message:' + event);
                    }}
                    //ref={() => {}}

                    source={{
                        uri: g.value.currentGoToLink,
                    }}
                    style={{
                        flex: 1
                    }}

                    startInLoadingState={true}
                    renderLoading={() =>
                        loadingView
                    }
                    onLoad={() => {
                        this.setState({ floatingVisible: true, isLoading: false });
                        if (!g.value.isContact)
                            g.sound.stop();

                    }} //finished loading

                    onNavigationStateChange={(webViewState: any) => {
                        //console.log(webViewState);

                        // event-sea-game
                        if (webViewState.url === Config.API_ENTRY_POINT + 'event/ASPORTS') {
                            // this.checkAndGoLinkESport('csports');
                        }
                        if (webViewState.url === Config.API_ENTRY_POINT + 'event/KSPORTS') {
                            //this.checkAndGoLinkESport('ksports');
                        }

                        //event-jackpot-game
                        if (webViewState.url === Config.API_ENTRY_POINT + 'event-jackpot-game') {
                            if (this.props.user.user.username !== '')
                                g.fn.checkAndGoLink("/gameUrl?partnerProvider=vingame&partnerGameId=kts9922", true, false, this.props)
                            else
                                this.props.navigation.navigate('Login');
                        }

                        if (webViewState.url === Config.API_ENTRY_POINT && g.value.isUsingWebViewOrNativeGame || webViewState.url === 'about:blank') {
                            if ((g.value.currentGoToLink === Config.API_ENTRY_POINT + 'event/sea-game'))
                                this.props.navigation.navigate('Sport');
                            else
                                this.actionGoBack();
                            //this.props.navigation.goBack();
                            g.sound.play('bet_click');
                        }

                        if (webViewState.url === Config.API_ENTRY_POINT + 'account/user/profile') {
                            this.props.navigation.goBack();
                            this.props.navigation.navigate('AccountPersonal');
                        }
                        if (webViewState.url === Config.API_ENTRY_POINT + 'account/deposit/bank' || webViewState.url === Config.API_ENTRY_POINT + 'account/deposit' || webViewState.url === Config.API_ENTRY_POINT + 'account/deposit/codepay') {
                            this.props.navigation.goBack();
                            this.props.navigation.navigate('AccountDeposit');
                        }
                        if (webViewState.url === Config.API_ENTRY_POINT + 'account/user/bank') {
                            this.props.navigation.goBack();
                            this.props.navigation.navigate('AccountBank');
                        }

                        if (webViewState.url === Config.API_ENTRY_POINT + 'sports') {
                            this.props.navigation.navigate('Sport');
                        }
                        if (webViewState.url === Config.API_ENTRY_POINT + 'lobby') {
                            this.props.navigation.navigate('Game');
                        }
                        if (webViewState.url === Config.API_ENTRY_POINT + 'lobby?type=slots-game&ncc=habanero') {
                            this.props.navigation.goBack();
                            g.value.congGameName === 'SLOTS';
                            this.props.navigation.navigate('CongGameDetail');
                        }
                        if (webViewState.url === Config.API_ENTRY_POINT + 'lobby?type=quay-so') {
                            this.props.navigation.goBack();
                            g.value.congGameName === 'QUAY SỐ';
                            this.props.navigation.navigate('CongGameDetail');
                        }
                        if (webViewState.url === Config.API_ENTRY_POINT + 'game-bai') {
                            this.props.navigation.navigate('CardGame');
                        }
                        if (webViewState.url === Config.API_ENTRY_POINT + 'livecasino') {
                            this.props.navigation.navigate('LiveCasino');
                        }
                        if (webViewState.url === Config.API_ENTRY_POINT + 'account') {
                            this.props.navigation.goBack();
                            if (this.props.user.user.username !== '')
                                this.props.navigation.navigate('Account');
                            else
                                this.props.navigation.navigate('Login');
                        }
                    }
                    }

                    // setSupportMultipleWindows = {true}
                    // incognito={false}
                    // cacheEnabled={false}
                    // nestedScrollEnabled={true}
                    // contentMode={'mobile'}
                    // javaScriptEnabled={false}

                    sharedCookiesEnabled={true}

                    // onShouldStartLoadWithRequest={(request) => {
                    //     if (request.url === 'https://vars.hotjar.com/box-4924254a9ce4dc9b959b6e4a9b662d60.html') {
                    //         console.log(request.url);
                    //         Alert.alert('aaa');
                    //         return false;
                    //     }
                    //     //console.log(request);
                    //     return true;
                    // }}

                    //memory leak fix little
                    useWebkit={true}
                />

                {!g.value.isContact && this.state.floatingVisible && <Draggable
                    imageSource={require('../../../assets/images/88.png')}
                    renderSize={48}
                    x={g.value.isLandscape ? (Platform.OS === 'android' ? Dimensions.get('screen').height : Dimensions.get('screen').width) - 160 : (screenWidth - 60)}
                    y={60}
                    minX={20}
                    minY={20}
                    maxX={g.value.isLandscape ? Platform.OS === 'android' ? Dimensions.get('screen').height : Dimensions.get('screen').width - 20 : screenWidth - 20}
                    maxY={g.value.isLandscape ? Platform.OS === 'android' ? Dimensions.get('screen').width : Dimensions.get('screen').height - 20 : screenHeight - 20}
                    onShortPressRelease={() => {
                        g.sound.play('bet_click');
                        this.setState({ modalVisible: true });
                    }}
                />
                }

                <Modal
                    animationType='fade'
                    transparent={true}
                    statusBarTranslucent
                    visible={this.state.modalVisible}
                    supportedOrientations={[g.value.isLandscape ? 'landscape' : 'portrait']}
                >

                    <Animated.View style={{ opacity: this.fadeAnim, backgroundColor: `rgba(0, 0, 0, 0.2)`, width: '100%', height: '100%', position: 'absolute', }}>
                        <TouchableOpacity onPress={() => {
                            g.sound.play('bet_click');
                            this.fadeOut(false);
                        }}
                            style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ height: 168, width: 300, alignSelf: 'center', backgroundColor: '#FFF', borderRadius: 16 }}>
                                {/* <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0 }}>
                                </TouchableOpacity> */}
                                <View style={{ flexDirection: 'row', marginHorizontal: 16, marginTop: 32 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#EDEDED', height: 44, borderRadius: 8 }}>
                                        <Text style={{ color: '#033254', fontSize: 14, fontFamily: 'Roboto-Bold', textAlign: 'center', alignSelf: 'center' }}>SỐ DƯ:</Text>
                                        <Text adjustsFontSizeToFit numberOfLines={1} style={{ color: '#721111', marginTop: 10, marginLeft: 2, fontFamily: 'Roboto-Bold', fontSize: 18, width: 75 }} >
                                            {g.fn.currencyFormatK(this.props.user.user.balance)} đ
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={{ width: 120, height: 44, backgroundColor: '#d62828', borderRadius: 8, justifyContent: 'center' }} onPress={() => {
                                        g.sound.play('bet_click');
                                        this.setState({ modalVisible: false });
                                        let interval = setInterval(() => {
                                            this.props.navigation.navigate('AccountDeposit', { fromWebView: true });
                                            clearInterval(interval);
                                        }, Platform.OS === 'ios' && g.value.isLandscape ? 600 : 0)
                                    }}>
                                        <Text style={{ color: '#FFF', fontSize: 14, fontFamily: 'Roboto-Medium', textAlign: 'center' }} >NẠP TIỀN</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={{ marginTop: 24, justifyContent: 'center', alignSelf: 'center', backgroundColor: '#e0e0e0', width: 163, height: 44, borderRadius: 8 }}
                                    onPress={() => {
                                        this.fadeOut(true);
                                        g.sound.play('bet_click');
                                        this.actionGoBack();
                                        //this.props.navigation.goBack();
                                    }}>
                                    <Text style={{ color: '#033254', fontSize: 14, fontFamily: 'Roboto-Medium', textAlign: 'center' }} >THOÁT GAME</Text>
                                </TouchableOpacity>

                            </View>
                        </TouchableOpacity>
                    </Animated.View>

                </Modal>

            </View>
    }

    static option() {
        return {
            headerTransparent: false
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0C1F31',
    },
    smallText: {
        color: '#8CA3BA',
        fontSize: 14,
        fontFamily: 'SFProDisplay-Regular',
        textAlign: 'center'
    }
})