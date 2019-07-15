// import { mapKeys } from "lodash";

import { types } from "../actions";

export default (state = {}, action) => {
  // let tempArr = [];
  // let pan, adhar;
  switch (action.type) {
    case types.PAN_ADHAR:
      return { ...state, pan: action.pan, adhar: action.adhar };

    case types.PERSONAL_DETAIL:
      return { ...state, adharObj: action.adharObj };

    default:
      return state;
  }
};
