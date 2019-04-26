export const types = {
    SET_TOKEN: "SET_TOKEN",
    CHANGE_LOADER: "CHANGE_LOADER",
    CHECK_USER_EXISTS: "CHECK_USER_EXISTS",
    PAN_ADHAR: "PAN_ADHAR",
    ADHAR_COMPLETE: "ADHAR_COMPLETE",
    GST_PROFILE: "GST_PROFILE",
    PREFLIGHT_RESPONSE: "PREFLIGHT_RESPONSE",
    BUSINESS_DETAIL: "BUSINESS_DETAIL",
    FETCH_AUTH: "FETCH_AUTH",
    FETCH_AUTH_SUCCESS: "FETCH_AUTH_SUCCESS",
    SEND_OTP: "SEND_OTP",
    SEND_OTP_SUCCESS: "SEND_OTP_SUCCESS",
    RECEIVE_OTP: "RECEIVE_OTP",
    RECEIVE_OTP_SUCCESS: "RECEIVE_OTP_SUCCESS",
    SORT_UPCOMING: "SORT_UPCOMING",
    FILTER_UPCOMING: "FILTER_UPCOMING",
//    Drawdown Section
    D_SET_AUTH: "D_SET_AUTH",
    D_SET_TOKEN: "D_SET_TOKEN",
};

export const changeLoader = loader => ({
    type: types.CHANGE_LOADER,
    loader
});

export const setToken = (token, payload) => ({
    type: types.SET_TOKEN,
    token, payload
});

export const checkExists = existing => ({
    type: types.CHECK_USER_EXISTS,
    existing
});

export const setAdharManual = adharObj => ({type: types.ADHAR_COMPLETE, adharObj});

export const setBusinessDetail = businessObj => ({type: types.BUSINESS_DETAIL, businessObj});

export const setGstProfile = gstProfile => ({type: types.GST_PROFILE, gstProfile});

export const storeResponse = preFlightResp => ({type: types.PREFLIGHT_RESPONSE, preFlightResp});

export const pan_adhar = (pan, adhar) => ({
    type: types.PAN_ADHAR,
    pan, adhar
});

export const setAuth = authObj => ({
    type: types.FETCH_AUTH, authObj
});

export const sendOTP = number => ({
    type: types.SEND_OTP, number
});

// Drawdown Section

export const DrawsetAuth = authObj => ({
    type: types.D_SET_AUTH, authObj
});

export const DrawsetToken = (token, payload) => ({
    type: types.D_SET_TOKEN,
    token, payload
});


/*
export const fetchUpcoming = () => ({type: types.FETCH_UPCOMING});

export const sortUpcoming = (method, order) => ({
    type: types.SORT_UPCOMING,
    method,
    order
});

export const sortArr = (action, state) => {
    let tempArr = [...state.upcome];
    let {method, order} = action;

    if (method === "alpha")
        if (order === "asc")
            tempArr.sort((a, b) => (a.title > b.title) - (a.title < b.title));
        else tempArr.sort((a, b) => (a.title < b.title) - (a.title > b.title));

    if (method === "year")
        if (order === "asc")
            tempArr.sort((a, b) => {
                return (
                    (a.release_date > b.release_date) - (a.release_date < b.release_date)
                );
            });
        else
            tempArr.sort((a, b) => {
                return (
                    (a.release_date < b.release_date) - (a.release_date > b.release_date)
                );
            });
    // console.log(tempArr);
    return tempArr;
};

export const filterArr = (action, state) => {
    let titleStr, yearStr;
    return state.upcome.filter(val => {
        titleStr = val.title.toLowerCase();
        yearStr = val.release_date.toLowerCase();
        return titleStr.includes(action.query) || yearStr.includes(action.query);
    });
};
*/
