import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import {
  environment,
  mintifiMail,
  mintifiMobile
} from "../../../shared/constants";
import {
  pan_adhar,
  setAdharManual,
  setBusinessDetail,
  changeLoader
} from "../../../actions/index";
import { postMessage, checkObject } from "../../../shared/common_logic";

// const { PUBLIC_URL } = process.env;

class AppRejected extends Component {
  static propTypes = {
    adharObj: PropTypes.object.isRequired,
    // preFlightResp: PropTypes.object.isRequired,
    anchorObj: PropTypes.object,
    payload: PropTypes.object.isRequired
  };

  componentWillMount() {
    const { changeLoader } = this.props;
    changeLoader(false);
    // alertModule('Just a test');
    // if (!checkObject(payload))
    //     history.push(`${PUBLIC_URL}/preapprove/token`);
  }

  render() {
    let { adharObj, location, payload, anchorObj } = this.props;
    // let { loan_application_id, credit_eligibility } = preFlightResp;
    const loan_status = "expired"; // rejected  // expired
    let { state } = location;
    // ToDo :  Hide it in Prod
    if (environment === "local") location = { state: { status: loan_status } };

    // console.log(state);
    if (window.location !== window.parent.location)
      postMessage({
        loan_status: state.status,
        loan_id: "",
        credit_limit: "",
        action: "close"
      });

    if (environment === "dev")
      if (checkObject(state)) state = { status: loan_status };

    if (checkObject(payload))
      if (checkObject(state))
        return (
          <>
            {/* <button onClick={() => history.push(`${PUBLIC_URL}/preapprove/businessdetail`)} className={"btn btn-link"}>
                    Go Back
                </button>*/}
            <h4 className={"text-center"}>Credit Eligibility</h4>
            <br />
            {/*fa-exclamation-circle*/}
            <i
              style={{
                fontSize: "60px",
                color: state.status === "rejected" ? "crimson" : "gold"
              }}
              className={"fa fa-exclamation-triangle closeCircle"}
            />
            {/*<h5 className={"text-center"}> Application {(location.state.status === 'rejected') ? 'Rejected' : 'Error'}</h5>*/}
            <br />
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
                We regret to inform you that your application can not be
                approved at this point of time.
                <br />
                <b>
                  {state.status === "rejected"
                    ? "You can try again with us after 6 months"
                    : "Kindly try again after some time"}
                </b>
              </div>
              <div className={"blockquote-footer"}>
                In case of any query, please contact us at{" "}
                <a href={`mailto:${mintifiMail}`}>{mintifiMail}</a> or{" "}
                <a href={`tel:+91${mintifiMobile}`}>+91 {mintifiMobile}</a>.{" "}
                <br />
                Please mention your registered phone number and email in the
                request.
              </div>
            </div>
            <div className="mt-5 mb-5 text-center ">
              {/* ToDo : Applying the name of the anchor
               */}
              <button
                type="button"
                onClick={e => (window.location.href = `${payload.error_url}`)}
                className="form-submit btn btn-raised greenButton"
              >
                Back to{" "}
                {checkObject(anchorObj) ? anchorObj.anchor_name : "Anchor"}
              </button>
            </div>
          </>
        );
      else return <></>;
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
