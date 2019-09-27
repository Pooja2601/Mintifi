import React, { Component } from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {
  baseUrl,
  accountType,
  payMintifiUrl,
  app_id,
  user_id,
  auth_secret
} from "../../../shared/constants";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  setBankDetail,
  changeLoader,
  setToken,
  showAlert,
  fieldAlert
} from "../../../actions";
import { withRouter } from "react-router-dom";
import {
  retrieveParam,
  checkObject,
  fieldValidationHandler,
  generateToken,
  base64Logic,
  regexTrim
} from "../../../shared/common_logic";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { fetchAPI, apiActions, postAPI } from "../../../api";
import { validationBank } from "./../../../shared/validations";
import InputWrapper from "../../../layouts/input_wrapper";

const { PUBLIC_URL } = process.env;

class BankDetail extends Component {
  static propTypes = {
    adharObj: PropTypes.object.isRequired,
    anchorObj: PropTypes.object,
    payload: PropTypes.object.isRequired,
    businessObj: PropTypes.object.isRequired,
    gstProfile: PropTypes.object,
    preFlightResp: PropTypes.object
  };

  state = {
    acc_type: null,
    bank_name: "",
    acc_number: "",
    acc_name: "",
    ifsc_code: "",
    micr_code: "",
    branch_name: ""
  };

  tempState = this.state;

  // ToDo : should be independent of a field
  validationHandler = () => {
    const { showAlert, fieldAlert } = this.props;

    const lomo = fieldValidationHandler({
      fieldAlert,
      validations: validationBank,
      localState: this.state
    });

    this.setState({ missed_fields: lomo }); // true : for disabling
  };

  // Common for all input fields of this component
  onChangeHandler = (field, value) => {
    let that = this;
    const { setBankDetail } = this.props;
    // fields is Equivalent to F_NAME , L_NAME... thats an object

    // ToDo : comment those that are not required
    const { ACCOUNT_NUMBER, ACCOUNT_TYPE, IFSC, MICR_CODE } = validationBank;

    this.tempState = Object.assign({}, this.state);
    switch (field) {
      case ACCOUNT_NUMBER:
        if (!isNaN(value))
          if (value.length <= 18) this.tempState[ACCOUNT_NUMBER.slug] = value;
        break;

      case IFSC:
        if (value.length <= 11) {
          this.tempState[IFSC.slug] = value;
          value.length === 11 && this._fetchIFSC(value);
        }
        break;
      case ACCOUNT_TYPE:
        this.tempState[ACCOUNT_TYPE.selectedOption] = value;
        this.tempState[ACCOUNT_TYPE.slug] = value.value;
        break;
      case MICR_CODE:
        if (value.length <= 9 && !isNaN(value)) {
          this.tempState[MICR_CODE.slug] = value;
        }
        break;
      default:
        this.tempState[field.slug] = value;
        break;
    }
    // console.log(value)

    this.setState({ ...this.state, ...this.tempState });

    window.setTimeout(() => {
      setBankDetail(that.state);
      this.validationHandler();
    }, 10);
  };

  /*   businessGst(e) {
             const {value} = e.target;
             if (value.length <= 15) {
                 let bpan = value.substr(2, 10);
                 this.setState({gst: value, bpan}, () => this.props.setBusinessDetail(this.state))
             }
             this.validate.gst = (value.length === 15) ? true : false;
             this.handleValidation();
         }*/

  _genAuthToken = async () => {
    const {
      history,
      changeLoader,
      showAlert,
      payload,
      preFlightResp
    } = this.props;

    changeLoader(true);
    let payloadData = {
      anchor_id: payload.anchor_id,
      loan_application_id: preFlightResp.loan_application_id,
      company_id: preFlightResp.company_id,
      success_url: payload.success_url,
      error_url: payload.error_url,
      cancel_url: payload.cancel_url
    };
    let base64_encode = base64Logic(payloadData, "encode");
    const resp = await generateToken();
    changeLoader(false);

    // console.log(JSON.stringify(resp));
    if (resp == 31) showAlert("net");

    if (checkObject(resp)) {
      // console.log(JSON.stringify(resp.data))
      if (resp.status === "success")
        setTimeout(
          () =>
            history.push(
              `${PUBLIC_URL}/esign?payload=${base64_encode}&token=${resp.auth.token}`
            ),
          500
        );
    } else if (resp == 30) {
      showAlert("Something went wrong while creating Token", "warn");
    }
  };

  _formSubmit = async e => {
    e.preventDefault();
    const {
      changeLoader,
      token,
      payload,
      preFlightResp,
      history,
      showAlert
    } = this.props;
    // console.log(preFlightResp);
    const {
      bank_name,
      acc_name,
      acc_number,
      acc_type,
      ifsc_code,
      micr_code
    } = this.state;
    if (checkObject(preFlightResp)) {
      const options = {
        token: token,
        URL: `${baseUrl}/bank_account`,
        data: {
          app_id: app_id,
          loan_application_id: preFlightResp.loan_application_id,
          company_id: preFlightResp.company_id,
          anchor_id: payload.anchor_id,
          bank_name: bank_name,
          account_number: acc_number,
          account_name: acc_name,
          ifsc_code: ifsc_code,
          transfer_mode: "nach",
          micr_code: micr_code,
          account_type: acc_type,
          success_url: payload.success_url,
          error_url: payload.error_url,
          cancel_url: payload.cancel_url,
          timestamp: new Date()
        },
        showAlert: showAlert,
        changeLoader: changeLoader
      };

      const resp = await postAPI(options);

      if (resp.status === apiActions.SUCCESS_RESPONSE) {
        // ToDo : comment in Prod
        // let base64_encode = retrieveParam(
        //     resp.data.payload,
        //     "payload"
        // );
        // console.log(base64_encode);
        this._genAuthToken();
        /*setTimeout(() => history.push(`${PUBLIC_URL}/esign?payload=${base64_encode}&token=${token}`, {
                    token: token,
                    payload: base64_encode
                }), 100);*/
      } else if (resp.status === apiActions.ERROR_RESPONSE) {
        showAlert(resp.data.message, "warn");
      }
    } else showAlert("Something went wrong with the Request", "warn");
  };

  _fetchIFSC(ifsc) {
    const { changeLoader, showAlert, setBankDetail } = this.props;
    let bank_name, micr_code, branch_name;

    changeLoader(true);
    fetch(`https://ifsc.razorpay.com/${ifsc}`)
      .then(resp => resp.json())
      .then(
        resp => {
          changeLoader(false);
          if (checkObject(resp)) {
            bank_name = resp.BANK;
            // ifsc_code = resp.IFSC;
            micr_code = resp.MICR;
            branch_name = resp.BRANCH;
          } else {
            bank_name = micr_code = branch_name = "";
            showAlert("Make sure to enter correct IFSC code", "error");
          }
          this.setState(
            {
              bank_name,
              micr_code,
              branch_name
            },
            () => setBankDetail(this.state)
          );
          // console.log(resp);
        },
        resp => {
          showAlert("net");
          changeLoader(false);
        }
      );
  }

  componentWillMount() {
    const {
      payload,
      adharObj,
      history,
      businessObj,
      changeLoader,
      showAlert
    } = this.props;
    changeLoader(false);
    showAlert();
    if (checkObject(payload) && payload) {
      if (!checkObject(adharObj))
        history.push(`${PUBLIC_URL}/preapprove/personaldetail`);

      if (!checkObject(businessObj))
        history.push(`${PUBLIC_URL}/preapprove/businessdetail`);
    } else history.push(`${PUBLIC_URL}/preapprove/token`);
  }

  componentDidMount() {
    const { bankObj, setBankDetail, adharObj } = this.props;

    if (checkObject(adharObj)) {
      const { f_name, l_name } = adharObj;
      this.setState({ acc_name: `${f_name} ${l_name}` }, () =>
        setBankDetail(this.state)
      );
    }
    if (checkObject(bankObj)) this.setState(bankObj);
    else setBankDetail(this.state);

    // console.log(this.props.gstProfile)
    setTimeout(() => this.validationHandler(), 500);
    // console.log(this.props.adharObj);
  }

  render() {
    const {
      ACCOUNT_NAME,
      ACCOUNT_NUMBER,
      ACCOUNT_TYPE,
      BANK_NAME,
      BRANCH_NAME,
      IFSC,
      MICR_CODE
    } = validationBank;

    // const gstProfile = this.props.gstProfile;
    return (
      <>
        {/*<Link to={`${PUBLIC_URL}/preapprove/personaldetails`} className={"btn btn-link"}>Go Back </Link>*/}

        <h4 className={"text-center mt-5"}>Bank Details</h4>
        <p className="paragraph_styling  text-center secondLinePara">
          <b>
            {" "}
            Please submit your bank account details for loan disbursement.
            Please note that same bank account will be used to set up
            auto-debit/standing instructions for repayment:
          </b>
        </p>
        {/*<h5 className={"text-center"}>{(gstProfile === Object(gstProfile)) ? gstProfile.lgnm : ''}</h5>*/}

        <form id="serverless-contact-form" onSubmit={e => this._formSubmit(e)}>
          <div className={"row"}>
            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <InputWrapper
                validation={ACCOUNT_NAME}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>
            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <InputWrapper
                validation={ACCOUNT_NUMBER}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>
          </div>

          <div className={"row"}>
            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <InputWrapper
                validation={IFSC}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>
            <div className={"col-md-6 col-sm-6 col-xs-12"}>
              <InputWrapper
                validation={ACCOUNT_TYPE}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
                isListType={true}
              />
            </div>
          </div>

          <div className={"row"}>
            <div
              className={"col-md-6 col-sm-6 col-xs-12"}
              style={{ display: this.state.bank_name ? "block" : "none" }}
            >
              <InputWrapper
                validation={BANK_NAME}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>
            <div
              className={"col-md-6 col-sm-6 col-xs-12"}
              style={{ display: this.state.micr_code ? "block" : "none" }}
            >
              <InputWrapper
                validation={MICR_CODE}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>
          </div>
          <div
            className={"row"}
            style={{ display: this.state.branch_name ? "block" : "none" }}
          >
            <div className={"col-sm-12"}>
              <InputWrapper
                validation={BRANCH_NAME}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>
          </div>
          {/*<div className="checkbox mt-5">
                        <label style={{color: 'black'}}>
                            <input type="checkbox" checked={this.state.tnc_consent}
                                   onChange={(e) =>
                                       this.setState(prevState => ({tnc_consent: !prevState.tnc_consent}))
                                   }/> I accept the Terms & Condition, <a
                            href={"https://mintifi.com/privacy_policy"}>Privacy
                            Policy</a> of the Mintifi and provide the
                            consent to retrieve the Bureau information for checking my Credit worthiness .
                        </label>
                    </div>*/}

          <div className="mt-5 mb-5 text-center">
            <button
              type="submit"
              disabled={this.state.missed_fields}
              onClick={e => this._formSubmit(e)}
              className="form-submit btn btn-raised greenButton"
            >
              Submit Records
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
  payload: state.authPayload.payload,
  preFlightResp: state.businessDetail.preFlightResp,
  businessObj: state.businessDetail.businessObj,
  gstProfile: state.businessDetail.gstProfile,
  bankObj: state.businessDetail.bankObj
});

export default withRouter(
  connect(
    mapStateToProps,
    { setBankDetail, changeLoader, setToken, showAlert, fieldAlert }
  )(BankDetail)
);
