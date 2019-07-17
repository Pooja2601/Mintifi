import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { changeLoader, EnachsetAttempt, EnachsetPayload } from "../../actions";

const Success_URL = props => {
  return (
    <>
      <i
        className={"fa fa-check-circle checkCircle"}
        style={{ fontSize: "50px" }}
      />
      <h5 className={"text-center"}> E-NACH Completed !</h5>
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
