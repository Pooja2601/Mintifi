import React from 'react';
import { baseUrl, app_id } from '../shared/constants';

export const apiActions = {
    ERROR_RESPONSE: 'ERROR_RESPONSE',
    SUCCESS_RESPONSE: 'SUCCESS_RESPONSE',
    ERROR_NET: 'ERROR_NET'
}


export const fetchAPI = propsParam => {
    const {
        URL,
        token,
    } = propsParam;
    return fetch(
        `${URL}`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json", token: token }
        }
    )
        .then(resp => resp.json())
        .then(
            resp => {
                if (resp.response !== Object(resp.response)) {
                    return { status: apiActions.ERROR_RESPONSE, data: resp.error.code };
                } else {
                    return { status: apiActions.SUCCESS_RESPONSE, data: resp.response };
                }
            },
            () => {
                return { status: apiActions.ERROR_NET };
            }
        ).catch(e => {
            // { status: apiActions.ERROR_NET }
            const error = new Error()
            error.code = e.code
            error.status = apiActions.ERROR_NET
            error.message = e.message
            error.response = e.responseError
            throw error
        });
};

export const postAPI = propsParam => {
    const {
        URL,
        token,
        data
    } = propsParam;
    return fetch(
        `${URL}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json", token: token },
            body: JSON.stringify(data)
        }
    )
        .then(resp => resp.json())
        .then(
            resp => {
                if (resp.response !== Object(resp.response)) {
                    return { status: apiActions.ERROR_RESPONSE, data: resp.error };
                } else {
                    return { status: apiActions.SUCCESS_RESPONSE, data: resp.response };
                }
            },
            () => {
                return { status: apiActions.ERROR_NET };
            }
        ).catch(e => {
            // { status: apiActions.ERROR_NET }
            const error = new Error()
            error.code = e.code
            error.status = apiActions.ERROR_NET
            error.message = e.message
            error.response = e.responseError
            throw error
        });
};

