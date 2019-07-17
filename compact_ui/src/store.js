import {createStore, applyMiddleware, compose} from "redux";
// import promiseMiddleWare from "redux-promise";
import createSagaMiddleware from "redux-saga";
// import reducers from "./reducers";
import mySaga from "./sagas";

import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native

import rootReducer from './reducers';

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function createStoreWithMiddleware() {
    const sagaMiddleware = createSagaMiddleware();

    const middleware = [sagaMiddleware];

    const enhancers = compose(
        applyMiddleware(...middleware),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    );

    // const store = createStore(reducers, enhancers);    // Without redux-persist

    const store = createStore(persistedReducer, enhancers);
    let persistor = persistStore(store);

    sagaMiddleware.run(mySaga);

    // return store;       // Without redux-persist
    return {store, persistor};
}
