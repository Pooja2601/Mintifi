import React from "react";
import { connect } from "react-redux";
import {  withRouter } from "react-router-dom";
import { changeLoader, EnachsetAttempt, EnachsetPayload } from "../../actions";

const Error_URL = props => {
  return (
    <>
      <i className="fa fa-times-circle checkCircle" style={{ color: "red" }} />
      <h3 className={"text-center"}> E-NACH Failed !</h3>
      <br />

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

const mapStateToProps = state => ({
  token: state.eNachReducer.token,
  eNachPayload: state.eNachReducer.eNachPayload
});

export default withRouter(
  connect(
    mapStateToProps,
    { changeLoader, EnachsetPayload, EnachsetAttempt }
  )(Error_URL)
);
