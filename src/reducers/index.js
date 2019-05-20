import {combineReducers} from "redux";
import AuthReducer from "./authReducer";
import AdharReducer from "./adharReducer";
import BusinessReducer from "./businessReducer";
import DrawdownReducer from "./drawdownReducer";
import EnachReducer from "./enachReducer";

const rootReducer = combineReducers({
    authPayload: AuthReducer,
    adharDetail: AdharReducer,
    businessDetail: BusinessReducer,
    drawdownReducer: DrawdownReducer,
    EnachReducer: EnachReducer,
});

export default rootReducer;
