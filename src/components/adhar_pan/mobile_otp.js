import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl, otpUrl} from "../../shared/constants";
import {connect} from "react-redux";
import {setAuth, sendOTP} from "../../actions";
import {Link, withRouter} from "react-router-dom";

const Timer = 120;

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

        this.setState({loading: true, submitted: true, timer: Timer});

        fetch(`${otpUrl}/send_otp`, {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'token': this.props.token},
            body: JSON.stringify({
                "app_id": 3,
                "otp_type": "send_otp",
                "mobile_number": this.state.mobile,
                "timestamp": new Date()
            })
        }).then(resp => resp.json()).then(resp => {
            // console.log(JSON.stringify(resp));
            if (resp.error === Object(resp.error))
                alert(resp.error.message);
            else if (resp.response === Object(resp.response) && resp.response.status === 'success') {
                // alert(resp.success.message);
                this.setState({otp_reference_id: resp.response.otp_reference_code}, () => this.props.setAuth(this.state));
                this.interval = setInterval(e => {
                    this.setState({timer: this.state.timer - 1}, () => {
                        if (this.state.timer === 0) {
                            this.setState({loading: false, submitted: false, timer: Timer});
                            clearInterval(this.interval);
                        }
                    });
                }, 1000);
            }
        });
        // this.props.sendOTP(this.state.mobile);
    }

    _verifyOTP(e) {
        e.preventDefault();
        fetch(`${otpUrl}/verify_otp`, {
            method: "POST",
            headers: {'Content-Type': 'application/json', token: this.props.token},
            body: JSON.stringify({
                "app_id": 3,
                "otp_reference_number": this.props.authObj.otp_reference_id,
                "mobile_number": this.props.authObj.mobile,
                "otp": this.state.otp,
                "timestamp": new Date()
            })
        }).then(resp => resp.json()).then(resp => {

            if (resp.error === Object(resp.error))
                alert(resp.error.message);
            else if (resp.response === Object(resp.response)) {
                this.setState({verified: resp.response.is_otp_verified}, () => {
                    this.props.setAuth(this.state)
                });
                if (resp.response.is_otp_verified)
                    setTimeout(() => {
                        this.props.history.push('/BusinessDetail');
                    }, 500);
// Goes to New Page
            }
        })
    }

//authObj
    _setMobile = (e) => {
        if (e.target.value.length <= 10) {
            this.setState({mobile: e.target.value, mobile_correct: true}, () => this.props.setAuth(this.state));
        }
        else this.setState({mobile_correct: false}, () => this.props.setAuth(this.state));
    };

    componentDidMount() {
        if (this.props.adharObj === Object(this.props.adharObj))
            this.setState({mobile: this.props.adharObj.mobile});
        else this.props.setAuth(this.state);
    }

    render() {
        return (
            <>
                <Link to={'/Token'} className={"btn btn-link"}>Go Back </Link>
                <p className="paragraph_styling text-center">
                    <b> Existing Customer?</b><br/>
                    Let us verify your Number.
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
                                disabled={true}
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
                                readOnly={true}
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
                                    </button>*/}

                    </div>
                </form>
            </>
        );
    }
}


const mapStateToProps = state => ({
    authObj: state.authPayload.authObj,
    adharObj: state.adharDetail.adharObj,
    token: state.authPayload.token
});

export default withRouter(connect(
    mapStateToProps,
    {setAuth, sendOTP}
)(MobileOtp));
