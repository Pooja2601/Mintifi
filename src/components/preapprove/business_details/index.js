import React, { Component } from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import { connect } from "react-redux";
import {
  setBusinessDetail,
  changeLoader,
  showAlert,
  fieldAlert
} from "../../../actions/index";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { PrivacyPolicy, TnCPolicy } from "../../../shared/policy";
import Select from "react-select";
import ButtonWrapper from "../../../layouts/button_wrapper";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import {
  checkObject,
  regexTrim,
  fieldValidationHandler,
  retrieveDate
} from "../../../shared/common_logic";
import {
  validationBusinessDetails,
  validationPersonalDetails
} from "./../../../shared/validations";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputWrapper from "./../../../layouts/input_wrapper";
import SwitchButtonWrapper from "./../../../layouts/switch_wrapper";

const {
  COMPANY_NAME,
  COMPANY_TYPE,
  GST_NUMBER,
  PAN_NUMBER,
  AVERAGE_TRANSACTION,
  DEALER_CODE,
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  NO_OF_FOUNDERS,
  NO_OF_EMPLOYEES,
  OWNERSHIP,
  ADDRESS1,
  ADDRESS2,
  PINCODE,
  INC_DATE,
  RETAILER_VINTAGE
} = validationBusinessDetails;

const { PUBLIC_URL } = process.env;

class BusinessDetail extends Component {
  static propTypes = {
    adharObj: PropTypes.object.isRequired,
    anchorObj: PropTypes.object,
    payload: PropTypes.object.isRequired,
    gstProfile: PropTypes.object
  };

  state = {
    company_name: "",
    company_type: "",
    gst: "",
    bpan: "",
    avgtrans: "",
    dealer_code: "",
    missed_fields: true,
    // lgnm: '', // company_name
    tnc_consent: false,
    tncModal: false,
    ctrerror: 4,
    optionSelected: { value: "", label: "Select Company Type" },
    business_email: "",
    business_phone: "",
    inc_date: new Date(1117608499),
    ownership: "rented",
    pincode: "",
    retailer_vintage: "",
    address1: "",
    address2: "",
    gst_correct: true
  };

  // validate = {company_type: false, gst: false, avgtrans: false, dealer_code: false};

  RenderModalTnC = () => {
    return (
      <>
        <button
          type="button"
          style={{ visibility: "hidden" }}
          ref={ref => (this.triggerTnCModal = ref)}
          id={"triggerTnCModal"}
          data-toggle="modal"
          data-target="#TnCMsgModal"
        ></button>

        <div
          className="modal fade"
          id={"TnCMsgModal"}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-lg"
            role="document"
            style={{ margin: "5.75rem auto" }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {this.state.tncModal
                    ? "Terms and Conditions"
                    : "Privacy policy"}
                </h5>
                {/* <ButtonWrapper
                  className="close"
                  data-dismiss="model"
                  aria-label="CLOSE"
                >
                  <span aria-hidden="true">&times;</span>
                </ButtonWrapper> */}
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {this.state.tncModal
                  ? TnCPolicy({ fontSize: 13 })
                  : PrivacyPolicy({
                    fontSize: 13,
                    headSize: 1.5
                  })}
              </div>
              <div className="modal-footer">
                {/*<button type="button" className="btn btn-primary">Save changes</button>*/}

                <button
                  type="button"
                  className="btn btn-primary"
                  ref={ref => (this.closeModal = ref)}
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  _formSubmit = e => {
    e.preventDefault();
    // this.props.setBusinessDetail(this.state);
    setTimeout(() => {
      this.props.history.push(`${PUBLIC_URL}/preapprove/finalize`);
    });
  };

  // ToDo : should be independent of a field
  validationHandler = () => {
    const { showAlert, fieldAlert } = this.props;

    const lomo = fieldValidationHandler({
      fieldAlert,
      validations: validationBusinessDetails,
      localState: this.state
    });
    // console.log(lomo)
    this.setState({ missed_fields: lomo }); // true : for disabling
  };

  onChangeHandler = (field, value) => {
    let that = this,
      regex,
      doby;
    const { setBusinessDetail } = this.props;
    // fields is Equivalent to F_NAME , L_NAME... thats an object

    this.tempState = Object.assign({}, this.state);
    switch (field) {
      case COMPANY_TYPE:
        this.tempState[COMPANY_TYPE.selectedOption] = value;
        this.tempState[COMPANY_TYPE.slug] = value.value;
        break;
      case GST_NUMBER:
        if (value.length <= 15) {
          let bpan = value.substr(2, 10);
          this.tempState[field.slug] = value;
          this.tempState[PAN_NUMBER.slug] = bpan;
          this.tempState["gst_correct"] = GST_NUMBER.pattern.test(value);
        }
        break;
      case BUSINESS_PHONE:
        if (value.length <= 10) this.tempState[field.slug] = value;
        break;
      case PAN_NUMBER:
        if (value.length <= 10) this.tempState[field.slug] = value;
        break;
      case INC_DATE:
        this.tempState[field.slug] = new Date(value);

        break;
      case PINCODE:
        if (value.length <= 6) this.tempState[field.slug] = value;
        break;
      case AVERAGE_TRANSACTION:
        if (value.length <= 10 && !isNaN(value))
          this.tempState[field.slug] = value;
        break;
      case DEALER_CODE:
        if (value.length <= 10) this.tempState[field.slug] = value;
        break;
      case RETAILER_VINTAGE:
        if (value.length <= 4) this.tempState[field.slug] = value;
        break;
      default:
        this.tempState[field.slug] = value;
        break;
    }

    this.setState({ ...this.state, ...this.tempState });

    window.setTimeout(() => {
      setBusinessDetail(that.state);
      this.validationHandler();
    }, 10);
  };

  componentWillMount() {
    const { payload, adharObj, changeLoader, history } = this.props;

    if (checkObject(payload)) {
      if (!checkObject(adharObj))
        history.push(`${PUBLIC_URL}/preapprove/personaldetail`);
    } else history.push(`${PUBLIC_URL}/preapprove/token`);

    // console.log(this.props.gstProfile)
    changeLoader(false);
  }

  componentDidMount() {
    const { businessObj, payload, setBusinessDetail, gstProfile } = this.props;
    // console.log(adharObj);
    let company_name;
    const { GST_NUMBER } = validationBusinessDetails;

    if (checkObject(businessObj)) {
      company_name = businessObj.company_name ? businessObj.company_name : "";
      this.setState(businessObj, () =>
        this.onChangeHandler(GST_NUMBER, businessObj.gst)
      );
    } else setBusinessDetail(this.state);

    try {
      /*  if (gstProfile === Object(gstProfile))
                  if (gstProfile.length) {
                      BusinessType.map((val, key) => {
                          (`/${val}/gi`).test(gstProfile.ctb);
                      });
                      this.setState({gst: gstProfile.gstin, lgnm: gstProfile.lgnm});
                  }*/
      if (checkObject(gstProfile)) company_name = gstProfile.lgnm;
      if (checkObject(payload)) {
        this.setState(
          {
            dealer_code: payload.distributor_dealer_code,
            company_name
          },
          () => setBusinessDetail(this.state)
        );
      }
    } catch (e) {
      console.log(e);
    }

    setTimeout(() => this.validationHandler(), 1000);
  }

  // ToDo : Need to make it feasible in future
  _customButtonValidation = () => {
    // Negate for disabling feature
    let result;
    const { payload, showAlert, fieldAlert } = this.props;
    const {
      tnc_consent,
      gst_correct,
      missed_fields,
      address1,
      pincode,
      gst,
      retailer_vintage
    } = this.state;
    if (!missed_fields && tnc_consent) {
      if (gst_correct) result = true;
      else {
        if (pincode && address1) {
          result =
            PINCODE.pattern.test(pincode) && ADDRESS1.pattern.test(address1);
          !PINCODE.pattern.test(pincode) &&
            fieldAlert({
              showError: true,
              slug: PINCODE.slug,
              message: PINCODE.error
            });
          !ADDRESS1.pattern.test(address1) &&
            fieldAlert({
              showError: true,
              slug: ADDRESS1.slug,
              message: ADDRESS1.error
            });
        } else {
          !pincode &&
            fieldAlert({
              showError: true,
              slug: PINCODE.slug,
              message: "Pincode is Missing"
            });
          !address1 &&
            fieldAlert({
              showError: true,
              slug: ADDRESS1.slug,
              message: "Address1 is Missing"
            });
          result = false;
        }
      }
      if (!payload.retailer_onboarding_date)
        if (retailer_vintage) {
          result = RETAILER_VINTAGE.pattern.test(retailer_vintage);
          !RETAILER_VINTAGE.pattern.test(retailer_vintage) &&
            fieldAlert({
              showError: true,
              slug: RETAILER_VINTAGE.slug,
              message: RETAILER_VINTAGE.error
            });
        } else {
          result = false;
          fieldAlert({
            showError: true,
            slug: RETAILER_VINTAGE.slug,
            message: "Vintage is Missing (in months)"
          });
        }
    } else result = false;
    // Negate for disabling feature on submit button
    return !result;
  };

  render() {
    const { businessObj, payload, setBusinessDetail, gstProfile } = this.props;
    return (
      <>
        {/*<Link to={`${PUBLIC_URL}/preapprove/personaldetails`} className={"btn btn-link"}>Go Back </Link>*/}

        <h4 className={"text-center mt-5"}>Business Details</h4>
        <h5 className="paragraph_styling  text-center secondLinePara">
          <b>
            {" "}
            Please submit your business details to complete the loan
            application.
          </b>
        </h5>
        <br />
        {/*<h5 className={"text-center"}>{(gstProfile === Object(gstProfile)) ? gstProfile.lgnm : ''}</h5>*/}

        <div id="serverless-contact-form">
          <div
            className={"row"}
          // style={{visibility: (checkObject(gstProfile) && gstProfile.lgnm) ? 'visible' : 'hidden'}}
          >
            <div className={"col-md-12 col-sm-12 col-xs-12"}>
              <InputWrapper
                validation={COMPANY_NAME}
                onChangeHandler={this.onChangeHandler}
                localState={this.state}
              />
            </div>
          </div>
          <div className={"row"}>
            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <InputWrapper
                validation={COMPANY_TYPE}
                onChangeHandler={this.onChangeHandler}
                localState={this.state}
                isListType={true}
              />
            </div>
            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <InputWrapper
                validation={GST_NUMBER}
                onChangeHandler={this.onChangeHandler}
                localState={this.state}
              />
            </div>
          </div>

          <div className={"row"}>
            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <InputWrapper
                validation={INC_DATE}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
                isDatepicker={true}
              />
            </div>
            <div className={"col-sm-6 col-xs-12 col-md-6 text-left"}>
              <SwitchButtonWrapper
                onChangeHandler={this.onChangeHandler}
                validation={OWNERSHIP}
                localState={this.state}
              />
            </div>
          </div>

          <div className={"row"}>
            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <InputWrapper
                validation={AVERAGE_TRANSACTION}
                onChangeHandler={this.onChangeHandler}
                localState={this.state}
              />
            </div>

            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <InputWrapper
                validation={DEALER_CODE}
                onChangeHandler={this.onChangeHandler}
                localState={this.state}
              />
            </div>
          </div>

          <div className={"row"}>
            {checkObject(payload) && payload.retailer_onboarding_date ? (
              <div className={"col-md-6 col-sm-6 col-xs-12"}>
                <InputWrapper
                  validation={RETAILER_VINTAGE}
                  onChangeHandler={this.onChangeHandler}
                  localState={this.state}
                  isNumber={true}
                />
              </div>
            ) : (
                <></>
              )}
          </div>
          {this.state.gst_correct === false || this.state.gst === "" ? (
            <>
              <div className={"row"}>
                <div className={"col-md-6 col-sm-6 col-xs-12"}>
                  <InputWrapper
                    validation={BUSINESS_EMAIL}
                    onChangeHandler={this.onChangeHandler}
                    localState={this.state}
                  />
                </div>
                <div className={"col-md-6 col-sm-6 col-xs-12"}>
                  <InputWrapper
                    validation={BUSINESS_PHONE}
                    onChangeHandler={this.onChangeHandler}
                    localState={this.state}
                    isPhone={true}
                    isNumber={true}
                  />
                </div>
              </div>

              <div className={"row"}>
                <div className={"col-md-6 col-sm-6 col-xs-12"}>
                  <InputWrapper
                    validation={NO_OF_FOUNDERS}
                    onChangeHandler={this.onChangeHandler}
                    localState={this.state}
                    isNumber={true}
                  />
                </div>

                <div className={"col-md-6 col-sm-6 col-xs-12"}>
                  <InputWrapper
                    validation={NO_OF_EMPLOYEES}
                    onChangeHandler={this.onChangeHandler}
                    localState={this.state}
                    isNumber={true}
                  />
                </div>
              </div>
              <div className={"row"}>
                <div className={"col-md-6 col-sm-6 col-xs-12"}>
                  <InputWrapper
                    validation={ADDRESS1}
                    onChangeHandler={this.onChangeHandler}
                    localState={this.state}
                  />
                </div>

                <div className={"col-md-6 col-sm-6 col-xs-12"}>
                  <InputWrapper
                    validation={PINCODE}
                    onChangeHandler={this.onChangeHandler}
                    localState={this.state}
                    isNumber={true}
                  />
                </div>
              </div>
              <div className={"row"}>
                <div className={"col-md-12"}>
                  <InputWrapper
                    validation={ADDRESS2}
                    onChangeHandler={this.onChangeHandler}
                    localState={this.state}
                  />
                </div>
              </div>
            </>
          ) : (
              <></>
            )}

          {/*    {(this.state.company_type !== "proprietorship" && this.state.company_type !== "") ? (
            <InputWrapper
                    validation={PAN_NUMBER}
                    onChangeHandler={this.onChangeHandler}
                    localState={this.state}
                  /> ) : <></>}*/}

          <div className=" mt-5">
            <label className="main">
              I accept the{" "}
              <a
                href={"#"}
                onClick={e => {
                  e.preventDefault();
                  this.setState({ tncModal: true }, () =>
                    this.triggerTnCModal.click()
                  );
                }}
              >
                Terms & Condition
              </a>
              ,{" "}
              <a
                href={"#"}
                onClick={e => {
                  e.preventDefault();
                  this.setState({ tncModal: false }, () =>
                    this.triggerTnCModal.click()
                  );
                }}
              >
                Privacy Policy
              </a>{" "}
              of the Mintifi and provide the consent to retrieve the Bureau
              information for checking my Credit worthiness .
              <input
                type="checkbox"
                onChange={e =>
                  this.setState(prevState => ({
                    tnc_consent: !prevState.tnc_consent
                  }))
                }
                checked={this.state.tnc_consent}
              />
              <span className="geekmark"></span>
            </label>
          </div>

          <div className="mt-5 mb-5 text-center">
            <ButtonWrapper
              localState={this.state}
              onClick={this._formSubmit}
              disabled={this._customButtonValidation()}
              label="CHECK YOUR ELIGIBILITY"
            />
            {/* <button
              type="submit"
              disabled={this._customButtonValidation()}
              onClick={e => this._formSubmit(e)}
              className="form-submit btn btn-raised greenButton"
            >
              Check your eligibility
            </button> */}
          </div>
        </div>
        {this.RenderModalTnC()}
      </>
    );
  }
}

const mapStateToProps = state => ({
  adharObj: state.adharDetail.adharObj,
  businessObj: state.businessDetail.businessObj,
  gstProfile: state.businessDetail.gstProfile,
  payload: state.authPayload.payload
});

export default withRouter(
  connect(
    mapStateToProps,
    { setBusinessDetail, changeLoader, showAlert, fieldAlert }
  )(BusinessDetail)
);
