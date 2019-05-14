import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl, loanUrl, BusinessType} from "../../shared/constants";
import {connect} from "react-redux";
import {setBusinessDetail, setAdharManual, pan_adhar, storeResponse, changeLoader} from "../../actions";
import {Link, withRouter} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

class ReviewBusinessDetail extends Component {
    obj = {pan_correct: '', adhar_correct: ''};
    state = {
        // authObj: {mobile: '', verified: ''},
        pan_adhar: {pan: '', adhar: ''},
        businessDetail: {
            companytype: "", gst: "", bpan: "",
            avgtrans: "", dealercode: ""
        },
        adharDetail: {
            f_name: '',
            m_name: '',
            l_name: '',
            mobile: '',
            verified: '',
            email: '',
            dob: new Date(),
            gender: 'm',
            pincode: '',
            address1: '',
            address2: ''
        },
        tnc_consent: false,
        tncModal: false,
    };


    componentWillMount() {
        const {payload, authObj, adharObj, businessObj} = this.props;
        if (payload !== Object(payload))
            if (adharObj !== Object(adharObj))
                if (businessObj !== Object(businessObj))
                    if (adharObj.verified)
                        this.props.history.push("/Token");
    }

    _formSubmit(e) {
        e.preventDefault();
        this.props.changeLoader(true);
        const {payload, gstProfile, businessObj, adharObj, pan, adhar} = this.props;
        let dob = adharObj.dob.substr(0, 10);
        /*
                let date = (adharObj.dob).getDate();
                let month = (adharObj.dob).getMonth();
                let year = (adharObj.dob).getFullYear();
                let dob = `${year}-${month}-${date}`;
        */

        fetch(`${loanUrl}/application/instant`, {
            method: "POST",
            headers: {"Content-Type": "application/json", "token": this.props.token},
            body: JSON.stringify({
                "app_id": "3",
                "anchor_id": payload.anchor_id,
                "distributor_dealer_code": payload.distributor_dealer_code,
                "sales_agent_mobile_number": payload.sales_agent_mobile_number,
                "business_type": businessObj.companytype,
                "anchor_transaction_id": payload.anchor_transaction_id,
                "borrowers": {
                    "first_name": adharObj.f_name,
                    "middle_name": adharObj.m_name,
                    "last_name": adharObj.l_name,
                    "pan": pan,
                    "gstin": businessObj.gst,
                    "dob": dob,
                    "mobile_number": adharObj.mobile,
                    "email": adharObj.email,
                    "gender": adharObj.gender,
                    "residence_address": {
                        "address_1": adharObj.address1,
                        "address_2": adharObj.address2 ? adharObj.address2 : " ",
                        "address_3": " ",
                        "ownership_type": adharObj.ownership,
                        "pincode": adharObj.pincode
                    }
                },
                "loan_details": {
                    "loan_amount": payload.loan_amount,
                    "average_monthly_transaction": businessObj.avgtrans,
                    "retailer_onboarding_date": payload.retailer_onboarding_date,
                    "vintage": 60
                },
                "is_credit_decision": true,
                "timestamp": new Date()
            })
        }).then(resp => resp.json()).then(resp => {
            this.props.changeLoader(false);
            if (resp.response === Object(resp.response)) {
                let {loan_status} = resp.response.credit_eligibility;
                this.props.storeResponse(resp.response);
                if (loan_status === 'closed' || loan_status === 'decline')
                    this.props.history.push("/AppRejected", {status: 'decline'});
                else if (loan_status === 'pending') {
                    setTimeout(() => this.props.history.push("/AppApproved", {status: 'pending'}), 500);
                }
                else {
                    setTimeout(() => this.props.history.push("/AppApproved", {status: 'approved'}), 500);
                }

            }
            else if (resp.error === Object(resp.error)) {
                console.log(resp.message);
                this.props.history.push("/AppRejected", {status: 'error'});
            }
        }, (resp) => {
            this.props.changeLoader(false);
            // console.log("Application Rejected");
            console.log("Internet Connectivity Issue");
            //        this.props.history.push("/AppRejected);
        });
    }

    //ToDo : Fetching info of the Business Information and Credit Line Check
    componentDidMount() {

        const {adharObj, adhar, pan, businessObj} = this.props;
        this.setState({
            adharDetail: adharObj,
            pan_adhar: {pan: pan, adhar: adhar},
            businessDetail: businessObj,
        });
        console.log(adharObj);
        // console.log(this.changeDob(this.state.adharDetail.dob));
    }


    render() {

        return (
            <>
                <div className="justify-content-center text-center">
                    <i className={"fa fa-clipboard-list"} style={{fontSize: '60px'}}></i>
                    <br/>


                    <div className="lds-ellipsis" style={{
                        marginTop: "-10px",
                        marginBottom: '-18px'
                    }}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <p className="paragraph_section" style={{fontSize: '15px', lineHeight: '22px'}}>Processing your
                        Application <br/>Submitting your data to our server, Hold on !</p>
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
        {setBusinessDetail, pan_adhar, setAdharManual, storeResponse, changeLoader}
    )(ReviewBusinessDetail)
);
