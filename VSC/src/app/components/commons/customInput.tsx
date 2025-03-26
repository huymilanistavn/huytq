import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
//import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default class CustomInput extends React.Component<{}, {}> {
  constructor(props: CustomInput["props"]) {
    super(props);
    this.state = {
      hidden: true,
      password: this.props.password || false,
      label: this.props.label || "Label",
    };
  }

  checkValid() {
    return this.props.valid !== undefined && this.props.valid === true;
  }

  render() {
    return (
      <View>
        <View
          style={[
            style.inputContainer,
            {
              borderColor:
                this.props.error || this.props.valid === false
                  ? "#FC8282"
                  : this.props.valid === true
                  ? "#6FCF97"
                  : "transparent",
              borderWidth: 2,
            },
          ]}
        >
          <TextInput
            {...this.props}
            autoCorrect={false}
            style={{
              marginHorizontal: 15,
              width:
                this.state.password || this.props.valid !== undefined
                  ? "80%"
                  : "90%",
            }}
            placeholderTextColor="#828282"
            secureTextEntry={this.state.password && this.state.hidden}
            value={this.state.value}
            onChangeText={(value) => {
              this.props.onChangeText(value);
            }}
            //keyboardType=''
          />

          {/* {this.state.password ? (
            <MaterialIcons
              name={this.state.hidden ? "visibility" : "visibility-off"}
              color="#828282"
              size={20}
              style={{ marginRight: 20 }}
              onPress={() => this.setState({ hidden: !this.state.hidden })}
            />
          ) : null}
          {this.props.valid !== undefined ? (
            <MaterialIcons
              name={this.checkValid() ? "check" : "close"}
              size={20}
              style={{ marginRight: 20 }}
              color={this.checkValid() ? "#6FCF97" : "#FC8282"}
            />
          ) : null} */}
        </View>
        {this.props.error ? (
          <Text
            style={{
              marginHorizontal: 20,
              paddingTop: 5,
              paddingLeft: 5,
              color: "#D62828",
            }}
          >
            {this.props.error}
          </Text>
        ) : null}
      </View>
    );
  }
}

const style = StyleSheet.create({
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginTop: 15,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
});
