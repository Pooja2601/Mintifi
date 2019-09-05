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
import {changeLoader, setToken, showAlert, EsignsetBankDetail, EnachsetPayload} from "../../../actions";
import {withRouter} from "react-router-dom";
import {alertModule, retrieveParam} from "../../../shared/commonLogic";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import {fetchAPI, apiActions, postAPI} from "../../../api";

const {PUBLIC_URL} = process.env;

class ESignBankDetail extends Component {

    static propTypes = {
        anchorObj: PropTypes.object,
        eSignPayload: PropTypes.object.isRequired,
        showAlert: PropTypes.func,
        changeLoader: PropTypes.func
    };

    state = {
        acc_type: "",
        bank_name: "",
        acc_number: "",
        acc_name: "",
        ifsc_code: "",
        micr_code: "",
        branch_name: ""
    };

    validate = {
        acc_type: false,
        // bank_name: false,
        acc_number: false,
        acc_name: false,
        ifsc_code: false
        // micr_code: false,
    };

    validationErrorMsg = () => {
        let ctrerror = 4,
            fieldTxt;
        Object.values(this.validate).map((val, key) => {
            if (!val) ++ctrerror;
            else --ctrerror;
        });
        if (ctrerror !== 0) {
            fieldTxt = ctrerror > 1 ? "field is " : "fields are ";
            // alertModule(`Kindly check the form again, ${ctrerror / 2} ${fieldTxt} still having some issue !`, 'warn');
        }
    };

    handleValidation = () => {
        let ctrerror = 4,
            missed_fields;
        // let missed_fields = Object.keys(this.validate).some(x => this.validate[x]);
        Object.values(this.validate).map((val, key) => {
            if (!val) ++ctrerror;
            else --ctrerror;
            // console.log(val);
        });
        console.log(ctrerror);
        missed_fields = ctrerror !== 0;
        this.setState({missed_fields});
        // this.setState({missed_fields}, () => console.log('All Fields Validated : ' + this.state.missed_fields));
    };


    _createMandate = async (base64_encode) => {
        const {changeLoader, token, showAlert, history, eSignPayload, EnachsetPayload} = this.props;

        let nachObject = {};
        changeLoader(true);
        const options = {
            URL: `${baseUrl}/setup_mandate`,
            data: {
                "app_id": app_id,
                "loan_application_id": eSignPayload.loan_application_id,
            },
            token: token
        };
        const resp = await postAPI(options);
        changeLoader(false);
        if (resp.status === apiActions.ERROR_NET)
            showAlert('net');
        if (resp.status === apiActions.ERROR_RESPONSE)
            showAlert('We couldn`t setup the mandate, you may try the physical NACH process', 'warn');
        else if (resp.status === apiActions.SUCCESS_RESPONSE) {
            showAlert('e-Mandate created successfully', 'success');
            nachObject = Object.assign(eSignPayload, resp.data);
            EnachsetPayload(nachObject);
        }
        setTimeout(() =>
            history.push(
                `${PUBLIC_URL}/enach?payload=${nachObject}&token=${token}`), 50);
    }

    _formSubmit = async e => {
        e.preventDefault();
        const {changeLoader, token, showAlert, history, eSignPayload} = this.props;
        // console.log(preFlightResp);
        if (eSignPayload === Object(eSignPayload) && eSignPayload) {
            const {bank_name, acc_number, acc_name, ifsc_code, micr_code, acc_type} = this.state;
            changeLoader(true);

            const options = {
                URL: `${baseUrl}/bank_account`,
                token: token,
                data: {
                    app_id: app_id,
                    loan_application_id: eSignPayload.loan_application_id,
                    company_id: eSignPayload.company_id,
                    anchor_id: eSignPayload.anchor_id,
                    bank_name: bank_name,
                    account_number: acc_number,
                    account_name: acc_name,
                    ifsc_code: ifsc_code,
                    transfer_mode: "nach",
                    micr_code: micr_code,
                    account_type: acc_type,
                    success_url: eSignPayload.success_url,
                    error_url: eSignPayload.error_url,
                    cancel_url: eSignPayload.cancel_url,
                    timestamp: new Date()
                }
            }

            const resp = await postAPI(options);
            changeLoader(false);

            if (resp.status === apiActions.ERROR_NET)
                showAlert('net');
            if (resp.status === apiActions.ERROR_RESPONSE) {
                showAlert(resp.data.message, "warn");
            } else if (resp.status === apiActions.SUCCESS_RESPONSE) {
                let base64_encode = retrieveParam(
                    resp.data.payload,
                    "payload"
                );
                this._createMandate(base64_encode);
            }

        } else showAlert("Something went wrong with the Request", "warn");
    };

    _fetchIFSC = async (ifsc) => {
        const {changeLoader, showAlert, EsignsetBankDetail} = this.props;
        let bank_name, micr_code, branch_name;

        changeLoader(true);

        // ToDo : Suggestion : Only meant for External URL
        fetch(`https://ifsc.razorpay.com/${ifsc}`)
            .then(resp => resp.json())
            .then(resp => {
                if (resp !== Object(resp)) {
                    bank_name = micr_code = branch_name = "";
                    showAlert("Make sure to enter correct IFSC code", "error");
                } else {
                    bank_name = resp.BANK;
                    // ifsc_code = resp.IFSC;
                    micr_code = resp.MICR;
                    branch_name = resp.BRANCH;
                }
                this.setState({
                    bank_name,
                    micr_code,
                    branch_name
                }, () => EsignsetBankDetail(this.state));

                changeLoader(false);
            }, () => {
                changeLoader(false);
            });

        changeLoader(false);


    }

    // ToDo : Fetch bank details
    _fetchBankDetails = async () => {

        const {changeLoader, token, eSignPayload, showAlert, EsignsetBankDetail} = this.props;
        const paramReq = `app_id=${app_id}&loan_application_id=${eSignPayload.loan_application_id}`;
        const options = {URL: `${baseUrl}/bank_account_details?${paramReq}`, token: token};
        let that = this;
        changeLoader(true);
        const resp = await fetchAPI(options);
        changeLoader(false);

        if (resp.status === apiActions.ERROR_NET)
            showAlert('net');
        // Doesn't require to check if error
        // if(resp.status === apiActions.ERROR_RESPONSE)

        if (resp.status === apiActions.SUCCESS_RESPONSE) {
            const {
                bank_name,
                bank_account_name,
                bank_account_number,
                bank_ifsc_code,
                transfer_mode,
                account_type,
                bank_micr_code,
            } = resp.data;
            this.setState({
                acc_type: account_type && account_type,
                transfer_mode,
                bank_name,
                acc_number: bank_account_number && bank_account_number,
                acc_name: bank_account_name && bank_account_name,
                ifsc_code: bank_ifsc_code && bank_ifsc_code,
                micr_code: bank_micr_code && bank_micr_code,
            });

            window.setTimeout(() => {

                if (bank_ifsc_code) {
                    that._fetchIFSC(that.state.ifsc_code);
                    that.validate.ifsc_code = that.state.ifsc_code.length === 11;
                    that.validate.acc_name = that.state.acc_name.length > 2;
                    that.validate.acc_number =
                        that.state.acc_number.length >= 9 && that.state.acc_number.length <= 18;
                    that.validate.acc_type = false;
                }
                window.setTimeout(() => that.handleValidation(), 50);
                EsignsetBankDetail(that.state);
            }, 50);

        }
    }

    componentWillMount() {
        const {eSignPayload, history} = this.props;

        if (eSignPayload === Object(eSignPayload) && eSignPayload) {
            // history.push(`${PUBLIC_URL}/esign`);
            this._fetchBankDetails();
        } else history.push(`${PUBLIC_URL}/esign`);
    }

    componentDidMount() {
        const {bankObj, EsignsetBankDetail, changeLoader} = this.props;

        if (bankObj === Object(bankObj))
            this.setState(bankObj, () => {
                Object.keys(this.state).map((val, key) => {
                    if (this.validate[val] !== undefined)
                        this.validate[val] = this.state[val].length > 0;
                    // console.log(this.validate);
                });
            });
        else EsignsetBankDetail(this.state);

        changeLoader(false);
        setTimeout(() => this.handleValidation(), 500);
    }

    render() {

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
                                <label htmlFor="nameAccount" className={"bmd-label-floating"}>
                                    Account Name *
                                </label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Email"
                                    title="Please enter Account Name"
                                    autoCapitalize="characters"
                                    id="nameAccount"
                                    required={true}
                                    value={this.state.acc_name}
                                    onBlur={() => this.validationErrorMsg()}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={e => {
                                        let {value} = e.target;
                                        this.validate.acc_name = value.length > 2;
                                        this.setState({acc_name: value}, () =>
                                            this.props.EsignsetBankDetail(this.state)
                                        );
                                        this.handleValidation();
                                    }}
                                />
                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor="numberAccount" className={"bmd-label-floating"}>
                                    Account Number *
                                </label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Mobile Number"
                                    pattern="^[0-9]{9,18}$"
                                    title="Please enter Account Number"
                                    autoCapitalize="characters"
                                    id="numberAccount"
                                    required={true}
                                    value={this.state.acc_number}
                                    onBlur={() => this.validationErrorMsg()}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={e => {
                                        let {value} = e.target;
                                        if (!isNaN(value)) {
                                            this.validate.acc_number =
                                                value.length >= 9 && value.length <= 18;
                                            if (value.length <= 18) {
                                                this.setState({acc_number: value}, () =>
                                                    this.props.EsignsetBankDetail(this.state)
                                                );
                                                this.handleValidation();
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor="ifscCode" className="bmd-label-floating">
                                    IFSC *
                                </label>

                                <input
                                    type="text"
                                    className="form-control font_weight text-capitalize"
                                    pattern="^[A-Za-z]{4}\d{7}$"
                                    title="Enter Average monthly Transactions"
                                    autoCapitalize="characters"
                                    id="ifscCode"
                                    required={true}
                                    value={this.state.ifsc_code}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onBlur={() => {
                                        this.validationErrorMsg();
                                        this._fetchIFSC(this.state.ifsc_code);
                                    }}
                                    onChange={e => {
                                        let {value} = e.target;
                                        this.validate.ifsc_code = value.length === 11;
                                        if (value.length <= 11) {
                                            this.setState({ifsc_code: value}, () =>
                                                this.props.EsignsetBankDetail(this.state)
                                            );
                                            this.handleValidation();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor="accountType" className={"bmd-label-floating"}>
                                    Account Type *
                                </label>
                                <Select
                                    options={accountType}
                                    required={true}
                                    id="accountType"
                                    inputId={"accountType"}
                                    onBlur={() => this.validationErrorMsg()}
                                    onChange={e => {
                                        let {value} = e;
                                        this.setState({acc_type: value}, () =>
                                            this.props.EsignsetBankDetail(this.state)
                                        );
                                        this.validate.acc_type = value.length > 0;
                                        this.handleValidation();
                                    }}
                                />
                                {/*<select style={{fontWeight: 600}}
                                        title="Please select Company Type"
                                        value={this.state.acc_type} required={true}
                                        onChange={(e) => {
                                            let {value} = e.target;
                                            this.setState({acc_type: value}, () => this.props.EsignsetBankDetail(this.state));
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
                                <label htmlFor="nameBank" className={"bmd-label-floating"}>
                                    Bank Name *
                                </label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Email"
                                    title="Please enter Bank Name"
                                    autoCapitalize="characters"
                                    id="nameBank"
                                    required={true}
                                    disabled={true}
                                    value={this.state.bank_name}
                                    // onBlur={() => this.validationErrorMsg()}
                                    // ref={ref => (this.obj.pan = ref)}
                                    /*onChange={(e) => {
                                                          let {value} = e.target;
                                                          this.setState({bank_name: value}, () => this.props.EsignsetBankDetail(this.state));
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
                                <label htmlFor="micrCode" className="bmd-label-floating">
                                    MICR Code
                                </label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    pattern="^[0-9]{9}$"
                                    title="Enter MICR Code"
                                    autoCapitalize="characters"
                                    id="micrCode"
                                    disabled={true}
                                    value={this.state.micr_code}
                                    // ref={ref => (this.obj.pan = ref)}
                                    // onBlur={() => this.validationErrorMsg()}
                                    onChange={e => {
                                        let {value} = e.target;
                                        this.validate.micr_code = value.length === 9;
                                        if (value.length <= 9 && !isNaN(value)) {
                                            this.setState({micr_code: value}, () =>
                                                this.props.EsignsetBankDetail(this.state)
                                            );
                                            // this.handleValidation();
                                        }
                                    }}
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
                                <label htmlFor="nameBranch" className={"bmd-label-floating"}>
                                    Branch Name *
                                </label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Email"
                                    title="Please enter Branch Name"
                                    id="nameBranch"
                                    required={true}
                                    disabled={true}
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
    token: state.eSignReducer.token,
    eSignPayload: state.eSignReducer.eSignPayload,
    bankObj: state.eNachReducer.bankObj,
    anchorObj: state.eSignReducer.anchorObj
});

export default withRouter(
    connect(
        mapStateToProps,
        {EsignsetBankDetail, changeLoader, setToken, showAlert, EnachsetPayload}
    )(ESignBankDetail)
);
