import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {loanUrl, app_id} from "../../../shared/constants";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {
    setBusinessDetail,
    setAdharManual,
    pan_adhar,
    storeResponse,
    changeLoader,
    showAlert
} from "../../../actions/index";
import {withRouter} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import {checkObject, retrieveDate} from "../../../shared/common_logic";

const {PUBLIC_URL} = process.env;

class ReviewBusinessDetail extends Component {
    obj = {pan_correct: "", adhar_correct: ""};

    static propTypes = {
        adharObj: PropTypes.object.isRequired,
        anchorObj: PropTypes.object,
        payload: PropTypes.object.isRequired,
        businessObj: PropTypes.object.isRequired,
        gstProfile: PropTypes.object
    };

    state = {
        // authObj: {mobile: '', verified: ''},
        pan_adhar: {pan: "", adhar: ""},
        businessDetail: {
            company_type: "",
            gst: "",
            bpan: "",
            avgtrans: "",
            dealer_code: ""
        },
        tnc_consent: false,
        tncModal: false
    };

    componentWillMount() {
        const {payload, authObj, adharObj, businessObj, history} = this.props;

        if (checkObject(payload)) {
            if (!checkObject(adharObj))
                history.push(`${PUBLIC_URL}/preapprove/personaldetail`);

            if (!checkObject(businessObj))
                history.push(`${PUBLIC_URL}/preapprove/businessdetail`);
        } else history.push(`${PUBLIC_URL}/preapprove/token`);
    }

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
            storeResponse,
            showAlert
        } = this.props;
        changeLoader(true);
        if (checkObject(adharObj))
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
            headers: {"Content-Type": "application/json", token: token},
            body: JSON.stringify({
                app_id: app_id,
                anchor_id: payload.anchor_id,
                distributor_dealer_code:
                    businessObj.dealer_code && payload.distributor_dealer_code,
                sales_agent_mobile_number: payload.sales_agent_mobile_number,
                // business_type: businessObj.company_type,
                anchor_transaction_id: payload.anchor_transaction_id,
                borrowers: {
                    first_name: adharObj.f_name || "_",
                    middle_name: adharObj.m_name,
                    last_name: adharObj.l_name,
                    pan: pan,
                    // gstin: businessObj.gst,
                    dob: retrieveDate(dob),
                    mobile_number: adharObj.mobile,
                    email: adharObj.email,
                    gender: adharObj.gender,
                    residence_address: {
                        address_1: adharObj.address1,
                        address_2: adharObj.address2 ? adharObj.address2 : "",
                        ownership_type: adharObj.ownership,
                        pincode: adharObj.pincode
                    }
                },
                business_details: {
                    business_name: businessObj.company_name,
                    business_type: businessObj.company_type,
                    gstin: businessObj.gst,
                    business_pan: businessObj.bpan,
                    inc_date: retrieveDate(businessObj.inc_date),
                    business_email: businessObj.business_email,
                    business_phone: businessObj.business_phone,
                    no_of_founders: businessObj.no_of_founders,
                    no_of_employees: businessObj.no_of_employees,
                    monthly_anchor_txn_value: businessObj.avgtrans,
                    retailer_onboarding_date: payload.retailer_onboarding_date,
                    retailer_vintage: payload.retailer_vintage ? payload.retailer_vintage : '',
                    business_address: {
                        ownership_type: businessObj.ownership,
                        address_1: businessObj.address1,
                        address_2: businessObj.address2,
                        pincode: businessObj.pincode
                    }
                },
                loan_details: {
                    loan_amount: payload.loan_amount,
                    product_type: payload.product_type,
                },
                tnc_accepted: true,
                is_credit_decision: true,
                timestamp: new Date(),
                transactions_details: {}
            })
        })
            .then(resp => resp.json())
            .then(
                resp => {
                    changeLoader(false);
                    if (checkObject(resp.response)) {
                        let {loan_status} = resp.response.credit_eligibility;
                        // this._updateAnchor(loan_status);
                        storeResponse(resp.response);
                        // console.log(resp.response);
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
                    } else if (checkObject(resp.error)) {
                        showAlert(resp.message, "warn");
                        history.push(`${PUBLIC_URL}/preapprove/apprejected`, {
                            status: "expired"
                        });
                    }
                },
                resp => {
                    changeLoader(false);
                    showAlert("net");
                    //        this.props.history.push(`${process.env.PUBLIC_URL}/AppRejected`);
                }
            );
    }

    componentDidMount() {
        const {adharObj, adhar, pan, businessObj} = this.props;
        this.setState({
            adharDetail: adharObj,
            pan_adhar: {pan: pan, adhar: adhar},
            businessDetail: businessObj
        });
        // console.log(adharObj);
        this._formSubmit();
    }

    render() {
        return (
            <>
                <div className="justify-content-center text-center fetchLoadPage">
                    <i className={"fa fa-clipboard-list"}/>
                    <br/>

                    <div className="lds-ellipsis">
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                    </div>
                    <p className="paragraph_section">
                        Processing your Application <br/>
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
            changeLoader,
            showAlert
        }
    )(ReviewBusinessDetail)
);
