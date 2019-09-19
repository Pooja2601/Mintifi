import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {BusinessType} from "../../../shared/constants";
import {connect} from "react-redux";
import {setBusinessDetail, changeLoader, showAlert} from "../../../actions/index";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import {PrivacyPolicy, TnCPolicy} from "../../../shared/policy";
import Select from "react-select";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import {checkObject, regexTrim, fieldValidationHandler} from "../../../shared/common_logic";
import {validationBusinessDetails} from "./../../../shared/validations";

const {PUBLIC_URL} = process.env;

class BusinessDetail extends Component {

    static propTypes = {
        adharObj: PropTypes.object.isRequired,
        anchorObj: PropTypes.object,
        payload: PropTypes.object.isRequired,
        gstProfile: PropTypes.object
    };

    state = {
        companytype: '',
        gst: '',
        bpan: '',
        avgtrans: '',
        dealercode: '',
        missed_fields: true,
        lgnm: '',
        tnc_consent: false,
        tncModal: false,
        ctrerror: 4,
        optionSelected: {value: '', label: "Select Company Type"},
    };

    validate = {companytype: false, gst: false, avgtrans: false, dealercode: false};

    RenderModalTnC = () => {
        return (
            <>
                <button type="button" style={{visibility: 'hidden'}} ref={ref => this.triggerTnCModal = ref}
                        id={"triggerTnCModal"} data-toggle="modal"
                        data-target="#TnCMsgModal">
                </button>

                <div className="modal fade" id={"TnCMsgModal"} tabIndex="-1"
                     role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document" style={{margin: '5.75rem auto'}}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{(this.state.tncModal) ? 'Terms and Conditions' : 'Privacy policy'}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {(this.state.tncModal) ? TnCPolicy({fontSize: 13}) : PrivacyPolicy({
                                    fontSize: 13,
                                    headSize: 1.5
                                })}

                            </div>
                            <div className="modal-footer">
                                {/*<button type="button" className="btn btn-primary">Save changes</button>*/}
                                <button type="button" className="btn btn-primary" ref={ref => this.closeModal = ref}
                                        data-dismiss="modal">Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>);
    };

    _formSubmit(e) {
        e.preventDefault();
        // this.props.setBusinessDetail(this.state);
        setTimeout(() => {
            this.props.history.push(`${PUBLIC_URL}/preapprove/finalize`);
        });
    }


    // ToDo : should be independent of a field
    validationHandler = () => {
        const {showAlert} = this.props;

        const lomo = fieldValidationHandler({
            showAlert: showAlert,
            validations: validationBusinessDetails,
            localState: this.state
        });

        this.setState({missed_fields: lomo}); // true : for disabling
    }


    onChangeHandler = (field, value) => {
        // debugger;
        let that = this, regex, doby;
        const {setBusinessDetail} = this.props;
        // fields is Equivalent to F_NAME , L_NAME... thats an object

        // ToDo : comment those that are not required
        const {COMPANY_NAME, COMPANY_TYPE, GST_NUMBER, PAN_NUMBER, AVERAGE_TRANSACTION, DEALER_CODE} = validationBusinessDetails;

        this.tempState = Object.assign({}, this.state);
        switch (field) {

            case COMPANY_TYPE:
                this.tempState['optionSelected'] = value;
                this.tempState['companytype'] = value.value;
                break;
            case GST_NUMBER:
                if (value.length <= 15) {
                    let bpan = value.substr(2, 10);
                    this.tempState['gst'] = value;
                    this.tempState['bpan'] = bpan;
                }
                break;
            case PAN_NUMBER:
                if (value.length <= 10)
                    this.tempState['bpan'] = value;
                break;
            case AVERAGE_TRANSACTION:
                if (value.length <= 10 && !isNaN(value))
                    this.tempState['avgtrans'] = value;

                break;
            case DEALER_CODE:
                if (value.length <= 10)
                    this.tempState['dealercode'] = value;
                break;
            default:
                this.tempState[field.slug] = value;
                break;
        }

        this.setState({...this.state, ...this.tempState});

        window.setTimeout(() => {
            setBusinessDetail(that.state);
            this.validationHandler();
        }, 10)

    }

    componentWillMount() {
        const {payload, adharObj, changeLoader, history} = this.props;

        if (checkObject(payload)) {
            if (!checkObject(adharObj))
                history.push(`${PUBLIC_URL}/preapprove/personaldetail`);

        } else history.push(`${PUBLIC_URL}/preapprove/token`);

        // console.log(this.props.gstProfile)
        changeLoader(false);
    }

    componentDidMount() {
        const {businessObj, payload, setBusinessDetail} = this.props;
        // console.log(adharObj);

        const {GST_NUMBER} = validationBusinessDetails;

        if (checkObject(businessObj)) {

            this.setState(businessObj, () => this.onChangeHandler(GST_NUMBER, businessObj.gst));

        } else setBusinessDetail(this.state);

        try {
            /*  if (gstProfile === Object(gstProfile))
                  if (gstProfile.length) {
                      BusinessType.map((val, key) => {
                          (`/${val}/gi`).test(gstProfile.ctb);
                      });
                      this.setState({gst: gstProfile.gstin, lgnm: gstProfile.lgnm});
                  }*/
            if (checkObject(payload)) {
                this.setState({dealercode: payload.distributor_dealer_code}, () => setBusinessDetail(this.state));
            }

        } catch (e) {
            console.log(e);
        }

        setTimeout(() => this.validationHandler(), 1000);

    }


    render() {

        const gstProfile = this.props.gstProfile;
        const {COMPANY_NAME, COMPANY_TYPE, GST_NUMBER, PAN_NUMBER, AVERAGE_TRANSACTION, DEALER_CODE} = validationBusinessDetails
        return (
            <>
                {/*<Link to={`${PUBLIC_URL}/preapprove/personaldetails`} className={"btn btn-link"}>Go Back </Link>*/}

                <h4 className={"text-center mt-5"}>Business Details</h4>
                <h5 className="paragraph_styling  text-center secondLinePara">
                    <b> Please submit your business details to complete the loan application.</b>
                </h5>
                <br/>
                {/*<h5 className={"text-center"}>{(gstProfile === Object(gstProfile)) ? gstProfile.lgnm : ''}</h5>*/}

                <form
                    id="serverless-contact-form"
                    onSubmit={e => this._formSubmit(e)}
                >
                    <div className={"row"}
                         style={{visibility: (checkObject(gstProfile) && gstProfile.lgnm) ? 'visible' : 'hidden'}}>
                        <div className={"col-md-12 col-sm-12 col-xs-12"}>
                            {/*<h5 className={"text-center"}>{(gstProfile === Object(gstProfile)) ? gstProfile.lgnm : ''}</h5>*/}
                            <input
                                type={COMPANY_NAME.type}
                                className="form-control font_weight p-2"
                                title={COMPANY_NAME.title}
                                autoCapitalize={COMPANY_NAME.autoCapitalize}
                                id={COMPANY_NAME.id}
                                required={COMPANY_NAME.required}
                                value={(checkObject(gstProfile)) ? gstProfile.lgnm : ''}
                                readOnly={COMPANY_NAME.readOnly}
                                disabled={COMPANY_NAME.disabled}
                            />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor="companyType" className={"bmd-label-floating"}>Company Type *</label>
                                <Select options={COMPANY_TYPE.options}
                                        required={COMPANY_TYPE.required}
                                        id={COMPANY_TYPE.id}
                                        inputId={COMPANY_TYPE.inputId}
                                        value={this.state.optionSelected}
                                        onChange={(e) => this.onChangeHandler(COMPANY_TYPE, e)}

                                />
                                {/*<select style={{fontWeight: 600}}
                                        title="Please select Company Type"
                                        value={this.state.companytype} required={true}
                                        onChange={(e) => {
                                            let {value} = e.target;
                                            this.setState({companytype: value}, () => this.props.setBusinessDetail(this.state));
                                            this.validate.companytype = (value.length > 0);
                                            this.handleValidation();
                                        }}
                                        onBlur={() => this.validationErrorMsg()}
                                        className="form-control font_weight" id="companyType">
                                    <option value={''}>Select Company Type</option>
                                    {
                                        Object.keys(BusinessType).map((key, index) =>
                                            (<option key={index} value={key}>{BusinessType[key]}</option>)
                                        )
                                    }
                                </select>*/}

                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor="numberGST" className={"bmd-label-floating"}>GST Number *</label>
                                <input
                                    type={GST_NUMBER.type}
                                    className="form-control font_weight"
                                    // placeholder="Mobile Number"
                                    pattern={regexTrim(GST_NUMBER.pattern)}
                                    title={GST_NUMBER.title}
                                    autoCapitalize={GST_NUMBER.autoCapitalize}
                                    id={GST_NUMBER.id}
                                    required={GST_NUMBER.required}
                                    value={this.state.gst}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => this.onChangeHandler(GST_NUMBER, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {(this.state.companytype !== "proprietorship" && this.state.companytype !== "") ? (
                        <div className="form-group mb-3 ">
                            <label htmlFor="numberPAN" className={"bmd-label-floating"}>Business PAN *</label>
                            <input
                                type={PAN_NUMBER.type}
                                className="form-control font_weight p-2"
                                // placeholder="Email"
                                pattern={regexTrim(PAN_NUMBER.pattern)}
                                title={PAN_NUMBER.title}
                                autoCapitalize={PAN_NUMBER.autoCapitalize}
                                id={PAN_NUMBER.id}
                                required={PAN_NUMBER.required}
                                value={this.state.bpan}
                                readOnly={PAN_NUMBER.readOnly}
                                disabled={PAN_NUMBER.disabled}
                                // ref={ref => (this.obj.pan = ref)}
                                onChange={(e) => this.onChangeHandler(PAN_NUMBER, e.target.value)}
                            />
                        </div>
                    ) : <></>}


                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor="avgTrans" className="bmd-label-floating">
                                    Average Monthly Transactions *
                                </label>
                                <div className={"input-group"}>
                                    <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon3">
                    ₹
                  </span>
                                    </div>
                                    <input
                                        type={AVERAGE_TRANSACTION.type}
                                        className="form-control font_weight prependInput"
                                        pattern={regexTrim(AVERAGE_TRANSACTION.pattern)}
                                        title={AVERAGE_TRANSACTION.title}
                                        autoCapitalize={AVERAGE_TRANSACTION.autoCapitalize}
                                        id={AVERAGE_TRANSACTION.id}
                                        required={AVERAGE_TRANSACTION.required}
                                        value={this.state.avgtrans}
                                        style={{marginLeft: '-0.5rem'}}
                                        // ref={ref => (this.obj.pan = ref)}
                                        onChange={(e) => this.onChangeHandler(AVERAGE_TRANSACTION, e.target.value)}

                                    />
                                </div>
                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor="dealerCode" className="bmd-label-floating">
                                    Dealer Code
                                </label>
                                <input
                                    type={DEALER_CODE.type}
                                    className="form-control font_weight"
                                    pattern={regexTrim(DEALER_CODE.pattern)}
                                    title={DEALER_CODE.title}
                                    autoCapitalize={DEALER_CODE.autoCapitalize}
                                    id={DEALER_CODE.id}
                                    required={DEALER_CODE.required}
                                    value={this.state.dealercode}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => this.onChangeHandler(DEALER_CODE, e.target.value)}

                                />
                            </div>
                        </div>
                    </div>
                    <div className=" mt-5">

                        <label className="main">I accept the <a href={'#'} onClick={(e) => {
                            e.preventDefault();
                            this.setState({tncModal: true}, () => this.triggerTnCModal.click());
                        }}>Terms &
                            Condition</a>, <a href={'#'} onClick={(e) => {
                            e.preventDefault();
                            this.setState({tncModal: false}, () => this.triggerTnCModal.click());
                        }}>Privacy
                            Policy</a> of the Mintifi and provide the
                            consent to retrieve the Bureau information for checking my Credit worthiness .
                            <input type="checkbox" onChange={(e) =>
                                this.setState(prevState => ({tnc_consent: !prevState.tnc_consent}))
                            } checked={this.state.tnc_consent}/>
                            <span className="geekmark"></span>
                        </label>
                    </div>

                    <div className="mt-5 mb-5 text-center">
                        <button
                            type="submit"
                            disabled={this.state.missed_fields || !this.state.tnc_consent}
                            onClick={e => this._formSubmit(e)}
                            className="form-submit btn btn-raised greenButton"
                        >Check your eligibility
                        </button>
                    </div>
                    {/*<div style={{display: (this.state.missed_fields) ? 'block' : 'none'}}
                         className={"alert alert-error"}>
                        Check {this.state.ctrerror} fields for the error, you might have missed something !
                    </div>*/}
                </form>
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

export default withRouter(connect
(mapStateToProps, {setBusinessDetail, changeLoader, showAlert})
(BusinessDetail));
