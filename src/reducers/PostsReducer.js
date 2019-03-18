// import { mapKeys } from "lodash";

import { types, sortArr, filterArr } from "../actions";

export default (state = {}, action) => {
  let tempArr = [];

  switch (action.type) {
    case types.FILTER_UPCOMING:
      // console.log(state)
      if (action.query !== "") tempArr = filterArr(action, state);

      return { ...state, filtered: tempArr };

    case types.CHECK_USER_EXISTS:
      return { ...state, existing: action.existing };

    case types.FETCH_AUTH_SUCCESS:
      return { ...state, authPayload: action.payload };

    default:
      return state;
  }
};
