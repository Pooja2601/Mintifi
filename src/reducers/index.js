import { combineReducers } from "redux";
import PostsReducer from "./PostsReducer";
// import UpcomingReducer from "./UpcomingReducer";

const rootReducer = combineReducers({
    authPayload: PostsReducer,
    // upcoming: UpcomingReducer
});

export default rootReducer;
