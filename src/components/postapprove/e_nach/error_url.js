import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {changeLoader, EnachsetAttempt, EnachsetPayload} from "../../../actions";
import {postMessage} from "../../../shared/common_logic";
import PropTypes from "prop-types";

const Error_URL = props => {
    if (window.location !== window.parent.location)
        postMessage({
            enach_status: "error",
            action: "close",
            loan_id: props.eNachPayload.loan_application_id
        });
    else
        window.setTimeout(() => {
            window.location.href = `${props.eNachPayload.error_url}`;
        }, 3000);

    return (
        <>
            <i className="fa fa-times-circle checkCircle" style={{color: "red"}}/>
            <h3 className={"text-center"}> E-NACH Failed !</h3>
            <br/>

            <div className="alert alert-danger" role="alert">
                {/*<h4 className="alert-heading">Dear {f_name} {l_name}</h4>*/}
                <p className="paragraph_styling  ">
                    Thank you for completing the process, For some reason we couldn't
                    complete the e-NACH, you'll be redirected to Anchor dashboard within a
                    moment..
                </p>
            </div>
        </>
    );
};

Error_URL.propTypes = {
    eNachPayload: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    token: state.eNachReducer.token,
    eNachPayload: state.eNachReducer.eNachPayload
});

export default withRouter(
    connect(
        mapStateToProps,
        {changeLoader, EnachsetPayload, EnachsetAttempt}
    )(Error_URL)
);
