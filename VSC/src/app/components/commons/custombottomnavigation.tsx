import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { g } from "../../g";

export default class CustomBottomNavigation extends React.Component<
  {
    visible: boolean;
    navigation: g.NavigationStackProp;
    menu: any[];
  },
  {}
> {
  constructor(props: CustomBottomNavigation["props"]) {
    super(props);
    this.state = {};
  }
  private fadeAnim = new Animated.Value(0);

  fadeOut = () => {
    Animated.timing(this.fadeAnim, {
      toValue: 70,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      /* completion callback */
      //if (finished) this.fadeAnim = new Animated.Value(60);
    });
  };

  fadeIn = () => {
    Animated.timing(this.fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      /* completion callback */
      //if (finished) this.fadeAnim = new Animated.Value(0);
    });
  };

  componentDidUpdate(prevProp: any) {
    // if (this.props.invisible !== prevProp.invisible && this.props.invisible){
    //   this.fadeOut();
    // }
    // else {this.fadeIn()}
    if (this.props.visible !== prevProp.visible)
      if (this.props.visible)
        this.fadeIn();
      else
        this.fadeOut();
  }

  handleChat = () => () => {
    g.sound.play('bet_click');

  }

  render() {
    return (
      <Animated.View style={[styles.container, { transform: [{ translateY: this.fadeAnim }] }]}>
        {this.props.menu.map((e: any, index: number) => {
          return (
            <TouchableOpacity
              key={index}
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => {
                g.sound.play('bet_click');
                if (e.route.name === 'Livechat') {
                  g.value.isContact = true;
                  g.value.currentGoToLink = 'https://secure.livechatinc.com/licence/14834172/v2/open_chat.cgi';
                  this.props.navigation.navigate('Webview');
                } else {
                  this.props.navigation.navigate(
                    e.route.name,
                    e.route.data !== null ? { data: e.route.data } : {}
                  );
                }
              }}
            >
              {e.icon}
              <Text
                style={[
                  {
                    textAlign: "center",
                    fontFamily: "Roboto-Regular",
                    fontSize: 12,
                    paddingTop: 5,
                    fontWeight: "500",
                  },
                  e.color ? { color: e.color } : { color: e.name === 'Nạp tiền' ? "#d62828" : "#B5B6BE" },
                ]}
              >
                {e.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 99,
    height: 70,
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: "#fff",
    shadowColor: "#828282",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 3,
    shadowOpacity: 0.8,
    elevation: 1,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
