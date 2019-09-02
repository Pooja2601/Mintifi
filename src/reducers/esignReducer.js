// import { mapKeys } from "lodash";

import { types } from "../actions";

export default (state = {}, action) => {
    switch (action.type) {
        case types.ESIGN_PAYLOAD:
            return {
                ...state,
                token: action.token,
                eSignPayload: action.eSignPayload
            };

        case types.ESIGN_ATTEMPT:
            return { ...state, eSignAttempt: action.eSignAttempt };

        case types.ESIGN_BANK_DETAIL:
            return { ...state, bankObj: action.bankObj };

        case types.ESIGN_DOC_PAYLOAD:
            return { ...state, docStatusObj: action.docStatusObj };

        case types.ESIGN_ANCHOR_PAYLOAD:
            return { ...state, anchorPayload: action.anchorPayload };


        default:
            return state;
    }
};
