import "regenerator-runtime/runtime";

import {
    watchSendOTP,
    watchVerifyOTP,
} from "./PostsSagas";

// Root sagas
export default function* rootSaga() {
    // yield [watchSendOTP(), watchVerifyOTP()];
}
