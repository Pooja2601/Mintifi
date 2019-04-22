import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl, BusinessType} from "../../shared/constants";
import {connect} from "react-redux";
import {setBusinessDetail, setAdharManual, changeLoader} from "../../actions";
import {Link, withRouter} from "react-router-dom";
// import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class BusinessDetail extends Component {

    state = {companytype: '', gst: '', bpan: '', avgtrans: '', dealercode: '', missed_fields: true};

    validate = {companytype: false, gst: false, bpan: false, avgtrans: false, dealercode: false};

    _formSubmit(e) {
        e.preventDefault();
        // this.props.setBusinessDetail(this.state);
        setTimeout(() => {
            this.props.history.push('/ReviewChanges')
        });
    }

    handleValidation = () => {
        let ctrerror = 5, missed_fields;
        // let missed_fields = Object.keys(this.validate).some(x => this.validate[x]);
        Object.values(this.validate).map((val, key) => {
            if (!val)
                ++ctrerror;
            else --ctrerror;
            console.log(val);
        });
        console.log(ctrerror);
        missed_fields = (ctrerror !== 0);
        this.setState({missed_fields}, () => console.log('All Fields Validated : ' + this.state.missed_fields));
    }

    businessGst(e) {
        if (e.target.value.length <= 15) {
            let bpan = e.target.value.substr(2, 10);
            this.setState({gst: e.target.value, bpan}, () => this.props.setBusinessDetail(this.state))
        }
        this.validate.gst = (e.target.value.length === 15) ? true : false;
    }

    componentWillMount() {
        const {businessObj, gstProfile, payload} = this.props;
        if (businessObj === Object(businessObj))
            this.setState(businessObj, () => {
                Object.keys(this.state).map((val, key) => {
                    if (this.validate[val] !== undefined)
                        this.validate[val] = (this.state[val].length > 0);
                    // console.log(this.validate);
                });
            });
        else this.props.setBusinessDetail(this.state);

        if (gstProfile === Object(gstProfile) && gstProfile.length) {
            BusinessType.map((val, key) => {
                (`/${val}/gi`).test(gstProfile.ctb);
            });
            this.setState({gst: gstProfile.gstin});
        }
        if (payload === Object(payload) && payload.length) {
            this.setState({dealercode: payload.distributor_dealer_code});
        }
        // console.log(this.props.gstProfile)
        this.props.changeLoader(false);
        this.handleValidation();
    }

    render() {
        const gstProfile = this.props.gstProfile;
        return (
            <>
                {/*<Link to={'/AdharPan'} className={"btn btn-link"}>Go Back </Link>*/}
                <button onClick={() => this.props.history.goBack()} className={"btn btn-link"}>Go Back</button>
                <br/><br/>
                <h4 className={"text-center"}>{(gstProfile === Object(gstProfile)) ? gstProfile.lgnm : ''}</h4>
                <p className="paragraph_styling  text-center">
                    <b> And the last Step, your Business Information.</b>
                </p>
                <form
                    id="serverless-contact-form"
                    onSubmit={e => this._formSubmit(e)}
                >
                    <div className="form-group mb-3">
                        <label htmlFor="companyType" className={"bmd-label-floating"}>Company Type *</label>

                        <select style={{textTransform: "uppercase", fontWeight: 600}} title="Please select Company Type"
                                value={this.state.companytype} required={true}
                                onChange={(e) => {
                                    this.setState({companytype: e.target.value}, () => this.props.setBusinessDetail(this.state));
                                    this.validate.companytype = (e.target.value.length > 0) ? true : false
                                }}
                                onBlur={() => this.handleValidation()}
                                className="form-control font_weight" id="companyType">
                            <option value={''}>Select Company Type</option>
                            {
                                Object.keys(BusinessType).map((key, index) =>
                                    (<option key={index} value={key}>{BusinessType[key]}</option>)
                                )
                            }
                        </select>

                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="numberGST" className={"bmd-label-floating"}>GST Number *</label>
                        <input
                            type="text"
                            className="form-control font_weight"
                            // placeholder="Mobile Number"
                            style={{textTransform: "uppercase", fontWeight: 600}}
                            pattern="^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$"
                            title="Please enter GST Number"
                            autoCapitalize="characters"
                            id="numberGST"
                            required={true}
                            value={this.state.gst}
                            onBlur={() => this.handleValidation()}
                            // ref={ref => (this.obj.pan = ref)}
                            onChange={(e) => this.businessGst(e)}
                        />
                    </div>
                    {(this.state.companytype !== "proprietorship" && this.state.companytype !== "") ? (
                        <div className="form-group mb-3 ">
                            <label htmlFor="numberPAN" className={"bmd-label-floating"}>Business PAN *</label>
                            <input
                                type="text"
                                className="form-control font_weight"
                                // placeholder="Email"
                                style={{textTransform: "uppercase", fontWeight: 600}}
                                pattern="^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]{1}?$"
                                title="Please enter Business PAN"
                                autoCapitalize="characters"
                                id="numberPAN"
                                required={true}
                                value={this.state.bpan}
                                // onBlur={() => this.handleValidation()}
                                readOnly={true}
                                disabled={true}
                                // ref={ref => (this.obj.pan = ref)}
                                onChange={(e) => this.setState({bpan: e.target.value}, () => this.props.setBusinessDetail(this.state))}
                            />
                        </div>
                    ) : <></>}

                    <div className="form-group mb-3">
                        <label htmlFor="avgTrans" className="bmd-label-floating" style={{marginLeft: '2rem'}}>
                            Average Monthly Transactions *
                        </label>
                        <div className={"input-group"}>
                            <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon3">
                    ₹
                  </span>
                            </div>
                            <input
                                type="number"
                                className="form-control font_weight"
                                // placeholder="Pincode"
                                style={{textTransform: "uppercase", fontWeight: 600, marginLeft: '1rem'}}
                                pattern="^[0-9]{10}$"
                                title="Enter Average monthly Transactions"
                                autoCapitalize="characters"
                                id="avgTrans"
                                required={true}
                                value={this.state.avgtrans}
                                // ref={ref => (this.obj.pan = ref)}
                                onBlur={() => this.handleValidation()}
                                onChange={(e) => {
                                    if (e.target.value.length <= 10) this.setState({avgtrans: e.target.value}, () => this.props.setBusinessDetail(this.state));
                                    this.validate.avgtrans = (e.target.value.length <= 10) ? true : false;
                                }}
                            />
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="dealerCode" className="bmd-label-floating">
                            Dealer Code *
                        </label>
                        <input
                            type="text"
                            className="form-control font_weight"
                            style={{textTransform: "uppercase", fontWeight: 600}}
                            pattern="^[0-9A-Za-z]+$"
                            title="Enter Dealer Code"
                            autoCapitalize="characters"
                            id="dealerCode"
                            required={true}
                            value={this.state.dealercode}
                            // ref={ref => (this.obj.pan = ref)}
                            onBlur={() => this.handleValidation()}
                            onChange={(e) => {
                                if (e.target.value.length <= 8) this.setState({dealercode: e.target.value}, () => this.props.setBusinessDetail(this.state));
                                this.validate.dealercode = (e.target.value.length < 10 && e.target.value.length >= 4) ? true : false;
                            }}
                        />
                    </div>

                    <div className="mt-5 mb-5 text-center ">

                        <button
                            type="submit"
                            disabled={this.state.missed_fields}
                            onClick={e => this._formSubmit(e)}
                            className="form-submit btn btn-raised greenButton"
                        >Proceed
                        </button>

                    </div>
                </form>
            </>
        );
    }
}

const mapStateToProps = state => ({
    businessObj: state.businessDetail.businessObj,
    gstProfile: state.businessDetail.gstProfile,
    payload: state.authPayload.payload
});

export default withRouter(connect(
    mapStateToProps,
    {setBusinessDetail, changeLoader}
)(BusinessDetail));
