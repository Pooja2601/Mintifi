import React from "react";
import {baseUrl, app_id} from "../shared/constants";
import {checkObject} from "../shared/common_logic";


export const apiActions = {
    ERROR_RESPONSE: "ERROR_RESPONSE",
    SUCCESS_RESPONSE: "SUCCESS_RESPONSE",
    ERROR_NET: "ERROR_NET"
};

export const fetchAPI = propsParam => {
    const {URL, token, showAlert, changeLoader} = propsParam;
    let isLoader = typeof changeLoader === "function";
    let isAlert = typeof showAlert === "function";

    isLoader && changeLoader(true);
    return fetch(`${URL}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            token: token,
            "App-id": app_id
        }
    })
        .then(resp => resp.json())
        .then(
            resp => {
                isLoader && changeLoader(false);

                if (!checkObject(resp.response)) {

                    return {status: apiActions.ERROR_RESPONSE, data: resp.error};
                } else {
                    return {status: apiActions.SUCCESS_RESPONSE, data: resp.response};
                }
            },
            () => {
                isLoader && changeLoader(false);
                isAlert && showAlert("net");
                return {status: apiActions.ERROR_NET};
            }
        )
        .catch(e => {
            isLoader && changeLoader(false);
            isAlert && showAlert("net");
            const error = new Error();
            error.code = e.code;
            error.status = apiActions.ERROR_NET;
            error.message = e.message;
            error.response = e.responseError;
            throw error;
        });
};

export const postAPI = propsParam => {
    const {URL, token, data, showAlert, changeLoader} = propsParam;
    let isLoader = typeof changeLoader === "function";
    let isAlert = typeof showAlert === "function";

    isLoader && changeLoader(true);
    return fetch(`${URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            token: token,
            "App-id": app_id
        },
        body: JSON.stringify(data)
    })
        .then(resp => resp.json())
        .then(
            resp => {
                isLoader && changeLoader(false);

                if (!checkObject(resp.response)) {

                    return {status: apiActions.ERROR_RESPONSE, data: resp.error};
                } else {
                    return {status: apiActions.SUCCESS_RESPONSE, data: resp.response};
                }
            },
            () => {
                isLoader && changeLoader(false);
                isAlert && showAlert("net");
                return {status: apiActions.ERROR_NET};
            }
        )
        .catch(e => {
            isLoader && changeLoader(false);
            isAlert && showAlert("net");
            const error = new Error();
            error.code = e.code;
            error.status = apiActions.ERROR_NET;
            error.message = e.message;
            error.response = e.responseError;
            throw error;
        });
};


export const postFileAPI = propsParam => {
    const {URL, token, data, showAlert, changeLoader} = propsParam;
    let isLoader = typeof changeLoader === "function";
    let isAlert = typeof showAlert === "function";

    isLoader && changeLoader(true);
    return fetch(`${URL}`, {
        method: "POST",
        headers: {
            // "Content-Type": "application/json",
            token: token,
            "App-id": app_id,
            "cache": "no-cache",
        },
        body: data
    })
        .then(resp => resp.json())
        .then(
            resp => {
                isLoader && changeLoader(false);

                if (!checkObject(resp.response)) {
                    showAlert("We couldn't upload the files, Kindly try again !", 'warn');
                    return {status: apiActions.ERROR_RESPONSE, data: resp.error};
                } else {
                    return {status: apiActions.SUCCESS_RESPONSE, data: resp.response};
                }
            },
            () => {
                isLoader && changeLoader(false);
                isAlert && showAlert("net");
                return {status: apiActions.ERROR_NET};
            }
        )
        .catch(e => {
            isLoader && changeLoader(false);
            isAlert && showAlert("net");
            const error = new Error();
            error.code = e.code;
            error.status = apiActions.ERROR_NET;
            error.message = e.message;
            error.response = e.responseError;
            throw error;
        });
};