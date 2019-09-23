import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {otpUrl, OTP_Timer, app_id} from "../../../shared/constants";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {
    setAuth,
    sendOTP,
    changeLoader,
    setAdharManual,
    showAlert
} from "../../../actions";
import {Link, withRouter} from "react-router-dom";
import {fetchAPI, apiActions, postAPI} from "../../../api";
import {
    checkObject,
    fieldValidationHandler,
    regexTrim
} from "../../../shared/common_logic";
import {validationMobileOtp} from "../../../shared/validations";

const Timer = OTP_Timer;
const {PUBLIC_URL} = process.env;

class MobileOtp extends Component {
    static propTypes = {
        authObj: PropTypes.object,
        anchorObj: PropTypes.object,
        adharObj: PropTypes.object.isRequired,
        payload: PropTypes.object.isRequired,
        gstProfile: PropTypes.object
    };

    state = {
        submitted: false,
        loading: false,
        showMsg: {},
        timer: Timer,
        mobile: "",
        otp: "",
        otp_reference_id: "",
        verified: false,
        verified_number: "",
        mobile_correct: false
    };

    tempState = this.state;

    // obj = {mobile_correct: false};

    _formSubmit = async e => {
        e.preventDefault();
        clearInterval(this.interval);
        const {changeLoader, token, setAdharManual, showAlert} = this.props;

        this.setState({loading: true, submitted: true, timer: Timer});

        const options = {
            token: token,
            URL: `${otpUrl}/send_otp`,
            data: {
                app_id: app_id,
                otp_type: "one_time_password",
                mobile_number: this.state.mobile,
                timestamp: new Date()
            },
            showAlert: showAlert,
            changeLoader: changeLoader
        };

        const resp = await postAPI(options);

        if (resp.status === apiActions.ERROR_RESPONSE) {
            showAlert(resp.data.message, "warn");
            this.setState({loading: false, submitted: false});
        } else if (resp.status === apiActions.SUCCESS_RESPONSE) {
            this.setState({otp_reference_id: resp.data.otp_reference_code}, () =>
                setAdharManual(this.state)
            );
            this.interval = setInterval(e => {
                this.setState({timer: this.state.timer - 1}, () => {
                    if (this.state.timer === 0) {
                        this.setState({
                            loading: false,
                            submitted: false,
                            timer: Timer
                        });
                        clearInterval(this.interval);
                    }
                });
            }, 1000);
        }
    };

    _verifyOTP = async e => {
        const {
            adharObj,
            token,
            changeLoader,
            setAdharManual,
            history,
            showAlert
        } = this.props;
        e.preventDefault();

        const options = {
            token: token,
            URL: `${otpUrl}/verify_otp`,
            data: {
                app_id: app_id,
                otp_reference_number: adharObj.otp_reference_id,
                mobile_number: adharObj.mobile,
                otp: this.state.otp,
                timestamp: new Date()
            },
            showAlert: showAlert,
            changeLoader: changeLoader
        };

        const resp = await postAPI(options);

        if (resp.status === apiActions.ERROR_RESPONSE)
            showAlert(resp.data.message, "warn");
        else if (resp.status === apiActions.SUCCESS_RESPONSE) {
            this.setState(
                {
                    verified: resp.data.is_otp_verified,
                    verified_number: adharObj.mobile
                },
                () => {
                    setAdharManual(this.state);
                }
            );
            if (resp.data.is_otp_verified)
            //&& this.state.verified_number === adharObj.mobile
                setTimeout(() => {
                    history.push(`${PUBLIC_URL}/preapprove/businessdetail`);
                }, 500);
        }
    };

    // ToDo : should be independent of a field
    validationHandler = () => {
        const {showAlert} = this.props;

        const lomo = fieldValidationHandler({
            showAlert: showAlert,
            validations: validationMobileOtp,
            localState: this.state
        });

        this.setState({missed_fields: lomo}); // true : for disabling
    };

    onChangeHandler = (field, value) => {
        let that = this,
            regex,
            doby;
        const {setAdharManual} = this.props;
        // fields is Equivalent to F_NAME , L_NAME... thats an object

        // ToDo : comment those that are not required
        const {MOBILE_NUMBER, VERIFY_OTP} = validationMobileOtp;

        this.tempState = Object.assign({}, this.state);
        switch (field) {
            case MOBILE_NUMBER:
                if (value.length <= 10) {
                    this.tempState["mobile"] = value;
                    this.tempState["mobile_correct"] = value.length !== 10;
                }
                break;
            case VERIFY_OTP:
                if (value.length <= 6) {
                    this.tempState["otp"] = value;
                }
                break;
            default:
                this.tempState[field.slug] = value;
                break;
        }

        this.setState({...this.state, ...this.tempState});

        window.setTimeout(() => {
            setAdharManual(that.state);
            this.validationHandler();
        }, 10);
    };

    componentWillMount() {
        const {adharObj, payload, history, authObj, changeLoader, showAlert} = this.props;
        changeLoader(false);
        showAlert();
        if (checkObject(payload)) {
            if (!checkObject(adharObj)) {
                history.push(`${PUBLIC_URL}/preapprove/personaldetail`);
            } else if (adharObj.verified)
                history.push(`${PUBLIC_URL}/preapprove/businessdetail`);
            // window.location.href = `${PUBLIC_URL}/preapprove/businessdetail`;
            if (checkObject(authObj))
                if (authObj.verified)
                    history.push(`${PUBLIC_URL}/preapprove/businessdetail`);
            //   window.location.href = `${PUBLIC_URL}/preapprove/businessdetail`;
        } else history.push(`${PUBLIC_URL}/preapprove/token`);
    }

    componentDidMount() {
        const {adharObj} = this.props;

        let state = this.state,
            that = this;

        if (checkObject(adharObj)) this.setState({mobile: adharObj.mobile});

        Object.assign(state, adharObj);
        setTimeout(() => {
            if (checkObject(state) && state) that.setState(state);
            this.validationHandler();
        }, 500);

        // else setAdharManual(this.state);
    }

    render() {
        const {MOBILE_NUMBER, VERIFY_OTP} = validationMobileOtp;
        return (
            <>
                <Link
                    to={`${PUBLIC_URL}/preapprove/personaldetail`}
                    className={"btn btn-link"}
                >
                    Go Back{" "}
                </Link>

                <h5 className="paragraph_styling text-center">
                    Please verify your mobile number
                </h5>
                <div id="serverless-contact-form">
                    <div className={"row"}>
                        <div className={"col-sm-11 col-md-8 m-auto"}>
                            <div className="form-group mb-3">
                                <label htmlFor="numberMobile" className={"bmd-label-floating"}>
                                    Mobile Number *
                                </label>
                                <div className={"input-group"}>
                                    <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon3">
                      +91
                    </span>
                                    </div>
                                    <input
                                        type={MOBILE_NUMBER.type}
                                        className="form-control font_weight prependInput"
                                        // placeholder="10 digit Mobile Number"
                                        name="url"
                                        disabled={this.state.submitted}
                                        min={MOBILE_NUMBER.min}
                                        max={MOBILE_NUMBER.max}
                                        maxLength={MOBILE_NUMBER.maxLength}
                                        minLength={MOBILE_NUMBER.minLength}
                                        pattern={regexTrim(MOBILE_NUMBER.pattern)}
                                        title={MOBILE_NUMBER.title}
                                        id={MOBILE_NUMBER.id}
                                        required={MOBILE_NUMBER.required}
                                        // readOnly={MOBILE_NUMBER.readOnly}
                                        value={this.state.mobile}
                                        // ref={ref => (this.obj.number = ref)}
                                        onChange={e =>
                                            this.onChangeHandler(MOBILE_NUMBER, e.target.value)
                                        }
                                        aria-describedby="basic-addon3"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={"col-sm-11 col-md-8 m-auto"}>
                            <div
                                className="form-group mb-3"
                                style={{
                                    visibility: this.state.submitted ? "visible" : "hidden"
                                }}
                            >
                                <label htmlFor="otpVerify" className={"bmd-label-floating"}>
                                    OTP *
                                </label>
                                <div className={"input-group"}>
                                    <input
                                        type={VERIFY_OTP.type}
                                        className="form-control font_weight mr-1"
                                        // placeholder="Enter the OTP"
                                        name="url"
                                        pattern={regexTrim(VERIFY_OTP.pattern)}
                                        title={VERIFY_OTP.title}
                                        id={VERIFY_OTP.id}
                                        value={this.state.otp}
                                        min={VERIFY_OTP.min}
                                        max={VERIFY_OTP.max}
                                        maxLength={VERIFY_OTP.maxLength}
                                        minLength={VERIFY_OTP.minLength}
                                        onChange={e =>
                                            this.onChangeHandler(VERIFY_OTP, e.target.value)
                                        }
                                        // onChange={e => {
                                        //   if (e.target.value.length <= 6)
                                        //     this.setState({ otp: e.target.value });
                                        // }}
                                        aria-describedby="otp-area"
                                        required={VERIFY_OTP.required}
                                    />

                                    <div className="input-group-append">
                                        {/* <label style={{
                                            fontSize: 'small',
                                            paddingTop: '14px',
                                            color: '#bbb'
                                        }}>Next OTP in {(this.state.timer) && ` ${this.state.timer} Sec`}</label>*/}
                                        {/*<button className="btn btn-outline-secondary" disabled={this.state.timer}
                                        type="button"
                                        id="otp-area">Resending
                                    in {(this.state.timer) && ` ${this.state.timer} Sec`}
                                </button>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={"text-center"}>
                        <label
                            className="resendOTPLabel"
                            style={{
                                display: this.state.submitted ? "block" : "none"
                            }}
                        >
                            You can resend OTP after{" "}
                            {this.state.timer && ` ${this.state.timer} Sec`}
                        </label>
                    </div>

                    <div className="mt-2 text-center ">
                        <button
                            name="submit"
                            style={{
                                visibility:
                                    !this.state.mobile_correct && !this.state.loading
                                        ? "visible"
                                        : "hidden"
                            }}
                            // value={"Send OTP"}
                            onClick={e => this._formSubmit(e)}
                            className="form-submit btn btn-raised greenButton m-auto d-block"
                        >
                            Send OTP
                        </button>

                        <button
                            style={{
                                visibility:
                                    this.state.loading && this.state.otp.length === 6
                                        ? "visible"
                                        : "hidden"
                            }}
                            onClick={e => this._verifyOTP(e)}
                            className="btn btn-raised greenButton text-center m-auto d-block"
                        >
                            Verify OTP
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    token: state.authPayload.token,
    adharObj: state.adharDetail.adharObj,
    payload: state.authPayload.payload,
    authObj: state.authPayload.authObj
});

export default withRouter(
    connect(
        mapStateToProps,
        {setAuth, sendOTP, changeLoader, setAdharManual, showAlert}
    )(MobileOtp)
);
