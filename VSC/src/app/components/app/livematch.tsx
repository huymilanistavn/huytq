import * as React from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, ImageBackground, Modal, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import SelectDropdown from "react-native-select-dropdown";
import ScrolldownIcon from '../../../assets/images/lichthidau-scrolldown-white.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import MenuDrawer from 'react-native-side-drawer';
import TopBg from '../../../assets/images/top-bg.svg';
import TopMenuIcon from '../../../assets/images/top-menu-icon.svg';
import TopMenuIconClose from '../../../assets/images/btn-close-light.svg';
import BackBtn from '../../../assets/images/back-btn.svg';
import NotMatch from '../../../assets/images/lichthidau-not-match.svg';
import Config from 'react-native-config';
import LeftMenu from './leftmenu';
import { headerRight } from '../commons/headerright';
import Video from 'react-native-video';
import { g } from '../../g';


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default class Livematch extends React.Component<{
  navigation: g.NavigationStackProp,
  route: any,
}, {
  visible: boolean,

}> {
  constructor(props: Livematch['props']) {
    super(props);
    this.state = {
      //isLoading: true,
      visible: true,

    };
  }
  isTV() {
    if (screenWidth > screenHeight) return true;
    else return false;
  }

  render() {
    return (
      this.isTV()?
      <Video source={{ uri: this.props.route.params.data.live_stream_app_url }}   // Can be a URL or a local file.
              ref={(ref) => {
                this.player = ref
              }}
              style={styles.backgroundVideoTV} />
      :<SafeAreaView style={styles.container}>
        {/* Header */}
        <View>
          <View style={styles.headerBar}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity>
                <Image source={require('../../../assets/images/logo-img.png')} style={{ alignSelf: 'center', width: 64, height: 52, resizeMode: 'stretch' }} />
                <Image source={require('../../../assets/images/logo-text-2.png')} style={{ alignSelf: 'center', width: 194, height: 19, resizeMode: 'stretch' }} />
              </TouchableOpacity>
              <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { g.sound.play('bet_click'); this.setState({ toggleMenu: !this.state.toggleMenu }) }}>
                {this.state.toggleMenu === true ? <TopMenuIconClose width={24} height={24} style={{ marginRight: 17 }} /> : <TopMenuIcon style={{ marginRight: 15 }} />}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <MenuDrawer
          open={this.state.toggleMenu}
          drawerContent={<LeftMenu propsData={this.props} closeMenu={() => { this.setState({ toggleMenu: false }); g.sound.play('bet_click'); }} />}
          drawerPercentage={100}
          animationTime={100}
          overlay={true}
          position={'right'}
          opacity={0.6}
        >
          <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false} style={{ backgroundColor: '#080247' }} scrollEventThrottle={16} bounces={true}>
            {/* content */}
            <Video source={{ uri: this.props.route.params.data.live_stream_app_url }}   // 'https://vniptv.simplecdn.lol/streams/2acee715-5193-44ac-bde6-1b4ef53003f0720p-playlist.m3u8'
              ref={(ref) => {
                this.player = ref
              }}                                      // Store reference
              //onBuffer={this.onBuffer}                // Callback when remote video is buffering
              //onError={this.videoError}               // Callback when video cannot be loaded
              style={styles.backgroundVideo} />

            <View style={{flexDirection:'row', marginTop:24}}>
              <LinearGradient
                colors={['rgba(255, 187, 23, 1)', 'rgba(218, 118, 7, 1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: 140, height: 42, borderRadius: 6, justifyContent: 'center', marginRight: 2 }}
              >
                <Text style={{ color: '#FFF', fontSize: 16, textAlign: 'center', fontWeight: '500', fontFamily: 'Roboto-Bold' }}>Server 1</Text>
              </LinearGradient>
              <LinearGradient
                colors={['rgba(255, 187, 23, 1)', 'rgba(218, 118, 7, 1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: 140, height: 42, borderRadius: 6, justifyContent: 'center', marginRight: 2 }}
              >
                <Text style={{ color: '#FFF', fontSize: 16, textAlign: 'center', fontWeight: '500', fontFamily: 'Roboto-Bold' }}>Server 2</Text>
              </LinearGradient>
            </View>
          </ScrollView>

        </MenuDrawer>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080247',
  },
  headerBar: {
    backgroundColor: '#080247',
    height: 90,
    borderRadius: 4,
    flexDirection: 'row',
    paddingTop: 5,
    justifyContent: 'space-between',
  },
  backgroundVideo: {
    height: screenWidth * 0.5,
    backgroundColor:'#000',
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
  },
  backgroundVideoTV: {
    backgroundColor:'#000',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
})