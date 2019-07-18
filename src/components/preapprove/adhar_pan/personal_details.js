import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl, otpUrl} from "../../../shared/constants";
import {connect} from "react-redux";
import {setAdharManual, changeLoader} from "../../../actions/index";
import {Link, withRouter} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {alertModule} from "../../../shared/commonLogic";

const {PUBLIC_URL} = process.env;

class AdharPan extends Component {
    state = {
        f_name: '',
        m_name: '',
        l_name: '',
        mobile: '',
        email: '',
        dob: new Date(1980, 0, 1),
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

    validate = {
        f_name: false,
        // m_name: false,
        l_name: false,
        mobile: false,
        email: false,
        // dob: true,
        // gender: true,
        pincode: false,
        address1: false,
        // address2: false,
    };

    componentDidMount() {

        const {payload, authObj, adharObj, changeLoader, setAdharManual, history, pan} = this.props;
        // console.log(typeof payload);
        // var datePickerInput = document.getElementsByClassName('react-datepicker__input-container');
        // var datePickerInputWrapper = document.getElementsByClassName('react-datepicker-wrapper');
        setTimeout(() => {
            // datePickerInput.style.width = '100%';
            // datePickerInputWrapper.style.width = '100%';
        }, 1000);
        // console.log(pan)
        if (payload === Object(payload)  && payload) {
            if (!pan)
                history.push(`${PUBLIC_URL}/preapprove/adharpan`);
        }
        else
            history.push(`${PUBLIC_URL}/preapprove/token`);

        let state = adharObj;

        // console.log(state);

        if (authObj === Object(authObj) && authObj.length)
            if (authObj.verified && state === Object(state))
                if (state.mobile)
                    state.mobile = authObj.mobile;

        if (state === Object(state) && state.length)
            this.setState(state, () => {
                Object.keys(this.state).map((val, key) => {
                    if (this.validate[val] !== undefined)
                        this.validate[val] = (this.state[val].length > 0);
                    // console.log(this.validate);
                });
            });
        else setAdharManual(this.state);

        setTimeout(() => {
            this._loadGstProfile();
            this.handleValidation();
            // console.log(adharObj);
        }, 1000);
        changeLoader(false);

    }

    _loadGstProfile() {
        const {gstProfile, setAdharManual} = this.props;
        let tempName;
        if (gstProfile === Object(gstProfile)) {
            if (Array.isArray(gstProfile.mbr) && gstProfile.mbr.length > 0) {
                tempName = gstProfile.mbr[0].split(' ');
                console.log(tempName[0]);
                this.setState({
                    f_name: tempName[0],
                    m_name: (tempName[2]) ? tempName[1] : '',
                    l_name: (tempName[2]) ? tempName[2] : ''
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

    handleValidation() {
        let ctrerror = 6, missed_fields;
        // let missed_fields = Object.keys(this.validate).some(x => this.validate[x]);
        Object.values(this.validate).map((val, key) => {
            if (!val)
                ++ctrerror;
            else --ctrerror;
            console.log(val);
        });
        missed_fields = (ctrerror !== 0);
        this.setState({missed_fields}, () => console.log('All Fields Validated : ' + this.state.missed_fields));
    }

    _pincodeFetch = () => {
        //http://postalpincode.in/api/pincode/
        //https://test.mintifi.com/api/v2/communications/pincode/400059
        let city, state;
        const {setAdharManual, changeLoader} = this.props;
        if (this.state.pincode) {
            changeLoader(true);

            fetch(`${otpUrl}/pincode/${this.state.pincode}`)
                .then(resp => resp.json())
                .then(resp => {

                    let obj = resp.response;
                    if (obj !== null && obj === Object(obj)) {
                        city = obj.city;
                        state = obj.state;
                        this.setState({city, state}, () => setAdharManual(this.state));
                    }
                    if (resp.error === Object(resp.error)) {
                        alertModule(resp.error.message, 'warn');
                        this.setState({city: '', state: ''});
                    }
                    changeLoader(false);
                }, () => {
                    changeLoader(false);
                    alertModule();
                });
        }
    };

    changeDob = (dob) => {
        /*        let date = d.getDate();
                let month = d.getMonth();
                let year = d.getFullYear();
                let dob = `${year}-${month}-${date}`;
         */
        this.setState({dob}, () => this.props.setAdharManual(this.state))
    };

    render() {
        return (
            <>
                <Link to={`${PUBLIC_URL}/preapprove/adharpan`} className={"btn btn-link"}>Go
                    Back </Link><br/><br/>
                <h4 className={"text-center"}>Personal Details </h4>
                <h5 className="paragraph_styling  text-center" style={{fontSize: '17px'}}>
                    <b> Enter your personal information to proceed.</b>
                </h5>
                <br/>
                <form
                    id="serverless-contact-form"
                    onSubmit={e => this._formSubmit(e)}
                >
                    <div className={"row"}>
                        <div className={"col-md-4 col-sm-4 col-xs-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor="firstName" className={"bmd-label-floating"}>First Name *</label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Full Name"
                                    style={{fontWeight: 600}}
                                    pattern="^[a-zA-Z]+$"
                                    title="Please enter First Name"
                                    autoCapitalize="characters"
                                    id="firstName"
                                    required={true}
                                    value={this.state.f_name}
                                    onBlur={() => {
                                        // this.props.setAdharManual(this.state);
                                        this.handleValidation()
                                    }}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => {
                                        this.setState({f_name: e.target.value}, () => this.props.setAdharManual(this.state));
                                        this.validate.f_name = (e.target.value.length >= 2) ? true : false;
                                    }}
                                />
                            </div>
                        </div>
                        <div className={"col-md-4 col-sm-4 col-xs-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor="middleName" className={"bmd-label-floating"}>Middle Name </label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Full Name"
                                    style={{fontWeight: 600}}
                                    pattern="^[a-zA-Z]+$"
                                    title="Please enter Middle Name"
                                    autoCapitalize="characters"
                                    id="middleName"
                                    value={this.state.m_name}
                                    // onBlur={() => this.props.setAdharManual(this.state)}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => this.setState({m_name: e.target.value}, () => this.props.setAdharManual(this.state))}
                                />
                            </div>
                        </div>
                        <div className={"col-md-4 col-sm-4 col-xs-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor="lastName" className={"bmd-label-floating"}>Last Name *</label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Full Name"
                                    style={{fontWeight: 600}}
                                    pattern="^[a-zA-Z]+$"
                                    title="Please enter Last Name"
                                    autoCapitalize="characters"
                                    id="lastName"
                                    required={true}
                                    value={this.state.l_name}
                                    onBlur={() => {
                                        // this.props.setAdharManual(this.state);
                                        this.handleValidation()
                                    }}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => {
                                        this.setState({l_name: e.target.value}, () => this.props.setAdharManual(this.state));
                                        this.validate.l_name = (e.target.value.length >= 2) ? true : false;
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor="numberMobile"
                                       className={"bmd-label-floating"}>Mobile
                                    Number *</label>
                                <div className={"input-group"}>
                                    <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon3">
                    +91
                  </span>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-control font_weight prependInput"
                                        // placeholder="Mobile Number"

                                        pattern="^[0-9]{10}+$"
                                        title="Please enter Mobile Number"
                                        id="numberMobile"
                                        required={true}
                                        value={this.state.mobile}
                                        onBlur={() => {
                                            // this.props.setAdharManual(this.state);
                                            this.handleValidation()
                                        }}
                                        // ref={ref => (this.obj.pan = ref)}
                                        onChange={(e) => {
                                            let {value} = e.target;
                                            if (value.length <= 10)
                                                this.setState({mobile: value}, () => this.props.setAdharManual(this.state));
                                            this.validate.mobile = (value.length === 10 || value.length === 11) ? true : false;
                                            // console.log(value.length);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor="textEmail" className={"bmd-label-floating"}>Email ID *</label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Email"
                                    style={{fontWeight: 600}}
                                    pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
                                    title="Please enter Email"
                                    autoCapitalize="characters"
                                    id="textEmail"
                                    required={true}
                                    value={this.state.email}
                                    onBlur={() => {
                                        // this.props.setAdharManual(this.state);
                                        this.handleValidation();
                                    }}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => {
                                        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                                        this.setState({email: e.target.value}, () => this.props.setAdharManual(this.state));
                                        this.validate.email = (regex.test(e.target.value)) ? true : false;
                                    }}
                                />
                            </div>
                        </div>
                    </div>


                    <div className={"row"}>
                        <div className={"col-sm-6 col-xs-12 col-md-6 text-left"}>
                            <label htmlFor="ResidenceOwnership" className="labelLoan bmd-label">
                                Gender *
                            </label><br/>
                            <div
                                style={{marginBottom: '20px'}}
                                className="btn-group"
                                id="proprietorship"
                                role="groupProperty"
                                aria-label="..."
                            >
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    onClick={() => {
                                        this.setState({gender: 'm'}, () => this.props.setAdharManual(this.state));
                                    }}
                                    style={{
                                        width: "90px",
                                        border:
                                            this.state.gender === "m" && "2px solid #00bfa5",
                                        borderBottomLeftRadius: '25px',
                                        borderTopLeftRadius: '25px'
                                    }}
                                >
                                    <i
                                        className="fa fa-male"
                                        style={{
                                            fontSize: "x-large",
                                            display: "block",
                                            padding: "0 10px"
                                        }}
                                    />
                                    <small style={{fontSize: "75%"}}>Male</small>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    onClick={() => {
                                        this.setState({gender: 'f'}, () => this.props.setAdharManual(this.state));
                                    }}
                                    style={{
                                        width: "90px",
                                        border:
                                            this.state.gender === "f" && "2px solid #00bfa5",
                                        borderBottomRightRadius: '25px',
                                        borderTopRightRadius: '25px'
                                    }}
                                >
                                    <i
                                        className="fa fa-female"
                                        style={{
                                            fontSize: "x-large",
                                            display: "block",
                                            padding: "0 10px"
                                        }}
                                    />
                                    <small style={{fontSize: "75%"}}>Female</small>
                                </button>
                            </div>
                        </div>
                        <div className={"col-sm-6 col-xs-12 col-md-6 text-left"}>
                            <label htmlFor="ResidenceOwnership" className="labelLoan bmd-label">
                                Ownership *
                            </label><br/>
                            <div
                                style={{marginBottom: '20px'}}
                                className="btn-group"
                                id="proprietorship"
                                role="groupProperty"
                                aria-label="..."
                            >

                                <button
                                    type="button"
                                    className="btn btn-default"
                                    onClick={() => {
                                        this.setState({ownership: 'rented'}, () => this.props.setAdharManual(this.state));
                                    }}
                                    style={{
                                        width: "90px",
                                        border:
                                            this.state.ownership === "rented" && "2px solid #00bfa5",
                                        borderBottomLeftRadius: '25px',
                                        borderTopLeftRadius: '25px'
                                    }}
                                >
                                    <i
                                        className="fa fa-building"
                                        style={{
                                            fontSize: "x-large",
                                            display: "block",
                                            padding: "0 10px"
                                        }}
                                    />
                                    <small style={{fontSize: "75%"}}>Rented</small>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    onClick={() => {
                                        this.setState({ownership: 'owned'}, () => this.props.setAdharManual(this.state));

                                    }}
                                    style={{
                                        width: "90px",
                                        border:
                                            this.state.ownership === "owned" && "2px solid #00bfa5",
                                        borderBottomRightRadius: '25px',
                                        borderTopRightRadius: '25px'
                                    }}
                                >
                                    <i
                                        className="fa fa-home"
                                        style={{
                                            fontSize: "x-large",
                                            display: "block",
                                            padding: "0 10px"
                                        }}
                                    />
                                    <small style={{fontSize: "75%"}}>Owned</small>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor="textAddress1" className="bmd-label-floating">
                                    Address 1 *
                                </label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Pincode"
                                    style={{fontWeight: 600}}
                                    title="Please enter Address 1"
                                    // pattern={"^[A-Za-z0-9'\\.\\-\\s\\,]{3,}"}
                                    autoCapitalize="characters"
                                    id="textAddress1"
                                    required={true}
                                    value={this.state.address1}
                                    onBlur={() => {
                                        // this.props.setAdharManual(this.state);
                                        this.handleValidation();
                                    }}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => {
                                        const {value} = e.target;
                                        this.setState({address1: value}, () => this.props.setAdharManual(this.state));
                                        this.validate.address1 = (value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor="dobDate" className="bmd-label-floating">
                                    Date of Birth
                                </label>
                                <div style={{display: 'block '}}>
                                    <DatePicker
                                        className="form-control font_weight"
                                        // placeholderText={"Date of Birth"}
                                        selected={this.state.dob}
                                        id={"dobDate"}
                                        pattern={"^[0-9]{2}/[0-9]{2}/[0-9]{4}$"}
                                        scrollableYearDropdown
                                        showMonthDropdown
                                        required={true}
                                        showYearDropdown
                                        style={{margin: 'auto', display: 'block'}}
                                        dateFormat={'dd/MM/yyyy'}
                                        onChange={(date) => this.changeDob(date)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor="textAddress2" className="bmd-label-floating">
                                    Address 2
                                </label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Pincode"
                                    style={{fontWeight: 600}}
                                    title="Please enter Address 2"
                                    autoCapitalize="characters"
                                    // pattern={"^.+{3,}"}
                                    id="textAddress2"
                                    required={true}
                                    value={this.state.address2}
                                    onBlur={() => {
                                        // this.props.setAdharManual(this.state);
                                        // this.handleValidation();
                                    }}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => {
                                        const {value} = e.target;
                                        this.setState({address2: value}, () => this.props.setAdharManual(this.state));
                                        // this.validate.address2 = (value);
                                    }}
                                />
                            </div>

                        </div>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <div className="form-group mb-3">
                                <label htmlFor="numberPincode" className="bmd-label-floating">
                                    Pincode *
                                </label>
                                <input
                                    type="number"
                                    className="form-control font_weight"
                                    // placeholder="Pincode"
                                    style={{fontWeight: 600}}
                                    pattern="^[0-9]{6}$"
                                    title="Please enter Pincode"
                                    autoCapitalize="characters"
                                    id="numberPincode"
                                    required={true}
                                    value={this.state.pincode}
                                    onBlur={() => {
                                        // this.props.setAdharManual(this.state);
                                        this._pincodeFetch();
                                        this.handleValidation();
                                    }}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => {
                                        let regex = /^[0-9]{6,7}$/;
                                        if (e.target.value.length <= 6)
                                            this.setState({pincode: e.target.value}, () => this.props.setAdharManual(this.state));
                                        this.validate.pincode = (regex.test(e.target.value));
                                    }}
                                />
                            </div>

                        </div>
                    </div>
                    <div className={"row"}
                         style={{
                             marginTop: '26px',
                             visibility: (this.state.city && this.state.state) ? 'visible' : 'hidden'
                         }}>
                        <div className={"col-md-6 col-sm-6 col-xs-12 "}>
                            <label className={"form-control font_weight"}
                                   style={{fontWeight: 600}}>{this.state.city}</label>
                        </div>
                        <div className={"col-md-6 col-sm-6 col-xs-12"}>
                            <label className={"form-control font_weight"}
                                   style={{fontWeight: 600}}>{this.state.state}</label>
                        </div>
                    </div>
                    {/*  <div className="form-group mb-3">
                        <label htmlFor="textAddress2" className="bmd-label-floating"> Select Your Locality *</label>
                        <select className="form-control font_weight"
                                style={{ fontWeight: 600}}
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
    {setAdharManual, changeLoader}
)(AdharPan));
