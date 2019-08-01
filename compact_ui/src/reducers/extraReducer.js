// import { mapKeys } from "lodash";

import { types } from "../actions";

export default (state = {}, action) => {
  switch (action.type) {
    case types.CHANGE_LOADER:
      return { ...state, loader: action.loader };

    case types.SHOW_ALERT:
      return {
        ...state,
        alertMsg: action.alertMsg,
        alertType: action.alertType
      };

    default:
      return state;
  }
};
