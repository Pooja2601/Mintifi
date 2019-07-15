import "regenerator-runtime/runtime";

import {
    watchSendOTP,
    watchVerifyOTP,
    watchFetchPosts,
    watchFetchUpcoming
} from "./PostsSagas";

// Root sagas
export default function* rootSaga() {
    yield [watchSendOTP(), watchVerifyOTP(), watchFetchPosts(), watchFetchUpcoming()];
}
