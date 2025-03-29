import Swiper from 'react-native-swiper';
import React from 'react';
import { View, StyleSheet, ScrollView, Text, Image, ImageBackground, FlatList, Dimensions, TouchableOpacity, Platform, SafeAreaView, Linking } from 'react-native';
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

import GlobalKeyEvent from 'react-native-global-keyevent';

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
  hotMatchList: any,
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
      indexTVnode : 0,
    };
  }
  showTutorialScroll = true;
  lodeCitiesIndex = 0;
  lodeDateSelected = Moment(Date()).add(-1, 'days').format('DD-MM-YYYY');
  _carousel: any;

  componentDidMount() {
    // call refresh to check islogin connection server
    this._isMounted = true;

    Platform.OS == 'android' && GlobalKeyEvent.addKeyDownListener((evt) => {
      //alert('code:' + evt.keyCode)
      //alert('key:' + evt)
      if (evt.keyCode == 21 && this._carousel.currentIndex != 0) { //left
        this._carousel.snapToPrev();
        this.setState({indexTVnode:this._carousel.currentIndex - 1})
      }
      if (evt.keyCode == 22&&(this._carousel.currentIndex != 5)) { //right
        this._carousel.snapToNext();
        this.setState({indexTVnode:this._carousel.currentIndex + 1})
      }
    })
    //bg music sound
    //g.sound.playLoop();

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

  loadLode(date: string, city: number, type: number) {
    if (type === 1) {
      this.lodeCitiesIndex = 0;
      this.lodeDateSelected = date;
      g.api.lodeGetCities(date).then(res => {
        if (res.data.code === 200) {
          this.setState({ lodeCities: res.data.data.rows });
        }
      });
    }
    if (type === 2 || type === 1) { // reload city
      g.api.lodeGetResult(date, city).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.rows?.title.includes('chưa có kết quả'))
            this.setState({ lodeData: ['-', '-', '-', '-', '-'] });
          else
            this.setState({ lodeData: Array.from(res.data.data.rows?.result?.special) });
        }
      });
    }
  }


  callAPIJackpot() {
    g.api.slotjackpot().then(res => {
      if (res.data.status === 'OK') {
        let sum = 0;
        Object.entries(res.data.data || []).map(([key, value]) => {
          sum += parseInt('' + value);
        });
        this.setState({ coinJackpot: res.data.data, totalJackpot: sum });
      }
    });
  }
  heroBannerClick(index: number) {
    g.sound.play('bet_click');
    let item = this.state.heroBanner[index];
    if (item?.type === 'PAGE') {
      if (item.name === 'khuyen-mai')
        this.props.navigation.navigate('LeftMenuTrungTamThongTin', { data: 1 })
      else if (item.name === 'the thao ao')
        this.checkAndGoESportLobby('vsports');
      else if (item.name === 'primier')
        this.checkAndGoSportLobby('ksports', '');
      else
        Linking.openURL(Config.API_ENTRY_POINT + item?.path.substr(1));
    }
    if (item?.type === 'GAME') {
      this.onClickTopAndGame('/gameUrl?partnerProvider=' + item.partner_provider + '&partnerGameId=' + item.partner_game_id);
    }
    if (item?.type === 'MATCH')
      this.checkAndGoLinkSport(item.event_id, item.league_id);
  }

  checkAndGoSportLobby(str_type: string, sub_type: string) {
    g.sound.play('bet_click');
    g.value.canPlay = g.fn.gotoLink(this.props, true, false);
    if (g.value.canPlay !== 'login') {
      g.api.getRealLinkESport(str_type).then(res => {
        if (res.data.status === 'OK') {
          if (res.data?.data?.url) {
            if ((str_type === 'ssports' || str_type === 'sinsports' || str_type === 'tpsports') && sub_type === 'Football')
              g.value.currentGoToLink = res.data?.data?.url?.Football;
            else if ((str_type === 'ssports' || str_type === 'sinsports' || str_type === 'tpsports') && sub_type === 'Basketball')
              g.value.currentGoToLink = '' + res.data?.data?.url?.Basketball;
            else if ((str_type === 'ssports' || str_type === 'sinsports' || str_type === 'tpsports') && sub_type === 'Volleyball')
              g.value.currentGoToLink = res.data?.data?.url?.Volleyball;
            else if ((str_type === 'ssports' || str_type === 'sinsports' || str_type === 'tpsports') && sub_type === 'Tennis')
              g.value.currentGoToLink = res.data?.data?.url?.Tennis;
            else if ((str_type === 'ssports' || str_type === 'sinsports') && sub_type === 'Boxing')
              g.value.currentGoToLink = res.data?.data?.url?.Boxing;
            else if ((str_type === 'ssports' || str_type === 'sinsports') && sub_type === 'Badminton')
              g.value.currentGoToLink = res.data?.data?.url?.Badminton;

            else
              g.value.currentGoToLink = res.data?.data?.url;
            this.props.navigation.navigate('Webview');
          }
          else
            showMessage({ message: 'Chưa có dữ liệu!', type: "warning", icon: { icon: "warning", position: "left" } });
        }
      })
    }
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
            this.props.navigation.navigate('Webview');
          }
          else
            showMessage({ message: 'Chưa có dữ liệu!', type: "warning", icon: { icon: "warning", position: "left" } });
        }
      })
    }
  }
  _renderItem = ({ item, index }: { item: any, index: number }) => {
    //console.log(item.image);
    return (
      <TouchableOpacity key={index} style={{ height: screenWidth * 1.4 }} onPress={() => {
        g.sound.play('bet_click');
        if (item.name === 'THỂ THAO') this.props.navigation.navigate('Sport');
        if (item.name === 'LIVE CASINO') this.props.navigation.navigate('Casino');
        if (item.name === 'GAME BÀI') this.props.navigation.navigate('GameBai');
        if (item.name === 'LÔ ĐỀ') this.props.navigation.navigate('LoDe');
        if (item.name === 'KENO') this.props.navigation.navigate('QuickGames', { data: 1 });
        if (item.name === 'QUAY SỐ') this.props.navigation.navigate('QuickGames', { data: 3 });
        if (item.name === 'NUMBERS GAME') this.props.navigation.navigate('QuickGames', { data: 2 });
        if (item.name === 'VIRTUAL GAMES') this.props.navigation.navigate('QuickGames', { data: 5 });
        if (item.name === 'TABLE GAMES') this.props.navigation.navigate('QuickGames', { data: 4 });
        if (item.name === 'NỔ HŨ') this.props.navigation.navigate('CongGame', { data: 1 });
        if (item.name === 'SLOTS') this.props.navigation.navigate('CongGame', { data: 2 });
        if (item.name === 'INGAME') this.props.navigation.navigate('CongGame', { data: 3 });
        if (item.name === 'SPRIBE GAMES') this.props.navigation.navigate('CongGame', { data: 4 });
        if (item.name === 'BẮN CÁ') this.props.navigation.navigate('BanCa', { data: 1 });
        if (item.name === 'BẮN MÁY BAY') this.props.navigation.navigate('BanCa', { data: 2 });
        if (item.name === 'E-SPORTS') this.checkAndGoESportLobby('');
        if (item.name === 'THỂ THAO ẢO') this.checkAndGoESportLobby('vsports');
      }}>
        <FastImage
          style={{ width: screenWidth / 3 - 15, height: item.name === 'GAME BÀI' ? (screenWidth / 3 - 5) * 1.31 : (screenWidth / 3 - 15) * 1.31, marginTop: item.name === 'GAME BÀI' ? -15 : 0 }}
          source={{ uri: item.image }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ marginLeft: -10, color: '#FFF', marginTop: -22, textAlign: 'center', fontWeight: '500', fontSize: 13, fontFamily: 'Roboto-Regular' }}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  _renderItemKhuyenMai = ({ item, index }: { item: any, index: number }) => {
    return (
      <TouchableOpacity key={index} style={{ height: screenWidth * 1.4 }} onPress={() => { g.sound.play('bet_click'); this.props.navigation.navigate('LeftMenuTrungTamThongTin', { data: 1 }) }}>
        <FastImage
          style={{ width: screenWidth - 80, height: (screenWidth - 80) * 0.555, borderRadius: 8, alignSelf: 'center' }}
          source={{ uri: item.image }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </TouchableOpacity>
    );
  }
  _renderItemSlotHot = ({ item, index }: { item: any, index: number }) => {
    return (
      <TouchableOpacity key={index} style={{ height: screenWidth * 1.4 }} onPress={() => {
        this.onClickTopAndGame(item.api);
      }}>

      </TouchableOpacity>
    );
  }
  _renderItemHotMatch = ({ item, index }: { item: any, index: number }) => {
    //console.log(index);
    //let h1 = (item?.oddsKS.length > 0 && item?.oddsKS[0]?.ft?.hdp && item?.oddsKS[0]?.ft?.hdp[0]?.hTeam[0]) || item.oddsAT[0]?.ft?.hdp[0]?.hTeam[0];
    let h1 = item?.oddsKS.length > 0
      ? '' || item?.oddsKS[0]?.ft?.hdp && item?.oddsKS[0]?.ft?.hdp[0]?.hTeam[0] === "" ? item?.oddsKS[0]?.ft?.hdp[0]?.aTeam[0] : item?.oddsKS[0]?.ft?.hdp[0]?.hTeam[0]
      : item.oddsAT[0]?.ft?.hdp[0]?.hTeam[0];

    let h2 = (item?.oddsKS.length > 0 && item?.oddsKS[0]?.ft?.hdp && item?.oddsKS[0]?.ft?.hdp[0]?.hTeam[1]) || item.oddsAT[0]?.ft?.hdp[0]?.hTeam[1];
    //let a1 = (item?.oddsKS.length > 0 && item?.oddsKS[0]?.ft?.hdp && item?.oddsKS[0]?.ft?.hdp[0]?.hTeam[0] * -1) || item.oddsAT[0]?.ft?.hdp[0]?.aTeam[0];

    let a1 = item?.oddsKS.length > 0
      ? ('' || item?.oddsKS[0]?.ft?.hdp && item?.oddsKS[0]?.ft?.hdp[0]?.hTeam[0]) !== "" ? item?.oddsKS[0]?.ft?.hdp[0]?.hTeam[0] * (- 1) : item?.oddsKS[0]?.ft?.hdp[0]?.aTeam[0] * (- 1)
      : item.oddsAT[0]?.ft?.hdp[0]?.aTeam[0];

    let a2 = (item?.oddsKS.length > 0 && item?.oddsKS[0]?.ft?.hdp && item?.oddsKS[0]?.ft?.hdp[0]?.aTeam[1]) || item.oddsAT[0]?.ft?.hdp[0]?.hTeam[1];
    return (
      <TouchableOpacity onPress={() => { this.checkAndGoLinkSport(item.mkid, item.ckid) }}>

      </TouchableOpacity>
    );
  }
  //native game
  checkAndGoNative(gameName: string, isLandscape: boolean) {
    g.value.isNative = "true";
    g.value.gameName = gameName;
    g.value.isLandscape = isLandscape;
  }
  //using for sport
  checkAndGoLinkSport = (event_id: number, league_id: number) => {
    g.sound.play('bet_click');
    g.value.canPlay = g.fn.gotoLink(this.props, true, false);
    if (g.value.canPlay !== 'login') {
      g.api.getRealLinkSportHome(event_id, league_id).then(res => {
        if (res.data.status === 'OK') {
          if (res.data?.data?.url) {
            g.value.currentGoToLink = res.data?.data?.url;
            this.props.navigation.navigate('Webview');
          }
          else {
            showMessage({ message: 'Chưa có dữ liệu trận đấu!', type: "warning", icon: { icon: "warning", position: "left" } });
          }
        }
      })
    }
  }

  onClickTopAndGame(api: string) {
    if (g.value.canClick) {
      g.fn.setClick();
      let temp = g.fn.gotoLink(this.props, true, false);
      if (temp === 'ok') {
        g.fn.checkAndGoLink(api, true, this.props);
      }
      else {
        g.sound.play('bet_click');
        if (temp === 'nomoney')
          this.setState({ popupMoney: true });
      }
    }
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

  pagination(type: string) {
    let dotsLengthTemp = 0;
    let activeDot = 0;
    if (type === 'slothot') {
      dotsLengthTemp = slothot.length;
      activeDot = this.state.activeSlide;
    }
    if (type === 'hotmatch') {
      dotsLengthTemp = this.state.hotMatchList.length;
      activeDot = this.state.activeSlideHotMatch;
    }
    if (type === 'promotion') {
      dotsLengthTemp = khuyenmai.length;
      activeDot = this.state.activeSlidePromotion;
    }
    if (type === 'topthumb') {
      dotsLengthTemp = arrTopData[this.state.topIndex].length;
      activeDot = this.state.activeSlideTopThumb;
    }
    //const { entries, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={dotsLengthTemp}
        activeDotIndex={activeDot}
        containerStyle={{
          width: 20 * dotsLengthTemp, backgroundColor: '#bdbdbd', borderRadius: 5, height: 8, paddingVertical: -12, position: 'absolute', alignSelf: 'center',
          bottom: type === 'slothot' ? 26
            : type === 'hotmatch' ? -20
              : type === 'promotion' ? 20
                : 28
        }}
        dotStyle={{
          width: 20,
          height: 8,
          borderRadius: 5,
          marginHorizontal: -8,
          backgroundColor: '#4f4f4f',
        }}
        inactiveDotStyle={{
          backgroundColor: '#bdbdbd', width: 20, height: 8, borderRadius: 5, marginHorizontal: -8
        }}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    );
  }

  _renderItemTV = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: this.state.indexTVnode == index ? '#080247' : "#333", height: screenHeight*0.4, borderRadius: 16, margin: 8 }}>
        <Text style={{ marginVertical: 18, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '700', fontFamily: 'Roboto-Bold' }}>Giao Hữu</Text>
        <ImageBackground source={require('../../../assets/images/bg-match.png')} style={{ height: 81, justifyContent: "space-around", flexDirection: 'row' }}
          imageStyle={{}}>
          <FastImage
            style={{ width: 60, height: 60, alignSelf: 'center' }}
            source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/05/France-U20.webp' }}
            resizeMode={FastImage.resizeMode.stretch}
          />
          <View style={{ height: 60 }}>
            <View style={{ backgroundColor: '#ED1B4A', borderRadius: 13, width: 80, height: 26, justifyContent: 'center' }}>
              <Text style={{ fontWeight: '800', fontFamily: 'Roboto-Bold', fontSize: 13, textAlign: 'center', color: '#FFF' }}>Trực tiếp</Text>
            </View>
            <Text style={{ marginTop: 14, color: '#FFBC15', fontSize: 22, textAlign: 'center', fontWeight: '900', fontFamily: 'Roboto-Bold' }}>17:00</Text>
            <Text style={{ marginTop: 6, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: 'Roboto-Bold' }}>24/03/2025</Text>
          </View>
          <FastImage
            style={{ width: 60, height: 60, alignSelf: 'center' }}
            source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/10/Mexico.webp' }}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </ImageBackground>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>France U20</Text>
          <View style={{ flex: 1 }} />
          <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>Mexico U20</Text>
        </View>
        <View style={{ flex: 1 }} />
        {!this.isTV()&&<View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
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
      </View>
    );
  }

  render() {
    //const { trackAppStart, trackScreenView } = useMatomo();

    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View>
          {this.isTV() ?
            <View style={[styles.headerBar, { height: screenHeight*0.4, backgroundColor: '#020d24' }]}>
              <View style={{ marginTop: 0 }}>
                <Image source={require('../../../assets/images/logo-img.png')} style={{ alignSelf: 'center', width: screenWidth*0.15, height: screenWidth*0.145, resizeMode: 'stretch' }} />
                <Image source={require('../../../assets/images/logo-text-2.png')} style={{ alignSelf: 'center', width: screenWidth*0.4, height: screenWidth*0.05, resizeMode: 'stretch' }} />
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
          {!this.isTV() && <ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false} style={{ backgroundColor: '#020d24' }} scrollEventThrottle={16} onScroll={(e) => { this.onScroll(e); }} bounces={false}>
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

            <View style={{ backgroundColor: '#080247', height: 266, flex: 1, borderRadius: 16, margin: 8 }}>
              <Text style={{ marginVertical: 18, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '700', fontFamily: 'Roboto-Bold' }}>Giao Hữu</Text>
              <ImageBackground source={require('../../../assets/images/bg-match.png')} style={{ height: 81, justifyContent: "space-around", flexDirection: 'row' }}
                imageStyle={{}}>
                <FastImage
                  style={{ width: 60, height: 60, alignSelf: 'center' }}
                  source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/05/France-U20.webp' }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
                <View style={{ height: 60 }}>
                  <View style={{ backgroundColor: '#ED1B4A', borderRadius: 13, width: 80, height: 26, justifyContent: 'center' }}>
                    <Text style={{ fontWeight: '800', fontFamily: 'Roboto-Bold', fontSize: 13, textAlign: 'center', color: '#FFF' }}>Trực tiếp</Text>
                  </View>
                  <Text style={{ marginTop: 14, color: '#FFBC15', fontSize: 22, textAlign: 'center', fontWeight: '900', fontFamily: 'Roboto-Bold' }}>17:00</Text>
                  <Text style={{ marginTop: 6, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: 'Roboto-Bold' }}>24/03/2025</Text>
                </View>
                <FastImage
                  style={{ width: 60, height: 60, alignSelf: 'center' }}
                  source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/10/Mexico.webp' }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </ImageBackground>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>France U20</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>Mexico U20</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
                <TouchableOpacity onPress={() => { g.sound.play('bet_click'); this.props.navigation.navigate('Livematch'); }}>
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

            <View style={{ backgroundColor: '#080247', height: 266, flex: 1, borderRadius: 16, margin: 8 }}>
              <Text style={{ marginVertical: 18, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '700', fontFamily: 'Roboto-Bold' }}>Giao Hữu 1</Text>
              <ImageBackground source={require('../../../assets/images/bg-match.png')} style={{ height: 81, justifyContent: "space-around", flexDirection: 'row' }}
                imageStyle={{}}>
                <FastImage
                  style={{ width: 60, height: 60, alignSelf: 'center' }}
                  source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/05/France-U20.webp' }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
                <View style={{ height: 60 }}>
                  <Text style={{ marginTop: 14, color: '#FFBC15', fontSize: 22, textAlign: 'center', fontWeight: '900', fontFamily: 'Roboto-Bold' }}>17:00</Text>
                  <Text style={{ marginTop: 6, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: 'Roboto-Bold' }}>24/03/2025</Text>
                </View>
                <FastImage
                  style={{ width: 60, height: 60, alignSelf: 'center' }}
                  source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/10/Mexico.webp' }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </ImageBackground>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>France U20</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>Mexico U20</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
                <LinearGradient
                  colors={['rgba(255, 187, 23, 1)', 'rgba(218, 118, 7, 1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: 140, height: 42, borderRadius: 6, justifyContent: 'center', marginRight: 2 }}
                >
                  <Text style={{ color: '#FFF', fontSize: 16, textAlign: 'center', fontWeight: '500', fontFamily: 'Roboto-Bold' }}>Xem ngay</Text>
                </LinearGradient>
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

            <View style={{ backgroundColor: '#080247', height: 266, flex: 1, borderRadius: 16, margin: 8 }}>
              <Text style={{ marginVertical: 18, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '700', fontFamily: 'Roboto-Bold' }}>Giao Hữu 2</Text>
              <ImageBackground source={require('../../../assets/images/bg-match.png')} style={{ height: 81, justifyContent: "space-around", flexDirection: 'row' }}
                imageStyle={{}}>
                <FastImage
                  style={{ width: 60, height: 60, alignSelf: 'center' }}
                  source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/05/France-U20.webp' }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
                <View style={{ height: 60 }}>
                  <Text style={{ marginTop: 14, color: '#FFBC15', fontSize: 22, textAlign: 'center', fontWeight: '900', fontFamily: 'Roboto-Bold' }}>17:00</Text>
                  <Text style={{ marginTop: 6, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: 'Roboto-Bold' }}>24/03/2025</Text>
                </View>
                <FastImage
                  style={{ width: 60, height: 60, alignSelf: 'center' }}
                  source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/10/Mexico.webp' }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </ImageBackground>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>France U20</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>Mexico U20</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
                <LinearGradient
                  colors={['rgba(255, 187, 23, 1)', 'rgba(218, 118, 7, 1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: 140, height: 42, borderRadius: 6, justifyContent: 'center', marginRight: 2 }}
                >
                  <Text style={{ color: '#FFF', fontSize: 16, textAlign: 'center', fontWeight: '500', fontFamily: 'Roboto-Bold' }}>Xem ngay</Text>
                </LinearGradient>
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

            <View style={{ backgroundColor: '#080247', height: 266, flex: 1, borderRadius: 16, margin: 8 }}>
              <Text style={{ marginVertical: 18, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '700', fontFamily: 'Roboto-Bold' }}>Giao Hữu 3</Text>
              <ImageBackground source={require('../../../assets/images/bg-match.png')} style={{ height: 81, justifyContent: "space-around", flexDirection: 'row' }}
                imageStyle={{}}>
                <FastImage
                  style={{ width: 60, height: 60, alignSelf: 'center' }}
                  source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/05/France-U20.webp' }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
                <View style={{ height: 60 }}>
                  <Text style={{ marginTop: 14, color: '#FFBC15', fontSize: 22, textAlign: 'center', fontWeight: '900', fontFamily: 'Roboto-Bold' }}>17:00</Text>
                  <Text style={{ marginTop: 6, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: 'Roboto-Bold' }}>24/03/2025</Text>
                </View>
                <FastImage
                  style={{ width: 60, height: 60, alignSelf: 'center' }}
                  source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/10/Mexico.webp' }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </ImageBackground>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>France U20</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>Mexico U20</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
                <LinearGradient
                  colors={['rgba(255, 187, 23, 1)', 'rgba(218, 118, 7, 1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: 140, height: 42, borderRadius: 6, justifyContent: 'center', marginRight: 2 }}
                >
                  <Text style={{ color: '#FFF', fontSize: 16, textAlign: 'center', fontWeight: '500', fontFamily: 'Roboto-Bold' }}>Xem ngay</Text>
                </LinearGradient>
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

            <View style={{ backgroundColor: '#080247', height: 266, flex: 1, borderRadius: 16, margin: 8 }}>
              <Text style={{ marginVertical: 18, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '700', fontFamily: 'Roboto-Bold' }}>Giao Hữu 4</Text>
              <ImageBackground source={require('../../../assets/images/bg-match.png')} style={{ height: 81, justifyContent: "space-around", flexDirection: 'row' }}
                imageStyle={{}}>
                <FastImage
                  style={{ width: 60, height: 60, alignSelf: 'center' }}
                  source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/05/France-U20.webp' }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
                <View style={{ height: 60 }}>
                  <Text style={{ marginTop: 14, color: '#FFBC15', fontSize: 22, textAlign: 'center', fontWeight: '900', fontFamily: 'Roboto-Bold' }}>17:00</Text>
                  <Text style={{ marginTop: 6, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: 'Roboto-Bold' }}>24/03/2025</Text>
                </View>
                <FastImage
                  style={{ width: 60, height: 60, alignSelf: 'center' }}
                  source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/10/Mexico.webp' }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </ImageBackground>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>France U20</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>Mexico U20</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
                <LinearGradient
                  colors={['rgba(255, 187, 23, 1)', 'rgba(218, 118, 7, 1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: 140, height: 42, borderRadius: 6, justifyContent: 'center', marginRight: 2 }}
                >
                  <Text style={{ color: '#FFF', fontSize: 16, textAlign: 'center', fontWeight: '500', fontFamily: 'Roboto-Bold' }}>Xem ngay</Text>
                </LinearGradient>
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


          </ScrollView>}

          {this.isTV() &&
            <TouchableOpacity onPress={() => { alert(this._carousel.currentIndex); g.sound.play('bet_click');}} style={{ width: screenWidth, height: screenHeight, backgroundColor: '#020d24' }}>
              <Image source={require('../../../assets/images/logo-loading.png')} style={{ position: 'absolute', alignSelf: 'center', width: '60%', height: (screenWidth * 0.6) * 0.7, resizeMode: 'stretch', top: -340, right: -100 }} />
              <View style={{ height:'5%' }} />
              <Text style={{ color: 'rgba(255, 187, 23, 1)', fontSize: 20, fontFamily: 'Roboto-Bold', marginLeft: 16 }}>TẤT CẢ CÁC TRẬN</Text>
              <Carousel
                ref={(c) => { this._carousel = c; }}
                layout={'default'}
                style={{ paddingBottom: 100 }}
                inactiveSlideScale={0.9}
                inactiveSlideOpacity={0.5}
                firstItem={0}
                useScrollView={true}
                data={['TẤT CẢ', 'BẮN CÁ', 'BẮN MÁY BAY', '123', '345', '45657']}
                renderItem={this._renderItemTV}
                sliderWidth={screenWidth}
                //sliderHeight={100}
                itemWidth={(screenWidth/3.7)}
                itemHeight={(screenWidth/3.7)*1.3}
                loop={false}
                autoplay={false}
                activeSlideAlignment={'start'}
              />
              {/* <FlatList          
                horizontal={true}
                data={['TẤT CẢ', 'BẮN CÁ', 'BẮN MÁY BAY', '123', '345', '45657','23432']}
                renderItem={this._renderItemTV}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              /> */}
              {/* <View style={{ flexDirection: 'row' }}>
                <View style={{ backgroundColor: this.state.currentTVNode == 0 ? '#080247' : "#333", height: 266, borderRadius: 16, margin: 8 }}>
                  <Text style={{ marginVertical: 18, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '700', fontFamily: 'Roboto-Bold' }}>Giao Hữu</Text>
                  <ImageBackground source={require('../../../assets/images/bg-match.png')} style={{ height: 81, justifyContent: "space-around", flexDirection: 'row' }}
                    imageStyle={{}}>
                    <FastImage
                      style={{ width: 60, height: 60, alignSelf: 'center' }}
                      source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/05/France-U20.webp' }}
                      resizeMode={FastImage.resizeMode.stretch}
                    />
                    <View style={{ height: 60 }}>
                      <View style={{ backgroundColor: '#ED1B4A', borderRadius: 13, width: 80, height: 26, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: '800', fontFamily: 'Roboto-Bold', fontSize: 13, textAlign: 'center', color: '#FFF' }}>Trực tiếp 1</Text>
                      </View>
                      <Text style={{ marginTop: 14, color: '#FFBC15', fontSize: 22, textAlign: 'center', fontWeight: '900', fontFamily: 'Roboto-Bold' }}>17:00</Text>
                      <Text style={{ marginTop: 6, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: 'Roboto-Bold' }}>24/03/2025</Text>
                    </View>
                    <FastImage
                      style={{ width: 60, height: 60, alignSelf: 'center' }}
                      source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/10/Mexico.webp' }}
                      resizeMode={FastImage.resizeMode.stretch}
                    />
                  </ImageBackground>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>France U20</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>Mexico U20</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
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
                  </View>
                </View>
                <View style={{ backgroundColor: this.state.currentTVNode == 1 ? '#080247' : "#333", height: 266, borderRadius: 16, margin: 8 }}>
                  <Text style={{ marginVertical: 18, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '700', fontFamily: 'Roboto-Bold' }}>Giao Hữu</Text>
                  <ImageBackground source={require('../../../assets/images/bg-match.png')} style={{ height: 81, justifyContent: "space-around", flexDirection: 'row' }}
                    imageStyle={{}}>
                    <FastImage
                      style={{ width: 60, height: 60, alignSelf: 'center' }}
                      source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/05/France-U20.webp' }}
                      resizeMode={FastImage.resizeMode.stretch}
                    />
                    <View style={{ height: 60 }}>
                      <View style={{ backgroundColor: '#ED1B4A', borderRadius: 13, width: 80, height: 26, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: '800', fontFamily: 'Roboto-Bold', fontSize: 13, textAlign: 'center', color: '#FFF' }}>Trực tiếp 2</Text>
                      </View>
                      <Text style={{ marginTop: 14, color: '#FFBC15', fontSize: 22, textAlign: 'center', fontWeight: '900', fontFamily: 'Roboto-Bold' }}>17:00</Text>
                      <Text style={{ marginTop: 6, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: 'Roboto-Bold' }}>24/03/2025</Text>
                    </View>
                    <FastImage
                      style={{ width: 60, height: 60, alignSelf: 'center' }}
                      source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/10/Mexico.webp' }}
                      resizeMode={FastImage.resizeMode.stretch}
                    />
                  </ImageBackground>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>France U20</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>Mexico U20</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
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
                  </View>
                </View>
                <View style={{ backgroundColor: this.state.currentTVNode == 2 ? '#080247' : "#333", height: 266, borderRadius: 16, margin: 8 }}>
                  <Text style={{ marginVertical: 18, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '700', fontFamily: 'Roboto-Bold' }}>Giao Hữu</Text>
                  <ImageBackground source={require('../../../assets/images/bg-match.png')} style={{ height: 81, justifyContent: "space-around", flexDirection: 'row' }}
                    imageStyle={{}}>
                    <FastImage
                      style={{ width: 60, height: 60, alignSelf: 'center' }}
                      source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/05/France-U20.webp' }}
                      resizeMode={FastImage.resizeMode.stretch}
                    />
                    <View style={{ height: 60 }}>
                      <View style={{ backgroundColor: '#ED1B4A', borderRadius: 13, width: 80, height: 26, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: '800', fontFamily: 'Roboto-Bold', fontSize: 13, textAlign: 'center', color: '#FFF' }}>Trực tiếp 3</Text>
                      </View>
                      <Text style={{ marginTop: 14, color: '#FFBC15', fontSize: 22, textAlign: 'center', fontWeight: '900', fontFamily: 'Roboto-Bold' }}>17:00</Text>
                      <Text style={{ marginTop: 6, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: 'Roboto-Bold' }}>24/03/2025</Text>
                    </View>
                    <FastImage
                      style={{ width: 60, height: 60, alignSelf: 'center' }}
                      source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/10/Mexico.webp' }}
                      resizeMode={FastImage.resizeMode.stretch}
                    />
                  </ImageBackground>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>France U20</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>Mexico U20</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
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
                  </View>
                </View>
                <View style={{ backgroundColor: this.state.currentTVNode == 3 ? '#080247' : "#333", height: 266, borderRadius: 16, margin: 8 }}>
                  <Text style={{ marginVertical: 18, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '700', fontFamily: 'Roboto-Bold' }}>Giao Hữu</Text>
                  <ImageBackground source={require('../../../assets/images/bg-match.png')} style={{ height: 81, justifyContent: "space-around", flexDirection: 'row' }}
                    imageStyle={{}}>
                    <FastImage
                      style={{ width: 60, height: 60, alignSelf: 'center' }}
                      source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/05/France-U20.webp' }}
                      resizeMode={FastImage.resizeMode.stretch}
                    />
                    <View style={{ height: 60 }}>
                      <View style={{ backgroundColor: '#ED1B4A', borderRadius: 13, width: 80, height: 26, justifyContent: 'center' }}>
                        <Text style={{ fontWeight: '800', fontFamily: 'Roboto-Bold', fontSize: 13, textAlign: 'center', color: '#FFF' }}>Trực tiếp 4</Text>
                      </View>
                      <Text style={{ marginTop: 14, color: '#FFBC15', fontSize: 22, textAlign: 'center', fontWeight: '900', fontFamily: 'Roboto-Bold' }}>17:00</Text>
                      <Text style={{ marginTop: 6, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: 'Roboto-Bold' }}>24/03/2025</Text>
                    </View>
                    <FastImage
                      style={{ width: 60, height: 60, alignSelf: 'center' }}
                      source={{ uri: 'https://vsc63.com/wp-content/uploads/2023/10/Mexico.webp' }}
                      resizeMode={FastImage.resizeMode.stretch}
                    />
                  </ImageBackground>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>France U20</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{ flex: 1, marginVertical: 16, color: '#FFF', fontSize: 14, textAlign: 'center', fontWeight: '800', fontFamily: 'Roboto-Bold' }}>Mexico U20</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
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
                  </View>
                </View>
              </View> */}
              <View style={{ height: screenHeight*0.08 }} />
            </TouchableOpacity>}

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
