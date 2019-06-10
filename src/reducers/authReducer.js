// import { mapKeys } from "lodash";

import {filterArr, types} from "../actions";

export default (state = {}, action) => {
    let tempArr = [];
    let pan, adhar;
    switch (action.type) {
        /*  case types.FILTER_UPCOMING:
              // console.log(state)
              if (action.query !== "") tempArr = filterArr(action, state);
              return {...state, filtered: tempArr};
  */
        case types.FETCH_AUTH:
            return {...state, authObj: action.authObj};

        case types.CHECK_USER_EXISTS:
            return {...state, existing: action.existing};

        case types.SET_TOKEN:
            return {...state, token: action.token, payload: action.payload};

        case types.CHANGE_LOADER:
            return {...state, loader: action.loader};

        case types.ANCHOR_PAYLOAD:
            return {...state, anchorObj: action.anchorObj};

        /* case types.FETCH_AUTH_SUCCESS:
         return {...state, authPayload: action.payload};
*/
        default:
            return state;
    }
};
