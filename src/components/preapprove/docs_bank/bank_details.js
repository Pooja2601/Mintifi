import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {
    baseUrl,
    accountType,
    payMintifiUrl,
    app_id,
    user_id,
    auth_secret
} from "../../../shared/constants";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {setBankDetail, changeLoader, setToken, showAlert} from "../../../actions";
import {withRouter} from "react-router-dom";
import {alertModule, retrieveParam, generateToken, base64Logic, regexTrim} from "../../../shared/common_logic";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import {fetchAPI, apiActions, postAPI} from "../../../api";
import {checkObject, fieldValidationHandler} from "../../../shared/common_logic";
import {validationPersonalDetails} from "../adhar_pan/validation";
import {bankValidations} from './validations';

const {PUBLIC_URL} = process.env;

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
        dropdownSelected: {value: '', label: bankValidations.ACCOUNT_TYPE.title},
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
        const {showAlert} = this.props;

        const lomo = fieldValidationHandler({
            showAlert: showAlert,
            validations: bankValidations,
            localState: this.state
        });

        this.setState({missed_fields: lomo}); // true : for disabling
    }

    // Common for all input fields of this component
    onChangeHandler = (field, value) => {
        let that = this;
        const {setBankDetail} = this.props;
        // fields is Equivalent to F_NAME , L_NAME... thats an object

        // ToDo : comment those that are not required
        const {ACCOUNT_NAME, ACCOUNT_NUMBER, ACCOUNT_TYPE, BANK_NAME, BRANCH_NAME, IFSC, MICR_CODE} = bankValidations;

        this.tempState = Object.assign({}, this.state);
        switch (field) {

            case ACCOUNT_NUMBER:
                if (!isNaN(value))
                    if (value.length <= 18)
                        this.tempState['acc_number'] = value;
                break;

            case IFSC:
                if (value.length <= 11) {
                    this.tempState['ifsc_code'] = value;
                    (value.length === 11) && this._fetchIFSC(value);
                }
                break;
            case ACCOUNT_TYPE:
                this.tempState['dropdownSelected'] = value;
                this.tempState['acc_type'] = value.value;
                break;
            case MICR_CODE:
                if (value.length <= 9 && !isNaN(value)) {
                    this.tempState['micr_code'] = value;
                }
                break;
            default:
                this.tempState[field.slug] = value;
                break
        }
        // console.log(value)

        this.setState({...this.state, ...this.tempState});

        window.setTimeout(() => {
            setBankDetail(that.state);
            this.validationHandler();
        }, 10)

    }

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
        const {history, changeLoader, showAlert, payload, preFlightResp} = this.props;

        changeLoader(true);
        let payloadData = {
            anchor_id: payload.anchor_id,
            loan_application_id: preFlightResp.loan_application_id,
            company_id: preFlightResp.company_id,
            success_url: payload.success_url,
            error_url: payload.error_url,
            cancel_url: payload.cancel_url,
        }
        let base64_encode = base64Logic(payloadData, 'encode');
        const resp = await generateToken();
        changeLoader(false);

        // console.log(JSON.stringify(resp));
        if (resp == 31)
            showAlert('net');

        if (checkObject(resp)) {
            // console.log(JSON.stringify(resp.data))
            if (resp.status === "success")
                setTimeout(
                    () =>
                        history.push(
                            `${PUBLIC_URL}/esign?payload=${base64_encode}&token=${
                                resp.auth.token
                                }`
                        ),
                    500
                );
        } else if (resp == 30) {
            showAlert("Something went wrong while creating Token", "warn");
        }

    };

    _formSubmit = async (e) => {
        e.preventDefault();
        const {changeLoader, token, payload, preFlightResp, history, showAlert} = this.props;
        // console.log(preFlightResp);
        const {bank_name, acc_name, acc_number, acc_type, ifsc_code, micr_code} = this.state;
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
            }

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
                showAlert(resp.data.message, 'warn');
            }

        } else showAlert("Something went wrong with the Request", "warn");
    };

    _fetchIFSC(ifsc) {
        const {changeLoader, showAlert, setBankDetail} = this.props;
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
                    this.setState({
                        bank_name,
                        micr_code,
                        branch_name
                    }, () => setBankDetail(this.state));
                    // console.log(resp);

                },
                resp => {
                    showAlert('net');
                    changeLoader(false);
                }
            );
    }

    componentWillMount() {
        const {payload, adharObj, history, businessObj} = this.props;

        if (checkObject(payload) && payload) {
            if (!checkObject(adharObj))
                history.push(`${PUBLIC_URL}/preapprove/personaldetail`);

            if (!checkObject(businessObj))
                history.push(`${PUBLIC_URL}/preapprove/businessdetail`);
        } else history.push(`${PUBLIC_URL}/preapprove/token`);
    }

    componentDidMount() {
        const {bankObj, setBankDetail, changeLoader, adharObj} = this.props;

        if (checkObject(adharObj)) {
            const {f_name, l_name} = adharObj;
            this.setState({acc_name: `${f_name} ${l_name}`}, () => setBankDetail(this.state));
        }
        if (checkObject(bankObj))
            this.setState(bankObj);
        else setBankDetail(this.state);

        // console.log(this.props.gstProfile)
        changeLoader(false);
        setTimeout(() => this.validationHandler(), 500);
        // console.log(this.props.adharObj);

    }


    render() {
        const {ACCOUNT_NAME, ACCOUNT_NUMBER, ACCOUNT_TYPE, BANK_NAME, BRANCH_NAME, IFSC, MICR_CODE} = bankValidations;

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
                        auto-debit/standing instructions for repayment of your loan amount.
                    </b>
                </p>
                {/*<h5 className={"text-center"}>{(gstProfile === Object(gstProfile)) ? gstProfile.lgnm : ''}</h5>*/}

                <form id="serverless-contact-form" onSubmit={e => this._formSubmit(e)}>
                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor={ACCOUNT_NAME.id} className={"bmd-label-floating"}>
                                    Account Name *
                                </label>
                                <input
                                    type={ACCOUNT_NAME.type}
                                    className="form-control font_weight"
                                    // placeholder="Email"
                                    title={ACCOUNT_NAME.title}
                                    autoCapitalize={ACCOUNT_NAME.autoCapitalize}
                                    id={ACCOUNT_NAME.id}
                                    pattern={regexTrim(ACCOUNT_NAME.pattern)}
                                    required={ACCOUNT_NAME.required}
                                    value={this.state.acc_name}
                                    // onBlur={() => this.validationErrorMsg()}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={e => this.onChangeHandler(ACCOUNT_NAME, e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor={ACCOUNT_NUMBER.id} className={"bmd-label-floating"}>
                                    Account Number *
                                </label>
                                <input
                                    type={ACCOUNT_NUMBER.type}
                                    className="form-control font_weight"
                                    // placeholder="Mobile Number"
                                    pattern={regexTrim(ACCOUNT_NUMBER.pattern)}
                                    title={ACCOUNT_NUMBER.title}
                                    id={ACCOUNT_NUMBER.id}
                                    required={ACCOUNT_NUMBER.required}
                                    value={this.state.acc_number}
                                    // onBlur={() => this.validationErrorMsg()}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={e => this.onChangeHandler(ACCOUNT_NUMBER, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor={IFSC.id} className="bmd-label-floating">
                                    IFSC *
                                </label>

                                <input
                                    type={IFSC.type}
                                    className="form-control font_weight text-capitalize"
                                    pattern={regexTrim(IFSC.pattern)}
                                    title={IFSC.title}
                                    autoCapitalize={IFSC.autoCapitalize}
                                    id={IFSC.id}
                                    required={IFSC.required}
                                    value={this.state.ifsc_code}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onBlur={() => {
                                        // this.validationErrorMsg();
                                        this._fetchIFSC(this.state.ifsc_code);
                                    }}
                                    onChange={e => this.onChangeHandler(IFSC, e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor={ACCOUNT_TYPE.id} className={"bmd-label-floating"}>
                                    Account Type *
                                </label>
                                <Select
                                    options={ACCOUNT_TYPE.options}
                                    required={true}
                                    value={this.state.dropdownSelected}
                                    id={ACCOUNT_TYPE.id}
                                    inputId={ACCOUNT_TYPE.id}
                                    // onBlur={() => this.validationErrorMsg()}
                                    onChange={e => this.onChangeHandler(ACCOUNT_TYPE, e)}
                                />
                                {/*<select style={{fontWeight: 600}}
                                        title="Please select Company Type"
                                        value={this.state.acc_type} required={true}
                                        onChange={(e) => {
                                            let {value} = e.target;
                                            this.setState({acc_type: value}, () => this.props.setBankDetail(this.state));
                                            this.validate.acc_type = (value.length > 0);
                                            this.handleValidation();
                                        }}
                                        onBlur={() => this.validationErrorMsg()}
                                        className="form-control font_weight" id="accountType">
                                    <option value={''}>Select Account Type</option>
                                    {
                                        Object.keys(accountType).map((key, index) =>
                                            (<option key={index} value={key}>{accountType[key]}</option>)
                                        )
                                    }
                                </select>*/}
                            </div>
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div
                                className="form-group mb-3"
                                style={{display: this.state.bank_name ? "block" : "none"}}
                            >
                                <label htmlFor={BANK_NAME.id} className={"bmd-label-floating"}>
                                    Bank Name *
                                </label>
                                <input
                                    type={BANK_NAME.type}
                                    className="form-control font_weight"
                                    // placeholder="Email"
                                    title={BANK_NAME.title}
                                    autoCapitalize={BANK_NAME.autoCapitalize}
                                    id={BANK_NAME.id}
                                    pattern={regexTrim(BANK_NAME.pattern)}
                                    required={BANK_NAME.required}
                                    disabled={BANK_NAME.disabled}
                                    value={this.state.bank_name}
                                    // onBlur={() => this.validationErrorMsg()}
                                    // ref={ref => (this.obj.pan = ref)}
                                    /*onChange={(e) => {
                                                          let {value} = e.target;
                                                          this.setState({bank_name: value}, () => this.props.setBankDetail(this.state));
                                                          this.validate.bank_name = (value.length > 0);
                                                          this.handleValidation();
                                                      }}*/
                                />
                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div
                                className="form-group mb-3"
                                style={{display: this.state.micr_code ? "block" : "none"}}
                            >
                                <label htmlFor={MICR_CODE.id} className="bmd-label-floating">
                                    MICR Code
                                </label>
                                <input
                                    type={MICR_CODE.type}
                                    className="form-control font_weight"
                                    pattern={regexTrim(MICR_CODE.pattern)}
                                    title={MICR_CODE.title}
                                    autoCapitalize={MICR_CODE.autoCapitalize}
                                    id={MICR_CODE.id}
                                    disabled={MICR_CODE.disabled}
                                    value={this.state.micr_code}
                                    // ref={ref => (this.obj.pan = ref)}
                                    // onBlur={() => this.validationErrorMsg()}
                                    onChange={e => this.onChangeHandler(MICR_CODE, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className={"row"}
                        style={{display: this.state.branch_name ? "block" : "none"}}
                    >
                        <div className={"col-sm-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor={BRANCH_NAME.id} className={"bmd-label-floating"}>
                                    Branch Name *
                                </label>
                                <input
                                    type={BRANCH_NAME.type}
                                    className="form-control font_weight"
                                    // placeholder="Email"
                                    title={BRANCH_NAME.title}
                                    pattern={regexTrim(BRANCH_NAME.pattern)}
                                    id={BRANCH_NAME.id}
                                    required={BRANCH_NAME.required}
                                    disabled={BRANCH_NAME.disabled}
                                    value={this.state.branch_name}
                                />
                            </div>
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
        {setBankDetail, changeLoader, setToken, showAlert}
    )(BankDetail)
);
