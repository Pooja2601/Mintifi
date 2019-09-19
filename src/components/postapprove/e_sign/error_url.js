import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {changeLoader} from "../../../actions";
import {postMessage} from "../../../shared/common_logic";
import PropTypes from "prop-types";

const Error_URL = props => {
    if (window.location !== window.parent.location)
        postMessage({
            esign_status: "error",
            action: "close",
            loan_id: props.eSignPayload.loan_application_id
        });
    /* else
         window.setTimeout(() => {
             window.location.href = `${props.eSignPayload.error_url}`;
         }, 4000);*/

    return (
        <>
            <i className="fa fa-times-circle checkCircle" style={{color: "red"}}/>
            <h3 className={"text-center"}> E-SIGN Failed !</h3>
            <br/>

            <div className="alert alert-danger" role="alert">
                {/*<h4 className="alert-heading">Dear {f_name} {l_name}</h4>*/}
                <p className="paragraph_styling">
                    Thank you for completing the e-SIGN process, For some reason we couldn't
                    complete the e-SIGN, you may close this window now.
                </p>
            </div>
        </>
    );
};

Error_URL.propTypes = {
    eSignPayload: PropTypes.object
};

const mapStateToProps = state => ({
    token: state.eSignReducer.token,
    eSignPayload: state.eSignReducer.eSignPayload,
});

export default withRouter(
    connect(
        mapStateToProps,
        {changeLoader,}
    )(Error_URL)
);
