import React, { Component } from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import { otpUrl, OTP_Timer, app_id } from "../../../shared/constants";
import { connect } from "react-redux";
import ButtonWrapper from "../../../layouts/button_wrapper";
import PropTypes from "prop-types";
import {
  setAuth,
  sendOTP,
  changeLoader,
  setAdharManual,
  showAlert,
  fieldAlert
} from "../../../actions";
import { Link, withRouter } from "react-router-dom";
import { fetchAPI, apiActions, postAPI } from "../../../api";
import {
  checkObject,
  fieldValidationHandler,
  regexTrim
} from "../../../shared/common_logic";
import { validationMobileOtp } from "../../../shared/validations";
import InputWrapper from "../../../layouts/input_wrapper";

const Timer = OTP_Timer;
const { PUBLIC_URL } = process.env;

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
    mobile_correct: false,
    count: 0
  };

  tempState = this.state;

  // obj = {mobile_correct: false};

  _formSubmit = async e => {
    e.preventDefault();
    clearInterval(this.interval);
    const { changeLoader, token, setAdharManual, showAlert } = this.props;

    this.setState({ loading: true, submitted: true, timer: Timer });

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
      this.setState({ loading: false, submitted: false });
    } else if (resp.status === apiActions.SUCCESS_RESPONSE) {
      this.setState(
        {
          otp_reference_id: resp.data.otp_reference_code,
          count: this.state.count + 1
        },
        () => setAdharManual(this.state)
      );
      this.interval = setInterval(e => {
        this.setState({ timer: this.state.timer - 1 }, () => {
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
    const { showAlert, fieldAlert } = this.props;

    const lomo = fieldValidationHandler({
      validations: validationMobileOtp,
      localState: this.state,
      fieldAlert
    });

    this.setState({ missed_fields: lomo }); // true : for disabling
  };

  onChangeHandler = (field, value) => {
    let that = this,
      regex,
      doby;
    const { setAdharManual } = this.props;
    // fields is Equivalent to F_NAME , L_NAME... thats an object

    // ToDo : comment those that are not required
    const { MOBILE_NUMBER, VERIFY_OTP } = validationMobileOtp;

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

    this.setState({ ...this.state, ...this.tempState });

    window.setTimeout(() => {
      setAdharManual(that.state);
      this.validationHandler();
    }, 10);
  };

  componentWillMount() {
    const {
      adharObj,
      payload,
      history,
      authObj,
      changeLoader,
      showAlert
    } = this.props;
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
    const { adharObj, changeLoader } = this.props;

    let state = this.state,
      that = this;

    if (checkObject(adharObj)) this.setState({ mobile: adharObj.mobile });

    Object.assign(state, adharObj);
    setTimeout(() => {
      if (checkObject(state) && state) that.setState(state);
      this.validationHandler();
    }, 500);

    // else setAdharManual(this.state);
    changeLoader(false);
  }

  render() {
    const { MOBILE_NUMBER, VERIFY_OTP } = validationMobileOtp;
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
            <ButtonWrapper
              style={{
                visibility:
                  !this.state.submitted && !this.state.loading
                    ? "visible"
                    : "hidden"
              }}
              disabled={!(!this.state.missed_fields && !this.state.submitted)}
              onClick={this._formSubmit}
              className="form-submit"
              label={this.state.count === 0 ? "Send OTP" : "Resend OTP"}
            />


            <ButtonWrapper
              style={{
                visibility:
                  this.state.loading && this.state.submitted
                    ? "visible"
                    : "hidden"
              }}
              disabled={this.state.loading && this.state.otp.length !== 6}
              onClick={this._verifyOTP}
              className="text-center m-auto d-block marginTopBottom"
              label={"Verify OTP"}

            />


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
    { setAuth, sendOTP, changeLoader, setAdharManual, showAlert, fieldAlert }
  )(MobileOtp)
);
