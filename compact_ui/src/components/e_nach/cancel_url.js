import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { changeLoader, EnachsetAttempt, EnachsetPayload } from "../../actions";
import { postMessage } from "../../shared/commonLogic";

const Cancel_URL = props => {
  postMessage({
    enach_status: "cancel",
    action: "close",
    loan_id: props.eNachPayload.loan_application_id
  });
  return (
    <>
      <i
        className={"fa fa-exclamation checkCircle"}
        style={{ color: "orange", fontSize: "50px" }}
      />
      <h5 className={"text-center"}> E-NACH Pending/Cancelled !</h5>
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
