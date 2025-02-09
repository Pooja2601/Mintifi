import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  environment,
  mintifiMail,
  mintifiMobile
} from "../../../shared/constants";
// import { alertModule } from "../../../shared/commonLogic";
import {
  pan_adhar,
  setAdharManual,
  setBusinessDetail,
  changeLoader
} from "../../../actions/index";
import { postMessage } from "../../../shared/commonLogic";
// const { PUBLIC_URL } = process.env;

class AppRejected extends Component {
  componentWillMount() {
    const { changeLoader } = this.props;
    changeLoader(false);
    // alertModule('Just a test');
    // if (payload !== Object(payload))
    //     history.push(`${PUBLIC_URL}/preapprove/token`);
  }

  render() {
    let { adharObj, preFlightResp, location, payload, anchorObj } = this.props;
    const loan_status = "expired"; // rejected  // expired
    // let { loan_application_id, credit_eligibility } = preFlightResp;
    let { state } = location;
    // ToDo :  Hide it in Prod
    if (environment === "local") location = { state: { status: loan_status } };

    if (environment === "dev")
      if (state !== Object(state)) state = { status: loan_status };

    postMessage({
      loan_status: state.status,
      loan_id: "",
      credit_limit: "",
      action: "close"
    });

    return (
      <>
        {/* <button onClick={() => history.push(`${PUBLIC_URL}/preapprove/businessdetail`)} className={"btn btn-link"}>
                    Go Back
                </button>*/}
        <h4 className={"text-center"}>Credit Eligibility</h4>

        {/*fa-exclamation-circle*/}
        <i
          className={"fa fa-exclamation-triangle closeCircle"}
          style={{
            fontSize: "45px",
            color: state.status === "rejected" ? "crimson" : "gold"
          }}
        />
        {/*<h5 className={"text-center"}> Application {(location.state.status === 'rejected') ? 'Rejected' : 'Error'}</h5>*/}

        <div
          className="paragraph_styling  text-center"
          style={{ margin: "auto 5%" }}
        >
          <div
            className={
              state.status === "rejected"
                ? "alert alert-danger"
                : "alert alert-warning"
            }
            style={{
              backgroundColor:
                state.status !== "rejected" && "lightgoldenrodyellow"
            }}
            role="alert"
          >
            <h5 className="alert-heading">
              {state.status === "rejected" ? (
                <>
                  {" "}
                  Dear{" "}
                  <b>
                    <i>
                      {" "}
                      {adharObj.f_name} {adharObj.l_name}
                    </i>
                  </b>
                </>
              ) : (
                "Something went wrong !"
              )}
            </h5>
            We regret to inform you that your application can not be approved at
            this point of time.
            <br />
            <b>
              {state.status === "rejected"
                ? "You can try again with us after 6 months"
                : "Kindly try again after some time"}
            </b>
          </div>
          <div className={"blockquote-footer mt-2"}>
            In case of any query, please contact us at{" "}
            <a href={`mailto:${mintifiMail}`}>{mintifiMail}</a> or{" "}
            <a href={`tel:+91${mintifiMobile}`}>+91 {mintifiMobile}</a>. <br />
            Please mention your registered phone number and email in the
            request.
          </div>
        </div>
        <div className="mt-4 mb-2 text-center ">
          {/* ToDo : Applying the name of the anchor
           */}
          <button
            type="button"
            onClick={e => (window.location.href = `${payload.error_url}`)}
            className="form-submit btn btn-raised greenButton"
          >
            Back to{" "}
            {anchorObj === Object(anchorObj) ? anchorObj.anchor_name : "Anchor"}
          </button>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  payload: state.authPayload.payload,
  adharObj: state.adharDetail.adharObj,
  anchorObj: state.authPayload.anchorObj,
  preFlightResp: state.businessDetail.preFlightResp
});

export default withRouter(
  connect(
    mapStateToProps,
    { setBusinessDetail, pan_adhar, setAdharManual, changeLoader }
  )(AppRejected)
);
