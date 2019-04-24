import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl, loanUrl, BusinessType} from "../../shared/constants";
import {connect} from "react-redux";
import {setBusinessDetail, setAdharManual, pan_adhar, storeResponse, changeLoader} from "../../actions";
import {Link, withRouter} from "react-router-dom";
// import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker/es";

class ReviewBusinessDetail extends Component {
    obj = {pan_correct: '', adhar_correct: ''};
    state = {
        authObj: {mobile: '', verified: ''},
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
            email: '',
            dob: new Date(),
            gender: 'm',
            pincode: '',
            address1: '',
            address2: ''
        }
    };

    componentWillMount() {
        const {payload, authObj, adharObj, businessObj} = this.props;
        if (payload !== Object(payload))
            if (authObj !== Object(authObj))
                if (adharObj !== Object(adharObj))
                    if (businessObj !== Object(businessObj))
                        if (authObj.verified)
                            this.props.history.push("/Token");
    }

    _formSubmit(e) {
        e.preventDefault();
        this.props.changeLoader(true);
        const {payload, gstProfile, businessObj, adharObj, pan, adhar, authObj} = this.props;
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
                    "mobile_number": (authObj.mobile) ? authObj.mobile : adharObj.mobile,
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
                if (loan_status === 'closed' || loan_status === 'decline')
                    this.props.history.push("/AppRejected", {status: 'decline'});
                else if (loan_status === 'pending') {
                    setTimeout(() => this.props.history.push("/AppApproved", {status: 'pending'}), 500);
                }
                else {
                    setTimeout(() => this.props.history.push("/AppApproved", {status: 'approved'}), 500);
                }
                this.props.storeResponse(resp.response);
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

    _PANEnter = (e, pan = 'personal') => {
        let regex = /^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]{1}?$/;
        if (e.target.value.length <= 10) {
            this.obj.pan_correct = regex.test(e.target.value);
            if (pan === 'personal')
                this.setState({pan_adhar: {...this.state.pan_adhar, pan: e.target.value}});
            else this.setState({businessDetail: {...this.state.businessDetail, bpan: e.target.value}});
            /* if(this.obj.pan_correct)
             this.props.pan_adhar(e.target.value, '');*/
        }
    };

    _AdharEnter = e => {
        let regex = /^([0-9]){12}$/;
        if (e.target.value.length <= 12) {
            this.obj.adhar_correct = regex.test(e.target.value);
            this.setState({pan_adhar: {...this.state.pan_adhar, adhar: e.target.value}})
            /* if(this.obj.adhar_correct)
             this.props.pan_adhar(this.props.pan, e.target.value);*/
        }
    };

    businessGst(e) {
        if (e.target.value.length <= 15) {
            let bpan = e.target.value.substr(2, 10);
            this.setState({businessDetail: {...this.state.businessDetail, gst: e.target.value, bpan}});
        }
    }

    //ToDo : Fetching info of the Business Information and Credit Line Check
    componentDidMount() {

        this.setState({
            adharDetail: this.props.adharObj,
            pan_adhar: {pan: this.props.pan, adhar: this.props.adhar},
            businessDetail: this.props.businessObj,
        });
        // console.log(this.changeDob(this.state.adharDetail.dob));
    }

    changeDob = (dob) => {
        // return dob;
        this.setState({
            adharDetail: {
                ...this.state.adharDetail,
                dob
            }
        }, () => this.props.setAdharManual(this.state.adharDetail))
    };

    render() {
        const gstProfile = this.props.gstProfile;
        return (
            <>
                {/*<Link to={'/AdharPan'} className={"btn btn-link"}>Go Back </Link>*/}
                <button onClick={() => this.props.history.push('/BusinessDetail')} className={"btn btn-link"}>
                    Go Back
                </button>
                <br/>
                <br/>
                <h4 className={"text-center"}>{(gstProfile === Object(gstProfile)) ? gstProfile.lgnm : ''}</h4>
                <p className="paragraph_styling  text-center">
                    <b> Kindly Review your Information.</b>
                </p>
                <form id="serverless-contact-form" onSubmit={e => this._formSubmit(e)}>
                    <p className="paragraph_styling  text-center">
                        <b> Personal Detail.</b>
                    </p>
                    {(this.state.adharDetail === Object(this.state.adharDetail)) ?
                        (<div className={"row"}>
                            <div className={"col-md-4 col-sm-12"}>
                                <div className="form-group mb-3 ">
                                    <label htmlFor="firstName" className={"bmd-label-floating"}>First Name *</label>
                                    <input
                                        type="text"
                                        className="form-control font_weight"
                                        // placeholder="Full Name"
                                        style={{textTransform: "uppercase", fontWeight: 600}}
                                        pattern="^[a-zA-Z]+$"
                                        title="Please enter First Name"
                                        autoCapitalize="characters"
                                        id="firstName"
                                        required={true}
                                        value={this.state.adharDetail.f_name}
                                        onBlur={() => this.props.setAdharManual(this.state.adharDetail)}
                                        // ref={ref => (this.obj.pan = ref)}
                                        onChange={(e) => this.setState({
                                            adharDetail: {
                                                ...this.state.adharDetail,
                                                f_name: e.target.value
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                            <div className={"col-md-4 col-sm-12"}>
                                <div className="form-group mb-3 ">
                                    <label htmlFor="middleName" className={"bmd-label-floating"}>Middle Name </label>
                                    <input
                                        type="text"
                                        className="form-control font_weight"
                                        // placeholder="Full Name"
                                        style={{textTransform: "uppercase", fontWeight: 600}}
                                        pattern="^[a-zA-Z]+$"
                                        title="Please enter Middle Name"
                                        autoCapitalize="characters"
                                        id="middleName"
                                        required={true}
                                        value={this.state.adharDetail.m_name}
                                        onBlur={() => this.props.setAdharManual(this.state.adharDetail)}
                                        // ref={ref => (this.obj.pan = ref)}
                                        onChange={(e) => this.setState({
                                            adharDetail: {
                                                ...this.state.adharDetail,
                                                m_name: e.target.value
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                            <div className={"col-md-4 col-sm-12"}>
                                <div className="form-group mb-3 ">
                                    <label htmlFor="lastName" className={"bmd-label-floating"}>Last Name *</label>
                                    <input
                                        type="text"
                                        className="form-control font_weight"
                                        // placeholder="Full Name"
                                        style={{textTransform: "uppercase", fontWeight: 600}}
                                        pattern="^[a-zA-Z]+$"
                                        title="Please enter Last Name"
                                        autoCapitalize="characters"
                                        id="lastName"
                                        required={true}
                                        value={this.state.adharDetail.l_name}
                                        onBlur={() => this.props.setAdharManual(this.state.adharDetail)}
                                        // ref={ref => (this.obj.pan = ref)}
                                        onChange={(e) => this.setState({
                                            adharDetail: {
                                                ...this.state.adharDetail,
                                                l_name: e.target.value
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>) : <></>}

                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-12"}>
                            {(this.props.authObj === Object(this.props.authObj)) ?
                                (<div className="form-group mb-3">
                                    <label htmlFor="numberMobile" className={"bmd-label-floating"}>Mobile Number
                                        *</label>
                                    <input
                                        type="number"
                                        className="form-control font_weight"
                                        // placeholder="Mobile Number"
                                        style={{textTransform: "uppercase", fontWeight: 600}}
                                        pattern="^[0-9]{10}+$"
                                        title="Please enter Mobile Number"
                                        id="numberMobile"
                                        required={true}
                                        value={this.props.authObj.mobile}
                                        disabled={true}
                                        // onBlur={() => this.props.setAdharManual(this.state)}
                                        // ref={ref => (this.obj.pan = ref)}
                                        /*onChange={(e) => {
                                            if (e.target.value.length <= 10) this.setState({mobile: e.target.value})
                                        }}*/
                                    />
                                </div>) : <></>}
                        </div>
                        <div className={"col-md-6 col-sm-12"}>
                            {(this.state.adharDetail === Object(this.state.adharDetail)) ? (
                                <div className="form-group mb-3 ">
                                    <label htmlFor="textEmail" className={"bmd-label-floating"}>Email ID *</label>

                                    <input
                                        type="text"
                                        className="form-control font_weight"
                                        // placeholder="Email"
                                        style={{textTransform: "uppercase", fontWeight: 600}}
                                        pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
                                        title="Please enter Email"
                                        autoCapitalize="characters"
                                        id="textEmail"
                                        required={true}
                                        value={this.state.adharDetail.email}
                                        onBlur={() => this.props.setAdharManual(this.state.adharDetail)}
                                        // ref={ref => (this.obj.pan = ref)}
                                        onChange={(e) => this.setState({
                                            adharDetail: {
                                                ...this.state.adharDetail,
                                                email: e.target.value
                                            }
                                        })}
                                    />
                                </div>) : <></>}
                        </div>
                    </div>

                    <div className={"row"}>
                        {(this.state.adharDetail === Object(this.state.adharDetail)) ? (
                            <>
                                <div className={"col-md-6 col-sm-12"}>
                                    <div className="form-group mb-3 ">

                                        <label htmlFor="dobDate" className="bmd-label-floating">
                                            Date of Birth
                                        </label>
                                        <DatePicker
                                            className="form-control font_weight"
                                            // placeholderText={"Date of Birth"}
                                            selected={this.state.adharDetail.dob}
                                            id={"dobDate"}
                                            pattern={"^[0-9]{2}/[0-9]{2}/[0-9]{4}$"}
                                            scrollableYearDropdown
                                            showMonthDropdown
                                            showYearDropdown
                                            style={{margin: 'auto'}}
                                            dateFormat={'dd/MM/yyyy'}
                                            onChange={(date) => this.changeDob(date)}
                                        />
                                    </div>
                                </div>
                                <div className={"col-md-6 col-sm-12"}>

                                    <div className="form-group mb-3">
                                        <label htmlFor="numberPincode" className="bmd-label-floating">
                                            Pincode *
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control font_weight"
                                            // placeholder="Pincode"
                                            style={{textTransform: "uppercase", fontWeight: 600}}
                                            pattern="^[0-9]{6}$"
                                            title="Please enter Pincode"
                                            autoCapitalize="characters"
                                            id="numberPincode"
                                            required={true}
                                            value={this.state.adharDetail.pincode}
                                            onBlur={() => this.props.setAdharManual(this.state.adharDetail)}
                                            // ref={ref => (this.obj.pan = ref)}
                                            onChange={(e) => {
                                                if (e.target.value.length <= 6) this.setState({
                                                    adharDetail: {
                                                        ...this.state.adharDetail,
                                                        pincode: e.target.value
                                                    }
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                            </>) : <></>}
                    </div>

                    <div className={'row'}>
                        {(this.state.pan_adhar === Object(this.state.pan_adhar)) ?
                            (<>
                                <div className={"col-md-6 col-sm-12"}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="numberPAN" className={"bmd-label-floating"}>
                                            PAN Number *{" "}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control font_weight"
                                            // placeholder="10 digit PAN Number"
                                            autoComplete={"off"}
                                            name="url"
                                            maxLength={10}
                                            minLength={10}
                                            style={{textTransform: "uppercase", fontWeight: 600}}
                                            pattern="^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]{1}?$"
                                            title="Please enter valid PAN number. E.g. AAAAA9999A"
                                            autoCapitalize="characters"
                                            id="numberPAN"
                                            required={true}
                                            value={this.state.pan_adhar.pan}
                                            // ref={ref => (this.obj.pan = ref)}
                                            onBlur={() => {
                                                let {pan, adhar} = this.state.pan_adhar;
                                                this.props.pan_adhar(pan, adhar)
                                            }}
                                            onChange={e => this._PANEnter(e)}
                                        />
                                    </div>

                                </div>
                                < div className={"col-md-6 col-sm-12"}>
                                    < div
                                        className="form-group"
                                        style={{visibility: (this.props.pan && this.props.adhar) ? "visible" : "hidden"}}
                                    >
                                        <label htmlFor="numberAdhar" className={"bmd-label-floating"}>
                                            Aadhaar Number *
                                        </label>

                                        <input
                                            type="number"
                                            className="form-control font_weight"
                                            name="url"
                                            pattern="^[0-9]{12}$"
                                            title="This field is required"
                                            autoComplete={"off"}
                                            style={{fontWeight: 600}}
                                            id="numberAdhar"
                                            maxLength={12}
                                            minLength={12}
                                            value={this.state.pan_adhar.adhar}
                                            min={100000000000}
                                            max={999999999999}
                                            onBlur={() => {
                                                let {pan, adhar} = this.state.pan_adhar;
                                                this.props.pan_adhar(pan, adhar)
                                            }}
                                            onChange={e => this._AdharEnter(e)}
                                            // ref={ref => (this.obj.adhar = ref)}
                                            aria-describedby="adhar-area"
                                        />
                                        <br/>

                                    </div>
                                </div>
                            </>) : <></>
                        }
                    </div>
                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor="textAddress1" className="bmd-label-floating">
                                    Address 1
                                </label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Pincode"
                                    style={{textTransform: "uppercase", fontWeight: 600}}
                                    title="Please enter Address 1"
                                    autoCapitalize="characters"
                                    id="textAddress1"
                                    required={true}
                                    value={this.state.adharDetail.address1}
                                    onBlur={() => {
                                        this.props.setAdharManual(this.state.adharDetail);
                                        // this.handleValidation();
                                    }}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => {
                                        this.setState({
                                            ...this.state.adharDetail,
                                            adharDetail: {address1: e.target.value}
                                        });
                                        // this.validate.address1 = (e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor="textAddress2" className="bmd-label-floating">
                                    Address 2
                                </label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Pincode"
                                    style={{textTransform: "uppercase", fontWeight: 600}}
                                    title="Please enter Address 2"
                                    autoCapitalize="characters"
                                    id="textAddress2"
                                    required={true}
                                    value={this.state.adharDetail.address2}
                                    onBlur={() => {
                                        this.props.setAdharManual(this.state.adharDetail);
                                        // this.handleValidation();
                                    }}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => {
                                        this.setState({
                                            ...this.state.adharDetail,
                                            adharDetail: {address2: e.target.value}
                                        });
                                        // this.validate.address2 = (e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <br/>
                    <p className="paragraph_styling  text-center">
                        <b> Company Detail.</b>
                    </p>
                    <div className="form-group mb-3">
                        <label htmlFor="companyType" className={"bmd-label-floating"}>
                            Company Type *
                        </label>

                        <select
                            style={{textTransform: "uppercase", fontWeight: 600}}
                            title="Please select Company Type"
                            value={this.state.businessDetail.companytype}
                            required={true}
                            onChange={e => this.setState({
                                businessDetail: {
                                    ...this.state.businessDetail,
                                    companytype: e.target.value
                                }
                            })}
                            onBlur={() => {
                                this.props.setBusinessDetail(this.state.businessDetail)
                            }}
                            className="form-control font_weight"
                            id="companyType"
                        >
                            <option value={''}>Select Company Type</option>
                            {
                                Object.keys(BusinessType).map((key, index) =>
                                    (<option key={index} value={key}>{BusinessType[key]}</option>)
                                )
                            }
                        </select>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="numberGST" className={"bmd-label-floating"}>
                            GST Number *
                        </label>
                        <input
                            type="text"
                            className="form-control font_weight"
                            // placeholder="Mobile Number"
                            style={{textTransform: "uppercase", fontWeight: 600}}
                            pattern="^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$"
                            title="Please enter GST Number"
                            autoCapitalize="characters"
                            id="numberGST"
                            required={true}
                            value={this.state.businessDetail.gst}
                            onBlur={() => {
                                this.props.setBusinessDetail(this.state.businessDetail)
                            }}
                            // ref={ref => (this.obj.pan = ref)}
                            onChange={e => this.businessGst(e)}
                        />
                    </div>
                    {this.state.businessDetail.companytype !== "proprietorship" &&
                    this.state.businessDetail.companytype !== "" ? (
                        <div className="form-group mb-3 ">
                            <label htmlFor="numberPAN" className={"bmd-label-floating"}>
                                Business PAN *
                            </label>
                            <input
                                type="text"
                                className="form-control font_weight"
                                // placeholder="Email"
                                style={{textTransform: "uppercase", fontWeight: 600}}
                                pattern="^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]{1}?$"
                                title="Please enter Business PAN"
                                autoCapitalize="characters"
                                id="numberPAN"
                                required={true}
                                value={this.state.businessDetail.bpan}
                                readOnly={true}
                                disabled={true}
                                // ref={ref => (this.obj.pan = ref)}
                                onChange={e => this._PANEnter(e, 'business')}
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-12"}>
                            <div className="form-group mb-3">
                                <label
                                    htmlFor="avgTrans"
                                    className="bmd-label-floating"
                                    style={{marginLeft: "2rem"}}
                                >
                                    Average Monthly Transactions *
                                </label>
                                <div className={"input-group"}>
                                    <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon3">
                    ₹
                  </span>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-control font_weight"
                                        // placeholder="Pincode"
                                        style={{
                                            textTransform: "uppercase",
                                            fontWeight: 600,
                                            marginLeft: "1rem"
                                        }}
                                        pattern="^[0-9]{10}$"
                                        title="Enter Average monthly Transactions"
                                        autoCapitalize="characters"
                                        id="avgTrans"
                                        required={true}
                                        value={this.state.businessDetail.avgtrans}
                                        onBlur={() => {
                                            this.props.setBusinessDetail(this.state.businessDetail)
                                        }}
                                        // ref={ref => (this.obj.pan = ref)}
                                        onChange={e => {
                                            if (e.target.value.length <= 10)
                                                this.setState({
                                                    businessDetail: {
                                                        ...this.state.businessDetail,
                                                        avgtrans: e.target.value
                                                    }
                                                });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor="loanAmount" className="bmd-label-floating">
                                    Loan Amount *
                                </label>
                                <div className={"input-group"}>
                                    <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon3">
                    ₹
                  </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control font_weight"
                                        style={{
                                            textTransform: "uppercase",
                                            fontWeight: 600,
                                            paddingLeft: '5px',
                                            marginLeft: '1rem'
                                        }}
                                        pattern="^[0-9]+$"
                                        title="Loan Amount"
                                        autoCapitalize="characters"
                                        id="loanAmount"
                                        required={true}
                                        disabled={true}
                                        value={this.props.payload.loan_amount}
                                        // onBlur={() => this.props.setBusinessDetail(this.state.businessDetail)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="dealerCode" className="bmd-label-floating">
                            Dealer Code *
                        </label>
                        <input
                            type="text"
                            className="form-control font_weight"
                            style={{textTransform: "uppercase", fontWeight: 600}}
                            pattern="^[0-9A-Za-z]+$"
                            title="Enter Dealer Code"
                            autoCapitalize="characters"
                            id="dealerCode"
                            required={true}
                            value={this.state.businessDetail.dealercode}
                            onBlur={() => this.props.setBusinessDetail(this.state.businessDetail)}
                            // ref={ref => (this.obj.pan = ref)}
                            onChange={e => {
                                if (e.target.value.length <= 8)
                                    this.setState({
                                        businessDetail: {
                                            ...this.state.businessDetail,
                                            dealercode: e.target.value
                                        }
                                    });
                            }}
                        />
                    </div>
                    <div className="mt-5 mb-5 text-center ">
                        <button
                            type="submit"
                            onClick={e => this._formSubmit(e)}
                            className="form-submit btn btn-raised greenButton"
                        >Proceed
                        </button>
                    </div>
                </form>
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
    authObj: state.authPayload.authObj,
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
