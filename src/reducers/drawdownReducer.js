// import { mapKeys } from "lodash";

import {types} from "../actions";

export default (state = {}, action) => {

    switch (action.type) {

        case types.D_SET_AUTH:
            return {...state, authObj: action.authObj};

        /* case types.D_CHECK_USER_EXISTS:
             return {...state, existing: action.existing};
 */
        case types.D_SET_TOKEN:
            return {...state, token: action.token, payload: action.payload};

        case types.CHANGE_LOADER:
            return {...state, loader: action.loader};

        default:
            return state;
    }
};
