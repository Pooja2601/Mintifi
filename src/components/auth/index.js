import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl} from "../../shared/constants";
import { connect } from "react-redux";
import { fetchAuth} from "../../actions";

const Timer = 10;

class Auth extends Component {
    state = {submitted: false, loading: false, showMsg: {}, timer: Timer, mobile: '', otp: ''};
    obj = {};

    _formSubmit(e) {
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

    render() {
        return (
            <div
                className="row justify-content-center background-color"
                style={{backgroundColor: "#DDD", marginTop: "100px"}}
            >
                <div className="col-11 col-md-5 ml-5 mr-5 partner_section">
                    <div className="ml-2">
                        <div className="mt-4 text-center">
                            <div className="mt-4 mb-4 border_bottom">
                                <img
                                    src="images/logo.png"
                                    style={{width: "150px", paddingBottom: "10px"}}
                                />
                                <h4>User Registration</h4>
                                <p className="paragraph_styling">
                                    Find out how our platform can help you climb the ladder to
                                    another level of success today.
                                </p>
                            </div>
                        </div>
                        <form
                            id="serverless-contact-form"
                            onSubmit={e => this._formSubmit(e)}
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
                                    required={true}
                                    value={this.state.mobile}
                                    // ref={ref => (this.obj.number = ref)}
                                    onChange={(e) => this.setState({mobile: e.target.value})}
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
                                        id="basic-url"
                                        maxlength={4}
                                        minLength={4}
                                        value={this.state.otp}
                                        min={1000}
                                        max={9999}
                                        onChange={(e) => this.setState({otp: e.target.value})}
                                        aria-describedby="otp-area"
                                    />
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary" disabled={this.state.timer}
                                                type="button"
                                                id="otp-area">Resending
                                            OTP in {(this.state.timer) && `...${this.state.timer} Sec`}
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="mt-5 mb-5 text-center ">
                                {!this.state.loading ? (
                                    <button
                                        type="submit"
                                        name="submit"
                                        value="Submit"
                                        className="form-submit btn partenrs_submit_btn"
                                    >
                                        Send OTP
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
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    authPayload: state.authPayload
});

export default connect(
    mapStateToProps,
    { fetchAuth }
)(Auth);
