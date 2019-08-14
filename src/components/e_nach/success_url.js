import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { changeLoader, EnachsetAttempt, EnachsetPayload } from "../../actions";
import { postMessage } from "../../shared/commonLogic";
import PropTypes from "prop-types";

const Success_URL = props => {
  if (window.location !== window.parent.location)
    postMessage({
      enach_status: "success",
      loan_id: props.eNachPayload.loan_application_id,
      action: "close"
    });
  else
    window.setTimeout(() => {
      window.location.href = `${props.eNachPayload.success_url}`;
    }, 3000);

  return (
    <>
      <i className={"fa fa-check-circle checkCircle"} />
      <h3 className={"text-center"}> E-NACH Completed !</h3>
      <br />

      <div className="alert alert-success" role="alert">
        {/*<h4 className="alert-heading">Dear {f_name} {l_name}</h4>*/}
        <p className="paragraph_styling  ">
          Thank you for completing the E-NACH process, you'll be redirected to
          Anchor dashboard within a moment..
        </p>
      </div>
    </>
  );
};

Success_URL.propTypes = {
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
  )(Success_URL)
);
