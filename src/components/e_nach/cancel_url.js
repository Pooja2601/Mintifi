import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { changeLoader, EnachsetAttempt, EnachsetPayload } from "../../actions";
import { postMessage } from "../../shared/commonLogic";
import PropTypes from "prop-types";

const Cancel_URL = props => {
  if (window.location !== window.parent.location) {
    postMessage({
      enach_status: "cancel",
      action: "close",
      loan_id: props.eNachPayload.loan_application_id
    });
  } else {
    window.setTimeout(() => {
      window.location.href = `${props.eNachPayload.cancel_url}`;
    }, 3000);
  }

  return (
    <>
      <i
        className={"fa fa-exclamation checkCircle"}
        style={{ color: "orange" }}
      />
      <h3 className={"text-center"}> E-NACH Pending/Cancelled !</h3>
      <br />

      <div className="alert alert-warning" role="alert">
        {/*<h4 className="alert-heading">Dear {f_name} {l_name}</h4>*/}
        <p className="paragraph_styling  ">
          We cannot process the eNACH Application as of now, you'll be
          redirected to Anchor dashboard within a moment, you may try again from
          Anchor's portal..
        </p>
      </div>
    </>
  );
};

Cancel_URL.propTypes = {
  eNachPayload: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  token: state.eNachReducer.token,
  eNachPayload: state.eNachReducer.eNachPayload
});

export default withRouter(
  connect(
    mapStateToProps,
    { changeLoader, EnachsetPayload, EnachsetAttempt }
  )(Cancel_URL)
);
