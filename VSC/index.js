/**
 * @format
 */

import { AppRegistry, View } from 'react-native';
import App from './src/app/app';
import { name as appName } from './app.json';

//import CodePush from 'react-native-code-push';

AppRegistry.registerComponent(appName, () => App);

// AppRegistry.registerComponent(appName, () => CodePush({
//     updateDialog: {
//       optionalInstallButtonLabel: 'Cài đặt',
//       optionalIgnoreButtonLabel: 'Bỏ qua',
//       title: 'Cập nhật có sẵn',
//       optionalUpdateMessage: 'Đã có bản cập nhật, bạn có muốn cài đặt nó?',
//     },
//     installMode: CodePush.InstallMode.IMMEDIATE,
//     checkFrequency: CodePush.CheckFrequency.ON_APP_START,
//   })(App),
// );

// class TestApp extends Component {
//   codePushStatusDidChange(status) {
//       switch(status) {
//           case codePush.SyncStatus.CHECKING_FOR_UPDATE:
//               console.log("Checking for updates.");
//               break;
//           case codePush.SyncStatus.DOWNLOADING_PACKAGE:
//               console.log("Downloading package.");
//               break;
//           case codePush.SyncStatus.INSTALLING_UPDATE:
//               console.log("Installing update.");
//               break;
//           case codePush.SyncStatus.UP_TO_DATE:
//               console.log("Up-to-date.");
//               break;
//           case codePush.SyncStatus.UPDATE_INSTALLED:
//               console.log("Update installed.");
//               break;
//       }
//   }

//   codePushDownloadDidProgress(progress) {
//       console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
//   }
// }
// const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START };
// //const TestApp = codePush(codePushOptions)(TestApp);

// AppRegistry.registerComponent(appName, () => TestApp);

// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View,
//   Button,
// } from 'react-native';
// import CodePush from 'react-native-code-push';
// //import app from 'app/containers/app/app';

// const CodePushConfig = {
//   updateDialog: true,
//   installMode: CodePush.InstallMode.IMMEDIATE
// }
// export default class RNCodePush extends Component {

//   checkForUpdates = () => {
//     CodePush.sync(CodePushConfig);
//   }

//   codePushStatusDidChange(status) {
//       switch(status) {
//           case codePush.SyncStatus.CHECKING_FOR_UPDATE:
//               console.log("Checking for updates.");
//               break;
//           case codePush.SyncStatus.DOWNLOADING_PACKAGE:
//               console.log("Downloading package.");
//               break;
//           case codePush.SyncStatus.INSTALLING_UPDATE:
//               console.log("Installing update.");
//               break;
//           case codePush.SyncStatus.UP_TO_DATE:
//               console.log("Up-to-date.");
//               break;
//           case codePush.SyncStatus.UPDATE_INSTALLED:
//               console.log("Update installed.");
//               break;
//       }
//   }

//   codePushDownloadDidProgress(progress) {
//       console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
//   }
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>
//           Welcome to React Native Version 1!
//         </Text>
//         <Button
//           title='Check for Updates'
//           onPress={this.checkForUpdates}
//         />     
//       </View>
//     );
//   }
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//   },
// });
// App = CodePush(CodePushConfig)(RNCodePush);
// AppRegistry.registerComponent(appName, () => App);