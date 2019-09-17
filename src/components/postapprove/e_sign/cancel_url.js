import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {changeLoader} from "../../../actions";
import {postMessage} from "../../../shared/common_logic";
import PropTypes from "prop-types";

const Cancel_URL = props => {
    if (window.location !== window.parent.location) {
        postMessage({
            esign_status: "cancel",
            action: "close",
            loan_id: props.eSignPayload.loan_application_id
        });
    }/* else {
        window.setTimeout(() => {
            window.location.href = `${props.eSignPayload.cancel_url}`;
        }, 4000);
    }*/

    return (
        <>
            <i
                className={"fa fa-exclamation checkCircle"}
                style={{color: "orange"}}
            />
            <h3 className={"text-center"}> E-SIGN Pending/Cancelled !</h3>
            <br/>

            <div className="alert alert-warning" role="alert">
                {/*<h4 className="alert-heading">Dear {f_name} {l_name}</h4>*/}
                <p className="paragraph_styling  ">
                    We cannot process the eSIGN Application as of now, you may try again from
                    Dashboard's portal.
                </p>
            </div>
        </>
    );
};

Cancel_URL.propTypes = {
    eSignPayload: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    token: state.eSignReducer.token,
    eSignPayload: state.eSignReducer.eSignPayload,
});

export default withRouter(
    connect(
        mapStateToProps,
        {changeLoader}
    )(Cancel_URL)
);
