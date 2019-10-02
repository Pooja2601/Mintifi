import React, { Component } from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import ButtonWrapper from "../../layouts/button_wrapper";
import { baseUrl, otpUrl, OTP_Timer, app_id } from "../../shared/constants";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  DrawsetAuth,
  DrawsetToken,
  setAnchorObj,
  changeLoader,
  DrawAnchorPayload,
  showAlert,
  fieldAlert
} from "../../actions";
import PropTypes from "prop-types";
import { fetchAPI, apiActions, postAPI } from "../../api";
import {
  checkObject,
  regexTrim,
  fieldValidationHandler
} from "../../shared/common_logic";
import { validationMobileOtp } from "../../shared/validations";
import InputWrapper from "../../layouts/input_wrapper";

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
    missed_fields: true,
    count: 0
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
      this.setState({ submitted: true });
    } else if (resp.status === apiActions.SUCCESS_RESPONSE) {
      // alertModule(resp.success.message, "warn");
      this.setState(
        {
          otp_reference_id: resp.data.otp_reference_code,
          count: this.state.count + 1
        },
        () => DrawsetAuth(this.state)
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

  validationHandler = () => {
    const { showAlert, fieldAlert } = this.props;

    const lomo = fieldValidationHandler({
      validations: validationMobileOtp,
      localState: this.state,
      fieldAlert
    });

    this.setState({ missed_fields: lomo }); // true : for disabling
  };

  onChangeHandler = (field, value) => {
    // ;
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
    const { changeLoader, match, showAlert } = this.props;
    changeLoader(false);
    showAlert();
    /*const {changeLoader, match, DrawsetToken} = this.props;

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
              <InputWrapper
                validation={MOBILE_NUMBER}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
                isPhone={true}
                isSubmitted={!this.state.submitted}
                isNumber={true}
              />
            </div>
            <div
              className={"col-sm-11 col-md-8 m-auto"}
              style={{
                visibility: this.state.submitted ? "visible" : "hidden"
              }}
            >
              <InputWrapper
                validation={VERIFY_OTP}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
                isNumber={true}
              />
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

          <div className="mt-3 mb-2 text-center">
            <ButtonWrapper
              localState={this.state}
              style={{
                visibility: !this.state.submitted ? "visible" : "hidden"
              }}
              onClick={this._formSubmit}
              disabled={!(!this.state.missed_fields && !this.state.submitted)}
              label={this.state.count === 0 ? "Send OTP" : "Resend OTP"}
            ></ButtonWrapper>
            <br />
            <ButtonWrapper
              localState={this.state}
              style={{
                visibility: this.state.submitted ? "visible" : "hidden"
              }}
              onClick={this._verifyOTP}
              disabled={this.state.otp.length !== 6}
              label="VERIFY OTP"
            />


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
      setAnchorObj,
      fieldAlert
    }
  )(MobileOtp)
);
