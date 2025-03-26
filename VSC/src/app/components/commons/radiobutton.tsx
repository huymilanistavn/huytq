import { g } from "../../g";
import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import CheckIcon from "../../../assets/images/checkmark.svg";

export default class RadioButton extends React.Component<
  { data: any; height: any; onSelected: Function },
  { selected: any; data: any }
> {
  constructor(props: RadioButton["props"]) {
    super(props);
    this.state = {
      selected: null,
      data: this.props.data,
    };
  }

  render() {
    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          height: this.props.height,
        }}
      >
        {this.state.data.map((item: any, index: number) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                g.sound.play("bet_click");
                this.props.onSelected(index);
                this.setState({ selected: index });
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "transparent",
                height: 20,
              }}
            >
              <View
                style={
                  index === this.state.selected
                    ? [
                        styles.radioSelected,
                        {
                          backgroundColor: item.activeColor,
                          borderColor: item.activeColor,
                        },
                      ]
                    : styles.radioUnselected
                }
              >
                {index === this.state.selected ? (
                  <CheckIcon height={8} width={8} />
                ) : null}
              </View>

              <Text
                style={
                  index === this.state.selected
                    ? [styles.selected, { color: item.activeColor }]
                    : styles.unselected
                }
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  unselected: {
    color: "#828282",
    fontSize: 16,
    paddingLeft: 10,
    fontWeight: "500",
  },
  selected: {
    fontSize: 16,
    paddingLeft: 10,
    fontWeight: "500",
  },
  radioUnselected: {
    height: 16,
    width: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#828282",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    height: 16,
    width: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
