import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { types } from "../actions";
import {
  isCached,
  setCached,
  setObject,
  getObject
} from "../shared/CacheLogic.js";

const ROOT_URL = "//api.themoviedb.org/3";
const API_KEY = "?api_key=583f5418d3702c0709d79b38812b7e7c";

// Watcher sagas
export function* watchFetchAuth() {
  yield takeEvery(types.FETCH_AUTH, workFetchAuth);
}

export function* watchFetchPosts() {
  yield takeEvery(types.FETCH_POSTS, workFetchPosts);
}

export function* watchFetchUpcoming() {
  yield takeLatest(types.FETCH_UPCOMING, workFetchUpcome);
}

// Worker sagas
export function* workFetchAuth({ otp, token }) {
  let config = {
    headers: { Authorization: "bearer " + token }
  };
  try {
    const uri = encodeURI(`${ROOT_URL}/otp/verify/${API_KEY}`);
    const response = yield call(axios.post, uri, { otp: otp }, config);
    yield put({
      type: types.FETCH_AUTH_SUCCESS,
      payload: response.data.results
    });
  } catch (error) {
    console.log("Request failed! Could not fetch Payload.");
  }
}

export function* workFetchPosts({ query }) {
  try {
    const uri = encodeURI(`${ROOT_URL}/search/movie${API_KEY}&query=${query}`);
    const response = yield call(axios.get, uri);

    yield put({
      type: types.FETCH_POSTS_SUCCESS,
      payload: response.data.results
    });
  } catch (error) {
    console.log("Request failed! Could not fetch posts.");
  }
}

export function* workFetchUpcome() {
  try {
    const uri = encodeURI(`${ROOT_URL}/movie/upcoming${API_KEY}`);
    let response = { data: [] };

    if (getObject(uri) === null && !isCached(uri)) {
      response = yield call(axios.get, uri);
      setCached(uri);
      setObject(uri, response.data);
    } else response.data = getObject(uri);

    yield put({
      type: types.FETCH_UPCOMING_SUCCESS,
      payload: response.data.results
    });
  } catch (error) {
    console.log("Request failed! Could not fetch posts.");
  }
}
