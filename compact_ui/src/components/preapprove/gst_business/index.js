import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import { BusinessType} from "../../../shared/constants";
import {connect} from "react-redux";
import {setBusinessDetail, changeLoader} from "../../../actions/index";
import { withRouter} from "react-router-dom";
// import {alertModule} from "../../../shared/commonLogic";
import {PrivacyPolicy, TnCPolicy} from "../../../shared/policy";
import Select from "react-select";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

const {PUBLIC_URL} = process.env;

class BusinessDetail extends Component {

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
                    <div className="modal-dialog" role="document" style={{margin: '5.75rem auto'}}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{(this.state.tncModal) ? 'Terms and Conditions' : 'Privacy policy'}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{padding:'12px 15px 5px'}}>
                                {(this.state.tncModal) ? TnCPolicy({fontSize: 10}) : PrivacyPolicy({
                                    fontSize: 10,
                                    headSize: 1
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

    validationErrorMsg = () => {
        let ctrerror = 4, fieldTxt;
        Object.values(this.validate).map((val, key) => {
            if (!val)
                ++ctrerror;
            else --ctrerror;
        });
        this.setState({ctrerror});

        if (ctrerror !== 0) {
            fieldTxt = (ctrerror > 1) ? 'field is ' : 'fields are ';
            // alertModule(`Kindly check the form again, ${ctrerror / 2} ${fieldTxt} still having some issue !`, 'warn');
        }
    }

    handleValidation = () => {
        let ctrerror = 4, missed_fields;
        // let missed_fields = Object.keys(this.validate).some(x => this.validate[x]);
        Object.values(this.validate).map((val, key) => {
            if (!val)
                ++ctrerror;
            else --ctrerror;
            // console.log(val);
        });
        // console.log(ctrerror);
        missed_fields = (ctrerror !== 0);
        this.setState({missed_fields}, () => console.log('All Fields Validated : ' + this.state.missed_fields));

    };

    businessGst(e) {
        const value = e;
// ToDo : allow only Business PAN
        if (value.length <= 15) {
            let bpan = value.substr(2, 10);
            this.setState({gst: value, bpan}, () => this.props.setBusinessDetail(this.state))
        }
        this.validate.gst = (value.length === 15) ? true : false;
        this.handleValidation();
    }

    componentWillMount() {
        const {businessObj, payload, adharObj, setBusinessDetail, changeLoader, history} = this.props;


        if (payload === Object(payload) && payload.length) {
            if (adharObj !== Object(adharObj))
                history.push(`${PUBLIC_URL}/preapprove/personaldetail`);
        }
        else history.push(`${PUBLIC_URL}/preapprove/token`);

        if (businessObj === Object(businessObj)) {
            this.businessGst(businessObj.gst);
            this.setState(businessObj, () => {
                Object.keys(this.state).map((val, key) => {
                    if (this.validate[val] !== undefined)
                        this.validate[val] = (this.state[val].length > 0);
                    // console.log(this.validate);
                });
            });
        }
        else setBusinessDetail(this.state);

        try {
            /*  if (gstProfile === Object(gstProfile))
                  if (gstProfile.length) {
                      BusinessType.map((val, key) => {
                          (`/${val}/gi`).test(gstProfile.ctb);
                      });
                      this.setState({gst: gstProfile.gstin, lgnm: gstProfile.lgnm});
                  }*/
            if (payload === Object(payload) && payload.length) {
                this.setState({dealercode: payload.distributor_dealer_code}, () => setBusinessDetail(this.state));
            }

        }
        catch (e) {
            console.log(e);
        }

        // console.log(this.props.gstProfile)
        changeLoader(false);

    }

    componentDidMount() {
        const {businessObj, adharObj} = this.props;
        setTimeout(() => this.handleValidation(), 1000);
        console.log(adharObj);

        if (businessObj === Object(businessObj))
            this.businessGst(businessObj.gst);
    }

    render() {
        const gstProfile = this.props.gstProfile;
        // react-select
        const customStyles = {
            option: (provided, state) => ({
              ...provided,
              fontSize: 11,
              padding: 8,
            }),
            singleValue: (provided, state) => ({
                ...provided,
                fontSize: 13,
            }),
            Input: (provided, state) => ({
                ...provided,
                fontSize: 12,
            }),
        }
        return (
            <>
                {/*<Link to={`${PUBLIC_URL}/preapprove/personaldetails`} className={"btn btn-link"}>Go Back </Link>*/}
                
                <h4 className={"text-center"} style={{fontSize: '1.2rem'}}>Business Details</h4>
                <p className="paragraph_styling  text-center">
                    <b> Please submit your business details to complete the loan application.</b>
                </p>
                {/*<h5 className={"text-center"}>{(gstProfile === Object(gstProfile)) ? gstProfile.lgnm : ''}</h5>*/}

                <form
                    id="serverless-contact-form mb-0"
                    onSubmit={e => this._formSubmit(e)}
                >
                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            {/*<h5 className={"text-center"}>{(gstProfile === Object(gstProfile)) ? gstProfile.lgnm : ''}</h5>*/}
                            <input
                                type="text"
                                className="form-control font_weight"
                                style={{ padding: '10px'}}
                                title="Company Legal Name"
                                autoCapitalize="characters"
                                id="companyName"
                                required={true}
                                value={(gstProfile === Object(gstProfile)) ? gstProfile.lgnm : ''}
                                readOnly={true}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-6"}>
                            <div className="form-group mb-0">
                                <label htmlFor="companyType" className={"bmd-label-floating"}>Company Type *</label>
                                <Select options={BusinessType}
                                        required={true}
                                        id="companyType"
                                        inputId={"companyType"}
                                        styles={customStyles}
                                    // value={BusinessType[1]}
                                        onBlur={() => this.validationErrorMsg()}
                                        onChange={(e) => {
                                            let {value} = e;
                                            this.setState({companytype: value}, () => this.props.setBusinessDetail(this.state));
                                            this.validate.companytype = (value.length > 0);
                                            this.handleValidation();
                                        }}/>
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
                        <div className={"col-6"}>
                            <div className="form-group mb-0">
                                <label htmlFor="numberGST" className={"bmd-label-floating"}>GST Number *</label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Mobile Number"
                                    pattern="^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$"
                                    title="Please enter GST Number"
                                    autoCapitalize="characters"
                                    id="numberGST"
                                    required={true}
                                    value={this.state.gst}
                                    onBlur={() => this.validationErrorMsg()}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => this.businessGst(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {(this.state.companytype !== "proprietorship" && this.state.companytype !== "") ? (
                        <div className="form-group mb-0">
                            <label htmlFor="numberPAN" className={"bmd-label-floating"}>Business PAN *</label>
                            <input
                                type="text"
                                className="form-control font_weight"
                                // placeholder="Email"
                                style={{ padding: '10px'}}
                                pattern="^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]{1}?$"
                                title="Please enter Business PAN"
                                autoCapitalize="characters"
                                id="numberPAN"
                                required={true}
                                value={this.state.bpan}
                                onBlur={() => this.validationErrorMsg()}
                                readOnly={true}
                                disabled={true}
                                // ref={ref => (this.obj.pan = ref)}
                                onChange={(e) => this.setState({bpan: e.target.value}, () => this.props.setBusinessDetail(this.state))}
                            />
                        </div>
                    ) : <></>}

                    <div className={"row"}>
                        <div className={"col-6"}>
                            <div className="form-group mb-0">
                                <label htmlFor="avgTrans" className="bmd-label-floating">
                                    Avg Trans./month *
                                </label>
                                <div className={"input-group"}>
                                    <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon3">
                    ₹
                  </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control font_weight prependInput"
                                        pattern="^[0-9]{5,10}$"
                                        title="Enter Average monthly Transactions"
                                        autoCapitalize="characters"
                                        id="avgTrans"
                                        required={true}
                                        value={this.state.avgtrans}
                                        style={{marginLeft: '-0.5rem'}}
                                        // ref={ref => (this.obj.pan = ref)}
                                        onBlur={() => this.validationErrorMsg()}
                                        onChange={(e) => {
                                            let {value} = e.target;
                                            if (value.length <= 10 && !isNaN(value)) this.setState({avgtrans: value}, () => this.props.setBusinessDetail(this.state));
                                            this.validate.avgtrans = (value.length <= 10 && value.length >= 5);
                                            this.handleValidation();
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={"col-6"}>
                            <div className="form-group mb-0">
                                <label htmlFor="dealerCode" className="bmd-label-floating">
                                    Dealer Code
                                </label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    pattern="^[0-9A-Za-z]{4,}$"
                                    title="Enter Dealer Code"
                                    autoCapitalize="characters"
                                    id="dealerCode"
                                    required={true}
                                    value={this.state.dealercode}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onBlur={() => this.validationErrorMsg()}
                                    onChange={(e) => {
                                        let {value} = e.target;
                                        if (value.length <= 10) this.setState({dealercode: value}, () => this.props.setBusinessDetail(this.state));
                                        this.validate.dealercode = (value.length <= 10 && value.length >= 4);
                                        this.handleValidation();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <label >
                            <input type="checkbox" checked={this.state.tnc_consent}
                                   onChange={(e) =>
                                       this.setState(prevState => ({tnc_consent: !prevState.tnc_consent}))
                                   }/>
                            <p className="main_tnc" >I accept the <a href={'#'} onClick={(e) => {
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
                            </p>
                        </label>
                    </div>

                    <div className="mt-3 mb-1 text-center">
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
(mapStateToProps, {setBusinessDetail, changeLoader})
(BusinessDetail));
