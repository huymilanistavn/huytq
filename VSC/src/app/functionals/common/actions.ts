import actionTypes from './actionTypes';

export const resetCommon = (): any => {
  return {
    type: actionTypes.RESET_COMMON,
  };
};

export const userLogin = (): any => {
  return {
    type: actionTypes.HANDLE_LOGIN,
  };
};
export const loginSuccess = (): any => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
  };
};
export const loginFail = (): any => {
  return {
    type: actionTypes.LOGIN_FAIL,
  };
};