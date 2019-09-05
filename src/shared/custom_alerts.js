import React from 'react';
import {withRouter} from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import {showAlert} from "../actions";

let alertTimer = '';
// const {PUBLIC_URL} = process.env;
const CustomAlerts = (props) => {

    const {alertMsg, alertType, showAlert} = props;
    const types = {
        'error': 'danger',
        'danger': 'danger',
        'warn': 'warning',
        'info': 'info',
        'success': 'success',
        'default': 'default'
    };

    clearTimeout(alertTimer);

    alertTimer = window.setTimeout(() => {
        showAlert();
    }, 4000);

    return (
        <>
            <div style={{visibility: alertMsg ? 'visible' : 'hidden', fontSize: '13px'}}
                 className={`mt-2 alert alert-${types[alertType]}`}>
                <b>{alertMsg === 'net' ? 'Looks like a connectivity issue !!' : alertMsg}</b>
            </div>
        </>
    )
};

const mapStateToProps = state => ({
    alertMsg: state.extraReducer.alertMsg,
    alertType: state.extraReducer.alertType,
    // alertShow: state.extraReducer.alertShow,
});

export default withRouter(
    connect(
        mapStateToProps,
        {showAlert}
    )(CustomAlerts)
);