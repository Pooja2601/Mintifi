import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { changeLoader, setAdharManual } from "../../actions";
import {
  defaultLender,
  environment,
  mintifiMail,
  mintifiMobile
} from "../../shared/constants";
import { postMessage, checkObject } from "../../shared/common_logic";

const { PUBLIC_URL } = process.env;

const ErrorUrl = props => {
  const { payload, authObj, history, preFlightResp, loanPayload } = props;
  if (!checkObject(payload)) history.push(`${PUBLIC_URL}/drawdown/token`);
  if (!checkObject(authObj)) history.push(`${PUBLIC_URL}/drawdown/auth`);

  if (checkObject(payload)) {
    // let { f_name, l_name } = payload;
    let loan_product = "";

    // ToDo : make it const in prod.
    // let {creditLimit, loanStatus, loanOffers} = loanPayload;

    if (checkObject(preFlightResp)) {
      loan_product = preFlightResp.offer.product_type.split("_");
      loan_product = loan_product[0] + " " + loan_product[1];
    }

    if (window.location !== window.parent.location) {
      if (checkObject(payload))
        postMessage({
          drawdown_status: "error",
          drawdown_offer: checkObject(preFlightResp)
            ? preFlightResp.offer
            : null,
          loan_id: loanPayload.loanOffers.loan.loan_application_id,
          drawdown_id: checkObject(preFlightResp)
            ? preFlightResp.drawdown_id
            : null,
          action: "close"
        });
    } else {
      if (checkObject(payload))
        window.setTimeout(
          () => (window.location.href = `${payload.error_url}`),
          5000
        );
    }

    return (
      <>
        {/* <button onClick={() => history.push(`${PUBLIC_URL}/businessdetail`)} className={"btn btn-link"}>
                    Go Back
                </button>*/}
        <div className={"thankYouPage"}>
          <i
            className="fa fa-times-circle checkCircle"
            style={{ color: "crimson" }}
          />
          <h4 className={"text-center"}> Application Error</h4>
          <br />

          <div className="alert alert-danger text-center" role="alert">
            {/*<h5 className="alert-heading">Dear {f_name} {l_name}</h5>*/}
            <p className="paragraph_styling ">
              We couldn't process your drawdown request as of now,
              <br /> Please try after some time.
            </p>
          </div>

          <small className={"footerComplaint"}>
            In case of any query, please contact us at{" "}
            <a href={`mailto:${mintifiMail}`}>{mintifiMail}</a> or{" "}
            <a href={`tel:+91${mintifiMobile}`}>+91 {mintifiMobile}</a>. <br />
            Please mention your registered phone number and email in the
            request.
          </small>
          <div className="mt-5 mb-5 text-center ">
            <button
              type="button"
              onClick={e => (window.location.href = payload.error_url)}
              className="form-submit btn btn-raised greenButton"
            >
              Exit Application
            </button>
          </div>
        </div>
      </>
    );
  } else
    return (
      <>
        <p className={"alert alert-danger"}>
          We hope that you're not Lost, Its all empty here.
        </p>{" "}
      </>
    );
};

const mapStateToProps = state => ({
  token: state.drawdownReducer.token,
  payload: state.drawdownReducer.payload,
  authObj: state.drawdownReducer.authObj,
  preFlightResp: state.drawdownReducer.preFlightResp,
  loanPayload: state.drawdownReducer.loanPayload
});

export default withRouter(
  connect(
    mapStateToProps,
    { changeLoader }
  )(ErrorUrl)
);
