import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {changeLoader} from "../../../actions";
import {postMessage} from "../../../shared/common_logic";
import PropTypes from "prop-types";

const Success_URL = props => {
    if (window.location !== window.parent.location)
        postMessage({
            esign_status: "success",
            loan_id: props.eSignPayload.loan_application_id,
            action: "close"
        });
    /*else
        window.setTimeout(() => {
            window.location.href = `${props.eNachPayload.success_url}`;
        }, 5000);
*/
    return (
        <>
            <i className={"fa fa-check-circle checkCircle"}/>
            <h3 className={"text-center"}> E-SIGN Completed !</h3>
            <br/>

            <div className="alert alert-success" role="alert">
                {/*<h4 className="alert-heading">Dear {f_name} {l_name}</h4>*/}
                <p className="paragraph_styling">
                    Thank you for completing the E-SIGN process, , you may close this window now.
                </p>
            </div>
        </>
    );
};

Success_URL.propTypes = {
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
    )(Success_URL)
);
