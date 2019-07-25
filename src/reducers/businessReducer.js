// import { mapKeys } from "lodash";

import {types} from "../actions";

export default (state = {}, action) => {
    // let tempArr = [];
    // let pan, adhar;
    switch (action.type) {
        case types.GST_PROFILE:
            return {...state, gstProfile: action.gstProfile};

        case types.BUSINESS_DETAIL:
            return {...state, businessObj: action.businessObj};

        case types.PREFLIGHT_RESPONSE:
            return {...state, preFlightResp: action.preFlightResp};

        case types.BANK_DETAIL:
            return {...state, bankObj: action.bankObj};

        default:
            return state;
    }
};
