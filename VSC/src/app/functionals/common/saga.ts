import { takeLatest, all, put, call, take } from 'redux-saga/effects';
import * as api from './api';
import actiontypes from './actionTypes';
import * as actions from './actions';
import { showMessage, hideMessage } from "react-native-flash-message";
import { Platform } from 'react-native';
import { g } from '../../g'
import { Alert } from 'react-native';
import moment from 'moment';
export function* resetCommon(action: any) {
  try {
  } catch (error) { }
}

const callAlertMessage = (typemess: any, mess: string,) => {
  showMessage({
    message: mess,
    type: typemess,
    icon: { icon: typemess, position: "left" }
  });
}

export function* userRegister(action: any) {
  try {
    let response = yield call(api.default.register, action.username, action.password, action.password, action.phone);
    //console.log('responseresponse ------------->', response.data);
    if (response.data.status === 'OK') {
      g.storage.user = { username: action.username, pass: action.password };
      g.storage.lastRefresh = { lastTimeRefresh: moment().toString() };

      let userData = response?.data?.data[0];
      yield put({
        type: actiontypes.LOGIN_SUCCESS,
        user: {
          id: userData?.id,
          username: userData?.username,
          fullname: userData?.fullname,
          birthday: userData?.birthday,
          phone: userData?.phone,
          is_verify_phone: userData?.is_verify_phone,
          is_verify_telegram: userData?.is_verify_telegram,
          balance: userData?.balance,
          //balanceSub: 0,
          email: userData?.email,
          token: userData?.token,
        },
      })
      action?.navigation.goBack();
      //action?.navigation?.navigate("Home");
    } else {
      let userData = response.data;
      callAlertMessage('danger', userData?.message);
      action.navigation.navigate("LoginAndRegister");
      yield put({ type: actiontypes.REGISTER_FAIL, });
    }
  } catch (error) {
    callAlertMessage('danger', 'Có lỗi xảy ra khi đăng ký! không thể kết nối dến dịch vụ!');
    action.navigation.navigate("LoginAndRegister");
    yield put({ type: actiontypes.REGISTER_FAIL, });
  }
}

export function* userLogout(action: any) {
  try {
    let response = yield call(api.default.logout);
    //console.log('responseresponse ------------->', response);
    if (response.data.code === 200) {
      yield put({ type: actiontypes.LOGOUT_SUCCESS })
    } else {
      yield put({
        type: actiontypes.LOGOUT_FAIL,
      });
    }
  } catch (error) {
    yield put({
      type: actiontypes.LOGOUT_FAIL,
    });
  }
}

export function* userLogin(action: any) {
  try {
    let response = yield call(api.default.login, action.username, action.password);
    //console.log('Login responseresponse ------------->', JSON.stringify(response.data));
    if (response?.data?.status === 'OK') {
      g.storage.user = { username: action.username, pass: action.password };
      g.storage.lastRefresh = { lastTimeRefresh: moment().toString() };

      //action.navigation.navigate("Home");
      action.navigation.goBack();
      let userData = response.data.data[0];
      yield put({
        type: actiontypes.LOGIN_SUCCESS,
        user: {
          id: userData.id,
          username: userData.username,
          fullname: userData.fullname,
          birthday: userData?.birthday,
          phone: userData.phone,
          bank_name: userData.bank_name,
          is_verify_phone: userData.is_verify_phone,
          is_verify_telegram: userData.is_verify_telegram,
          balance: userData.balance,
          balanceSub: userData.balanceSub,
          email: userData.email,
          token: userData.token,
          tp_token: userData.tp_token,
        },
      });
      yield put({ type: actiontypes.UPDATEPROFILE, });
    } else {
      let errorData = response.data;
      if (errorData?.status === 'SHOW_MESSAGE') {
        //errorData.message === "Bạn đang đăng nhập. Vui lòng Đăng xuất và Đăng nhập lại nếu muốn"
        yield put({ type: actiontypes.HANDLE_LOGOUT, });
        yield put({ type: actiontypes.HANDLE_LOGIN, username: action.username, password: action.password, navigation: action.navigation });
      } else {
        callAlertMessage('danger', errorData.message);
        yield put({ type: actiontypes.LOGIN_FAIL, });
      }
    }
  } catch (error) {
    callAlertMessage('danger', 'Có lỗi khi đăng nhập');
    yield put({ type: actiontypes.LOGIN_FAIL, });
  }
}

export function* refresh(action: any) {
  try {
    let response = yield call(api.default.refresh);
    //console.log('REFRESH responseresponse ------------->', response.data);
    let userData = response.data?.user;
    if (response.data?.status === 'OK') {
      if (!userData?.username && (moment() < moment(g.storage.lastRefresh.lastTimeRefresh).add(10, 'minutes')) ) { 
        callAlertMessage('danger', 'Phiên đăng nhập đã kết thúc hoặc đã đăng nhập ở thiết bị khác!');
        yield put({ type: actiontypes.HANDLE_LOGOUT })
      } else { 
        g.storage.lastRefresh = { lastTimeRefresh: moment().toString() };
        yield put({
          type: actiontypes.REFRESH_SUCCESS,
          user: {
            id: userData.id,
            username: userData.username,
            fullname: userData.fullname,
            birthday: userData?.birthday,
            phone: userData.phone,
            bank_name: userData.bank_name,
            is_verify_phone: userData.is_verify_phone,
            is_verify_telegram: userData.is_verify_telegram,
            balance: userData.balance,
            balanceSub: userData.balanceSub,
            email: userData.email,
            //token: userData.token,
            tp_token: userData.tp_token,
          },
        });
        yield put({ type: actiontypes.UPDATEPROFILE, });
      }
    } else {
      //console.log('REFRESH responseresponse ------------->', response.data)
      action.navigation.navigate('Home');
      yield put({ type: actiontypes.REFRESH_FAIL, });

      let userdata = g.storage.user;
      if (userdata.username !== '') {
        yield put({ type: actiontypes.HANDLE_LOGIN, username: userdata.username, password: userdata.pass, navigation: action.navigation });
      }
    }
  } catch (error: any) {
    //console.log('REFRESH responseresponse 111 ------------->', JSON.stringify(error));
    if (error?.message == 'Network Error') {
      //cheat force restart app

    } else {
      action.navigation.navigate('Home');
      if ((error?.message == 'Request failed with status code 401')
        && (moment() < moment(g.storage.lastRefresh.lastTimeRefresh).add(10, 'minutes'))) {
        callAlertMessage('danger', 'Phiên đăng nhập đã kết thúc hoặc đã đăng nhập ở thiết bị khác!');
        yield put({ type: actiontypes.HANDLE_LOGOUT })
      } else {
        yield put({ type: actiontypes.REFRESH_FAIL, });
        let userdata = g.storage.user;
        if (userdata.username !== '') {
          yield put({ type: actiontypes.HANDLE_LOGIN, username: userdata.username, password: userdata.pass, navigation: action.navigation });
        }
      }
    }
  }
}

export function* saveUserBank(action: any) {
  try {
    let response = yield call(api.default.saveuserbank, action.bank_code, action.bank_account_name, action.bank_account_no);
    //console.log('responseresponse ------------->', response.data);
    let userData = response.data;
    if (userData.status === 'OK') {
      if (userData?.data?.status !== 'OK') {
        callAlertMessage('danger', userData?.data?.message);
        yield put({ type: actiontypes.BANK_SAVE_FAIL, })
      } else {
        action.navigation.goBack();
        callAlertMessage('success', 'Đã lưu tài khoản ngân hàng thành công!');
        yield put({ type: actiontypes.USER_ALL_BANK, })
      }
    } else {
      callAlertMessage('danger', 'Hệ thống không thể thực hiện. Xin thử lại sau!');
      yield put({ type: actiontypes.BANK_SAVE_FAIL, })
    }
  } catch (error) {
    callAlertMessage('danger', 'Hệ thống không thể thực hiện. Xin thử lại sau!');
    yield put({ type: actiontypes.BANK_SAVE_FAIL, })
  }
}

export function* getUserAllBank(action: any) {
  try {
    let response = yield call(api.default.getuserbank);
    //console.log('responseresponse ------------->', response.data);
    let userData = response.data;
    if (userData.status === 'OK') {
      yield put({
        type: actiontypes.USER_ALL_BANK_SUCCESS,
        user: {
          userAllBank: userData.data,
        },
      })
    } else {
      callAlertMessage('danger', 'Hệ thống không thể thực hiện. Xin thử lại sau!');
    }
  } catch (error) {
    callAlertMessage('danger', 'Hệ thống không thể thực hiện. Xin thử lại sau!');
  }
}

export function* updateUserBank(action: any) {
  try {
    let response = yield call(api.default.updateuserbank, action.id, action.bank_code, action.bank_account_name, action.bank_account_no);
    //console.log('updateUserBank responseresponse ------------->', response.data);
    let userData = response.data;
    if (userData.status === 'OK') {
      callAlertMessage('success', 'Tài khoản ngân hàng đã được thay đổi');
      yield put({
        type: actiontypes.BANK_UPDATE_SUCCESS,
        user: {
          index: action.index,
          bank_account_updated: action.bank_account_no,
        },
      });
      action.navigation.goBack();
      //yield put({type: actiontypes.USER_ALL_BANK,})
    } else {
      callAlertMessage('danger', userData.message);
      yield put({ type: actiontypes.BANK_UPDATE_FAIL, })
    }
  } catch (error) {
    callAlertMessage('danger', 'Hệ thống không thể thực hiện. Xin thử lại sau!');
    yield put({ type: actiontypes.BANK_UPDATE_FAIL, })
  }
}

export function* deleteUserBank(action: any) {
  try {
    let response = yield call(api.default.deleteuserbank, action.id);
    //console.log('deleteUserBank responseresponse ------------->', response.data);
    let userData = response.data;
    if (userData.status === 'OK') {
      callAlertMessage('success', 'Xoá tài khoản ngân hàng thành công!');
      yield put({ type: actiontypes.USER_ALL_BANK, })

    } else {
      callAlertMessage('danger', userData.message);
      yield put({ type: actiontypes.BANK_DELETE_FAIL, });
    }
  } catch (error) {
    callAlertMessage('danger', 'Hệ thống không thể thực hiện. Xin thử lại sau!');
    yield put({ type: actiontypes.BANK_DELETE_FAIL, });
  }
}

export function* amountTransfer(action: any) {
  try {
    let response = yield call(api.default.transfer, action.amount, action.strType);
    //console.log('withdraw CARD responseresponse ------------->', response);
    let userData = response.data;
    if (userData.status === 'OK') {
      callAlertMessage('success', 'Chuyển ví thành công!');
      yield put({
        type: actiontypes.AMOUNT_TRANSFER_SUCCESS,
        user: {
          changeAmount: action.amount,
          strType: action.strType,
        },
      });
    } else {
      callAlertMessage('danger', 'Hệ thống không thể thực hiện. Xin thử lại sau!');
    }
  } catch (error) {
    callAlertMessage('danger', 'Hệ thống không thể thực hiện. Xin thử lại sau!');
  }
}

export function* updateinfo(action: any) {
  try {
    let response = yield call(api.default.updateinfo, action.fullname, action.email);
    //console.log('updateinfo responseresponse ------------->', response.data);
    let userData = response.data;
    if (userData.status === 'OK') {
      callAlertMessage('success', 'Cập nhật dữ liệu thành công!');
      yield put({
        type: actiontypes.UPDATEINFO_SUCCESS,
        user: {
          fullname: userData.user?.fullname,
          email: userData.user?.email,
        },
      });
    } else {
      callAlertMessage('danger', 'Hệ thống không thể thực hiện. Xin thử lại sau!');
    }
  } catch (error) {
    callAlertMessage('danger', 'Hệ thống không thể thực hiện. Xin thử lại sau!');
  }
}

export function* updateprofile(action: any) {
  try {
    let response = yield call(api.default.getUserProfile);
    //console.log('updateinfo responseresponse ------------->', response.data);
    let userData = response.data;
    if (userData.status === 'OK') {
      //callAlertMessage('success', 'Cập nhật dữ liệu thành công!');
      yield put({
        type: actiontypes.UPDATEPROFILE_SUCCESS,
        user: {
          level: userData.data?.level,
          next_level: userData.data?.next_level,
          remaining_points: userData.data?.remaining_points
        },
      });
    } else {
      callAlertMessage('danger', 'Hệ thống không thể thực hiện. Xin thử lại sau!');
    }
  } catch (error) {
    callAlertMessage('danger', 'Hệ thống không thể thực hiện. Xin thử lại sau!');
  }
}

export default function* root() {
  yield all([takeLatest(actiontypes.RESET_COMMON, resetCommon),
  takeLatest(actiontypes.HANDLE_REFRESH, refresh),
  takeLatest(actiontypes.UPDATEINFO, updateinfo),
  takeLatest(actiontypes.UPDATEPROFILE, updateprofile),
  // takeLatest(actiontypes.AMOUNT_TRANSFER, amountTransfer),
  // takeLatest(actiontypes.BANK_SAVE, saveUserBank),
  //takeLatest(actiontypes.WITHDRAW_BANK, withdrawBank),
  //takeLatest(actiontypes.WITHDRAW_CARD, withdrawCard),
  // takeLatest(actiontypes.BANK_UPDATE, updateUserBank),
  // takeLatest(actiontypes.BANK_DELETE, deleteUserBank),
  // takeLatest(actiontypes.USER_ALL_BANK, getUserAllBank),
  takeLatest(actiontypes.HANDLE_REGISTER, userRegister),
  takeLatest(actiontypes.HANDLE_LOGIN, userLogin),
  takeLatest(actiontypes.HANDLE_LOGOUT, userLogout)]);
}
