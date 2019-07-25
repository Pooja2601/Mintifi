import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl, otpUrl, OTP_Timer, app_id} from "../../shared/constants";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {
    DrawsetAuth,
    DrawsetToken,
    changeLoader,
    DrawAnchorPayload, showAlert
} from "../../actions";
// import {alertModule} from "../../shared/commonLogic";

const Timer = OTP_Timer;
const {PUBLIC_URL} = process.env;

class MobileOtp extends Component {
    state = {
        submitted: false,
        loading: false,
        showMsg: {},
        timer: Timer,
        mobile: "",
        otp: "",
        otp_reference_code: "",
        verified: false,
        mobile_correct: false
    };

    _formSubmit(e) {
        e.preventDefault();
        clearInterval(this.interval);
        const {changeLoader, token, DrawsetAuth, showAlert} = this.props;
        changeLoader(true);

        this.setState({loading: true, submitted: true, timer: Timer});

        fetch(`${otpUrl}/send_otp`, {
            method: "POST",
            headers: {"Content-Type": "application/json", token: token},
            body: JSON.stringify({
                app_id: app_id,
                otp_type: "drawdown",
                mobile_number: this.state.mobile,
                timestamp: new Date()
            })
        })
            .then(resp => resp.json())
            .then(
                resp => {
                    // console.log(JSON.stringify(resp));
                    changeLoader(false);
                    if (resp.error === Object(resp.error)) {
                        showAlert(resp.error.message, "warn");
                        this.setState({loading: false, submitted: false});
                    } else if (
                        resp.response === Object(resp.response) &&
                        resp.response.status === "success"
                    ) {
                        // alertModule(resp.success.message,'warn');
                        this.setState(
                            {otp_reference_code: resp.response.otp_reference_code},
                            () => DrawsetAuth(this.state)
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
                },
                resp => {
                    showAlert('net');
                    changeLoader(false);
                }
            );
        // this.props.sendOTP(this.state.mobile);
    }

    _verifyOTP(e) {
        e.preventDefault();
        const {changeLoader, authObj, token, DrawsetAuth, showAlert} = this.props;
        changeLoader(true);
        fetch(`${otpUrl}/verify_otp`, {
            method: "POST",
            headers: {"Content-Type": "application/json", token: token},
            body: JSON.stringify({
                app_id: app_id,
                otp_reference_number: authObj.otp_reference_code,
                mobile_number: authObj.mobile,
                otp: this.state.otp,
                timestamp: new Date()
            })
        })
            .then(resp => resp.json())
            .then(
                resp => {
                    changeLoader(false);
                    if (resp.error === Object(resp.error))
                        showAlert(resp.error.message, "warn");
                    else if (resp.response === Object(resp.response)) {
                        this.setState({verified: resp.response.is_otp_verified}, () => {
                            DrawsetAuth(this.state);
                        });
                        // Goes to New Page
                        if (resp.response.is_otp_verified)
                            setTimeout(() => {
                                this._fetchAnchorInfo();
                            }, 500);
                    }
                },
                resp => {
                    showAlert('net');
                    changeLoader(false);
                }
            );
    }

    _fetchAnchorInfo = () => {
        const {
            changeLoader,
            authObj,
            token,
            payload,
            DrawAnchorPayload, showAlert
        } = this.props;
        changeLoader(true);
        fetch(`${baseUrl}/loans/${payload.company_id}/details`, {
            method: "GET",
            headers: {"Content-Type": "application/json", token: token},
            body: JSON.stringify({
                app_id: app_id,
                anchor_id: payload.anchor_id,
                mobile_number: authObj.mobile
            })
        })
            .then(resp => resp.json())
            .then(
                resp => {
                    changeLoader(false);
                    if (resp.error === Object(resp.error))
                        showAlert(resp.error.message, "error");
                    if (resp.response === Object(resp.response)) {
                        DrawAnchorPayload(resp.response);
                        setTimeout(() =>
                            this.props.history.push(`${PUBLIC_URL}/drawdown/offers`)
                        );
                    }
                },
                resp => {
                    showAlert('net');
                    changeLoader(false);
                }
            );
    };

    //authObj
    _setMobile = e => {
        const {value} = e.target;
        const {DrawsetAuth} = this.props;

        if (value.length <= 10) {
            // console.log(value.length);
            this.setState(
                {mobile: value, mobile_correct: value.length !== 10},
                () => DrawsetAuth(this.state)
            );
        }
    };

    componentWillMount() {
        /*const {changeLoader, match, DrawsetToken} = this.props;
            changeLoader(false);
            const {token, payload} = match.params;
            if (token === undefined && payload === Object(payload))
                alertModule("You cannot access this page directly without Authorised session!! ", 'error');
            else DrawsetToken(token, payload);*/
    }

    componentDidMount() {
        const {authObj, DrawsetAuth} = this.props;
        if (authObj === Object(authObj))
            if (authObj.mobile)
                this.setState({
                    mobile: authObj.mobile,
                    mobile_correct: authObj.mobile.length !== 10
                });
            else DrawsetAuth(this.state);
    }

    render() {
        // const {payload, match} = this.props;
        return (
            <>
                {/*<Link to={`${PUBLIC_URL}/PersonalDetails`} className={"btn btn-link"}>Go Back </Link>*/}
                <h4 className={"text-center"}>Pay with Mintifi</h4>
                <p className="paragraph_styling text-center">
                    {/*<br/>*/}
                    Please verify your mobile number.
                </p>
                <form id="serverless-contact-form">
                    <div className={"row"}>
                        <div className={"col-md-8"} style={{margin: "auto"}}>
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
                                        onChange={e => this._setMobile(e)}
                                        aria-describedby="basic-addon3"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={"col-md-8"} style={{margin: "auto"}}>
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
                                        type="number"
                                        className="form-control font_weight"
                                        // placeholder="Enter the OTP"
                                        name="url"
                                        pattern="^[0-9]{6}$"
                                        title="This field is required"
                                        id="otpVerify"
                                        style={{
                                            marginRight: "5px"
                                        }}
                                        value={this.state.otp}
                                        min={100000}
                                        max={999999}
                                        onChange={e => {
                                            if (e.target.value.length <= 6)
                                                this.setState({otp: e.target.value});
                                        }}
                                        aria-describedby="otp-area"
                                    />
                                    {/* <div className="input-group-append">
                                        <label style={{
                                            fontSize: 'small',
                                            paddingTop: '14px',
                                            color: '#bbb'
                                        }}>Next OTP in {(this.state.timer) && ` ${this.state.timer} Sec`}</label>
                                    </div>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"text-center"}>
                        <label
                            style={{
                                fontSize: "small",
                                paddingTop: "14px",
                                color: "#bbb",
                                visibility: this.state.submitted ? "visible" : "hidden"
                            }}
                        >
                            You can resend OTP after{" "}
                            {this.state.timer && ` ${this.state.timer} Sec`}
                        </label>
                    </div>

                    <div className="mt-3 mb-2 text-center ">
                        <button
                            type="submit"
                            name="submit"
                            style={{
                                visibility:
                                    !this.state.mobile_correct && !this.state.loading
                                        ? "visible"
                                        : "hidden"
                            }}
                            // value={"Send OTP"}
                            onClick={e => this._formSubmit(e)}
                            className="form-submit btn btn-raised greenButton"
                        >
                            Send OTP
                        </button>
                        <br/>

                        <button
                            style={{
                                visibility:
                                    this.state.loading && this.state.otp.length === 6
                                        ? "visible"
                                        : "hidden"
                            }}
                            onClick={e => this._verifyOTP(e)}
                            className="btn btn-raised greenButton text-center"
                        >
                            Verify OTP
                        </button>
                    </div>
                </form>
            </>
        );
    }
}

const mapStateToProps = state => ({
    token: state.drawdownReducer.token,
    payload: state.drawdownReducer.payload,
    authObj: state.drawdownReducer.authObj
});

export default withRouter(
    connect(
        mapStateToProps,
        {DrawsetAuth, DrawsetToken, changeLoader, DrawAnchorPayload, showAlert}
    )(MobileOtp)
);
