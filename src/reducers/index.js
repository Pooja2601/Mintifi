import { combineReducers } from "redux";
import PostsReducer from "./authReducer";
import AdharReducer from "./adharReducer";
import BusinessReducer from "./businessReducer";
// import UpcomingReducer from "./UpcomingReducer";

const rootReducer = combineReducers({
    authPayload: PostsReducer,
    adharDetail: AdharReducer,
    businessDetail: BusinessReducer
});

export default rootReducer;
