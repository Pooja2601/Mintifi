// import { mapKeys } from "lodash";

import {types, sortArr, filterArr} from "../actions";

export default (state = {}, action) => {
    let tempArr = [];
    let pan, adhar;
    switch (action.type) {

        case types.PAN_ADHAR:
            // pan = (action.pan) ? action.pan : state.authPayload.pan;
            // adhar = (action.adhar) ? action.adhar : state.authPayload.adhar;
            return {...state, pan: action.pan, adhar: action.adhar};

        case types.ADHAR_COMPLETE:
            return {...state, adharObj: action.adharObj};

        default:
            return state;
    }
};
