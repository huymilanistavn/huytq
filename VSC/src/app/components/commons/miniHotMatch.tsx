import { g } from "../../g";
import * as React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import ReadMoreIcon from "../../../assets/images/menu-read-more-active.svg";
import moment from "moment";
import Config from 'react-native-config';
const screenWidth = Dimensions.get("screen").width;

export default class MiniHotmatch extends React.Component<
  {},
  { hotmatches: any; baseURL: string }
> {
  _isMounted = false;
  constructor(props: MiniHotmatch["props"]) {
    super(props);
    this.state = {
      hotmatches: [],
      baseURL: Config.URL_HOST_IMG1,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    g.api.hotMatchList().then((res: any) => {
      if (res.data.code === 200 && this._isMounted === true) {
        this.setState({
          hotmatches: res.data.data,
        });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  renderHotmatchItem = (hotmatch: any, index: number) => {
    return (
      <TouchableOpacity style={styles.tabBarItem} key={index}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View style={{ width: "40%", flexDirection: "row" }}>
            <FastImage
              style={styles.flagIcon}
              source={{
                uri: `${this.state.baseURL}${hotmatch.homeTeam[0].logo}`,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <FastImage
              style={styles.flagIcon}
              source={{
                uri: `${this.state.baseURL}${hotmatch.awayTeam[0].logo}`,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <Text
            style={styles.textTeamName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {hotmatch.homeTeam[0].name}
          </Text>
          <Text
            style={styles.textTeamName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {hotmatch.awayTeam[0].name}
          </Text>
        </View>
        <View style={{ width: "60%", flexDirection: "column" }}>
          <Text style={styles.competitionName}>
            {hotmatch.competition[0].name}
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignSelf: "flex-end",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                paddingTop: 4,
                fontWeight: "bold",
                color: "#D62828",
                fontFamily: "Roboto",
              }}
            >
              {moment(hotmatch.utcDate).format("HH:mm")}
            </Text>
            <Text
              style={{
                fontSize: 12,
                paddingTop: 4,
                fontWeight: "400",
                color: "#033254",
                fontFamily: "Roboto",
              }}
            >
              {" "}
              - {moment(hotmatch.utcDate).format("DD/MM")}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            {!hotmatch.oddsKS.length
              ? this.renderOdd("-")
              : this.renderOdd(
                  hotmatch.oddsKS[0].ft.hdp[0].hTeam[0] !== ""
                    ? hotmatch.oddsKS[0].ft.hdp[0].hTeam[0]
                    : `${-hotmatch.oddsKS[0].ft.hdp[0].aTeam[0]}`
                )}
            {!hotmatch.oddsKS.length
              ? this.renderOdd("-")
              : this.renderOdd(hotmatch.oddsKS[0].ft.hdp[0].hTeam[1])}
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            {!hotmatch.oddsKS.length
              ? this.renderOdd("-")
              : this.renderOdd(
                  hotmatch.oddsKS[0].ft.hdp[0].aTeam[0] !== ""
                    ? hotmatch.oddsKS[0].ft.hdp[0].aTeam[0]
                    : `${-hotmatch.oddsKS[0].ft.hdp[0].hTeam[0]}`
                )}
            {!hotmatch.oddsKS.length
              ? this.renderOdd("-")
              : this.renderOdd(hotmatch.oddsKS[0].ft.hdp[0].aTeam[1])}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // checkOddData = (odd: any, otherOdd: any) => {
  //   let data = 0;
  //   if (odd !== "") data = odd;
  //   else data = -otherOdd;
  //   return data;
  // };

  renderOdd = (odd: string) => {
    return (
      <View style={{ width: "40%", paddingLeft: 5 }}>
        <View
          style={{
            backgroundColor: "#E9EAED",
            borderRadius: 5,
            padding: 2,
          }}
        >
          <Text style={{ textAlign: "center", color: "#4F4F4F", fontSize: 12 }}>
            {odd}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          resizeMode="cover"
          style={styles.bgImage}
          source={require("../../../assets/images/mask-group.png")}
        >
          <View style={styles.subTitle}>
            <Text style={styles.textSubTitle}>{"LỊCH THI ĐẤU BÓNG ĐÁ"}</Text>
            <TouchableOpacity onPress={() => {}}>
              <ReadMoreIcon />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.tabBar}
            scrollEnabled={true}
            horizontal={true}
            alwaysBounceHorizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {this.state.hotmatches.map((item: any) => item.oddsKS.length > 0)
              .length > 0 ? (
              this.state.hotmatches.map((item: Object, index: number) =>
                this.renderHotmatchItem(item, index)
              )
            ) : (
              <Text style={styles.emptyHotmatch}>
                Danh sách các trận đấu sẽ được cập nhật trong thời gian sớm nhất
              </Text>
            )}
          </ScrollView>
          <View />
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
  },
  tabBar: {
    height: 48,
    paddingHorizontal: 5
  },
  tabBarItem: {
    marginHorizontal: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
    width: screenWidth / 1.5,
    height: ((screenWidth - 30) / 1.8) * 0.52,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    flex: 1,
  },
  bgImage: {
    backgroundColor: "#F3F1EE",
    flex: 1,
    width: screenWidth,
    height: ((screenWidth - 30) / 1.2) * 0.52,
  },
  subTitle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 5,
    paddingTop: 12,
  },
  textSubTitle: {
    color: "#033254",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  flagIcon: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  textTeamName: {
    fontSize: 12,
    paddingTop: 7,
    fontWeight: "400",
    color: "#141414",
    fontFamily: "Roboto",
  },
  competitionName: {
    textTransform: "uppercase",
    fontFamily: "Roboto",
    fontSize: 10,
    fontWeight: "400",
    color: "#828282",
    letterSpacing: -0.5,
    textAlign: "right",
  },
  emptyHotmatch: {
    width: screenWidth,
    paddingHorizontal: 20,
    paddingVertical: 15,
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 14,
    lineHeight: 16,
    color: "#4f4f4f",
    fontWeight: "700",
    letterSpacing: -0.5,
  },
});
