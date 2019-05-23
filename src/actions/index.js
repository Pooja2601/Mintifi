export const types = {
    SET_TOKEN: "SET_TOKEN",
    CHANGE_LOADER: "CHANGE_LOADER",
    CHECK_USER_EXISTS: "CHECK_USER_EXISTS",
    PAN_ADHAR: "PAN_ADHAR",
    PERSONAL_DETAIL: "PERSONAL_DETAIL",
    GST_PROFILE: "GST_PROFILE",
    PREFLIGHT_RESPONSE: "PREFLIGHT_RESPONSE",
    BUSINESS_DETAIL: "BUSINESS_DETAIL",
    BANK_DETAIL: "BANK_DETAIL",
    FETCH_AUTH: "FETCH_AUTH",
    FETCH_AUTH_SUCCESS: "FETCH_AUTH_SUCCESS",
    SEND_OTP: "SEND_OTP",
    SEND_OTP_SUCCESS: "SEND_OTP_SUCCESS",
    RECEIVE_OTP: "RECEIVE_OTP",
    RECEIVE_OTP_SUCCESS: "RECEIVE_OTP_SUCCESS",
    SORT_UPCOMING: "SORT_UPCOMING",
    FILTER_UPCOMING: "FILTER_UPCOMING",
    //...................................    Drawdown Section
    D_SET_AUTH: "D_SET_AUTH",
    D_SET_TOKEN: "D_SET_TOKEN",
    D_SET_PREFLIGHT: "D_SET_PREFLIGHT",
    D_SET_LOAN_PAYLOAD: "D_SET_LOAN_PAYLOAD",
    D_ANCHOR_PAYLOAD: "D_ANCHOR_PAYLOAD",
    //...................................    Enach Section
    ENACH_PAYLOAD: 'ENACH_PAYLOAD',
    ENACH_ATTEMPT: 'ENACH_ATTEMPT'
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

export const setAdharManual = adharObj => ({type: types.PERSONAL_DETAIL, adharObj});

export const setBusinessDetail = businessObj => ({type: types.BUSINESS_DETAIL, businessObj});

export const setBankDetail = bankObj => ({type: types.BANK_DETAIL, bankObj});

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

//.................................... Drawdown Section

export const DrawsetAuth = authObj => ({
    type: types.D_SET_AUTH, authObj
});

export const DrawsetToken = (token, payload) => ({
    type: types.D_SET_TOKEN,
    token, payload
});

export const DrawsetPreflight = preFlightResp => ({
    type: types.D_SET_PREFLIGHT, preFlightResp
});

export const DrawsetLoanPayload = loanPayload => ({
    type: types.D_SET_LOAN_PAYLOAD, loanPayload
});

export const DrawAnchorPayload = loanPayload => ({
    type: types.D_SET_LOAN_PAYLOAD, loanPayload
});

//..................................... E-NACH
export const EnachsetPayload = eNachPayload => ({
    type: types.ENACH_PAYLOAD, eNachPayload
});

export const EnachsetAttempt = eNachAttempt => ({
    type: types.ENACH_ATTEMPT, eNachAttempt
});
