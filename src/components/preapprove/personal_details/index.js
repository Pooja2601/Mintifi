import React, { Component } from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import { baseUrl, otpUrl } from "../../../shared/constants";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  setAdharManual,
  changeLoader,
  showAlert,
  fieldAlert
} from "../../../actions";
import { Link, withRouter } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchAPI, apiActions, postAPI } from "../../../api";
import {
  checkObject,
  fieldValidationHandler,
  regexTrim,
  retrieveDate
} from "../../../shared/common_logic";
import ButtonWrapper from "../../../layouts/button_wrapper";
import InputWrapper from "../../../layouts/input_wrapper";
import SwitchButtonWrapper from "../../../layouts/switch_wrapper";
import { validationPersonalDetails } from "../../../shared/validations";

const { PUBLIC_URL } = process.env;
const {
  F_NAME,
  M_NAME,
  L_NAME,
  MOBILE,
  DOB,
  ADDRESS2,
  ADDRESS1,
  EMAIL,
  GENDER,
  OWNERSHIP,
  PINCODE
} = validationPersonalDetails;

class PersonalDetail extends Component {
  static propTypes = {
    authObj: PropTypes.object,
    anchorObj: PropTypes.object,
    payload: PropTypes.object.isRequired,
    gstProfile: PropTypes.object
  };

  state = {
    f_name: "",
    m_name: "",
    l_name: "",
    mobile: "",
    email: "",
    dob: new Date(315577770),
    gender: "m",
    ownership: "rented",
    pincode: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    list_posts: "",
    missed_fields: true
  };

  tempState = this.state;

  componentDidMount() {
    const {
      payload,
      authObj,
      adharObj,
      changeLoader,
      showAlert,
      setAdharManual,
      history,
      pan
    } = this.props;
    // console.log(typeof payload);
    changeLoader(false);
    showAlert();
    setTimeout(() => {}, 1000);
    // console.log(pan)
    if (checkObject(payload)) {
      if (!pan) history.push(`${PUBLIC_URL}/preapprove/adharpan`);
    } else history.push(`${PUBLIC_URL}/preapprove/token`);

    let state = adharObj;
    this.tempState = Object.assign({}, this.state);

    // console.log(this.tempState);

    if (checkObject(authObj))
      if (authObj.verified && checkObject(state))
        if (state.mobile) state.mobile = authObj.mobile;

    if (checkObject(state)) this.setState(state);
    else setAdharManual(this.state);

    setTimeout(() => {
      this._loadGstProfile();
      this.validationHandler();
      // console.log(adharObj);
    }, 1000);
  }

  // incoming from GST profile
  _loadGstProfile() {
    const { gstProfile, setAdharManual } = this.props;
    let tempName;
    if (checkObject(gstProfile)) {
      if (Array.isArray(gstProfile.mbr) && gstProfile.mbr.length > 0) {
        tempName = gstProfile.mbr[0].split(" ");
        // console.log(tempName[0]);
        this.setState(
          {
            f_name: tempName[0],
            m_name: tempName[2] ? tempName[1] : "",
            l_name: tempName[2] ? tempName[2] : tempName[1] || ""
          },
          () => setAdharManual(this.state)
        );
      }
      if (Array.isArray(gstProfile.pradr) && gstProfile.pradr.length > 0) {
        this.setState(
          {
            mobile: gstProfile.pradr.mb,
            email: gstProfile.pradr.em
          },
          () => setAdharManual(this.state)
        );
      }
    }
  }

  _formSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      this.props.history.push(`${PUBLIC_URL}/preapprove/mobileotp`);
    }, 500);
  }

  _pincodeFetch = async pincode => {
    //http://postalpincode.in/api/pincode/
    //https://test.mintifi.com/api/v2/communications/pincode/400059
    let city, state;
    const { setAdharManual, changeLoader, showAlert } = this.props;
    if (pincode) {
      const options = {
        token: null,
        URL: `${otpUrl}/pincode/${pincode}`,
        showAlert: showAlert,
        changeLoader: changeLoader
      };

      const resp = await fetchAPI(options);

      if (resp.status === apiActions.SUCCESS_RESPONSE) {
        // TODO: Check for success response

        city = resp.data.city;
        state = resp.data.state;
        this.setState({ city, state }, () => setAdharManual(this.state));
      } else if (resp.status === apiActions.ERROR_RESPONSE) {
        showAlert(resp.data.message, "warn");
        this.setState({ city: "", state: "" });
      }
    }
  };

  // ToDo : should be independent of a field
  validationHandler = () => {
    const { showAlert, fieldAlert } = this.props;

    const lomo = fieldValidationHandler({
      fieldAlert,
      validations: validationPersonalDetails,
      localState: this.state
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

    this.tempState = Object.assign({}, this.state);
    switch (field) {
      case MOBILE:
        if (value.length <= 10) this.tempState[MOBILE.slug] = value;
        break;

      case PINCODE:
        if (value.length <= 6) {
          this.tempState[PINCODE.slug] = value;
          value.length === 6 && this._pincodeFetch(value);
        }
        break;
      case DOB:
        // this.tempState['dob'] = retrieveDate(value);
        this.tempState[DOB.slug] = new Date(value);
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

  render() {
    return (
      <>
        <Link
          to={`${PUBLIC_URL}/preapprove/adharpan`}
          className={"btn btn-link go-back-btn"}
        >
          Go Back{" "}
        </Link>
        <h4 className={"text-center "}>Personal Details </h4>
        <h5 className="paragraph_styling  text-center secondLinePara">
          <b> Enter your personal information to proceed.</b>
        </h5>
        <form id="serverless-contact-form" onSubmit={e => this._formSubmit(e)}>
          <div className={"row"}>
            <div className={"col-md-4 col-sm-4 col-xs-12"}>
              <InputWrapper
                validation={F_NAME}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>
            <div className={"col-md-4 col-sm-4 col-xs-12"}>
              <InputWrapper
                validation={M_NAME}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>
            <div className={"col-md-4 col-sm-4 col-xs-12"}>
              <InputWrapper
                validation={L_NAME}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>
          </div>
          <div className={"row"}>
            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <InputWrapper
                validation={MOBILE}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
                isPhone={true}
              />
            </div>
            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <InputWrapper
                validation={EMAIL}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>
          </div>

          <div className={"row"}>
            <div className={"col-sm-6 col-xs-12 col-md-6 text-left"}>
              <SwitchButtonWrapper
                validation={GENDER}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>
            <div className={"col-sm-6 col-xs-12 col-md-6 text-left"}>
              <SwitchButtonWrapper
                validation={OWNERSHIP}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>
          </div>

          <div className={"row"}>
            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <InputWrapper
                validation={DOB}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
                isDatepicker={true}
              />
            </div>
            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <InputWrapper
                validation={ADDRESS1}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>
          </div>

          <div className={"row"}>
            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <InputWrapper
                validation={PINCODE}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>
            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <InputWrapper
                validation={ADDRESS2}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>
          </div>
          <div
            className={"row mt-4"}
            style={{
              visibility:
                this.state.city && this.state.state ? "visible" : "hidden"
            }}
          >
            <div className={"col-md-6 col-sm-6 col-xs-12 "}>
              <label className={"form-control font_weight"}>
                {this.state.city}
              </label>
            </div>
            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <label className={"form-control font_weight"}>
                {this.state.state}
              </label>
            </div>
          </div>
          {/*  <div className="form-group mb-3">
                        <label htmlFor="textAddress2" className="bmd-label-floating"> Select Your Locality *</label>
                        <select className="form-control font_weight"
                               
                                onBlur={() => {
                                    this.props.setAdharManual(this.state);
                                    this.handleValidation()
                                }} title="Please enter Address2"
                                required={true}
                                value={this.state.address2} id="textAddress2" onChange={(e) => {
                            if (e.target.value.length >= 5)
                                this.setState({address2: e.target.value});
                            this.validate.address2 = (e.target.value.length >= 5) ? true : false;
                        }}>
                            <option>Select your Locality</option>
                            {
                                (this.state.list_posts === Object(this.state.list_posts)) ? this.state.list_posts.map((val, key) =>
                                    (<option value={`${val.name} ${val.district} ${val.state}`}>{val.name} {val.district} {val.state}</option>)
                                ) : (<></>)
                            }
                        </select>
                    </div>*/}

          <div className="mt-5 mb-5 text-center ">
            {
              <ButtonWrapper
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
                disabled={this.state.missed_fields}
              />
            }
            {/* <a href={'#'} disabled={this.state.missed_fields} onClick={e => this._formSubmit(e)}
                           className="form-submit btn btn-raised greenButton">Proceed</a>*/}
          </div>
        </form>
      </>
    );
  }
}

const mapStateToProps = state => ({
  pan: state.adharDetail.pan,
  authObj: state.authPayload.authObj,
  payload: state.authPayload.payload,
  adharObj: state.adharDetail.adharObj,
  gstProfile: state.businessDetail.gstProfile
});

export default withRouter(
  connect(
    mapStateToProps,
    { setAdharManual, changeLoader, showAlert, fieldAlert }
  )(PersonalDetail)
);
