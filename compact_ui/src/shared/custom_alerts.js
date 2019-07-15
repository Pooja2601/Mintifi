import React from 'react';
import {withRouter} from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import {showAlert} from "../actions";

const {PUBLIC_URL} = process.env;
const CustomAlerts = (props) => {
    const {alertMsg, alertType} = props;
    const types = {
        'error': 'danger',
        'warn': 'warn',
        'info': 'info',
        'success': 'success'
    };

    return (
        <>
            <div style={{visibility: 'visible'}} className={`alert alert-${types[alertType]}`}>
                <b>{alertMsg}</b>
            </div>
        </>
    )
};

const mapStateToProps = state => ({
    alertMsg: state.authPayload.alertMsg,
    alertType: state.authPayload.alertType
});

export default withRouter(
    connect(
        mapStateToProps,
        {showAlert}
    )(CustomAlerts)
);