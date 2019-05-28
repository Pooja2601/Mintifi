import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl, accountType, loanUrl} from "../../../shared/constants";
import {connect} from "react-redux";
import {setBankDetail, changeLoader} from "../../../actions/index";
import {Link, withRouter} from "react-router-dom";
import {alertModule} from "../../../shared/commonLogic";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select'

class BankDetail extends Component {

    state = {
        acc_type: "sa",
        bank_name: '',
        acc_number: '',
        acc_name: '',
        ifsc_code: '',
        micr_code: "",
    };

    validate = {
        acc_type: false,
        bank_name: false,
        acc_number: false,
        acc_name: false,
        ifsc_code: false,
        micr_code: false,
    };

    validationErrorMsg = () => {
        let ctrerror = 4, fieldTxt;
        Object.values(this.validate).map((val, key) => {
            if (!val)
                ++ctrerror;
            else --ctrerror;
        });
        if (ctrerror !== 0) {
            fieldTxt = (ctrerror > 1) ? 'field is ' : 'fields are ';
            alertModule(`Kindly check the form again, ${ctrerror / 2} ${fieldTxt} still having some issue !`, 'warn');
        }
    };

    handleValidation = () => {
        let ctrerror = 4, missed_fields;
        // let missed_fields = Object.keys(this.validate).some(x => this.validate[x]);
        Object.values(this.validate).map((val, key) => {
            if (!val)
                ++ctrerror;
            else --ctrerror;
            // console.log(val);
        });
        console.log(ctrerror);
        missed_fields = (ctrerror !== 0);
        this.setState({missed_fields}, () => console.log('All Fields Validated : ' + this.state.missed_fields));

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

    submitForm(e) {
        e.preventDefault();
        const {changeLoader, token, payload, preFlightResp} = this.props;
        changeLoader(true);
        fetch(`${baseUrl}/bank_account`, {
            method: "POST",
            headers: {"Content-Type": "application/json", "token": token},
            body: JSON.stringify({
                "app_id": 3,
                "loan_application_id": preFlightResp.loan_application_id,
                "company_id": 2,
                "anchor_id": payload.anchor_id,
                "bank_name": this.state.bank_name,
                "account_number": this.state.acc_number,
                "account_name": this.state.acc_name,
                "ifsc_code": this.state.ifsc_code,
                "transfer_mode": "nach",
                "micr_code": this.state.micr_code,
                "account_type": this.state.acc_type,
                "timestamp": new Date()
            })
        }).then((resp) => {
            changeLoader(true);
            // success
            if (resp.response === Object(resp.response)) {
                // resp.response.mandate_id

            }
            // error
            if (resp.error === Object(resp.error)) {
                alertModule(resp.error.message, 'warn');
            }

        }, (resp) => {
            alertModule();
            changeLoader(false);
        })
    }

    _fetchIFSC(ifsc) {
        changeLoader(true);
        fetch(`https://ifsc.razorpay.com/${ifsc}`).then(resp => resp.json()).then((resp) => {
            changeLoader(false);
            if (resp === Object(resp)) {
                this.setState({
                    bank_name: resp.BANK,
                    ifsc_code: resp.IFSC,
                    micr_code: resp.MICR
                });
            }
            // console.log(resp);
        }, (resp) => {
            alertModule();
            changeLoader(false);
        });
    }


    componentWillMount() {
        const {bankObj, gstProfile, payload, adharObj, setBankDetail, changeLoader} = this.props;

        if (payload !== Object(payload))
            if (adharObj !== Object(adharObj))
                if (adharObj.verified)
                    this.props.history.push("/preapprove/token");

        if (bankObj === Object(bankObj))
            this.setState(bankObj, () => {
                Object.keys(this.state).map((val, key) => {
                    if (this.validate[val] !== undefined)
                        this.validate[val] = (this.state[val].length > 0);
                    // console.log(this.validate);
                });
            });
        else setBankDetail(this.state);

        // console.log(this.props.gstProfile)
        changeLoader(false);
    }

    componentDidMount() {
        setTimeout(() => this.handleValidation(), 500);
        // console.log(this.props.adharObj);
    }

    render() {
        const gstProfile = this.props.gstProfile;
        return (
            <>
                {/*<Link to={'/preapprove/personaldetails'} className={"btn btn-link"}>Go Back </Link>*/}
                <br/><br/>
                <h4 className={"text-center"}>Bank Details</h4>
                <p className="paragraph_styling  text-center">
                    <b> Please submit your Bank details to help us to disburse your loan into your account.</b>
                </p>
                {/*<h5 className={"text-center"}>{(gstProfile === Object(gstProfile)) ? gstProfile.lgnm : ''}</h5>*/}

                <form
                    id="serverless-contact-form"
                    onSubmit={e => this._formSubmit(e)}
                >
                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor="nameAccount" className={"bmd-label-floating"}>Account Name *</label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Email"
                                    style={{fontWeight: 600}}
                                    title="Please enter Account Name"
                                    autoCapitalize="characters"
                                    id="nameAccount"
                                    required={true}
                                    value={this.state.acc_name}
                                    onBlur={() => this.validationErrorMsg()}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => {
                                        let {value} = e.target;
                                        this.validate.acc_name = (value.length > 5);
                                        this.setState({acc_name: value}, () => this.props.setBankDetail(this.state));
                                        this.handleValidation();
                                    }}
                                />
                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor="numberAccount" className={"bmd-label-floating"}>Account Number *</label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Mobile Number"
                                    style={{fontWeight: 600}}
                                    pattern="^[0-9]{9,18}$"
                                    title="Please enter Account Number"
                                    autoCapitalize="characters"
                                    id="numberAccount"
                                    required={true}
                                    value={this.state.acc_number}
                                    onBlur={() => this.validationErrorMsg()}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => {
                                        let {value} = e.target;
                                        if (!isNaN(value)) {
                                            this.validate.acc_number = (value.length >= 9 && value.length <= 18);
                                            if (value.length <= 18) {
                                                this.setState({acc_number: value}, () => this.props.setBankDetail(this.state));
                                                this.handleValidation();
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-12"}>
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
                                        this._fetchIFSC(this.state.ifsc_code)
                                    }}
                                    onChange={(e) => {
                                        let {value} = e.target;
                                        this.validate.ifsc_code = (value.length === 11);
                                        if (value.length <= 11) {
                                            this.setState({ifsc_code: value}, () => this.props.setBankDetail(this.state));
                                            this.handleValidation();
                                        }
                                    }}
                                />

                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor="accountType" className={"bmd-label-floating"}>Account Type *</label>
                                <Select options={accountType}
                                         required={true}
                                        id="accountType"
                                        inputId={"accountType"}
                                        onBlur={() => this.validationErrorMsg()}
                                        onChange={(e) => {
                                            let {value} = e;
                                            this.setState({acc_type: value}, () => this.props.setBankDetail(this.state));
                                            this.validate.acc_type = (value.length > 0);
                                            this.handleValidation();
                                        }}/>
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
                        <div className={"col-md-6 col-sm-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor="nameBank" className={"bmd-label-floating"}>Bank Name *</label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Email"
                                    style={{fontWeight: 600}}
                                    title="Please enter Bank Name"
                                    autoCapitalize="characters"
                                    id="nameBank"
                                    required={true}
                                    value={this.state.bank_name}
                                    onBlur={() => this.validationErrorMsg()}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => {
                                        let {value} = e.target;
                                        this.setState({bank_name: value}, () => this.props.setBankDetail(this.state));
                                        this.validate.bank_name = (value.length > 0);
                                        this.handleValidation();
                                    }}
                                />
                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor="micrCode" className="bmd-label-floating">
                                    MICR Code
                                </label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    style={{fontWeight: 600}}
                                    pattern="^[0-9]{9}$"
                                    title="Enter MICR Code"
                                    autoCapitalize="characters"
                                    id="micrCode"
                                    // required={true}
                                    value={this.state.micr_code}
                                    // ref={ref => (this.obj.pan = ref)}
                                    // onBlur={() => this.validationErrorMsg()}
                                    onChange={(e) => {
                                        let {value} = e.target;
                                        this.validate.micr_code = (value.length === 9);
                                        if (value.length <= 9 && !isNaN(value)) {
                                            this.setState({micr_code: value}, () => this.props.setBankDetail(this.state));
                                            // this.handleValidation();
                                        }

                                    }}
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
                        >Submit Records
                        </button>
                    </div>
                </form>
            </>
        );
    }
}

const mapStateToProps = state => ({
    adharObj: state.adharDetail.adharObj,
    payload: state.authPayload.payload,
    businessObj: state.businessDetail.businessObj,
    gstProfile: state.businessDetail.gstProfile,
    bankObj: state.businessDetail.bankObj
});

export default withRouter(connect
(mapStateToProps, {setBankDetail, changeLoader})
(BankDetail));
