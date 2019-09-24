import React, { Component } from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import { baseUrl, otpUrl, OTP_Timer, app_id } from "../../shared/constants";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  DrawsetAuth,
  DrawsetToken,
  setAnchorObj,
  changeLoader,
  DrawAnchorPayload,
  showAlert
} from "../../actions";
import PropTypes from "prop-types";
import { fetchAPI, apiActions, postAPI } from "../../api";
import {
  checkObject,
  regexTrim,
  fieldValidationHandler
} from "../../shared/common_logic";
import { validationMobileOtp } from "../../shared/validations";

const Timer = OTP_Timer;
const { PUBLIC_URL } = process.env;

class MobileOtp extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    payload: PropTypes.object.isRequired,
    changeLoader: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired
  };

  state = {
    submitted: false,
    showMsg: {},
    timer: Timer,
    mobile: "",
    otp: "",
    otp_reference_id: "",
    verified: false,
    mobile_correct: false,
    missed_fields: true
  };

  _formSubmit = async e => {
    e.preventDefault();
    clearInterval(this.interval);
    const { changeLoader, token, DrawsetAuth, showAlert } = this.props;

    this.setState({ submitted: true, timer: Timer });
    const options = {
      URL: `${otpUrl}/send_otp`,
      token: token,
      data: {
        app_id: app_id,
        otp_type: "drawdown",
        mobile_number: this.state.mobile,
        timestamp: new Date()
      },
      showAlert: showAlert,
      changeLoader: changeLoader
    };
    const resp = await postAPI(options);

    if (resp.status === apiActions.ERROR_RESPONSE) {
      showAlert(resp.data.message, "warn");
      this.setState({ submitted: false });
    } else if (resp.status === apiActions.SUCCESS_RESPONSE) {
      // alertModule(resp.success.message, "warn");
      this.setState({ otp_reference_id: resp.data.otp_reference_code }, () =>
        DrawsetAuth(this.state)
      );
      this.interval = setInterval(e => {
        this.setState({ timer: this.state.timer - 1 }, () => {
          if (this.state.timer === 0) {
            this.setState({
              submitted: false,
              timer: Timer
            });
            clearInterval(this.interval);
          }
        });
      }, 1000);
      // this.props.sendOTP(this.state.mobile);
    }
  };

  // TODO: check post function
  _verifyOTP = async e => {
    e.preventDefault();
    const { changeLoader, authObj, token, DrawsetAuth, showAlert } = this.props;

    const options = {
      URL: `${otpUrl}/verify_otp`,
      token: token,
      data: {
        app_id: app_id,
        otp_reference_number: authObj.otp_reference_id,
        mobile_number: authObj.mobile,
        otp: this.state.otp,
        timestamp: new Date()
      },
      showAlert: showAlert,
      changeLoader: changeLoader
    };
    const resp = await postAPI(options);

    if (resp.status === apiActions.ERROR_RESPONSE) {
      showAlert(resp.data.message, "warn");
      this.setState({ submitted: false });
    } else if (resp.status === apiActions.SUCCESS_RESPONSE) {
      let that = this;
      this.setState({ verified: resp.data.is_otp_verified }, () => {
        DrawsetAuth(that.state);
      });
      // Goes to New Page
      if (resp.data.is_otp_verified) {
        setTimeout(() => {
          this._fetchAnchorInfo();
          // history.push(`${PUBLIC_URL}/drawdown/offers`);
        }, 500);
      }
    }
  };

  _fetchAnchorInfo = async () => {
    const {
      changeLoader,
      authObj,
      setAnchorObj,
      token,
      payload,
      history,
      DrawAnchorPayload,
      showAlert
    } = this.props;
    // `${baseUrl}/loans/${payload.company_id}/details/?app_id=${app_id}`,

    // TODO: check fetchAPI function
    if (checkObject(payload)) {
      const options = {
        URL: `${baseUrl}/merchants/${payload.anchor_id}/get_details?app_id=${app_id}`,
        token: token,
        showAlert: showAlert,
        changeLoader: changeLoader
      };
      const resp = await fetchAPI(options);

      if (resp.status === apiActions.ERROR_RESPONSE) {
        showAlert(resp.data.message, "warn");
      } else if (resp.status === apiActions.SUCCESS_RESPONSE) {
        DrawAnchorPayload(resp.data);
        setAnchorObj(resp.data);
      }
      setTimeout(() => {
        history.push(`${PUBLIC_URL}/drawdown/fetch_offers`);
      }, 1000);
    }
  };

  //authObj
  _setMobile = e => {
    const { value } = e.target;
    const { DrawsetAuth } = this.props;

    if (value.length <= 10) {
      // console.log(value.length);
      this.setState(
        { mobile: value, mobile_correct: value.length !== 10 },
        () => DrawsetAuth(this.state)
      );
    }
  };

  validationHandler = () => {
    const { showAlert } = this.props;

    const lomo = fieldValidationHandler({
      showAlert: showAlert,
      validations: validationMobileOtp,
      localState: this.state
    });

    this.setState({ missed_fields: lomo }); // true : for disabling
  };

  onChangeHandler = (field, value) => {
    // debugger;
    let that = this,
      regex,
      doby;
    const { DrawsetAuth, authObj } = this.props;
    // fields is Equivalent to F_NAME , L_NAME... thats an object

    // ToDo : comment those that are not required
    const { MOBILE_NUMBER, VERIFY_OTP } = validationMobileOtp;

    this.tempState = Object.assign({}, this.state);
    switch (field) {
      case MOBILE_NUMBER:
        // console.log(">>>", value.length);
        if (value.length <= 10) {
          this.tempState["mobile"] = value;
        }
        break;
      case VERIFY_OTP:
        if (value.length <= 6) this.tempState["otp"] = value;
        break;

      default:
        this.tempState[field.slug] = value;
        break;
    }

    this.setState({ ...this.state, ...this.tempState });

    window.setTimeout(() => {
      DrawsetAuth(that.state);
      this.validationHandler();
    }, 10);
  };

  componentWillMount() {
    /*const {changeLoader, match, DrawsetToken} = this.props;
                    changeLoader(false);
                    const {token, payload} = match.params;
                    if (!token &&  !checkObject(payload))
                        alertModule("You cannot access this page directly without Authorised session!! ", 'error');
                    else DrawsetToken(token, payload);*/
  }

  componentDidMount() {
    const {
      authObj,
      payload,
      token,
      DrawsetAuth,
      history,
      changeLoader
    } = this.props;
    if (checkObject(payload) && token) {
      if (checkObject(authObj)) {
        if (authObj.mobile)
          this.setState({
            mobile: authObj.mobile
          });
        else DrawsetAuth(this.state);
      }
      // else history.push(`${PUBLIC_URL}/drawdown/token`);
    } else history.push(`${PUBLIC_URL}/drawdown/token`);
    // console.log(payload)
    window.setTimeout(() => this.validationHandler(), 500);

    changeLoader(false);
  }

  render() {
    // const {payload, match} = this.props;
    const { MOBILE_NUMBER, VERIFY_OTP } = validationMobileOtp;
    return (
      <>
        {/*<Link to={`${PUBLIC_URL}/PersonalDetails`} className={"btn btn-link"}>Go Back </Link>*/}
        <h4 className={"text-center"}>Pay with Mintifi</h4>
        <p className="paragraph_styling text-center">
          {/*<br/>*/}
          Please verify your mobile number.
        </p>
        <div id="serverless-contact-form">
          <div className={"row"}>
            <div className={"col-sm-11 col-md-8 m-auto"}>
              <div className="form-group mb-3">
                <label htmlFor="numberMobile" className={"bmd-label-floating"}>
                  Enter Mobile Number *
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
                    value={this.state.mobile}
                    // ref={ref => (this.obj.number = ref)}
                    // onChange={e => this._setMobile(e)}
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
              className={"resendOTPLabel"}
              style={{
                display: this.state.submitted ? "block" : "none"
              }}
            >
              You can resend OTP after{" "}
              {this.state.timer && ` ${this.state.timer} Sec`}
            </label>
          </div>

          <div className="mt-3 mb-2 text-center ">
            <button
              name="submit"
              // style={{
              //   visibility:
              //     !this.state.missed_fields && !this.state.submitted
              //       ? "visible"
              //       : "hidden"
              // }}
              disabled={!(!this.state.missed_fields && !this.state.submitted)}
              // value={"Send OTP"}
              onClick={e => this._formSubmit(e)}
              className="form-submit btn btn-raised greenButton"
            >
              Send OTP
            </button>
            <br />

            <button
              style={{
                visibility: this.state.otp.length === 6 ? "visible" : "hidden"
              }}
              onClick={e => this._verifyOTP(e)}
              className="btn btn-raised greenButton text-center"
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
  token: state.drawdownReducer.token,
  payload: state.drawdownReducer.payload,
  authObj: state.drawdownReducer.authObj
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      DrawsetAuth,
      DrawsetToken,
      changeLoader,
      DrawAnchorPayload,
      showAlert,
      setAnchorObj
    }
  )(MobileOtp)
);
