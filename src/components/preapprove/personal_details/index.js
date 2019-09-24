import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl, otpUrl} from "../../../shared/constants";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {setAdharManual, changeLoader, showAlert} from "../../../actions";
import {Link, withRouter} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {fetchAPI, apiActions, postAPI} from "../../../api";
import {checkObject, fieldValidationHandler, regexTrim, retrieveDate} from "../../../shared/common_logic";

import {validationPersonalDetails} from "../../../shared/validations";


const {PUBLIC_URL} = process.env;

class PersonalDetail extends Component {

    static propTypes = {
        authObj: PropTypes.object,
        anchorObj: PropTypes.object,
        payload: PropTypes.object.isRequired,
        gstProfile: PropTypes.object
    };

    state = {
        f_name: '',
        m_name: '',
        l_name: '',
        mobile: '',
        email: '',
        dob: new Date(315577770),
        gender: 'm',
        ownership: 'rented',
        pincode: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        list_posts: '',
        missed_fields: true
    };

    tempState = this.state;

    componentDidMount() {

        const {payload, authObj, adharObj, changeLoader, setAdharManual, history, pan} = this.props;
        // console.log(typeof payload);
        setTimeout(() => {
        }, 1000);
        // console.log(pan)
        if (checkObject(payload)) {
            if (!pan)
                history.push(`${PUBLIC_URL}/preapprove/adharpan`);
        } else
            history.push(`${PUBLIC_URL}/preapprove/token`);

        let state = adharObj;
        this.tempState = Object.assign({}, this.state);

        // console.log(this.tempState);

        if (checkObject(authObj))
            if (authObj.verified && checkObject(state))
                if (state.mobile)
                    state.mobile = authObj.mobile;

        if (checkObject(state))
            this.setState(state);
        else setAdharManual(this.state);

        setTimeout(() => {
            this._loadGstProfile();
            this.validationHandler();
            // console.log(adharObj);
        }, 1000);
        changeLoader(false);

    }

    // incoming from GST profile
    _loadGstProfile() {
        const {gstProfile, setAdharManual} = this.props;
        let tempName;
        if (checkObject(gstProfile)) {
            if (Array.isArray(gstProfile.mbr) && gstProfile.mbr.length > 0) {
                tempName = gstProfile.mbr[0].split(' ');
                // console.log(tempName[0]);
                this.setState({
                    f_name: tempName[0],
                    m_name: (tempName[2]) ? tempName[1] : '',
                    l_name: (tempName[2]) ? tempName[2] : (tempName[1] || '')
                }, () => setAdharManual(this.state));
            }
            if (Array.isArray(gstProfile.pradr) && gstProfile.pradr.length > 0) {
                this.setState({
                    mobile: gstProfile.pradr.mb,
                    email: gstProfile.pradr.em
                }, () => setAdharManual(this.state));
            }
        }
    }

    _formSubmit(e) {
        e.preventDefault();
        setTimeout(() => {
            this.props.history.push(`${PUBLIC_URL}/preapprove/mobileotp`);
        }, 500);

    }


    _pincodeFetch = async (pincode) => {
        //http://postalpincode.in/api/pincode/
        //https://test.mintifi.com/api/v2/communications/pincode/400059
        let city, state;
        const {setAdharManual, changeLoader, showAlert} = this.props;
        if (pincode) {
            const options = {
                token: null,
                URL: `${otpUrl}/pincode/${pincode}`,
                showAlert: showAlert,
                changeLoader: changeLoader
            }

            const resp = await fetchAPI(options);

            if (resp.status === apiActions.SUCCESS_RESPONSE) {
                // TODO: Check for success response

                city = resp.data.city;
                state = resp.data.state;
                this.setState({city, state}, () => setAdharManual(this.state));
            } else if (resp.status === apiActions.ERROR_RESPONSE) {
                showAlert(resp.data.message, 'warn');
                this.setState({city: '', state: ''});
            }
        }
    };


    // ToDo : should be independent of a field
    validationHandler = () => {
        const {showAlert} = this.props;

        const lomo = fieldValidationHandler({
            showAlert: showAlert,
            validations: validationPersonalDetails,
            localState: this.state
        });

        this.setState({missed_fields: lomo}); // true : for disabling

    }

    onChangeHandler = (field, value) => {
        let that = this, regex, doby;
        const {setAdharManual} = this.props;
        // fields is Equivalent to F_NAME , L_NAME... thats an object

        // ToDo : comment those that are not required
        const {MOBILE, PINCODE, DOB} = validationPersonalDetails;

        this.tempState = Object.assign({}, this.state);
        switch (field) {

            case MOBILE:
                if (value.length <= 10)
                    this.tempState['mobile'] = value;
                break;

            case PINCODE:
                if (value.length <= 6) {
                    this.tempState['pincode'] = value;
                    value.length === 6 && this._pincodeFetch(value);
                }
                break;
            case DOB:
                // this.tempState['dob'] = retrieveDate(value);
                this.tempState['dob'] = new Date(value);
                break;
            default:
                this.tempState[field.slug] = value;
                break
        }


        this.setState({...this.state, ...this.tempState});

        window.setTimeout(() => {
            setAdharManual(that.state);
            this.validationHandler();
        }, 10)

    }

    render() {
        const {F_NAME, M_NAME, L_NAME, MOBILE, DOB, ADDRESS2, ADDRESS1, EMAIL, GENDER, OWNERSHIP, PINCODE} = validationPersonalDetails;

        return (
            <>
                <Link to={`${PUBLIC_URL}/preapprove/adharpan`} className={"btn btn-link go-back-btn"}>Go
                    Back </Link>
                <h4 className={"text-center "}>Personal Details </h4>
                <h5 className="paragraph_styling  text-center secondLinePara">
                    <b> Enter your personal information to proceed.</b>
                </h5>
                <form
                    id="serverless-contact-form"
                    onSubmit={e => this._formSubmit(e)}
                >
                    <div className={"row"}>
                        <div className={"col-md-4 col-sm-4 col-xs-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor={F_NAME.id} className={"bmd-label-floating"}>First Name *</label>
                                <input
                                    type={F_NAME.type}
                                    className="form-control font_weight"
                                    // placeholder="Full Name"
                                    pattern={regexTrim(F_NAME.pattern)}
                                    title={F_NAME.title}
                                    autoCapitalize={F_NAME.autoCapitalize}
                                    id={F_NAME.id}
                                    required={F_NAME.required}
                                    value={this.state.f_name}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => this.onChangeHandler(F_NAME, e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={"col-md-4 col-sm-4 col-xs-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor={M_NAME.id} className={"bmd-label-floating"}>Middle Name </label>
                                <input
                                    type={M_NAME.type}
                                    className="form-control font_weight"
                                    // placeholder="Full Name"
                                    pattern={regexTrim(M_NAME.pattern)}
                                    title={M_NAME.title}
                                    autoCapitalize={M_NAME.autoCapitalize}
                                    id={M_NAME.id}
                                    value={this.state.m_name}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => this.onChangeHandler(M_NAME, e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={"col-md-4 col-sm-4 col-xs-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor={L_NAME.id} className={"bmd-label-floating"}>Last Name *</label>
                                <input
                                    type={L_NAME.type}
                                    className="form-control font_weight"
                                    // placeholder="Full Name"
                                    pattern={regexTrim(L_NAME.pattern)}
                                    title={L_NAME.title}
                                    autoCapitalize={L_NAME.autoCapitalize}
                                    id={L_NAME.id}
                                    required={L_NAME.required}
                                    value={this.state.l_name}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => this.onChangeHandler(L_NAME, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor={MOBILE.id}
                                       className={"bmd-label-floating"}>Mobile
                                    Number *</label>
                                <div className={"input-group"}>
                                    <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon3">
                    +91
                  </span>
                                    </div>
                                    <input
                                        type={MOBILE.type}
                                        className="form-control font_weight prependInput"
                                        // placeholder="Mobile Number"
                                        pattern={regexTrim(MOBILE.pattern)}
                                        title={MOBILE.title}
                                        id={MOBILE.id}
                                        required={MOBILE.required}
                                        value={this.state.mobile}
                                        // ref={ref => (this.obj.pan = ref)}
                                        onChange={(e) => this.onChangeHandler(MOBILE, e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor={EMAIL.id} className={"bmd-label-floating"}>Email ID *</label>
                                <input
                                    type={EMAIL.type}
                                    className="form-control font_weight"
                                    // placeholder="Email"
                                    pattern={regexTrim(EMAIL.pattern)}
                                    title={EMAIL.title}
                                    autoCapitalize={EMAIL.autoCapitalize}
                                    id={EMAIL.id}
                                    required={EMAIL.required}
                                    value={this.state.email}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => this.onChangeHandler(EMAIL, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-sm-6 col-xs-12 col-md-6 text-left"}>
                            <label htmlFor={GENDER.id} className="d-block bmd-label">
                                Gender *
                            </label>
                            <div
                                className="btn-group ToggleBtn"
                                id={GENDER.id}
                                role="groupProperty"
                                aria-label="..."
                            >
                                <button
                                    type={GENDER.type}
                                    className="btn btn-default btnLeft"
                                    onClick={() => this.onChangeHandler(GENDER, 'm')}
                                    style={{
                                        border:
                                            this.state.gender === "m" && "2px solid #00bfa5",
                                    }}
                                >
                                    <i
                                        className="fa fa-male"
                                    />
                                    <small>Male</small>
                                </button>
                                <button
                                    type={GENDER.type}
                                    className="btn btn-default btnRight"
                                    onClick={() => this.onChangeHandler(GENDER, 'f')}
                                    style={{
                                        border:
                                            this.state.gender === "f" && "2px solid #00bfa5",
                                    }}
                                >
                                    <i
                                        className="fa fa-female"
                                    />
                                    <small>Female</small>
                                </button>
                            </div>
                        </div>
                        <div className={"col-sm-6 col-xs-12 col-md-6 text-left"}>
                            <label htmlFor={OWNERSHIP.id} className="d-block bmd-label">
                                Ownership *
                            </label>
                            <div
                                className="btn-group ToggleBtn"
                                id={OWNERSHIP.id}
                                role="groupProperty"
                                aria-label="..."
                            >

                                <button
                                    type={OWNERSHIP.type}
                                    className="btn btn-default btnLeft"
                                    onClick={() => this.onChangeHandler(OWNERSHIP, 'rented')}
                                    style={{
                                        border:
                                            this.state.ownership === "rented" && "2px solid #00bfa5",
                                    }}
                                >
                                    <i
                                        className="fa fa-building"
                                    />
                                    <small>Rented</small>
                                </button>
                                <button
                                    type={OWNERSHIP.type}
                                    className="btn btn-default btnRight"
                                    onClick={() => this.onChangeHandler(OWNERSHIP, 'owned')}
                                    style={{
                                        border:
                                            this.state.ownership === "owned" && "2px solid #00bfa5",
                                    }}
                                >
                                    <i
                                        className="fa fa-home"
                                    />
                                    <small>Owned</small>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={"row"}>

                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor={DOB.id} className="bmd-label-floating">
                                    Date of Birth
                                </label>
                                <div className={'d-block'}>
                                    <DatePicker
                                        className="form-control font_weight"
                                        // placeholderText={"Date of Birth"}
                                        selected={new Date(this.state.dob)}
                                        id={DOB.id}
                                        pattern={regexTrim(DOB.pattern)}
                                        scrollableYearDropdown
                                        showMonthDropdown
                                        dropdownMode={"scroll"}
                                        required={DOB.required}
                                        showYearDropdown
                                        dateFormat={DOB.dateFormat}
                                        onChange={(date) => this.onChangeHandler(DOB, date)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor={ADDRESS1.id} className="bmd-label-floating">
                                    Address 1 *
                                </label>
                                <input
                                    type={ADDRESS1.type}
                                    className="form-control font_weight"
                                    // placeholder="Pincode"
                                    title={ADDRESS1.title}
                                    pattern={regexTrim(ADDRESS1.pattern)}
                                    autoCapitalize={ADDRESS1.autoCapitalize}
                                    id={ADDRESS1.id}
                                    required={ADDRESS1.required}
                                    value={this.state.address1}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => this.onChangeHandler(ADDRESS1, e.target.value)}
                                />
                            </div>
                        </div>

                    </div>

                    <div className={"row"}>

                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor={PINCODE.id} className="bmd-label-floating">
                                    Pincode *
                                </label>
                                <input
                                    type={PINCODE.type}
                                    className="form-control font_weight"
                                    // placeholder="Pincode"
                                    pattern={regexTrim(PINCODE.pattern)}
                                    title={PINCODE.title}
                                    autoCapitalize={PINCODE.autoCapitalize}
                                    id={PINCODE.id}
                                    required={PINCODE.required}
                                    value={this.state.pincode}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => this.onChangeHandler(PINCODE, e.target.value)}

                                />
                            </div>

                        </div>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3 ">

                                <label htmlFor={ADDRESS2.id} className="bmd-label-floating">
                                    Address 2

                                </label>
                                <input
                                    type={ADDRESS2.type}
                                    className="form-control font_weight"
                                    // placeholder="Pincode"

                                    title={ADDRESS2.title}
                                    autoCapitalize={ADDRESS2.autoCapitalize}
                                    pattern={regexTrim(ADDRESS2.pattern)}
                                    id={ADDRESS2.id}
                                    required={ADDRESS2.required}
                                    value={this.state.address2}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => this.onChangeHandler(ADDRESS2, e.target.value)}

                                />
                            </div>
                        </div>
                    </div>
                    <div className={"row mt-4"}
                         style={{
                             visibility: (this.state.city && this.state.state) ? 'visible' : 'hidden'
                         }}>
                        <div className={"col-md-6 col-sm-6 col-xs-12 "}>
                            <label className={"form-control font_weight"}
                            >{this.state.city}</label>
                        </div>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <label className={"form-control font_weight"}
                            >{this.state.state}</label>
                        </div>
                    </div>
                    {/*  <div className="form-group mb-3">
                        <label htmlFor="textAddress2" className="bmd-label-floating"> Select Your Locality *</label>
                        <select className="form-control font_weight"
                               
                                onBlur={() => {
                                    this.props.setAdharManual(this.state);
                                    this.handleValidation()
                                }} title="Please enter Address2"
                                required={true}
                                value={this.state.address2} id="textAddress2" onChange={(e) => {
                            if (e.target.value.length >= 5)
                                this.setState({address2: e.target.value});
                            this.validate.address2 = (e.target.value.length >= 5) ? true : false;
                        }}>
                            <option>Select your Locality</option>
                            {
                                (this.state.list_posts === Object(this.state.list_posts)) ? this.state.list_posts.map((val, key) =>
                                    (<option value={`${val.name} ${val.district} ${val.state}`}>{val.name} {val.district} {val.state}</option>)
                                ) : (<></>)
                            }
                        </select>
                    </div>*/}

                    <div className="mt-5 mb-5 text-center ">
                        {<button
                            type="submit"
                            onClick={e => this._formSubmit(e)}
                            disabled={this.state.missed_fields}
                            className=" btn btn-raised greenButton"
                        >Proceed
                        </button>}
                        {/* <a href={'#'} disabled={this.state.missed_fields} onClick={e => this._formSubmit(e)}
                           className="form-submit btn btn-raised greenButton">Proceed</a>*/}
                    </div>
                </form>
            </>
        );
    }
}

const mapStateToProps = state => ({
    pan: state.adharDetail.pan,
    authObj: state.authPayload.authObj,
    payload: state.authPayload.payload,
    adharObj: state.adharDetail.adharObj,
    gstProfile: state.businessDetail.gstProfile
});

export default withRouter(connect(
    mapStateToProps,
    {setAdharManual, changeLoader, showAlert}
)(PersonalDetail));
