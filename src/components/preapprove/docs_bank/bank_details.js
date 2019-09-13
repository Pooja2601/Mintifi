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
import {alertModule, retrieveParam, generateToken} from "../../../shared/common_logic";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import {fetchAPI, apiActions, postAPI} from "../../../api";
import {checkObject} from "../../../shared/common_logic";


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
        // console.log(ctrerror);
        missed_fields = ctrerror !== 0;
        this.setState({missed_fields});
        // this.setState({missed_fields}, () => console.log('All Fields Validated : ' + this.state.missed_fields));
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

    _genAuthToken = async (base64_encode) => {
        const {history, changeLoader, showAlert} = this.props;
        changeLoader(true);
        /*        const options = {
                    token: null,
                    URL: `${baseUrl}/auth`,
                    data: {
                        app_id: app_id,
                        user_id: user_id,
                        secret_key: auth_secret,
                        type: "react_web_user"
                    }
                }*/
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
            showAlert("Something went while creating Token", "warn");
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
                let base64_encode = retrieveParam(
                    resp.data.payload,
                    "payload"
                );
                // console.log(base64_encode);
                this._genAuthToken(base64_encode);
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

        if (checkObject(bankObj))
            this.setState(bankObj, () => {
                Object.keys(this.state).map((val, key) => {
                    if (this.validate[val] !== undefined)
                        this.validate[val] = this.state[val].length > 0;
                    if (val == 'acc_type')
                        this.validate[val] = false;
                    // console.log(this.validate);
                });
            });
        else setBankDetail(this.state);

        if (checkObject(adharObj)) {
            const {f_name, l_name} = adharObj;
            this.setState({acc_name: `${f_name} ${l_name}`}, () => setBankDetail(this.state));

        }


        // console.log(this.props.gstProfile)
        changeLoader(false);
        setTimeout(() => this.handleValidation(), 500);
        // console.log(this.props.adharObj);
    }

    render() {
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
                                        this.validate.acc_name = value.length > 3;
                                        this.setState({acc_name: value}, () =>
                                            this.props.setBankDetail(this.state)
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
                                                    this.props.setBankDetail(this.state)
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
                                                this.props.setBankDetail(this.state)
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
                                            this.props.setBankDetail(this.state)
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
                                                this.props.setBankDetail(this.state)
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
