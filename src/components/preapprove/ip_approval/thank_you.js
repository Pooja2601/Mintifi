import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { setAdharManual } from "../../../actions/index";
import { checkObject } from "../../../shared/common_logic";

class ThankYou extends Component {
  componentWillMount() {
    const { payload, authObj, adharObj, businessObj } = this.props;
    if (!checkObject(payload))
      if (!checkObject(authObj))
        if (!checkObject(adharObj))
          if (!checkObject(businessObj))
            this.props.history.push("/preapprove/token");
  }

  render() {
    const { adharObj, match, preFlightResp } = this.props;
    if (checkObject(adharObj)) {
      const { f_name, l_name } = adharObj;
      // const {loan_application_id, credit_eligibility} = preFlightResp;
      return (
        <>
          {/* <button onClick={() => this.props.history.push('/preapprove/businessdetail')} className={"btn btn-link"}>
                    Go Back
                </button>*/}
          <br />
          <i className={"fa fa-check-circle checkCircle"}></i>
          <h3 className={"text-center"}> Thank you !</h3>
          <br />

          <div className="alert alert-success" role="alert">
            <h4 className="alert-heading">
              Dear {f_name} {l_name}
            </h4>
            <p className="paragraph_styling  ">
              We're processing the application based on the KYC documents
              submitted, our representatives will get in touch with you soon.
              <br />
              You can expect the Loan amount in your bank account within 48
              hours.
            </p>
          </div>

          <div
            className="paragraph_styling text-left alert alert-success"
            role="alert"
          >
            {checkObject(preFlightResp) ? (
              <table width="100%">
                <tbody>
                  <tr>
                    <td>PRODUCT OFFERED</td>
                    <td>{preFlightResp.credit_eligibility.product_offered}</td>
                  </tr>
                  <tr>
                    <td>LOAN ID</td>
                    <td>{preFlightResp.loan_application_id}</td>
                  </tr>
                  <tr>
                    <td>LOAN STATUS</td>
                    <td>{preFlightResp.credit_eligibility.loan_status}</td>
                  </tr>
                  <tr>
                    <td>LENDER</td>
                    <td>FULLERTON</td>
                  </tr>
                  <tr>
                    <td>CREDIT APPROVED</td>
                    <td>
                      Rs.{" "}
                      {preFlightResp.credit_eligibility.loan_amount_approved}
                    </td>
                  </tr>
                  <tr>
                    <td>TENURE</td>
                    <td>
                      {preFlightResp.credit_eligibility.loan_tenor} Months
                    </td>
                  </tr>
                  <tr>
                    <td>EMI</td>
                    <td>Rs. {preFlightResp.credit_eligibility.emi}</td>
                  </tr>
                  <tr>
                    <td>RATE of INTEREST</td>
                    <td> {preFlightResp.credit_eligibility.roi} %</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <></>
            )}
          </div>
          <div className="mt-5 mb-5 text-center ">
            <button
              type="button"
              onClick={e => this.props.history.push("/preapprove/")}
              className="form-submit btn btn-raised greenButton"
            >
              Alright
            </button>
          </div>
        </>
      );
    } else return <></>;
  }
}

const mapStateToProps = state => ({
  adharObj: state.adharDetail.adharObj,
  preFlightResp: state.businessDetail.preFlightResp
});

export default withRouter(
  connect(
    mapStateToProps,
    { setAdharManual }
  )(ThankYou)
);
