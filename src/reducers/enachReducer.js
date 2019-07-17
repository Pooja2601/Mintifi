// import { mapKeys } from "lodash";

import {types} from "../actions";

export default (state = {}, action) => {

    switch (action.type) {

        case types.ENACH_PAYLOAD:
            return {...state, token: action.token, eNachPayload: action.eNachPayload};

        case types.ENACH_ATTEMPT:
            return {...state, eNachAttempt: action.eNachAttempt};

        default:
            return state;
    }
};
