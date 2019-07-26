import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl, otpUrl, OTP_Timer, app_id} from "../../../shared/constants";
import {connect} from "react-redux";
import {
    setAuth,
    sendOTP,
    changeLoader,
    setAdharManual,
    setBusinessDetail, setExistSummary,
    setBankDetail,
    pan_adhar, showAlert
} from "../../../actions/index";
import {Link, withRouter} from "react-router-dom";
// import {alertModule} from "../../../shared/commonLogic";

const Timer = OTP_Timer;
const {PUBLIC_URL} = process.env;

let personalDetails = {
    f_name: '',
    m_name: '',
    l_name: '',
    mobile: '',
    email: '',
    dob: new Date(),
    gender: 'm',
    ownership: 'rented',
    pincode: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
};

class Auth extends Component {
    state = {
        submitted: false,
        loading: false,
        showMsg: {},
        timer: Timer,
        mobile: '',
        otp: '',
        otp_reference_id: '',
        otp_sent: false,
        verified: false,
        mobile_correct: false
    };


    _formSubmit(e) {
        e.preventDefault();
        clearInterval(this.interval);

        const {changeLoader, token, setAuth} = this.props;
        changeLoader(true);
        this.setState({loading: true, submitted: true, timer: Timer});
        if (!this.state.otp_sent)
            fetch(`${otpUrl}/send_otp`, {
                method: "POST",
                headers: {'Content-Type': 'application/json', token: token},
                body: JSON.stringify({
                    "app_id": app_id,
                    "otp_type": "one_time_password",
                    "mobile_number": this.state.mobile,
                    "timestamp": new Date()
                })
            }).then(resp => resp.json()).then(resp => {
                // console.log(JSON.stringify(resp));
                changeLoader(false);
                if (resp.error === Object(resp.error)) {
                    showAlert(resp.error.message, 'warn');
                    this.setState({loading: false, submitted: false, otp_sent: false});
                }
                else if (resp.response === Object(resp.response)) {
                    // alert(resp.success.message);
                    this.setState({otp_reference_id: resp.response.otp_reference_code}, () => setAuth(this.state));
                    this.interval = setInterval(e => {
                        this.setState({timer: this.state.timer - 1}, () => {
                            if (this.state.timer === 0) {
                                this.setState({loading: false, submitted: false, timer: Timer, otp_sent: true});
                                clearInterval(this.interval);
                            }
                        });
                    }, 1000);
                }
            }, resp => {
                showAlert('net');
                changeLoader(false);
            });
        // this.props.sendOTP(this.state.mobile);
    }

    _verifyOTP(e) {
        e.preventDefault();
        const {changeLoader, token, authObj, setAuth, history} = this.props;
        changeLoader(true);
        fetch(otpUrl + '/verify_otp ', {
            method: "POST",
            headers: {'Content-Type': 'application/json', token: token},
            body: JSON.stringify({
                "app_id": app_id,
                "otp_reference_number": authObj.otp_reference_id,
                "mobile_number": authObj.mobile,
                "otp": this.state.otp,
                "timestamp": new Date()
            })
        }).then(resp => resp.json()).then(resp => {
            changeLoader(false);
            this.setState({otp_sent: false});
            if (resp.error === Object(resp.error))
                showAlert(resp.error.message, 'warn');
            else if (resp.response === Object(resp.response)) {
                this.setState({verified: resp.response.is_otp_verified}, () => setAuth(this.state));

                if (resp.response.is_otp_verified)
                    this.checkSummary();

            }
        }, resp => {
            showAlert('net');
            changeLoader(false);
        })
    }

    _fetchUserInfo() {
        const {changeLoader, history, authObj, token, adharObj, businessObj, setAdharManual, setBusinessDetail} = this.props;
        changeLoader(true);
        fetch(`${baseUrl}/users/user_summary?user_number=${authObj.mobile}&app_id=${app_id}`, {
            headers: {'Content-Type': 'application/json', token: token},
        }).then(resp => resp.json()).then(resp => {
            changeLoader(false);
            // console.log(resp.response);
            if (resp.error === Object(resp.error))
                showAlert(resp.error.message, 'warn');

            if (resp.response === Object(resp.response)) {
                let {borrowers, business_details} = resp.response;

                if (borrowers === Object(borrowers)) {
                    const {residence_address} = borrowers;
                    pan_adhar(borrowers.pan, borrowers.aadhar);
                    Object.assign(personalDetails, borrowers);
                    let nameFull = borrowers.name.split(' ');
                    personalDetails.f_name = nameFull[0];
                    personalDetails.l_name = nameFull[1];
                    personalDetails.mobile = borrowers.mobile_number;

                    if (residence_address === Object(residence_address)) {
                        Object.assign(personalDetails, residence_address);
                        personalDetails.ownership = residence_address.ownership_type;
                        personalDetails.address1 = residence_address.address_line_1;
                        personalDetails.address2 = residence_address.address_line_2;
                    }

                    setAdharManual(personalDetails);
                    // console.log(personalDetails);
                    // console.log(adharObj);
                }


                if (business_details === Object(business_details) && business_details[0].pan) {
                    let businessDetails = {
                        lgnm: business_details[0].business_name,
                        companytype: business_details[0].business_type,
                        gst: business_details[0].business_gst,
                        bpan: business_details[0].business_pan,
                        avgtrans: '',
                        dealercode: '',
                    };
                    setBusinessDetail(businessDetails);
                    // console.log(businessObj);
                }

            }
            setTimeout(() => history.push(`${PUBLIC_URL}/preapprove/personaldetail`), 1500);

        }, () => {
            showAlert('net');
            changeLoader(false);
        });

    }

    checkSummary = () => {
        const {payload, authObj, token, changeLoader, history, setExistSummary, showAlert} = this.props;
        changeLoader(true);
        fetch(`${baseUrl}/loans/loan_summary?user_number=${authObj.mobile}&anchor_transaction_id=${payload.anchor_transaction_id}&app_id=${app_id}`, {
            method: 'GET',
            headers: {token: token, "Content-Type": 'application/json'}
        }).then(resp => resp.json()).then(resp => {

            if (resp.error === Object(resp.error))
                showAlert(resp.error.message, 'warn');

            if (resp.response === Object(resp.response)) {
                const {response} = resp;
                setExistSummary(response);
                if (response.loan_status === 'new_user') {
                    showAlert('User doesn`t exist, redirecting you to the New User Portal...', 'info');
                    setTimeout(() => history.push(`${PUBLIC_URL}/preapprove/adharpan`), 3000);
                }
                else if (response.loan_status === 'user_exist') {
                    showAlert(`Welcome Back ${response.user_name} , Let's create your Loan Application. Redirecting you in a while...`, 'success');
                    // ToDo : fetch User personal and business details
                    this._fetchUserInfo();
                    // ToDo : set inside the Redux Object for adhar and business
                }
                else {
                    showAlert(`Welcome Back ${response.user_name}, redirecting you to the dashboard...`, 'success');
                    setTimeout(() => history.push(`${PUBLIC_URL}/exist/dashboard`), 500);
                }
            }

            changeLoader(false);
        }, () => {
            showAlert('net');
            changeLoader(false);
        });

    }

//authObj
    _setMobile = (e) => {
        const {value} = e.target;
        if (value.length <= 10) {
            this.setState({mobile: value, mobile_correct: (value.length !== 10)}, () => this.props.setAuth(this.state));
        }
    };

    componentDidMount() {

        const {authObj, changeLoader, setAuth} = this.props;
        changeLoader(false);
        if (authObj === Object(authObj))
            this.setState({mobile: authObj.mobile, verified: authObj.verified});
        else setAuth(this.state);
// ToDo : To make a customised central error system
        // showAlert('this is message', 'warn');
    }

    render() {
        return (
            <>
                <Link to={`${PUBLIC_URL}/preapprove/token`} className={"btn btn-link"}>Go Back </Link>
                <h4 className={"text-center"}>
                    Welcome Back
                </h4>
                <h5 className="paragraph_styling text-center">
                    Please login with your registered mobile number !
                </h5>
                <br/>
                <form
                    id="serverless-contact-form"
                >
                    <div className={"row"}>
                        <div className={"col-sm-11 col-md-8"} style={{margin: 'auto'}}>
                            <div className="form-group mb-3">
                                <label htmlFor="numberMobile" className={"bmd-label-floating"}>Mobile
                                    Number *</label>
                                <div className={"input-group"}>

                                    <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon3">
                    +91
                  </span>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-control font_weight prependInput"
                                        // placeholder="10 digit Mobile Number"
                                        name="url"
                                        disabled={this.state.submitted}
                                        min={1000000000}
                                        max={9999999999}
                                        maxLength={10}
                                        minLength={10}
                                        pattern="^[0-9]{10}$"
                                        title="This field is required"
                                        id="numberMobile"
                                        required={true}
                                        value={this.state.mobile}
                                        // ref={ref => (this.obj.number = ref)}
                                        onChange={(e) => this._setMobile(e)}
                                        aria-describedby="basic-addon3"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={"col-sm-11 col-md-8"} style={{margin: 'auto'}}>
                            <div className="form-group mb-3"
                                 style={{visibility: (this.state.submitted) ? 'visible' : 'hidden'}}>
                                <label htmlFor="otpVerify" className={"bmd-label-floating"}>OTP *</label>
                                <div className={"input-group"}>
                                    <input
                                        type="number"
                                        className="form-control font_weight"
                                        // placeholder="Enter the OTP"
                                        name="url"
                                        pattern="^[0-9]{6}$"
                                        title="This field is required"
                                        id="otpVerify"
                                        style={{
                                            marginRight: '5px',
                                            fontSize: '17px'
                                        }}
                                        value={this.state.otp}
                                        min={100000}
                                        max={999999}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 6) this.setState({otp: e.target.value})
                                        }}
                                        aria-describedby="otp-area"
                                    />
                                    <div className="input-group-append">
                                        {/*<button className="btn btn-outline-secondary" disabled={this.state.timer}
                                        type="button"
                                        id="otp-area">Resending
                                    in {(this.state.timer) && ` ${this.state.timer} Sec`}
                                </button>*/}
                                        {/*  <label style={{
                                            fontSize: 'small',
                                            paddingTop: '14px',
                                            color: '#bbb'
                                        }}>Next OTP in {(this.state.timer) && ` ${this.state.timer} Sec`}</label>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={"text-center"}>
                        <label style={{
                            fontSize: 'small',
                            paddingTop: '14px',
                            color: '#bbb',
                            visibility: (this.state.submitted) ? 'visible' : 'hidden'
                        }}>You can resend OTP after {(this.state.timer) && ` ${this.state.timer} Sec`}</label>
                    </div>

                    <div className="mt-3 text-center ">
                        <button
                            type="submit"
                            name="submit"
                            style={{visibility: (!this.state.mobile_correct && !this.state.loading) ? 'visible' : 'hidden'}}
                            // value={"Send OTP"}
                            onClick={e => this._formSubmit(e)}
                            className="form-submit btn btn-raised greenButton"
                        >Send OTP
                        </button>
                        <br/>
                        <button
                            style={{visibility: (this.state.loading && (this.state.otp.length === 6)) ? 'visible' : 'hidden'}}
                            onClick={e => this._verifyOTP(e)}
                            className="btn btn-raised greenButton text-center">
                            Verify OTP
                        </button>
                        {/*<br/>
                                    <button className="btn greenButton" disabled>
                                        <span className="spinner-border spinner-border-sm"/>
                                        Resend OTP.. {this.state.timer} Sec
                                    </button>*/}

                    </div>
                </form>
            </>
        );
    }
}


const mapStateToProps = state => ({
    payload: state.authPayload.payload,
    authObj: state.authPayload.authObj,
    token: state.authPayload.token,
    adharObj: state.adharDetail.adharObj,
    businessObj: state.businessDetail.businessObj
});

export default withRouter(connect(
    mapStateToProps,
    {
        setAuth, sendOTP, changeLoader, setAdharManual,
        setBusinessDetail,
        setBankDetail,
        pan_adhar, setExistSummary, showAlert
    }
)(Auth));
