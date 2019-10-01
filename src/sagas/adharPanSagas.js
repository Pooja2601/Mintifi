import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  types,
  // sagaTypes,
  changeLoader,
  setAnchorObj,
  showAlert,
  pan_adhar,
  setGstProfile,
  setBusinessDetail
} from "../actions";
import { fetchGstProfile, sagaTypes } from "../../src/actions/sagaActions";
import { app_id, baseUrl, BusinessType } from "../shared/constants";
import { apiActions, fetchAPI } from "../api";

// Watcher sagas

export function* watchGSTFetch() {
  console.log("worker saga called");
  yield takeLatest(sagaTypes.GST_PROFILE_TRIGGER, workGSTFetch);
}

export function* workGSTFetch({ payload, token, gstSelected }) {
  let gstProfile = {};
  try {
    const options = {
      URL: `${baseUrl}/companies/get_company_details_by_gstin?app_id=${app_id}&anchor_id=${payload.anchor_id}&gstin=${gstSelected}`,
      token: token,
      showAlert: showAlert,
      changeLoader: changeLoader
    };
    yield put(changeLoader(true));
    const resp = yield call(fetchAPI, options);
    yield put(changeLoader(false));
    if (resp.status === apiActions.SUCCESS_RESPONSE) {
      gstProfile = Object.assign({}, resp.data);
      const { company_details } = gstProfile;
      setGstProfile(company_details);

      BusinessType.map((val, key) => {
        if (company_details.ctb !== undefined)
          if (val.localeCompare(company_details.ctb) === 0)
            gstProfile.company_type = val.value;
      });
      gstProfile.lgnm = company_details.lgnm;
      // console.log(this.gstDetails);

      yield put(setBusinessDetail(gstProfile));
      console.log("worker saga called");
    } else if (resp.status === apiActions.ERROR_RESPONSE) {
      yield put(
        showAlert(
          "Could Not fetch GST information, Something went wrong !",
          "warn"
        )
      );
    }
  } catch (e) {
    console.log("Something went wrong !");
  }
}
