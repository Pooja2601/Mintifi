import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { setAdharManual } from "../../../actions/index";
import { defaultLender, environment } from "../../../shared/constants";

const { PUBLIC_URL } = process.env;

class AppApproved extends Component {
  state = { confirmed: false };

  render() {
    let {
      adharObj,
      preFlightResp,
      history,
      anchorObj,
      location,
      payload
    } = this.props;

    // if (adharObj === Object(adharObj))
    // if(preFlightResp ===Object(preFlightResp))
    // {

    const { f_name, l_name } = adharObj;
    let { loan_application_id, credit_eligibility } = preFlightResp;

    // ToDo : Hide Start (in Prod)
    if (environment === "local") {
      const load_status = "bank_approved"; // pending // bank_approved
      credit_eligibility = {
        product_offered: "LoC",
        loan_status: load_status,
        loan_amount_approved: "500000",
        loan_tenor: "16",
        roi: "7",
        emi: "33440"
      };
      loan_application_id = 1740;
      location = { state: { status: load_status } };
    }
    // ToDo : Hide Ends here

    let iconCss = "fa checkCircle ";
    return (
      <>
        {/* <button onClick={() => history.push(`${PUBLIC_URL}/BusinessDetail`)} className={"btn btn-link"}>
                    Go Back
                </button>*/}
        <h4 className={"text-center"}>Credit Eligibility</h4>
        <br />

        <i
          className={
            credit_eligibility.loan_status === "pending"
              ? iconCss + "fa-hourglass-half"
              : iconCss + "fa-check-circle"
          }
          style={{
            color:
              credit_eligibility.loan_status === "pending" ? "#02587F" : "",
            fontSize: "60px"
          }}
        />
        <h5 className={"text-center"}>
          {" "}
          Application{" "}
          {credit_eligibility.loan_status === "pending"
            ? "Pending..."
            : "Approved !"}
        </h5>

        <div className={"alert text-center"} role="alert">
          <p className="paragraph_styling">
            {credit_eligibility.loan_status === "pending" ? (
              <>
                Thank you {f_name} for completing the Loan Application process{" "}
                <br />
                However, we need more information for processing your loan
                application .<br /> We will get in touch with you in next 24
                hours.
              </>
            ) : (
              <>
                {" "}
                Dear {f_name} {l_name}, Congratulations. You are eligible for a
                credit limit of{" "}
                <b style={{ fontWeight: "700" }}>
                  {" "}
                  Rs. {credit_eligibility.loan_amount_approved}/-
                </b>
              </>
            )}{" "}
          </p>
          {/*<p className="paragraph_styling " style={{fontSize: '14px'}}>
                            Thank you for completing the Loan Application process.<br/>
                            {(location.state.status === 'pending') ? <>However, we need more information for
                                    processing your loan application .<br/> We will get in touch with you in next 24
                                    hours.</> :
                                <b><br/>Your Application is approved for a credit line of
                                    <b style={{fontWeight: '700'}}> Rs. {credit_eligibility.loan_amount_approved}/-</b>.</b>}
                            <br/>
                        </p>*/}
        </div>
        <br />

        <div
          className="paragraph_styling text-left"
          role="alert"
          style={{ margin: "auto 5%" }}
        >
          <b className={"text-center"}>
            {" "}
            Your Credit Line details are as below:
          </b>
          <br />
          <div
            className={
              credit_eligibility.loan_status === "pending"
                ? "alert alert-info"
                : "alert alert-success"
            }
          >
            <table width="100%" style={{ margin: "auto 15%" }}>
              <tbody>
                {/*<tr>
                                    <td>PRODUCT OFFERED</td>
                                    <td>{credit_eligibility.product_offered}</td>
                                </tr>*/}
                <tr>
                  <td className={"tableDataRight"}>Loan ID</td>
                  <td>
                    {preFlightResp === Object(preFlightResp)
                      ? loan_application_id
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td className={"tableDataRight"}>Application Status</td>
                  <td>
                    {credit_eligibility.loan_status === "aip"
                      ? "approval_in_principle"
                      : credit_eligibility.loan_status}
                  </td>
                </tr>
                <tr>
                  <td className={"tableDataRight"}>Lender</td>
                  <td>{defaultLender}</td>
                </tr>
                {credit_eligibility.loan_status !== "pending" ? (
                  <>
                    <tr>
                      <td className={"tableDataRight"}>Credit Approved</td>
                      <td>Rs. {credit_eligibility.loan_amount_approved}</td>
                    </tr>
                    <tr>
                      <td className={"tableDataRight"}>Tenure</td>
                      <td>{credit_eligibility.loan_tenor} Months</td>
                    </tr>
                    <tr>
                      <td className={"tableDataRight"}>EMI</td>
                      <td>Rs. {credit_eligibility.emi}</td>
                    </tr>
                    <tr>
                      <td className={"tableDataRight"}>Interest Rate</td>
                      <td> {credit_eligibility.roi} % p.a.</td>
                    </tr>
                  </>
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <br />

        <div
          className=" "
          style={{
            marginLeft: "2.3rem",
            visibility:
              location.state.status !== "pending" ? "visible" : "hidden"
          }}
        >
          <label style={{ color: "black", lineHeight: "1.5" }}>
            {/*<input type="checkbox" checked={this.state.confirmed}
                               onChange={(e) =>
                                   this.setState(prevState => ({confirmed: !prevState.confirmed}))
                               }/>*/}
            <label className="main">
              I accept the terms of the credit eligibility as given above.
              <input
                checked={this.state.confirmed}
                onChange={e =>
                  this.setState(prevState => ({
                    confirmed: !prevState.confirmed
                  }))
                }
                type="checkbox"
              />
              <span className="geekmark" />
            </label>
          </label>
        </div>
        <div
          className="mt-5 mb-3 text-center"
          style={{
            visibility:
              location.state.status !== "pending" ? "visible" : "hidden"
          }}
        >
          <button
            type="button"
            disabled={!this.state.confirmed}
            onClick={e => {
              history.push(`${PUBLIC_URL}/preapprove/docsupload`);
              // document.location.href = '/preapprove/docsupload';
            }}
            className="form-submit btn btn-raised greenButton"
          >
            Complete Your KYC
          </button>
        </div>
        {location.state.status === "pending" ? (
          <>
            <div
              className={"blockquote-footer mb-5 text-center"}
              style={{ marginTop: "-120px" }}
            >
              In case of any query, please contact us at{" "}
              <a href={"mailto:support@mintifi.com"}>support@mintifi.com</a> or{" "}
              <a href={"tel:+919999999999"}>+91 9999999999</a>. <br />
              Please mention your ( loan application id :{" "}
              {preFlightResp === Object(preFlightResp)
                ? loan_application_id
                : ""}{" "}
              ) in the request.
            </div>
            <div className="mt-5 mb-5 text-center ">
              {/*
                    ToDo : Applying the name of the anchor
                    */}
              <button
                type="button"
                onClick={e => (window.location.href = `${payload.success_url}`)}
                className="form-submit btn btn-raised greenButton"
              >
                Back to{" "}
                {anchorObj === Object(anchorObj)
                  ? anchorObj.anchor_name
                  : "Yatra"}
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
      </>
    );
    // }
  }
}

const mapStateToProps = state => ({
  adharObj: state.adharDetail.adharObj,
  // authObj: state.authPayload.authObj,
  anchorObj: state.authPayload.anchorObj,
  businessObj: state.businessDetail.businessObj,
  payload: state.authPayload.payload,
  preFlightResp: state.businessDetail.preFlightResp
});

export default withRouter(
  connect(
    mapStateToProps,
    { setAdharManual }
  )(AppApproved)
);
