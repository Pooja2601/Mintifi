import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { changeLoader, setAdharManual } from "../../actions";
import { defaultLender, environment } from "../../shared/constants";
import { postMessage, checkObject } from "../../shared/common_logic";
import ButtonWrapper from "../../layouts/button_wrapper";

const { PUBLIC_URL } = process.env;

const ThankYou = props => {
  const {
    payload,
    authObj,
    changeLoader,
    history,
    preFlightResp,
    loanPayload
  } = props;
  if (!checkObject(payload)) history.push(`${PUBLIC_URL}/drawdown/token`);
  if (!checkObject(authObj)) history.push(`${PUBLIC_URL}/drawdown/auth`);

  if (checkObject(payload) && checkObject(preFlightResp)) {
    // let { f_name, l_name } = payload;
    let loan_product = "";

    // ToDo : make it const in prod.
    // let {creditLimit, loanStatus, loanOffers} = loanPayload;

    if (checkObject(preFlightResp)) {
      loan_product = preFlightResp.offer.product_type.split("_");
      loan_product = loan_product[0] + " " + loan_product[1];
    }

    if (window.location.host !== window.parent.location.host)
      postMessage({
        drawdown_status: "success",
        drawdown_offer: preFlightResp.offer,
        loan_id: loanPayload.loanOffers.loan.loan_application_id,
        drawdown_id: preFlightResp.drawdown_id,
        action: "close"
      });
    else {
      if (checkObject(preFlightResp))
        window.setTimeout(
          () =>
            (window.location.href = `${payload.success_url}?drawdown_id=${preFlightResp.drawdown_id}`),
          5000
        );
    }

    return (
      <>
        {/* <button onClick={() => history.push(`${PUBLIC_URL}/businessdetail`)} className={"btn btn-link"}>
                    Go Back
                </button>*/}
        <div className={"thankYouPage"}>
          <i className={"fa fa-check-circle checkCircle"}></i>
          <h4 className={"text-center"}> Processing Application</h4>
          <br />

          <div className="alert  text-center" role="alert">
            {/*<h5 className="alert-heading">Dear {f_name} {l_name}</h5>*/}
            <p className="paragraph_styling ">
              Your payment request has been processed successfully.
              <br /> Your payment request details are as below :
            </p>
          </div>

          <div
            className="paragraph_styling text-left alert alert-success innerDiv"
            role="alert"
          >
            {checkObject(preFlightResp) && checkObject(loanPayload) ? (
              <table>
                <tbody>
                  <tr>
                    <td className={"tableDataRight"}>Product Selected</td>
                    <td className={"text-capitalize"}>{loan_product}</td>
                  </tr>
                  <tr>
                    <td className={"tableDataRight"}>Loan ID</td>
                    <td>{loanPayload.loanOffers.loan.loan_application_id}</td>
                  </tr>
                  <tr>
                    <td className={"tableDataRight"}>DrawDown ID</td>
                    <td>{preFlightResp.drawdown_id}</td>
                  </tr>
                  {/*
                                    <tr>
                                        <td className={"tableDataRight"}>Loan Status</td>
                                        <td>{loanPayload.loanStatus.loan_application_status}</td>
                                    </tr>*/}
                  <tr>
                    <td className={"tableDataRight"}>Lender</td>
                    <td>{defaultLender}</td>
                  </tr>
                  <tr>
                    <td className={"tableDataRight"}>Credit Balance</td>
                    <td>Rs. {loanPayload.creditLimit.balance_credit_limit}</td>
                  </tr>
                  <tr>
                    <td className={"tableDataRight"}>Tenure</td>
                    <td>{preFlightResp.offer.tenor} Months</td>
                  </tr>
                  <tr>
                    <td className={"tableDataRight"}>EMI</td>
                    <td>Rs. {preFlightResp.offer.emi}</td>
                  </tr>
                  <tr>
                    <td className={"tableDataRight"}>Rate of Interest</td>
                    <td> {preFlightResp.offer.roi} %</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <></>
            )}
          </div>
          <div className="mt-5 mb-5 text-center ">
            <ButtonWrapper
              type="button"
              onClick={e => (window.location.href = payload.success_url)}
              className="form-submit btn btn-raised greenButton"
              label="ALRIGHT"
            />
            {/* <button
                            type="button"
                            onClick={e => window.location.href = payload.success_url}
                            className="form-submit btn btn-raised greenButton"
                        >
                            Alright
                        </button> */}
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
  )(ThankYou)
);
