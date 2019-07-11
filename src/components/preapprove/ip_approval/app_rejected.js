import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { environment } from "../../../shared/constants";
// import { alertModule } from "../../../shared/commonLogic";
import {
  pan_adhar,
  setAdharManual,
  setBusinessDetail,
  changeLoader
} from "../../../actions/index";

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
    // ToDo :  Hide it in Prod
    if (environment === "local") location = { state: { status: "declined" } }; // declined  // expired

    return (
      <>
        {/* <button onClick={() => history.push(`${PUBLIC_URL}/preapprove/businessdetail`)} className={"btn btn-link"}>
                    Go Back
                </button>*/}
        <h4 className={"text-center"}>Credit Eligibility</h4>
        <br />
        {/*fa-exclamation-circle*/}
        <i
          style={{ fontSize: "60px" }}
          className={"fa fa-exclamation-triangle closeCircle"}
        />
        {/*<h5 className={"text-center"}> Application {(location.state.status === 'decline') ? 'Rejected' : 'Error'}</h5>*/}
        <br />
        <div
          className="paragraph_styling  text-center"
          style={{ margin: "auto 5%" }}
        >
          <div
            className={
              location.state.status === "decline"
                ? "alert alert-danger"
                : "alert alert-warning"
            }
            role="alert"
          >
            <h5 className="alert-heading">
              {location.state.status === "decline" ? (
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
              {location.state.status === "decline"
                ? "You can try again with us after 6 months"
                : "Kindly try again after some time"}
            </b>
          </div>
          <div className={"blockquote-footer"}>
            In case of any query, please contact us at{" "}
            <a href={"mailto:support@mintifi.com"}>support@mintifi.com</a> or{" "}
            <a href={"tel:+919999999999"}>+91 9999999999</a>. <br />
            Please mention your{" "}
            <b>
              ( loan application id :{" "}
              {preFlightResp === Object(preFlightResp)
                ? preFlightResp.loan_application_id
                : ""}{" "}
              )
            </b>{" "}
            in the request.
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
            {anchorObj === Object(anchorObj) ? anchorObj.anchor_name : "Yatra"}
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
