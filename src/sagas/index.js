import "regenerator-runtime/runtime";

import {
  watchFetchAuth,
  watchFetchPosts,
  watchFetchUpcoming
} from "./PostsSagas";

// Root sagas
export default function* rootSaga() {
  yield [watchFetchAuth(), watchFetchPosts(), watchFetchUpcoming()];
}
