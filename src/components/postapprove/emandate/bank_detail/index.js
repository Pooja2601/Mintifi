import React, { Component } from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {
  baseUrl,
  accountType,
  payMintifiUrl,
  app_id,
  user_id,
  auth_secret
} from "../../../../shared/constants";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  changeLoader,
  setToken,
  showAlert,
  EnachsetBankDetail,
  EnachsetPayload,
  fieldAlert
} from "../../../../actions";
import { withRouter } from "react-router-dom";
import {
  alertModule,
  checkObject,
  retrieveParam,
  base64Logic,
  fieldValidationHandler,
  regexTrim
} from "../../../../shared/common_logic";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { fetchAPI, apiActions, postAPI } from "../../../../api";
import { validationBank } from "../../../../shared/validations";
import InputWrapper from "../../../../layouts/input_wrapper";

const { PUBLIC_URL } = process.env;

class ENachBankDetail extends Component {
  static propTypes = {
    anchorObj: PropTypes.object,
    eNachPayload: PropTypes.object.isRequired,
    showAlert: PropTypes.func,
    changeLoader: PropTypes.func
  };

  state = {
    dropdownSelected: { value: "", label: "Select Account Type" },
    acc_type: "",
    bank_name: "",
    acc_number: "",
    acc_name: "",
    ifsc_code: "",
    micr_code: "",
    branch_name: ""
  };

  // ToDo : should be independent of a field
  validationHandler = () => {
    const { showAlert, fieldAlert } = this.props;

    const lomo = fieldValidationHandler({
      validations: validationBank,
      localState: this.state,
      fieldAlert
    });

    this.setState({ missed_fields: lomo }); // true : for disabling
  };

  // Common for all input fields of this component
  onChangeHandler = (field, value) => {
    let that = this;
    const { EnachsetBankDetail } = this.props;
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
        this.tempState[ACCOUNT_TYPE.slug] = value;
        this.tempState["acc_type"] = value.value;
        break;
      case MICR_CODE:
        if (value.length <= 9 && !isNaN(value))
          this.tempState[MICR_CODE.slug] = value;

        break;
      default:
        this.tempState[field.slug] = value;
        break;
    }
    // console.log(value)

    this.setState({ ...this.state, ...this.tempState });

    window.setTimeout(() => {
      EnachsetBankDetail(that.state);
      this.validationHandler();
    }, 10);
  };

  _createMandate = async base64_encode => {
    const {
      changeLoader,
      token,
      showAlert,
      history,
      eNachPayload,
      EnachsetPayload
    } = this.props;

    let nachObject = {};

    const options = {
      URL: `${baseUrl}/repayment/emandate/init`,
      data: {
        app_id: app_id,
        loan_application_id: eNachPayload.loan_application_id
      },
      token: token,
      showAlert: showAlert,
      changeLoader: changeLoader
    };
    const resp = await postAPI(options);

    if (resp.status === apiActions.ERROR_RESPONSE) {
      showAlert(
        "We couldn`t setup the mandate, you may try the physical NACH process",
        "warn"
      );
      setTimeout(() => history.push(`${PUBLIC_URL}/enach/error_url`), 3000);
    } else if (resp.status === apiActions.SUCCESS_RESPONSE) {
      showAlert("e-Mandate created successfully", "success");
      nachObject = Object.assign(eNachPayload, resp.data);
      EnachsetPayload(token, nachObject);
      nachObject = base64Logic(nachObject, "encode");
      // ToDo : payload & token append , needs to be reomved
      setTimeout(
        () =>
          history.push(
            `${PUBLIC_URL}/enach?payload=${nachObject}&token=${token}`
          ),
        1000
      );
    }
  };

  _formSubmit = async e => {
    e.preventDefault();
    const {
      changeLoader,
      token,
      showAlert,
      history,
      eNachPayload
    } = this.props;
    // console.log(preFlightResp);
    if (checkObject(eNachPayload)) {
      const {
        bank_name,
        acc_number,
        acc_name,
        ifsc_code,
        micr_code,
        acc_type
      } = this.state;
      const {
        company_id,
        loan_application_id,
        anchor_id,
        success_url,
        error_url,
        cancel_url
      } = eNachPayload;

      const options = {
        URL: `${baseUrl}/bank_account`,
        token: token,
        data: {
          app_id: app_id,
          loan_application_id: loan_application_id,
          company_id: company_id,
          anchor_id: anchor_id,
          bank_name: bank_name,
          account_number: acc_number,
          account_name: acc_name,
          ifsc_code: ifsc_code,
          transfer_mode: "nach",
          micr_code: micr_code,
          account_type: acc_type,
          success_url: success_url,
          error_url: error_url,
          cancel_url: cancel_url,
          timestamp: new Date()
        },
        showAlert: showAlert,
        changeLoader: changeLoader
      };

      const resp = await postAPI(options);

      if (resp.status === apiActions.ERROR_RESPONSE) {
        showAlert(resp.data.message, "warn");
      } else if (resp.status === apiActions.SUCCESS_RESPONSE) {
        /* let base64_encode = retrieveParam(
                     resp.data.payload,
                     "payload"
                 );*/
        // ToDo : uncomment after the doc/API are updated
        if (resp.data.status === "success") this._createMandate();
      }
    } else showAlert("Something went wrong with the Request", "warn");
  };

  _fetchIFSC = async ifsc => {
    const { changeLoader, showAlert, EnachsetBankDetail } = this.props;
    let bank_name, micr_code, branch_name;

    changeLoader(true);

    // ToDo : Suggestion : Only meant for External URL
    fetch(`https://ifsc.razorpay.com/${ifsc}`)
      .then(resp => resp.json())
      .then(
        resp => {
          if (!checkObject(resp)) {
            bank_name = micr_code = branch_name = "";
            showAlert("Make sure to enter correct IFSC code", "error");
          } else {
            bank_name = resp.BANK;
            // ifsc_code = resp.IFSC;
            micr_code = resp.MICR;
            branch_name = resp.BRANCH;
          }
          this.setState(
            {
              bank_name,
              micr_code,
              branch_name
            },
            () => EnachsetBankDetail(this.state)
          );

          changeLoader(false);
        },
        () => {
          changeLoader(false);
        }
      );

    changeLoader(false);
  };

  // ToDo : Fetch bank details
  _fetchBankDetails = async () => {
    const {
      changeLoader,
      token,
      eNachPayload,
      showAlert,
      EnachsetBankDetail
    } = this.props;
    const paramReq = `app_id=${app_id}&loan_application_id=${eNachPayload.loan_application_id}`;
    const options = {
      URL: `${baseUrl}/banking/account?${paramReq}`,
      token: token,
      showAlert: showAlert,
      changeLoader: changeLoader
    };
    let that = this;

    const resp = await fetchAPI(options);

    // ToDO : Doesn't require to check if error
    // if(resp.status === apiActions.ERROR_RESPONSE)

    if (resp.status === apiActions.SUCCESS_RESPONSE) {
      const {
        bank_name,
        bank_account_name,
        bank_account_number,
        bank_ifsc_code,
        transfer_mode,
        account_type,
        bank_micr_code
      } = resp.data;
      this.setState({
        acc_type: account_type || "",
        transfer_mode,
        bank_name,
        acc_number: bank_account_number || "",
        acc_name: bank_account_name || "",
        ifsc_code: bank_ifsc_code || "",
        micr_code: bank_micr_code || ""
      });

      window.setTimeout(() => {
        if (bank_ifsc_code) that._fetchIFSC(that.state.ifsc_code);
        EnachsetBankDetail(that.state);
        window.setTimeout(() => that.validationHandler(), 100);
      }, 500);
    }
  };

  componentWillMount() {
    const { eNachPayload, history, changeLoader, showAlert } = this.props;

    changeLoader(false);
    showAlert();
    if (checkObject(eNachPayload)) {
      // history.push(`${PUBLIC_URL}/emandate`);
      this._fetchBankDetails();
    } else history.push(`${PUBLIC_URL}/emandate`);
  }

  componentDidMount() {
    const { bankObj, EnachsetBankDetail } = this.props;

    if (checkObject(bankObj)) this.setState(bankObj);
    else EnachsetBankDetail(this.state);

    setTimeout(() => this.validationHandler(), 500);
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
    return (
      <>
        {/*<Link to={`${PUBLIC_URL}/preapprove/personaldetails`} className={"btn btn-link"}>Go Back </Link>*/}

        <h4 className={"text-center mt-5"}>Bank Details</h4>
        <p className="paragraph_styling  text-center secondLinePara">
          <b>
            {" "}
            Please submit your bank account details for loan disbursement.
            Please note that same bank account will be used to set up
            auto-debit/standing instructions for repayment :
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
                isNumber={true}
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
                isNumber={true}
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
  token: state.eNachReducer.token,
  eNachPayload: state.eNachReducer.eNachPayload,
  bankObj: state.eNachReducer.bankObj
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      EnachsetBankDetail,
      changeLoader,
      setToken,
      showAlert,
      EnachsetPayload,
      fieldAlert
    }
  )(ENachBankDetail)
);
