import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl, baseUrl2, otpUrl, OTP_Timer, landingPayload} from "../../../shared/constants";
import {connect} from "react-redux";
import {
    setAuth,
    sendOTP,
    changeLoader,
    setAdharManual,
    setBusinessDetail,
    setBankDetail,
    pan_adhar,
} from "../../../actions/index";
import {Link, withRouter} from "react-router-dom";
import {alertModule} from "../../../shared/commonLogic";

const Timer = OTP_Timer;
const {PUBLIC_URL} = process.env;

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

    /*
        // To Redirect the Page to the concerned Pages
        _existingSection() {

            let {
                payload, changeLoader, history, setAdharManual,
                setBusinessDetail,
                setBankDetail,
                pan_adhar,
            } = this.props;
            // ToDo : uncomment in prod;
            payload = landingPayload;

            changeLoader(true);
            fetch(`${baseUrl2}/agents/${payload.anchor_id}/loan_applications`).then((resp) => {
                changeLoader(false);

                if (resp.response === Object(resp.response)) {
                    //ToDo : Adding responses into States
                    // setAdharManual,
                    // setBusinessDetail,
                    // setBankDetail,
                    // pan_adhar,
                    setTimeout(() => history.push(`${PUBLIC_URL}/preapprove/personaldetail`));
                    // / Goes to New Page
                }

            }, () => {
                alertModule();
                changeLoader(false);
            })

        }*/

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
                    "app_id": 3,
                    "otp_type": "one_time_password",
                    "mobile_number": this.state.mobile,
                    "timestamp": new Date()
                })
            }).then(resp => resp.json()).then(resp => {
                // console.log(JSON.stringify(resp));
                changeLoader(false);
                if (resp.error === Object(resp.error)) {
                    alertModule(resp.error.message, 'warn');
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
                alertModule();
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
                "app_id": 3,
                "otp_reference_number": authObj.otp_reference_id,
                "mobile_number": authObj.mobile,
                "otp": this.state.otp,
                "timestamp": new Date()
            })
        }).then(resp => resp.json()).then(resp => {
            changeLoader(false);
            this.setState({otp_sent: false});
            if (resp.error === Object(resp.error))
                alertModule(resp.error.message, 'warn');
            else if (resp.response === Object(resp.response)) {
                this.setState({verified: resp.response.is_otp_verified}, () => setAuth(this.state));

                if (resp.response.is_otp_verified)
                    setTimeout(() => history.push(`${PUBLIC_URL}/preapprove/dashboard`), 500);

            }
        }, resp => {
            alertModule();
            changeLoader(false);
        })
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
                                            fontWeight: 600, marginRight: '5px',
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
    authObj: state.authPayload.authObj,
    token: state.authPayload.token
});

export default withRouter(connect(
    mapStateToProps,
    {
        setAuth, sendOTP, changeLoader, setAdharManual,
        setBusinessDetail,
        setBankDetail,
        pan_adhar
    }
)(Auth));
