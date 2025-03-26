import { all, fork } from 'redux-saga/effects';
import { commonSaga } from '../functionals/common';

export const rootSaga = function* root() {
  yield all([fork(commonSaga)]);
};
