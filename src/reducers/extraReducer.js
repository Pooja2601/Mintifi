import { types } from "../actions";

export default (state = {}, action) => {
  switch (action.type) {
    case types.SHOW_ALERT:
      return {
        ...state,
        alertMsg: action.alertMsg,
        alertType: action.alertType
      };

    case types.CHANGE_LOADER:
      return { ...state, loader: action.loader };

    case types.FIELD_ALERT:
      return { ...state, alertObj: action.alertObj };

    default:
      return state;
  }
};
