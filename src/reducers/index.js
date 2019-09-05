import { combineReducers } from "redux";
import AuthReducer from "./authReducer";
import AdharReducer from "./adharReducer";
import BusinessReducer from "./businessReducer";
import DrawdownReducer from "./drawdownReducer";
import EnachReducer from "./enachReducer";
import EsignReducer from "./esignReducer";
import ExtraReducer from "./extraReducer";

const rootReducer = combineReducers({
  authPayload: AuthReducer,
  adharDetail: AdharReducer,
  businessDetail: BusinessReducer,
  drawdownReducer: DrawdownReducer,
  eNachReducer: EnachReducer,
  eSignReducer: EsignReducer,
  extraReducer: ExtraReducer
});

export default rootReducer;
