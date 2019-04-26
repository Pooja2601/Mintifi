import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl, otpUrl} from "../../shared/constants";
import {connect} from "react-redux";
import {DrawsetAuth, DrawsetToken, changeLoader} from "../../actions";
import {withRouter} from "react-router-dom";

const Timer = 120;

class MobileOtp extends Component {
    state = {
        submitted: false,
        loading: false,
        showMsg: {},
        timer: Timer,
        mobile: '',
        otp: '',
        otp_reference_code: '',
        verified: false,
        mobile_correct: false
    };

    _generateToken() {
        this.props.changeLoader(true);
        let payload = {
            "anchor_id": "uyh65t",
            "distributor_dealer_code": "R1T89563",
            "sales_agent_mobile_number": "9876543210",
            "anchor_transaction_id": "hy76515",
            "retailer_onboarding_date": "2006-09-19",
            "loan_amount": "500000"
        };
        fetch('https://test.mintifi.com/api/v1/auth', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: "uyh65t",
                secret_key: "3f147e1bf610b5f3",
                app_id: "3",
                type: "anchor"
            })
        }).then(resp => resp.json()).then(resp => {
            this.props.changeLoader(false);
            if (resp.response === Object(resp.response))
                if (resp.response.status === 'success')
                    this.props.DrawsetToken(resp.response.auth.token, payload);
        });
    }

    _formSubmit(e) {

        e.preventDefault();
        clearInterval(this.interval);
        const {changeLoader, authObj, token, DrawsetAuth} = this.props;
        changeLoader(true);

        this.setState({loading: true, submitted: true, timer: Timer});

        fetch(`${otpUrl}/send_otp`, {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'token': token},
            body: JSON.stringify({
                "app_id": 3,
                "otp_type": "send_otp",
                "mobile_number": this.state.mobile,
                "timestamp": new Date()
            })
        }).then(resp => resp.json()).then(resp => {
            // console.log(JSON.stringify(resp));
            changeLoader(false);
            if (resp.error === Object(resp.error))
                alert(resp.error.message);
            else if (resp.response === Object(resp.response) && resp.response.status === 'success') {
                // alert(resp.success.message);
                this.setState({otp_reference_code: resp.response.otp_reference_code}, () => DrawsetAuth(this.state));
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
            console.log('Looks like a connectivity issue..!');
            this.props.changeLoader(false);
        });
        // this.props.sendOTP(this.state.mobile);
    }

    _verifyOTP(e) {
        e.preventDefault();
        const {changeLoader, authObj, token, DrawsetAuth} = this.props;
        changeLoader(true);
        fetch(`${otpUrl}/verify_otp`, {
            method: "POST",
            headers: {'Content-Type': 'application/json', token: token},
            body: JSON.stringify({
                "app_id": 3,
                "otp_reference_number": authObj.otp_reference_code,
                "mobile_number": authObj.mobile,
                "otp": this.state.otp,
                "timestamp": new Date()
            })
        }).then(resp => resp.json()).then(resp => {
            changeLoader(false);
            if (resp.error === Object(resp.error))
                alert(resp.error.message);
            else if (resp.response === Object(resp.response)) {
                this.setState({verified: resp.response.is_otp_verified}, () => {
                    DrawsetAuth(this.state);
                });
                if (resp.response.is_otp_verified)
                // Goes to New Page
                    setTimeout(() => {
                        // this.props.history.push('/Offers');
                    }, 500);
            }
        }, resp => {
            console.log('Looks like a connectivity issue..!');
            changeLoader(false);
        })
    }

//authObj
    _setMobile = (e) => {
        const {value} = e.target;
        const {DrawsetAuth} = this.props;

        if (value.length <= 10) {
            console.log(value.length);
            this.setState({mobile: value, mobile_correct: (value.length !== 10)}, () => DrawsetAuth(this.state));
        }
    };

    componentWillMount() {
        const {DrawsetToken, match, changeLoader, payload} = this.props;
        changeLoader(false);
        let base64_decode = (match.params.payload !== undefined) ? JSON.parse(new Buffer(match.params.payload, 'base64').toString('ascii')) : {};
        DrawsetToken(match.params.token, base64_decode);
        if (match.params.token !== undefined && payload !== Object(payload))
            alert("You cannot access this page directly without Credential Payload!! ");
    }

    componentDidMount() {
        const {payload, authObj, DrawsetAuth} = this.props;
        if (authObj === Object(authObj))
            this.setState({mobile: authObj.mobile, mobile_correct: (authObj.mobile.length !== 10)});
        else DrawsetAuth(this.state);
    }

    render() {
        const {payload, match} = this.props;
        return (
            <>
                {/*<Link to={'/AdharComplete'} className={"btn btn-link"}>Go Back </Link>*/}
                <h4 className={"text-center"}>Drawdown Portal</h4>
                <p className="paragraph_styling text-center">
                    
                    Glad to see you back !<br/>
                    Let us verify your phone number first.
                </p>
                <form
                    id="serverless-contact-form"
                >
                    <div className="form-group mb-3">
                        <label htmlFor="numberMobile" style={{marginLeft: '3rem'}} className={"bmd-label-floating"}>Mobile
                            Number *</label>
                        <div className={"input-group"}>

                            <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon3">
                    +91
                  </span>
                            </div>
                            <input
                                type="number"
                                className="form-control font_weight"
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
                                style={{
                                    fontWeight: 600,
                                    marginLeft: '1rem',
                                    fontSize: '17px',
                                    paddingLeft: '10px'
                                }}
                                required={true}
                                value={this.state.mobile}
                                // ref={ref => (this.obj.number = ref)}
                                onChange={(e) => this._setMobile(e)}
                                aria-describedby="basic-addon3"
                            />
                        </div>
                    </div>
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
                                <button className="btn btn-outline-secondary" disabled={this.state.timer}
                                        type="button"
                                        id="otp-area">Resending
                                    in {(this.state.timer) && ` ${this.state.timer} Sec`}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 mb-5 text-center ">

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
                        {/*<br/>
                                    <button className="btn greenButton" disabled>
                                        <span className="spinner-border spinner-border-sm"/>
                                        Resend OTP.. {this.state.timer} Sec
                                    </button>
                         */}

                    </div>

                </form>
                <button
                    onClick={() => this._generateToken()}
                    style={{visibility: (payload !== Object(payload) && !match.params.token) ? 'visible' : 'hidden'}}
                    style={{
                        padding: "5px 35px", width: '100%',
                        margin: '50px 0%'
                    }}
                    className="form-submit btn greenButton text-center"
                >
                    Create TOKEN and PAYLOAD
                </button>
                <br/>
                <small>(above button is for development use only)</small>
            </>
        );
    }
}

const mapStateToProps = state => ({
    token: state.drawdownReducer.token,
    payload: state.drawdownReducer.payload,
    authObj: state.drawdownReducer.authObj
});

export default withRouter(connect(
    mapStateToProps,
    {DrawsetAuth, DrawsetToken, changeLoader}
)(MobileOtp));
