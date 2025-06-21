import 'react-native-gesture-handler';

import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  //NativeModules,
  //DeviceEventEmitter,
  //NativeEventEmitter
} from 'react-native';
import WithComponentHooks from "with-component-hooks";
import MatomoTracker, { MatomoProvider, useMatomo } from 'matomo-tracker-react-native';

import NoInternet from '../assets/images/no-internet.svg';
import NoInternetUnion from '../assets/images/no-internet-union.svg';

import * as Progress from 'react-native-progress';
import FlashMessage from "react-native-flash-message";
import LinearGradient from 'react-native-linear-gradient';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { configureStore } from './functionals/store';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import LottieView from 'lottie-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AppPage from '../app/containers/app/app';

import Webview from '../app/containers/app/webview';
import {
    WebView
} from 'react-native-webview';
import Livematch from './components/app/livematch';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosRequestConfig } from 'axios';
import { g } from './g';
import { CarPlay, GridTemplate, MapTemplate } from 'react-native-carplay';

//const { NativeModule } = NativeModules;
//const eventEmitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModule) : DeviceEventEmitter;

const onCloseCCGame = (event: any) => {
  //console.log("James log onCloseCCGame" + JSON.stringify(event));
  //NativeModule.setOrientation("portrait");
  g.value.isUsingWebViewOrNativeGame = false;
  g.value.isLandscape = false;

  //console.log(event.user_bg_music);
  // if(event.user_bg_music === "1" || event.user_bg_music === "true"){
  //   g.storage.soundBG = true;
  //   g.sound.playLoop();
  // }else{
  //   g.storage.soundBG = false;
  // }

  // if(event.user_fx_sound === "1" || event.user_fx_sound === "true"){
  //   g.sound.play('bet_click');
  //   g.storage.soundFX = true;
  // }else{
  //   g.storage.soundFX = false;
  // }

}

const templateRoot = new GridTemplate({
  title: 'Hello, World',
  buttons: [],
});

let cv = ()=>{return <View style={{flex:1, backgroundColor:'red'}}>
  <WebView
    originWhitelist={['*']}
    source={{
        uri: 'https://youtube.com/embed/Gjmi8t-B5v4?autoplay=1&mute=0&showinfo=0&controls=1&fullscreen=1',
    }}
    allowsFullscreenVideo={true}
    javaScriptEnabled={true}
    scrollEnabled={false}
    allowsInlineMediaPlayback={true}/>
    
   {/* <WebView
    style={{flex:1}}
    javaScriptEnabled={true}
    scrollEnabled={false}
    allowsFullscreenVideo={true}
    userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 
    (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
    source={{uri: `https://www.youtube.com/embed/Gjmi8t-B5v4?&autoplay=1&mute=1&showinfo=0&controls=1&fullscreen=1`}} 
/> */}
    </View>};
const templateMap = new MapTemplate({
  component: /* react native view */ cv,
});
//CarPlay.setRootTemplate(templateRoot);

enableScreens();
const store = configureStore();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const instance = new MatomoTracker({
  urlBase: 'https://analytics-s4.com', // required
  // trackerUrl: 'https://LINK.TO.DOMAIN/tracking.php', // optional, default value: `${urlBase}matomo.php`
  siteId: 8, // required, number matching your Matomo project
  userId: 'UID76903202_Pirlo', // optional, default value: `undefined`.
  // disabled: false, // optional, default value: false. Disables all tracking operations if set to true.
  log: true  // optional, default value: false. Enables some logs if set to true.
});

class App extends Component<{
  //pros
}, {
  //state
  restartAllowed: boolean,
  syncMessage: string,
  progress: boolean | {
    receivedBytes: number,
    totalBytes: number
  },
  hasInternet: boolean,
  gotoMain: boolean,
  introLoaded: boolean,
  showIntroLoop: boolean,
  renderApp: boolean,
  isShowingDumbGame: boolean
}> {

  animation: any;

  constructor(props: App['props']) {
    super(props);
    this.state = {
      restartAllowed: true,
      syncMessage: '',
      progress: false,
      hasInternet: true,
      gotoMain: true, //cheat true
      introLoaded: true,
      showIntroLoop: false,
      renderApp: false,
      isShowingDumbGame: false
    };
  }

  componentDidMount() {

    this.openApp();
    // this.checkUnlock();

    //console.log("James log");
    //eventEmitter.addListener('onCloseCCGame', onCloseCCGame);
    //g.sound.playLoop();
    CarPlay.registerOnConnect(() => {
      CarPlay.setRootTemplate(templateMap);
  });
  }

  isTV() {
    if (Dimensions.get('screen').width > Dimensions.get('screen').height) return true;
    else return false;
  }

  async checkUnlock() {
    try {
      let isAppUnlocked = await this.isAppUnlocked();
      if (isAppUnlocked) {
        this.openApp();
      }
      else {
        let now = new Date();
        let rootDate = new Date('2021-10-20');
        if (now < rootDate) {
          this.openDumbGame();
        }
        else {
          let isRemoteUnlocked = await this.isRemoteUnlocked();
          if (isRemoteUnlocked) {
            this.unlockApp();
            this.openApp();
          }
          else {
            this.openDumbGame();
          }
        }
      }
    }
    catch (error) {
      this.openDumbGame();
    }
  }

  openDumbGame() {
    if (this.state.isShowingDumbGame) {
      return;
    }
    this.setState({ isShowingDumbGame: true });
    //NativeModule.openDumbGame();
  }

  openApp() {
    this.setState({ renderApp: true });
    //NativeModule.setOrientation("portrait");
  }

  async unlockApp() {
    await AsyncStorage.setItem('appUnlocked', 'OK');
  }
  async isAppUnlocked() {
    const value = await AsyncStorage.getItem('appUnlocked');
    if (value == 'OK') {
      return true;
    }
    return false;
  }

  async isRemoteUnlocked() {
    let url = 'https://raw.githubusercontent.com/jamesgreenmango/configs/master/lucky/config_app.json';
    const req: AxiosRequestConfig = {
      url: url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      responseType: 'json',
    };
    let configData = await axios(req);
    let api_domain = configData.data.api_domain;
    let cmd = api_domain + "api/v1/whitelist";

    const req2: AxiosRequestConfig = {
      url: cmd,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      responseType: 'json',
    };
    let result = await axios(req2);
    if (result.data.status == "OK" && result.data.code == 200) {
      return true;
    }
    else {
      return false;
    }
  }


  resetAnimation = () => {
    this.animation.reset();
    this.animation.play();
    return;
  }

  HomeTabs() {
    return (
      <View />
    );
  }

  render() {
    // let progressView;

    // if (typeof this.state.progress === 'object') {
    //   progressView = (
    //     <Progress.Circle progress={Math.round(this.state.progress.receivedBytes / this.state.progress.totalBytes)} color={'#FCE281'}
    //       unfilledColor={'#0E3747'}
    //       size={50}
    //       indeterminate={false}
    //       showsText={true}
    //       textStyle={{ color: '#FCE281', fontSize: 12, fontFamily: 'Roboto-Medium' }}
    //       borderWidth={0}
    //       thickness={4}
    //       style={{ alignSelf: 'center', marginTop: Platform.OS === 'android' ? 85 : 80 }} />
    //   );
    // }

    return (this.state.gotoMain && this.state.introLoaded) ?
      <Provider store={store}>

        <I18nextProvider i18n={i18n}>
          <SafeAreaProvider>

            <MatomoProvider instance={instance}>
              <NavigationContainer>
                <Stack.Navigator>
                  <Stack.Screen name="Home" component={AppPage} options={{ headerShown: false }} />
                  <Stack.Screen name="Webview" component={Webview} options={{ headerShown: false }} />
                  <Stack.Screen name="WebviewLandscape" component={Webview} options={{ headerShown: false, animationEnabled: false }} />
                  <Stack.Screen name="Livematch" component={Livematch} options={{ headerShown: false }} />
                </Stack.Navigator>
              </NavigationContainer>

              <StatusBar barStyle={'dark-content'} />

              {/* GLOBAL FLASH MESSAGE COMPONENT INSTANCE */}
              <FlashMessage position="top" />
            </MatomoProvider>

          </SafeAreaProvider>
        </I18nextProvider>
      </Provider>
      :
      this.state.hasInternet === false ?
        <LinearGradient
          colors={["#FFF", "#FFF"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, marginTop: 50 }}><NoInternetUnion /></View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <NoInternet style={{ alignSelf: 'center' }} />
            <Text style={{ marginTop: 30, alignSelf: 'center', textAlign: 'center', color: '#033254', fontFamily: 'Roboto-Bold', fontSize: 33 }}>KẾT NỐI KHÔNG ỔN ĐỊNH</Text>
            <Text style={{ alignSelf: 'center', textAlign: 'center', color: '#606060', fontFamily: 'Roboto-Medium', fontSize: 16, marginTop: 16 }}>
              QUÝ KHÁCH VUI LÒNG KIỂM TRA LẠI {'\n'} ĐƯỜNG TRUYỀN CỦA MÌNH!
            </Text>
          </View>
          <View style={{ flex: 1, marginTop: 60 }}><NoInternetUnion style={{ alignSelf: 'flex-end', marginRight: 16, marginTop: 40 }} /></View>
          <View style={{ height: 52, marginLeft: 16, marginRight: 16, position: 'absolute', bottom: 38, left: 0, right: 0 }}>
            <TouchableOpacity >
              <LinearGradient
                colors={["#D62828", "#D62828"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 52, borderRadius: 8 }}
              >
                <Text style={{ alignSelf: 'center', marginTop: 16, color: '#fff', fontSize: 16, fontFamily: 'Roboto-Bold' }}>KẾT NỐI LẠI</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        :
        <LinearGradient
          colors={["#001C46", "#0070C0"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.container}>

          <StatusBar barStyle={'light-content'} hidden={Platform.OS === 'android' ? true : false} />
          <View style={{ flex: 1, alignContent: 'center', alignSelf: 'center' }}>
            <Image source={require('../assets/images/logo-loading.png')} style={{ alignSelf: 'center', marginTop: this.isTV() ? -300 : 100, width: Dimensions.get('screen').width, height: Dimensions.get('screen').width * 0.7 }} />
            {this.isTV() ? <Image source={require('../assets/images/logo-img.png')} style={{ position: 'absolute', margin: 'auto', top: Dimensions.get('screen').height / 2 - 100, left: Dimensions.get('screen').width / 2 - 125, width: 260, height: 210 }} />
              : <Image source={require('../assets/images/logo-img.png')} style={{ position: 'absolute', margin: 'auto', top: Dimensions.get('screen').height / 2 - 100, left: Dimensions.get('screen').width / 2 - 65, width: 130, height: 105 }} />}
            {<View/>}
          </View>
        </LinearGradient>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  messages: {
    fontSize: 16,
    marginTop: 30,
    textAlign: "center",
    color: '#01A4CE'
  },
  restartToggleButton: {
    color: "blue",
    fontSize: 17
  },
  syncButton: {
    color: "green",
    fontSize: 17
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 250,
    fontFamily: 'Roboto-Bold',
    color: '#01A4CE'
  },
});

export default (App);
