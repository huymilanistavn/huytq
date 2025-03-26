import { createSelector } from 'reselect';

export const getCommonState = (state: any) => {
  return state.common;
};


export const makeSelectUserName = createSelector(getCommonState, (commonState) => {
  if(!!commonState){
    return commonState.username;
  }
})
