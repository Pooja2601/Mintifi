import {createStore, applyMiddleware, compose} from "redux";
// import promiseMiddleWare from "redux-promise";
import createSagaMiddleware from "redux-saga";

import reducers from "./reducers";
import mySaga from "./sagas";

export default function createStoreWithMiddleware() {
    const sagaMiddleware = createSagaMiddleware();

    const middleware = [sagaMiddleware];

    const enhancers = compose(
        applyMiddleware(...middleware),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    );

    const store = createStore(reducers, enhancers);

    sagaMiddleware.run(mySaga);

    return store;
}
