// import { mapKeys } from "lodash";

import {types, sortArr, filterArr} from "../actions";

export default (state = {}, action) => {
    let tempArr = [];
    let pan, adhar;
    switch (action.type) {

        case types.BUSINESS_DETAIL:
            return {...state, businessObj: action.businessObj};

        default:
            return state;
    }
};
