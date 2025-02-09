import React, { Component } from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import { loanUrl, app_id } from "../../../shared/constants";
import { connect } from "react-redux";
import {
  setBusinessDetail,
  setAdharManual,
  pan_adhar,
  storeResponse,
  changeLoader
} from "../../../actions/index";
import { withRouter } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { alertModule } from "../../../shared/commonLogic";

const { PUBLIC_URL } = process.env;

class ReviewBusinessDetail extends Component {
  obj = { pan_correct: "", adhar_correct: "" };
  state = {
    // authObj: {mobile: '', verified: ''},
    pan_adhar: { pan: "", adhar: "" },
    businessDetail: {
      companytype: "",
      gst: "",
      bpan: "",
      avgtrans: "",
      dealercode: ""
    },
    /* adharDetail: {
      f_name: "",
      m_name: "",
      l_name: "",
      mobile: "",
      verified: "",
      email: "",
      dob: new Date(),
      gender: "m",
      pincode: "",
      address1: "",
      address2: ""
    }, */
    tnc_consent: false,
    tncModal: false
  };

  componentWillMount() {
    const { payload, authObj, adharObj, businessObj, history } = this.props;

    if (payload === Object(payload) && payload) {
      if (adharObj !== Object(adharObj))
        history.push(`${PUBLIC_URL}/preapprove/personaldetail`);

      if (businessObj !== Object(businessObj))
        history.push(`${PUBLIC_URL}/preapprove/businessdetail`);
    } else history.push(`${PUBLIC_URL}/preapprove/token`);
  }

  // needs to be at the backend
  /*   _updateAnchor(creditStatus) {
           const {anchorDomain, payload, changeLoader} = this.props;
           changeLoader(true);
           fetch(`${anchorDomain}/credit/${payload.anchor_transaction_id}/status/${creditStatus}`).then((resp) => {
               changeLoader(false);
           }, (resp) => {
               alertModule();
               changeLoader(false);
           })
       }*/

  _formSubmit(e) {
    // e.preventDefault();
    let dob = "1980-01-01";
    const {
      payload,
      gstProfile,
      businessObj,
      adharObj,
      pan,
      adhar,
      token,
      changeLoader,
      history,
      storeResponse
    } = this.props;
    changeLoader(true);
    if (adharObj === Object(adharObj))
      if (adharObj.dob) {
        let dobObj = new Date(adharObj.dob);
        dob =
          dobObj.getFullYear() +
          "-" +
          (dobObj.getMonth() + 1) +
          "-" +
          dobObj.getDate();
      }

    fetch(`${loanUrl}/application/instant`, {
      method: "POST",
      headers: { "Content-Type": "application/json", token: token },
      body: JSON.stringify({
        app_id: app_id,
        anchor_id: payload.anchor_id,
        distributor_dealer_code:
          businessObj.dealercode && payload.distributor_dealer_code,
        sales_agent_mobile_number: payload.sales_agent_mobile_number,
        business_type: businessObj.companytype,
        anchor_transaction_id: payload.anchor_transaction_id,
        borrowers: {
          first_name: adharObj.f_name || "_",
          middle_name: adharObj.m_name,
          last_name: adharObj.l_name,
          pan: pan,
          gstin: businessObj.gst,
          dob: dob,
          mobile_number: adharObj.mobile,
          email: adharObj.email,
          gender: adharObj.gender,
          residence_address: {
            address_1: adharObj.address1,
            address_2: adharObj.address2 ? adharObj.address2 : " ",
            ownership_type: adharObj.ownership,
            pincode: adharObj.pincode
          }
        },
        loan_details: {
          loan_amount: payload.loan_amount,
          product_type: payload.product_type,
          average_monthly_transaction: businessObj.avgtrans,
          retailer_onboarding_date: payload.retailer_onboarding_date
          // "vintage": 60
        },
        tnc_accepted: true,
        is_credit_decision: true,
        timestamp: new Date()
      })
    })
      .then(resp => resp.json())
      .then(
        resp => {
          changeLoader(false);
          if (resp.response === Object(resp.response)) {
            let { loan_status } = resp.response.credit_eligibility;
            // this._updateAnchor(loan_status);
            storeResponse(resp.response);
            console.log(resp.response);
            if (loan_status === "expired" || loan_status === "rejected")
              history.push(`${PUBLIC_URL}/preapprove/apprejected`, {
                status: "rejected"
              });
            else if (loan_status === "pending") {
              setTimeout(
                () =>
                  history.push(`${PUBLIC_URL}/preapprove/appapproved`, {
                    status: "pending"
                  }),
                500
              );
            } else {
              setTimeout(
                () =>
                  history.push(`${PUBLIC_URL}/preapprove/appapproved`, {
                    status: "aip"
                  }),
                500
              );
            }
          } else if (resp.error === Object(resp.error)) {
            alertModule(resp.message, "warn");
            history.push(`${PUBLIC_URL}/preapprove/apprejected`, {
              status: "expired"
            });
          }
        },
        resp => {
          changeLoader(false);
          alertModule();
          //        this.props.history.push(`${process.env.PUBLIC_URL}/AppRejected`);
        }
      );
  }

  componentDidMount() {
    const { adharObj, adhar, pan, businessObj } = this.props;
    this.setState({
      adharDetail: adharObj,
      pan_adhar: { pan: pan, adhar: adhar },
      businessDetail: businessObj
    });
    console.log(adharObj);
    this._formSubmit();
  }

  render() {
    return (
      <>
        <div className="justify-content-center text-center">
          <i className={"fa fa-clipboard-list"} style={{ fontSize: "50px" }} />
          <br />

          <div
            className="lds-ellipsis"
            style={{
              marginTop: "-10px",
              marginBottom: "-18px"
            }}
          >
            <div />
            <div />
            <div />
            <div />
          </div>
          <p
            className="paragraph_section text-center"
            style={{ fontSize: "12px", lineHeight: "22px" }}
          >
            Processing your Application <br />
            Submitting your data to our server, Hold on !
          </p>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  businessObj: state.businessDetail.businessObj,
  adharObj: state.adharDetail.adharObj,
  gstProfile: state.businessDetail.gstProfile,
  pan: state.adharDetail.pan,
  adhar: state.adharDetail.adhar,
  // authObj: state.authPayload.authObj,
  token: state.authPayload.token,
  payload: state.authPayload.payload,
  preFlightResp: state.businessDetail.preFlightResp
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      setBusinessDetail,
      pan_adhar,
      setAdharManual,
      storeResponse,
      changeLoader
    }
  )(ReviewBusinessDetail)
);
