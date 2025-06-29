import Swiper from 'react-native-swiper';
import React from 'react';
import { View, StyleSheet, ScrollView, Text, Image, ImageBackground, FlatList, Dimensions, TouchableOpacity, Platform, SafeAreaView, Linking, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import SelectDropdown from "react-native-select-dropdown";
import { showMessage, hideMessage } from "react-native-flash-message";
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from "@react-native-community/masked-view";
import Moment from 'moment';
import LeftMenu from './leftmenu';
import { headerRight } from '../commons/headerright';
import { PopupNoMoney } from '../commons/popupnomoney';
import TopBg from '../../../assets/images/top-bg.svg';
import TopLogo from '../../../assets/images/top-logo.svg';
import TopMenuIcon from '../../../assets/images/top-menu-icon.svg';
import TopMenuIconClose from '../../../assets/images/btn-close-light.svg';


import Config from 'react-native-config';
import { g } from '../../g';
import { LogBox } from "react-native";
import FastImage from 'react-native-fast-image';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import HomeLodeCalendarPicker from "../commons/homelodecalendarpicker";
import MenuDrawer from 'react-native-side-drawer';
import WithComponentHooks from "with-component-hooks";
import { CarPlay } from 'react-native-carplay';
//import GlobalKeyEvent from 'react-native-global-keyevent';


LogBox.ignoreLogs([
  "exported from 'deprecated-react-native-prop-types'.",
])

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;


class App extends React.Component<{
  navigation: g.NavigationStackProp,
  refresh: any,
  user: any,
}, {
  //isLoading: boolean;
  visible: boolean,
  heroBanner: any,
  popupMoney: boolean,
  arrTop: string[],
  topIndex: number,
  hotMatchList: [],
  toggleMenu: boolean,
  coinJackpot: any,
  totalJackpot: number,
  lodeCities: any,
  toolTipLodeDateVisible: boolean;
  lodeData: any,

  activeSlide: number,
  activeSlideHotMatch: number,
  activeSlidePromotion: number,
  activeSlideTopThumb: number,
  indexTVnode: number;
}> {
  offset = 0;
  _isMounted = false;

  constructor(props: App['props']) {
    super(props);
    this.state = {
      //isLoading: true,
      visible: true,
      heroBanner: ['', ''],
      popupMoney: false,
      arrTop: ['Rewards', 'Thể Thao', 'Sòng Bài', 'Cổng Game', 'Bắn Cá', 'Game Nhanh'],
      topIndex: 0,
      hotMatchList: [],
      toggleMenu: false,
      coinJackpot: {},
      totalJackpot: 0,
      lodeCities: '',
      toolTipLodeDateVisible: false,
      lodeData: '',

      activeSlide: 0,
      activeSlideHotMatch: 0,
      activeSlidePromotion: 0,
      activeSlideTopThumb: 0,
      indexTVnode: 0,
    };
  }
  showTutorialScroll = true;
  lodeCitiesIndex = 0;
  lodeDateSelected = Moment(Date()).add(-1, 'days').format('DD-MM-YYYY');
  _carousel: any;
  _flatlist: any;

  componentDidMount() {
    console.log("acmilan-"+CarPlay.connected);
    // call refresh to check islogin connection server
    this._isMounted = true;
    this.callAllMatch();

    // Platform.OS == 'android' && GlobalKeyEvent.addKeyUpListener((evt) => {
    //   //alert('code:' + evt.keyCode)
    //   //alert('key:' + evt)
    //   g.sound.play('bet_click');
    //   if (evt.keyCode == 21 && this.indexTV != 0) { //left
    //     this.indexTV--;
    //   }
    //   if (evt.keyCode == 22 && (this.indexTV != this.state.hotMatchList.length)) { //right
    //     this.indexTV++;
    //   }
    //   this.setState({ indexTVnode: this.indexTV });
    //   this._carousel.snapToItem(this.indexTV);
    // })
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.intervalId);
  }

  //call interval all app to check logout
  intervalId = setInterval(() => {
    if (this.props.user.user.username !== '' && !g.value.isUsingWebViewOrNativeGame) {
      this.props.refresh(this.props.navigation);

      g.api.notificationCount().then(res => {
        if (res.data.code === 200)
          g.value.notificationCount = res.data.data.total;
      });

    }
  }, 15000);

  isTV() {
    if (screenWidth > screenHeight) return true;
    else return false;
  }

  callAllMatch() {
    g.api.hotmatchNews().then(res => {
      if (res.data) {
        //console.log(res);
        this.setState({ hotMatchList: res.data });
      }
    });
  }


  handleClosePopupMoney = () => {
    g.sound.play('bet_click');
    this.setState({ popupMoney: false })
  }

  onScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - (this.offset || 0);
    if (this._isMounted) {
      if (dif < 0 || dif < -0.6 || currentOffset === 0) {
        this.setState({ visible: true });
      } else {
        this.setState({ visible: false });
      }
    }
    if (parseInt(event.nativeEvent.contentOffset.y + Dimensions.get('screen').height) === parseInt(event.nativeEvent.contentSize.height))
      this.setState({ visible: true });
    this.offset = currentOffset;
  };

  _renderItemPhone = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: '#080247', height: 266, flex: 1, borderRadius: 16, margin: 8 }}>
        <Text style={{ marginVertical: 18, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '700', fontFamily: 'Roboto-Bold' }}>{item.league}</Text>
        <ImageBackground source={require('../../../assets/images/bg-match.png')} style={{ height: 81, justifyContent: "space-around", flexDirection: 'row' }}
          imageStyle={{}}>
          <FastImage
            style={{ width: 60, height: 60, alignSelf: 'center' }}
            source={{ uri: item?.home_team.logo }}
            resizeMode={FastImage.resizeMode.stretch}
          />
          <View style={{ height: 60 }}>
            {item.live_stream_app_url != '' ? <View style={{ backgroundColor: '#ED1B4A', borderRadius: 13, width: 80, height: 26, justifyContent: 'center' }}>
              <Text style={{ fontWeight: '800', fontFamily: 'Roboto-Bold', fontSize: 13, textAlign: 'center', color: '#FFF' }}>Trực tiếp</Text>
            </View> : <View />}
            <Text style={{ marginTop: 14, color: '#FFBC15', fontSize: 22, textAlign: 'center', fontWeight: '900', fontFamily: 'Roboto-Bold' }}>{item?.date_time?.time}</Text>
            <Text style={{ marginTop: 6, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: 'Roboto-Bold' }}>{item?.date_time?.date}</Text>
          </View>
          <FastImage
            style={{ width: 60, height: 60, alignSelf: 'center' }}
            source={{ uri: item?.away_team.logo }}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </ImageBackground>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>{item?.home_team?.name}</Text>
          <View style={{ flex: 1 }} />
          <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>{item?.away_team?.name}</Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
          <TouchableOpacity onPress={() => { g.sound.play('bet_click'); this.props.navigation.navigate('Livematch', { data: this.state.hotMatchList[index] }); }}>
            <LinearGradient
              colors={['rgba(255, 187, 23, 1)', 'rgba(218, 118, 7, 1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: 140, height: 42, borderRadius: 6, justifyContent: 'center', marginRight: 2 }}
            >
              <Text style={{ color: '#FFF', fontSize: 16, textAlign: 'center', fontWeight: '500', fontFamily: 'Roboto-Bold' }}>Xem ngay</Text>
            </LinearGradient>
          </TouchableOpacity>
          <LinearGradient
            colors={['#3252E6', '#0024C9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: 140, height: 42, borderRadius: 6, justifyContent: 'center', marginLeft: 2 }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, textAlign: 'center', fontWeight: '500', fontFamily: 'Roboto-Bold' }}>Đặt cược</Text>
          </LinearGradient>
        </View>
      </View>
    );
  }

  onItemFocus(e, index) {
    if (this.state.indexTVnode == index)
      return;

    this.setState({ indexTVnode: index });
    g.sound.play('bet_click');

    // Get rows width / height
    const rowsWidth = screenWidth;
    const itemWidth = 200 + 8 * 2;

    // Get horizontal offset for current item in current row
    const itemLeftOffset = itemWidth * index;

    // Center item horizontally in row
    const rowsWidthHalf = rowsWidth / 2;

    if (itemLeftOffset >= rowsWidthHalf) {
      const x = itemLeftOffset - rowsWidthHalf + itemWidth / 2;
      this._flatlist.scrollToOffset({ offset: x + 150, animated: true });
    } else {
      this._flatlist.scrollToOffset({ offset: 0, animated: true });
    }
  }

  _renderItemTV = ({ item, index }) => {
    return (
      <TouchableOpacity style={{ backgroundColor: this.state.indexTVnode == index ? '#080247' : "#333", height: 220, borderRadius: 16, margin: 8, width: 200 }}
        onFocus={(e) => { this.onItemFocus(e, index) }}
        onPress={(e) => {
          //cheat fot IOS render press working
          //this.onItemFocus(e, index)
          if (g.value.canClick) {
            g.fn.setClick();
            g.sound.play('bet_click');
            if (this.state.hotMatchList[index].live_stream_app_url == '')
              Alert.alert("Thông báo", "Chưa có dữ liệu trận đấu!")
            else
              this.props.navigation.navigate('Livematch', { data: this.state.hotMatchList[index] })
          }
        }}
      >
        <Text style={{ marginVertical: 18, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '700', fontFamily: 'Roboto-Bold' }}>{item.league}</Text>
        <ImageBackground source={require('../../../assets/images/bg-match.png')} style={{ height: 81, justifyContent: "space-around", flexDirection: 'row' }}
          imageStyle={{}}>
          <FastImage
            style={{ width: 60, height: 60, alignSelf: 'center' }}
            source={{ uri: item?.home_team.logo }}
            resizeMode={FastImage.resizeMode.stretch}
          />
          <View style={{ height: 60 }}>
            {item.live_stream_app_url != '' ? <View style={{ backgroundColor: '#ED1B4A', borderRadius: 13, width: 80, height: 26, justifyContent: 'center' }}>
              <Text style={{ fontWeight: '800', fontFamily: 'Roboto-Bold', fontSize: 13, textAlign: 'center', color: '#FFF' }}>Trực tiếp</Text>
            </View> : <View />}
            <Text style={{ marginTop: 14, color: '#FFBC15', fontSize: 22, textAlign: 'center', fontWeight: '900', fontFamily: 'Roboto-Bold' }}>{item?.date_time?.time}</Text>
            <Text style={{ marginTop: 6, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: 'Roboto-Bold' }}>{item?.date_time?.date}</Text>
          </View>
          <FastImage
            style={{ width: 60, height: 60, alignSelf: 'center' }}
            source={{ uri: item?.away_team.logo }}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </ImageBackground>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>{item?.home_team?.name}</Text>
          <View style={{ flex: 1 }} />
          <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>{item?.away_team?.name}</Text>
        </View>
        <View style={{ flex: 1 }} />
        {!this.isTV() && <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
          <View>
            <LinearGradient
              colors={['rgba(255, 187, 23, 1)', 'rgba(218, 118, 7, 1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: 140, height: 42, borderRadius: 6, justifyContent: 'center', marginRight: 2 }}
            >
              <Text style={{ color: '#FFF', fontSize: 16, textAlign: 'center', fontWeight: '500', fontFamily: 'Roboto-Bold' }}>Xem ngay</Text>
            </LinearGradient>
          </View>
        </View>}
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View>
          {this.isTV() ?
            <View style={[styles.headerBar, { height: screenHeight * 0.4, backgroundColor: '#020d24' }]}>
              <View style={{ marginTop: 0 }}>
                <Image source={require('../../../assets/images/logo-img.png')} style={{ alignSelf: 'center', width: screenWidth * 0.15, height: screenWidth * 0.145, resizeMode: 'stretch' }} />
                <Image source={require('../../../assets/images/logo-text-2.png')} style={{ alignSelf: 'center', width: screenWidth * 0.4, height: screenWidth * 0.05, resizeMode: 'stretch' }} />
              </View>

            </View>
            : <View style={styles.headerBar}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Image source={require('../../../assets/images/logo-img.png')} style={{ alignSelf: 'center', width: 64, height: 52, resizeMode: 'stretch' }} />
                  <Image source={require('../../../assets/images/logo-text-2.png')} style={{ alignSelf: 'center', width: 194, height: 19, resizeMode: 'stretch' }} />
                </View>
                <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { g.sound.play('bet_click'); this.setState({ toggleMenu: !this.state.toggleMenu }) }}>
                  {this.state.toggleMenu === true ? <TopMenuIconClose width={24} height={24} style={{ marginRight: 17 }} /> : <TopMenuIcon style={{ marginRight: 15 }} />}
                </TouchableOpacity>
              </View>

            </View>}

        </View>

        <MenuDrawer
          open={this.state.toggleMenu}
          drawerContent={this.isTV() ? <View /> : <LeftMenu propsData={this.props} closeMenu={() => { this.setState({ toggleMenu: false }); g.sound.play('bet_click'); }} />}
          drawerPercentage={100}
          animationTime={100}
          overlay={true}
          position={'right'}
          opacity={0.6}
        >

          {/* content */}
          {!this.isTV() &&
            <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false} style={{ backgroundColor: '#020d24' }} scrollEventThrottle={16} onScroll={(e) => { this.onScroll(e); }} bounces={false}>
              {/* Swiper and Top Index */}
              <View style={{ marginBottom: 15, marginTop: 15, flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <LinearGradient
                  colors={['rgba(255, 187, 23, 1)', 'rgba(218, 118, 7, 1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: 82, height: 32, borderRadius: 16, justifyContent: 'center' }}
                >
                  <Text style={{ color: '#000', fontSize: 14, textAlign: 'center', fontWeight: '500', fontFamily: 'Roboto-Bold' }}>TẤT CẢ</Text>
                </LinearGradient>
                <View style={{ width: 82, height: 32, borderColor: '#FFFFFF', borderWidth: 1, borderRadius: 16, justifyContent: 'center' }}>
                  <Text style={{ color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '500', fontFamily: 'Roboto-Bold' }}>TRỰC TIẾP</Text>
                </View>
                <View style={{ width: 82, height: 32, borderColor: '#FFFFFF', borderWidth: 1, borderRadius: 16, justifyContent: 'center' }}>
                  <Text style={{ color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '500', fontFamily: 'Roboto-Bold' }}>TRẬN HOT</Text>
                </View>
                <View style={{ width: 82, height: 32, borderColor: '#FFFFFF', borderWidth: 1, borderRadius: 16, justifyContent: 'center' }}>
                  <Text style={{ color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '500', fontFamily: 'Roboto-Bold' }}>HÔM NAY</Text>
                </View>
              </View>
              <FlatList
                data={this.state.hotMatchList}
                renderItem={this._renderItemPhone}
                keyExtractor={item => item.id}
              />
            </ScrollView>

          }

          {this.isTV() &&
            <View style={{ width: screenWidth, height: screenHeight, backgroundColor: '#020d24' }}>
              <Image source={require('../../../assets/images/logo-loading.png')} style={{ position: 'absolute', alignSelf: 'center', width: '60%', height: (screenWidth * 0.6) * 0.7, resizeMode: 'stretch', top: -340, right: -100 }} />
              <View style={{ height: '5%' }} />
              <Text style={{ color: 'rgba(255, 187, 23, 1)', fontSize: 20, fontFamily: 'Roboto-Bold', marginLeft: 16 }}>TẤT CẢ CÁC TRẬN</Text>

              {this.state.hotMatchList.length == 0 ? <View style={{ flex: 1 }}>
                <Text style={{ color: '#CCC', fontSize: 30, fontFamily: 'Roboto-Bold', flex: 1, textAlign: 'center', marginTop: 150 }}>..: LOADING :..</Text>
              </View>
                : <FlatList
                  style={{ marginTop: 16, height: 270 }}
                  ref={(c) => { this._flatlist = c; }}
                  data={this.state.hotMatchList}
                  renderItem={this._renderItemTV}
                  keyExtractor={item => item.id}
                  horizontal={true}
                />}

              {/* <Carousel
                ref={(c) => { this._carousel = c; }}
                layout={'default'}
                enableMomentum={true}
                style={{ paddingBottom: 100 }}
                inactiveSlideScale={1}
                inactiveSlideOpacity={0.5}
                firstItem={0}
                //useScrollView={true}
                data={this.state.hotMatchList}
                renderItem={this._renderItemTV}
                sliderWidth={screenWidth}
                //sliderHeight={100}
                itemWidth={(screenWidth / 3.7)}
                itemHeight={220}
                loop={false}
                autoplay={false}
                activeSlideAlignment={'start'}
              /> */}
              <View style={{ height: screenHeight * 0.08 }} />
            </View>}

          {this.isTV() && <View style={{ position: 'absolute', bottom: 8, right: 16 }}>
            <Text style={{ color: '#BBB', fontSize: 12, fontFamily: 'Roboto-Regular' }}>v0.250408</Text>
          </View>}

        </MenuDrawer>

      </SafeAreaView>

    )
  };
};

export default WithComponentHooks(App);

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
  headerLogo: {
    width: 120,
    height: 40,
  },
  headerButton: {
    flexDirection: 'row',
  },
  swiper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: screenWidth * 0.52,
    borderTopWidth: 2,
    borderTopColor: 'rgba(0,0,0,.1)',
    paddingTop: 16,
  },
  swiperImage: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
  },
  heroBanner: {
    width: screenWidth - 30,
    height: (screenWidth - 30) * 0.5,
    marginLeft: 15,
    borderRadius: 16
  },
  swiperText1: {
    fontFamily: 'SFUHelveticaCondensedBold',
    fontSize: 18,
    marginLeft: 15,
    marginTop: 35,
    color: '#fff'
  },
  swiperText2: {
    fontSize: 14,
    marginLeft: 15,
    marginTop: 2,
    color: '#fff',
    opacity: 0.7,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    margin: 3,
    marginBottom: 162
  },
  scrollview: {
    flex: 1,
    marginTop: 0,
  },

  topMatch: {
    flexDirection: 'row',
    //backgroundColor:'#fff',
    //alignItems:'center',
  },
  topMatchBg: {
    marginTop: -8,
  },
  topText1: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 12,
    marginTop: 9,
    color: '#E6F0F2',
    alignSelf: 'center'
  },
  topMatchBet: {
    flexDirection: 'row',
    alignItems: 'center',
    //marginTop:-10,
  },
  groupHeadBg: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginLeft: 16,
    marginRight: 16,
    height: 44,
    backgroundColor: '#1A3146',
    borderRadius: 8,
  },
  groupHeadText: {
    color: '#033254',
    alignSelf: 'center',
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Roboto-Regular'
  },
  groupHeadTextArrow: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 12,
    alignSelf: 'center',
    marginRight: 4,
    marginTop: 12,
    color: '#8CA3BA'
  },
  groupHeadArrow: {
    alignSelf: 'center', marginRight: 15, marginTop: 12
  },
  liveCasino: {
    marginTop: 16
  },
  liveCasinoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  liveCasinoContent: {
    marginTop: 12,
  },
  congGame: {
    marginTop: 16
  },
  congGameContent: {
    marginTop: 12
  },
  sieuPhamContent: {
    marginTop: 12,
  },
  casinoItemWrapper: {
    marginRight: 15,
  },
  thichItemWrapper: {
    marginTop: 8,
    marginRight: 15,
    marginBottom: 24,
  },
  sieuPhamItemWrapper: {
    marginRight: 15,
  },
  congGameGroup: {
    marginLeft: 16,
    width: 296,
    height: 440,
    backgroundColor: '#0F273E',
    borderRadius: 4,
  },
  congGameGroupText: {
    color: '#E0F3F5',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
    marginLeft: 12, marginTop: 13,
  },
  topNguoiChoiBg: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
    height: 456,
    backgroundColor: '#0F273E',
    borderRadius: 8,
  },
  footer: {
    backgroundColor: '#0D2235',
    opacity: 0.92,
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },

  paragraph: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '700',
    fontSize: 40, color: '#f1d668', textShadowColor: '#d62828', textShadowRadius: 1, textShadowOffset: {
      width: 1,
      height: 1
    }
  },
  paragraph1: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '700',
    fontSize: 20, color: '#d1533c', textShadowColor: '#fdf9c0', textShadowRadius: 1, textShadowOffset: {
      width: 1,
      height: 1
    }
  },
  abs: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  }
});

//export default App;
