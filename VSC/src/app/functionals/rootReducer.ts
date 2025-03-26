import { combineReducers } from 'redux';
import { commonReducer } from '../functionals/common';

export const rootReducer = () =>
  combineReducers({
    user: commonReducer,
  });
