// import { mapKeys } from "lodash";

import {types} from "../actions";

export default (state = {}, action) => {

    switch (action.type) {

        case types.D_SET_AUTH:
            return {...state, authObj: action.authObj};

        case types.D_ANCHOR_PAYLOAD:
            return {...state, anchorPayload: action.anchorPayload};

        case types.D_SET_TOKEN:
            return {...state, token: action.token, payload: action.payload};

        case types.D_SET_PREFLIGHT:
            return {...state, preFlightResp: action.preFlightResp};

        case types.D_SET_LOAN_PAYLOAD:
            return {...state, loanPayload: action.loanPayload};

        default:
            return state;
    }
};
