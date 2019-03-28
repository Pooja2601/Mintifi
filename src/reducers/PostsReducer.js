// import { mapKeys } from "lodash";

import {types, sortArr, filterArr} from "../actions";

export default (state = {}, action) => {
    let tempArr = [];
    let pan, adhar;
    switch (action.type) {
        case types.FILTER_UPCOMING:
            // console.log(state)
            if (action.query !== "") tempArr = filterArr(action, state);
            return {...state, filtered: tempArr};

        case types.PAN_ADHAR:
            // pan = (action.pan) ? action.pan : state.authPayload.pan;
            // adhar = (action.adhar) ? action.adhar : state.authPayload.adhar;
            return {...state, pan: action.pan, adhar: action.adhar};

        case types.ADHAR_COMPLETE:
            return {...state, adharObj: action.adharObj};

        case types.FETCH_AUTH:
            return {...state, mobile: action.mobile, otp: action.otp};

        case types.CHECK_USER_EXISTS:
            return {...state, existing: action.existing};

        case types.FETCH_AUTH_SUCCESS:
            return {...state, authPayload: action.payload};

        default:
            return state;
    }
};
