import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { changeLoader, EnachsetAttempt, EnachsetPayload } from "../../actions";

const Success_URL = props => {
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
