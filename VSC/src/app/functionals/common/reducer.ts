import actionTypes from './actionTypes';

const initialState: any = {
  username: '',
  fullname: '',
  birthday: '',
  phone: '',
  email: '',
  bank_name: '',
  is_verify_phone: false,
  is_verify_telegram: false,
  balance: 0,
  balanceSub: 0,
  token: '',
  tp_token: '',
  level: '',
  next_level: '',
  remaining_points: 0
};

export default function commonReducer(state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.RESET_COMMON:
      return { ...state };

    /** REGISTER */
    case actionTypes.HANDLE_REGISTER:
      return {
        ...state,
      };
    case actionTypes.REGISTER_FAIL:
      return {
        ...state,
      };

    /** LOGIN */
    case actionTypes.HANDLE_LOGIN:
      return {
        ...state,
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        username: action.user.username,
        fullname: action.user.fullname,
        birthday: action.user.birthday,
        phone: action.user.phone,
        email: action.user.email,
        bank_name: action.user.bank_name,
        is_verify_phone: action.user.is_verify_phone,
        is_verify_telegram: action.user.is_verify_telegram,
        balance: action.user.balance,
        balanceSub: action.user.balanceSub,
        token: action.user.token,
        tp_token: action.user.tp_token,
      };
    case actionTypes.LOGIN_FAIL:
      return {
        ...state,
        username: '',
        phone: '',
      };

      {/** REFRESH */ }
    case actionTypes.HANDLE_REFRESH:
      return {
        ...state,
      };
    case actionTypes.REFRESH_SUCCESS:
      return {
        ...state,
        username: action.user.username,
        fullname: action.user.fullname,
        birthday: action.user.birthday,
        phone: action.user.phone,
        email: action.user.email,
        bank_name: action.user.bank_name,
        is_verify_phone: action.user.is_verify_phone,
        is_verify_telegram: action.user.is_verify_telegram,
        balance: action.user.balance,
        balanceSub: action.user.balanceSub,
        tp_token: action.user.tp_token,
      };
    case actionTypes.REFRESH_FAIL:
      return {
        ...state,
        username: '',
        phone: '',
      };

    /** LOGOUT */
    case actionTypes.HANDLE_LOGOUT:
      return {
        ...state,
      };
    case actionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        username: '',
        phone: '',
        balance: 0,
      };
    case actionTypes.LOGOUT_FAIL:
      return {
        ...state,
        username: '',
        phone: ''
      };

    /** BANK SAVE */
    case actionTypes.BANK_SAVE:
      return {
        ...state,
      };
    case actionTypes.BANK_SAVE_SUCCESS:
      return {
        ...state,
      };
    case actionTypes.BANK_SAVE_FAIL:
      return {
        ...state,
      };

    /** GET ALL BANK */
    case actionTypes.USER_ALL_BANK:
      return {
        ...state,
      };
    case actionTypes.USER_ALL_BANK_SUCCESS:
      return {
        ...state,
        userAllBank: action.user.userAllBank,
      };

    /** UPDATE BANK */
    case actionTypes.BANK_UPDATE:
      return {
        ...state,
      };
    case actionTypes.BANK_UPDATE_SUCCESS:
      let temp = state.userAllBank;
      temp[action.user.index].bank_account_no = action.user.bank_account_updated;
      return {
        ...state,
        userAllBank: temp,
      };
    case actionTypes.BANK_UPDATE_FAIL:
      return {
        ...state,
      };

    /** DELETE BANK */
    case actionTypes.BANK_DELETE:
      return {
        ...state,
      };
    case actionTypes.BANK_DELETE_FAIL:
      return {
        ...state,
      };

    /** WITHDRAW BANK */
    case actionTypes.WITHDRAW_BANK:
      return {
        ...state,
      };
    case actionTypes.WITHDRAW_BANK_SUCCESS:
      return {
        ...state,
      };
    case actionTypes.WITHDRAW_BANK_FAIL:
      return {
        ...state,
      };

    /** WITHDRAW CARD */
    case actionTypes.WITHDRAW_CARD:
      return {
        ...state,
      };
    case actionTypes.WITHDRAW_CARD_SUCCESS:
      return {
        ...state,
      };
    case actionTypes.WITHDRAW_CARD_FAIL:
      return {
        ...state,
      };


    /** TRANSFER AMOUNT */
    case actionTypes.AMOUNT_TRANSFER:
      return {
        ...state,
      };
    case actionTypes.AMOUNT_TRANSFER_SUCCESS:
      return {
        ...state,
        balance: action.user.strType === 'DEPOSIT' ? (state.balance + action.user.changeAmount) : (state.balance - action.user.changeAmount),
        //balanceSub: action.user.strType === 'DEPOSIT' ? (state.balanceSub - action.user.changeAmount) : (state.balanceSub + action.user.changeAmount),
      };

    /** UPDATEINFO */
    case actionTypes.UPDATEINFO:
      return {
        ...state,
      };
    case actionTypes.UPDATEINFO_SUCCESS:
      return {
        ...state,
        fullname: action.user.fullname,
        email: action.user.email,
      };
    /** UPDATEPROFILE */
    case actionTypes.UPDATEPROFILE:
      return {
        ...state,
      };
    case actionTypes.UPDATEPROFILE_SUCCESS:
      return {
        ...state,
        level: action.user.level,
        next_level: action.user.next_level,
        remaining_points: action.user.remaining_points
      };

    default:
      return state;
  }
}

