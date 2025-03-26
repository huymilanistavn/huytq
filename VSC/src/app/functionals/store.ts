import { Store, createStore, applyMiddleware, compose } from 'redux';
import Config from 'react-native-config';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';

const sagaMiddleware = createSagaMiddleware();
export const configureStore = (): Store<any> => {
  let middleware = applyMiddleware(sagaMiddleware);
  if (Config.NODE_ENV !== 'production') {
    const composeEnhancers = (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose) || compose;
    middleware = composeEnhancers(middleware);
  }

  const store = createStore(rootReducer() as any, {}, middleware) as any;
  sagaMiddleware.run(rootSaga);
  (window as any).store = store;
  return store;
};
