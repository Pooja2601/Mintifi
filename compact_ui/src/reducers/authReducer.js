// import { mapKeys } from "lodash";

import {filterArr, types} from "../actions";

export default (state = {}, action) => {
    let tempArr = [];
    let pan, adhar;
    switch (action.type) {

        case types.SHOW_ALERT:
            return {...state, alertMsg: action.alertMsg, alertType: action.alertType};

        case types.SET_TOKEN:
            return {...state, token: action.token, payload: action.payload};

        case types.CHANGE_LOADER:
            return {...state, loader: action.loader};

        case types.ANCHOR_PAYLOAD:
            return {...state, anchorObj: action.anchorObj};

        //    Existing User

        case types.FETCH_AUTH:
            return {...state, authObj: action.authObj};

        case types.CHECK_USER_EXISTS:
            return {...state, existing: action.existing};

        case types.EXIST_SUMMARY:
            return {...state, summaryObj: action.summaryObj};

        default:
            return state;
    }
};