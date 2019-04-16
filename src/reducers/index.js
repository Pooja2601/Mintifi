import { combineReducers } from "redux";
import AuthReducer from "./authReducer";
import AdharReducer from "./adharReducer";
import BusinessReducer from "./businessReducer";
// import UpcomingReducer from "./UpcomingReducer";

const rootReducer = combineReducers({
    authPayload: AuthReducer,
    adharDetail: AdharReducer,
    businessDetail: BusinessReducer
});

export default rootReducer;
