import {types} from "../actions";

export default (state = {}, action) => {

    switch (action.type) {

        case types.SHOW_ALERT:
            return {...state, alertMsg: action.alertMsg, alertType: action.alertType, alertShow: action.alertShow};

        case types.CHANGE_LOADER:
            return {...state, loader: action.loader};

        default:
            return state;
    }
};
