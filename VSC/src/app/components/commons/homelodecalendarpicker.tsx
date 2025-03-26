import moment from "moment";
import React from "react";
import {
  Dimensions, StyleSheet,
  Text, View
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import Tooltip from "react-native-walkthrough-tooltip";
import ArrowIcon from "../../../assets/images/arrow-drop-down.svg";
import CalendarIcon from "../../../assets/images/calendar-icon.svg";
import { g } from '../../g';
const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default class HomeLodeCalendarPicker extends React.Component<
  {
    toolTipVisible: boolean;
    onChange: Function;
  },
  {
    date: any;
    toolTipVisible: boolean;
  }
> {
  _isMounted = false;

  constructor(props: HomeLodeCalendarPicker["props"]) {
    super(props);
    this.state = {
      toolTipVisible: props.toolTipVisible,
      date: moment(Date()).add(-1, 'days'),
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date: any) {
    this.props.onChange(moment(date).format("DD-MM-YYYY"));
    this.setState({
      date: date,
      toolTipVisible: false,
    });
  }
  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <Tooltip
        isVisible={this.state.toolTipVisible}
        content={
          <View>
            <CalendarPicker
              onDateChange={this.onDateChange}
              width={screenWidth * 0.9}
              previousComponent={
                <ArrowIcon style={{ transform: [{ rotate: "90deg" }] }} />
              }
              nextComponent={
                <ArrowIcon style={{ transform: [{ rotate: "270deg" }] }} />
              }
              selectedDayColor="#4bd"
              weekdays={[
                "CN",
                "Thứ 2",
                "Thứ 3",
                "Thứ 4",
                "Thứ 5",
                "Thứ 6",
                "Thứ 7",
              ]}
              months={[
                "Tháng 1",
                "Tháng 2",
                "Tháng 3",
                "Tháng 4",
                "Tháng 5",
                "Tháng 6",
                "Tháng 7",
                "Tháng 8",
                "Tháng 9",
                "Tháng 10",
                "Tháng 11",
                "Tháng 12",
              ]}
            />
          </View>
        }
        placement="top"
        onClose={() => {g.sound.play('bet_click'); this.setState({ toolTipVisible: false })}}
      >
        <TouchableOpacity
          onPress={() => {g.sound.play('bet_click'); this.setState({ toolTipVisible: true })}}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f2f2f2",
              borderRadius: 4,
              //marginLeft: 10,
              //paddingHorizontal: 10,
              width: 150,
              height: 40,
            }}
          >
            <Text
              style={{
                color: "#4F4F4F",
                //width: "100%",
                marginLeft:15,
                textAlign: "center",
                paddingRight: 30,
              }}
            >
              {moment(this.state.date).format("DD/MM/YYYY")}
            </Text>
            <CalendarIcon height={25} width={25} />
          </View>
        </TouchableOpacity>
      </Tooltip>
    );
  }
}

const styles = StyleSheet.create({});
