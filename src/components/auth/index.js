import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl} from "../../shared/constants";
import {connect} from "react-redux";
import {setAuth} from "../../actions";
import {Link, withRouter} from "react-router-dom";

const Timer = 20;

class Auth extends Component {
    state = {submitted: false, loading: false, showMsg: {}, timer: Timer, mobile: '', otp: ''};
    obj = {mobile_correct: false};

    _formSubmit(e) {
        // alert('hi');
        e.preventDefault();
        clearInterval(this.interval);
        this.setState({loading: true, submitted: true, timer: Timer});
        this.interval = setInterval(e => {
            this.setState({timer: this.state.timer - 1}, () => {
                if (this.state.timer === 0) {
                    this.setState({loading: false, submitted: false, timer: Timer});
                    clearInterval(this.interval);
                }
            });
        }, 1000);
    }

    _setMobile = (e) => {
        if (e.target.value.length <= 10) {
            this.props.setAuth(e.target.value);
            this.obj.mobile_correct = true;
        }
        else this.obj.mobile_correct = false;
    }

    render() {
        return (<>
                <Link to={'/'}>Go Back </Link>
                <p className="paragraph_styling text-center">
                    <b> Existing Customer?</b><br/>
                    Let us verify your Number.
                </p>
                <form
                    id="serverless-contact-form"

                >
                    <label htmlFor="numberMobile">Mobile Number *</label>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon3">
                    +91
                  </span>
                        </div>
                        <input
                            type="number"
                            className="form-control font_weight"
                            placeholder="10 digit Mobile Number"
                            name="url"
                            min={1000000000}
                            max={9999999999}
                            maxLength={10}
                            minLength={10}
                            pattern="^[0-9]{10}$"
                            title="This field is required"
                            id="numberMobile"
                            style={{fontWeight: 600}}
                            required={true}
                            value={this.props.mobile}
                            // ref={ref => (this.obj.number = ref)}
                            onChange={(e) => this._setMobile(e)}
                            aria-describedby="basic-addon3"
                        />
                    </div>
                    {(this.state.submitted) && (
                        <div className="input-group mb-3">
                            <input
                                type="number"
                                className="form-control font_weight"
                                placeholder="Enter the OTP"
                                name="url"
                                pattern="^[0-9]{4}$"
                                title="This field is required"
                                id="otpVerify"
                                style={{fontWeight: 600}}
                                value={this.state.otp}
                                min={1000}
                                max={9999}
                                onChange={(e) => {
                                    if (e.target.value.length <= 4) this.setState({otp: e.target.value})
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
                    )}
                    <div className="mt-5 mb-5 text-center ">
                        {(!this.state.loading) ? (
                            <button
                                type="submit"
                                name="submit"
                                // value={"Send OTP"}
                                onClick={e => this._formSubmit(e)}
                                className="form-submit btn partenrs_submit_btn"
                            >Send OTP
                            </button>

                        ) : (<>
                            {(this.state.otp !== '') && (<button className="btn partenrs_submit_btn">

                                Verify OTP
                            </button>)}
                            {/*<br/>
                                    <button className="btn partenrs_submit_btn" disabled>
                                        <span className="spinner-border spinner-border-sm"/>
                                        Resend OTP.. {this.state.timer} Sec
                                    </button>*/}
                        </>)}
                    </div>
                </form>
            </>

        );
    }
}


const mapStateToProps = state => ({
    mobile: state.authPayload.mobile,
    otp: state.authPayload.otp
});

export default withRouter(connect(
    mapStateToProps,
    {setAuth}
)(Auth));
