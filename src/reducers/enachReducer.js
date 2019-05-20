// import { mapKeys } from "lodash";

import {types} from "../actions";

export default (state = {}, action) => {

    switch (action.type) {

        case types.ENACH_PAYLOAD:
            return {...state, eNachPayload: action.eNachPayload};

        default:
            return state;
    }
};
