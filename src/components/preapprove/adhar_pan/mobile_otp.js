import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl, otpUrl, OTP_Timer} from "../../../shared/constants";
import {connect} from "react-redux";
import {setAuth, sendOTP, changeLoader, setAdharManual} from "../../../actions/index";
import {Link, withRouter} from "react-router-dom";
import {alertModule} from "../../../shared/commonLogic";

const Timer = OTP_Timer;
const {PUBLIC_URL} = process.env;

class MobileOtp extends Component {
    state = {
        submitted: false,
        loading: false,
        showMsg: {},
        timer: Timer,
        mobile: '',
        otp: '',
        otp_reference_id: '',
        verified: false,
        mobile_correct: false
    };

    // obj = {mobile_correct: false};

    _formSubmit(e) {

        e.preventDefault();
        clearInterval(this.interval);
        const {changeLoader, token, setAdharManual} = this.props;
        changeLoader(true);


        this.setState({loading: true, submitted: true, timer: Timer});

        fetch(`${otpUrl}/send_otp`, {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'token': token},
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
                this.setState({loading: false, submitted: false});
            }
            //     this.showSnackbary.click();
            // showSnackbar(resp.error.message);

            else if (resp.response === Object(resp.response) && resp.response.status === 'success') {
                // alertModule(resp.success.message,'success');
                this.setState({otp_reference_id: resp.response.otp_reference_code}, () => setAdharManual(this.state));
                this.interval = setInterval(e => {
                    this.setState({timer: this.state.timer - 1}, () => {
                        if (this.state.timer === 0) {
                            this.setState({loading: false, submitted: false, timer: Timer});
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
        const {adharObj, payload, token, changeLoader, setAdharManual, history} = this.props;
        e.preventDefault();
        changeLoader(true);
        fetch(`${otpUrl}/verify_otp`, {
            method: "POST",
            headers: {'Content-Type': 'application/json', token: token},
            body: JSON.stringify({
                "app_id": 3,
                "otp_reference_number": adharObj.otp_reference_id,
                "mobile_number": adharObj.mobile,
                "otp": this.state.otp,
                "timestamp": new Date()
            })
        }).then(resp => resp.json()).then(resp => {
            changeLoader(false);
            if (resp.error === Object(resp.error))
                alertModule(resp.error.message, 'warn');
            else if (resp.response === Object(resp.response)) {
                this.setState({verified: resp.response.is_otp_verified}, () => {
                    setAdharManual(this.state);
                });
                if (resp.response.is_otp_verified)
                    setTimeout(() => {
                        history.push(`${PUBLIC_URL}/preapprove/businessdetail`);
                    }, 500);
// Goes to New Page
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
            this.setState({
                mobile: value,
                mobile_correct: (value.length !== 10)
            }, () => this.props.setAdharManual(this.state));
        }
    };

    componentDidMount() {
        const {adharObj, payload, changeLoader, setAuth, history} = this.props;
        if (adharObj === Object(adharObj))
            this.setState({mobile: adharObj.mobile});
        else setAuth(this.state);

        changeLoader(false);

        if (payload !== Object(payload))
            if (adharObj !== Object(adharObj))
                history.push(`${PUBLIC_URL}/preapprove/personaldetails`);
    }

    render() {
        return (
            <>
                <Link to={`${PUBLIC_URL}/preapprove/personaldetails`} className={"btn btn-link"}>Go Back </Link>

                <h5 className="paragraph_styling text-center">

                    Please verify your mobile number
                </h5>
                <form
                    id="serverless-contact-form"
                >

                    <div className={"row"}>
                        <div className={"col-sm-11 col-md-8"} style={{margin: 'auto'}}>
                            <div className="form-group mb-3">
                                <label htmlFor="numberMobile"
                                       className={"bmd-label-floating"}>Mobile
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
                                        disabled={true}
                                        min={1000000000}
                                        max={9999999999}
                                        maxLength={10}
                                        minLength={10}
                                        pattern="^[0-9]{10}$"
                                        title="This field is required"
                                        id="numberMobile"

                                        required={true}
                                        readOnly={true}
                                        value={this.state.mobile}
                                        // ref={ref => (this.obj.number = ref)}
                                        // onChange={(e) => this._setMobile(e)}
                                        aria-describedby="basic-addon3"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={"col-sm-11 col-md-8"} style={{margin: 'auto'}}>
                            <div className="form-group mb-3"
                                 style={{
                                     visibility: (this.state.submitted) ? 'visible' : 'hidden',
                                     marginTop: '-15px'
                                 }}>
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
                        <label style={{
                            fontSize: 'small',
                            paddingTop: '14px',
                            color: '#bbb',
                            visibility: (this.state.submitted) ? 'visible' : 'hidden'
                        }}>You can resend OTP after {(this.state.timer) && ` ${this.state.timer} Sec`}</label>
                    </div>

                    <div className="mt-2 text-center ">
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
                            style={{visibility: (this.state.loading && (this.state.otp !== '')) ? 'visible' : 'hidden'}}
                            onClick={e => this._verifyOTP(e)}
                            className="btn btn-raised greenButton text-center">
                            Verify OTP
                        </button>
                    </div>
                </form>

            </>
        );
    }
}


const mapStateToProps = state => ({
    token: state.authPayload.token,
    adharObj: state.adharDetail.adharObj,
    payload: state.authPayload.payload
});

export default withRouter(connect(
    mapStateToProps,
    {setAuth, sendOTP, changeLoader, setAdharManual}
)(MobileOtp));
