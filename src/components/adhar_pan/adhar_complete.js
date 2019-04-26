import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
// import {baseUrl} from "../../shared/constants";
import {connect} from "react-redux";
import {setAdharManual, changeLoader} from "../../actions";
import {Link, withRouter} from "react-router-dom";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class AdharPan extends Component {
    state = {
        f_name: '',
        m_name: '',
        l_name: '',
        mobile: '',
        email: '',
        dob: new Date(),
        gender: 'm',
        ownership: 'rented',
        pincode: '',
        address1: '',
        address2: '',
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
        address2: false,
    };

    componentWillMount() {

        const {payload, authObj, adharObj} = this.props;

        if (payload !== Object(payload))
            if (authObj !== Object(authObj))
                if (adharObj !== Object(adharObj))
                    this.props.history.push("/Token");

        let state = adharObj;
        if (state === Object(state))
            this.setState(state, () => {
                Object.keys(this.state).map((val, key) => {
                    if (this.validate[val] !== undefined)
                        this.validate[val] = (this.state[val].length > 0);
                    // console.log(this.validate);
                });
            });
        else this.props.setAdharManual(this.state);
        setTimeout(() => this._loadGstProfile());
        this.props.changeLoader(false);
        this.handleValidation();
    }

    _loadGstProfile() {
        const {gstProfile} = this.props;
        if (gstProfile === Object(gstProfile)) {
            let tempName = gstProfile.mbr[0].split(' ');
            this.setState({
                f_name: tempName[0],
                m_name: (tempName[2]) ? tempName[1] : '',
                l_name: (tempName[2]) ? tempName[2] : '',
                mobile: gstProfile.pradr.mb,
                email: gstProfile.pradr.em
            }, () => this.props.setAdharManual(this.state));
        }
    }

    _formSubmit(e) {
        e.preventDefault();
        setTimeout(() => {
            this.props.history.push('/MobileOTP');
        }, 500);
    }

    handleValidation() {
        let ctrerror = 7, missed_fields;
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

    /* _PANEnter = e => {
         let regex = /^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]{1}?$/;
         if (e.target.value.length <= 10) {
             // this.obj.pan_correct = regex.test(e.target.value);
             // this.props.pan_adhar(e.target.value, '');
         }
     }
 */

    _pincodeFetch = () => {
        fetch(`http://postalpincode.in/api/pincode/${this.state.pincode}`, {
            mode: 'no-cors'
        })
        // .then(resp => resp.json())
            .then(resp => {
                let list_posts = resp.PostOffice;
                console.log(JSON.stringify(resp.PostOffice));
                if (list_posts !== null && list_posts === Object(list_posts)) {
                    this.setState({list_posts});
                }
            });
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
                <Link to={'/AdharPan'} className={"btn btn-link"}>Go Back </Link><br/><br/>
                <p className="paragraph_styling  text-center">

                    <b> Enter your personal information to proceed.</b>
                </p>
                <form
                    id="serverless-contact-form"
                    onSubmit={e => this._formSubmit(e)}
                >
                    <div className={"row"}>
                        <div className={"col-md-4 col-sm-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor="firstName" className={"bmd-label-floating"}>First Name *</label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Full Name"
                                    style={{textTransform: "uppercase", fontWeight: 600}}
                                    pattern="^[a-zA-Z]+$"
                                    title="Please enter First Name"
                                    autoCapitalize="characters"
                                    id="firstName"
                                    required={true}
                                    value={this.state.f_name}
                                    onBlur={() => {
                                        this.props.setAdharManual(this.state);
                                        this.handleValidation()
                                    }}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => {
                                        this.setState({f_name: e.target.value});
                                        this.validate.f_name = (e.target.value.length >= 2) ? true : false;
                                    }}
                                />
                            </div>
                        </div>
                        <div className={"col-md-4 col-sm-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor="middleName" className={"bmd-label-floating"}>Middle Name </label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Full Name"
                                    style={{textTransform: "uppercase", fontWeight: 600}}
                                    pattern="^[a-zA-Z]+$"
                                    title="Please enter Middle Name"
                                    autoCapitalize="characters"
                                    id="middleName"
                                    required={true}
                                    value={this.state.m_name}
                                    onBlur={() => this.props.setAdharManual(this.state)}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => this.setState({m_name: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className={"col-md-4 col-sm-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor="lastName" className={"bmd-label-floating"}>Last Name *</label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Full Name"
                                    style={{textTransform: "uppercase", fontWeight: 600}}
                                    pattern="^[a-zA-Z]+$"
                                    title="Please enter Last Name"
                                    autoCapitalize="characters"
                                    id="lastName"
                                    required={true}
                                    value={this.state.l_name}
                                    onBlur={() => {
                                        this.props.setAdharManual(this.state);
                                        this.handleValidation()
                                    }}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => {
                                        this.setState({l_name: e.target.value});
                                        this.validate.l_name = (e.target.value.length >= 2) ? true : false;
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="numberMobile" className={"bmd-label-floating"}>Mobile Number *</label>
                        <input
                            type="number"
                            className="form-control font_weight"
                            // placeholder="Mobile Number"
                            style={{textTransform: "uppercase", fontWeight: 600}}
                            pattern="^[0-9]{10}+$"
                            title="Please enter Mobile Number"
                            id="numberMobile"
                            required={true}
                            value={this.state.mobile}
                            onBlur={() => {
                                this.props.setAdharManual(this.state);
                                this.handleValidation()
                            }}
                            // ref={ref => (this.obj.pan = ref)}
                            onChange={(e) => {
                                let {value} = e.target;
                                if (e.target.value.length <= 10)
                                    this.setState({mobile: value});
                                this.validate.mobile = (value.length === 10 || value.length === 11) ? true : false;
                                // console.log(value.length);
                            }}
                        />
                    </div>
                    <div className="form-group mb-3 ">
                        <label htmlFor="textEmail" className={"bmd-label-floating"}>Email ID *</label>
                        <input
                            type="text"
                            className="form-control font_weight"
                            // placeholder="Email"
                            style={{textTransform: "uppercase", fontWeight: 600}}
                            pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
                            title="Please enter Email"
                            autoCapitalize="characters"
                            id="textEmail"
                            required={true}
                            value={this.state.email}
                            onBlur={() => {
                                this.props.setAdharManual(this.state);
                                this.handleValidation();
                            }}
                            // ref={ref => (this.obj.pan = ref)}
                            onChange={(e) => {
                                let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                                this.setState({email: e.target.value});
                                this.validate.email = (regex.test(e.target.value)) ? true : false;
                            }}
                        />
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            {/*<label htmlFor="ResidenceOwnership" className="labelLoan">
                                Gender
                            </label><br/>*/}
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
                                        width: "105px",
                                        backgroundColor:
                                            this.state.gender === "m" && "#00bfa5",
                                        color: this.state.gender === "m" && "white",
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
                                        width: "105px",
                                        backgroundColor:
                                            this.state.gender === "f" && "#00bfa5",
                                        color: this.state.gender === "f" && "white",
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
                        <div className={"col-sm-12 col-md-6"}>
                            {/*<label htmlFor="ResidenceOwnership" className="labelLoan">
                                Gender
                            </label><br/>*/}
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
                                        width: "105px",
                                        backgroundColor:
                                            this.state.ownership === "rented" && "#00bfa5",
                                        color: this.state.ownership === "rented" && "white",
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
                                        width: "105px",
                                        backgroundColor:
                                            this.state.ownership === "owned" && "#00bfa5",
                                        color: this.state.ownership === "owned" && "white",
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
                        <div className="form-group mb-3 col-md-6 col-sm-12">
                            <label htmlFor="numberPincode" className="bmd-label-floating">
                                Pincode *
                            </label>
                            <input
                                type="number"
                                className="form-control font_weight"
                                // placeholder="Pincode"
                                style={{textTransform: "uppercase", fontWeight: 600}}
                                pattern="^[0-9]{6}$"
                                title="Please enter Pincode"
                                autoCapitalize="characters"
                                id="numberPincode"
                                required={true}
                                value={this.state.pincode}
                                onBlur={() => {
                                    this.props.setAdharManual(this.state);
                                    // this._pincodeFetch();
                                    this.handleValidation();
                                }}
                                // ref={ref => (this.obj.pan = ref)}
                                onChange={(e) => {
                                    let regex = /^[0-9]{6,7}$/;
                                    if (e.target.value.length <= 6) this.setState({pincode: e.target.value});
                                    this.validate.pincode = (regex.test(e.target.value));
                                }}
                            />
                        </div>
                        <div className="form-group mb-3 col-md-6 col-sm-12">
                            <label htmlFor="dobDate" className="bmd-label-floating">
                                Date of Birth
                            </label>
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
                                style={{margin: 'auto'}}
                                dateFormat={'dd/MM/yyyy'}
                                onChange={(date) => this.changeDob(date)}

                            />
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-md-6 col-sm-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor="textAddress1" className="bmd-label-floating">
                                    Address 1
                                </label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Pincode"
                                    style={{textTransform: "uppercase", fontWeight: 600}}
                                    title="Please enter Address 1"
                                    autoCapitalize="characters"
                                    id="textAddress1"
                                    required={true}
                                    value={this.state.address1}
                                    onBlur={() => {
                                        this.props.setAdharManual(this.state);
                                        this.handleValidation();
                                    }}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => {
                                        this.setState({address1: e.target.value});
                                        this.validate.address1 = (e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className={"col-md-6 col-sm-12"}>
                            <div className="form-group mb-3 ">
                                <label htmlFor="textAddress2" className="bmd-label-floating">
                                    Address 2
                                </label>
                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="Pincode"
                                    style={{textTransform: "uppercase", fontWeight: 600}}
                                    title="Please enter Address 2"
                                    autoCapitalize="characters"
                                    id="textAddress2"
                                    required={true}
                                    value={this.state.address2}
                                    onBlur={() => {
                                        this.props.setAdharManual(this.state);
                                        this.handleValidation();
                                    }}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => {
                                        this.setState({address2: e.target.value});
                                        this.validate.address2 = (e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/*  <div className="form-group mb-3">
                        <label htmlFor="textAddress2" className="bmd-label-floating"> Select Your Locality *</label>
                        <select className="form-control font_weight"
                                style={{textTransform: "uppercase", fontWeight: 600}}
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
    authObj: state.authPayload.authObj,
    payload: state.authPayload.payload,
    adharObj: state.adharDetail.adharObj,
    gstProfile: state.businessDetail.gstProfile
});

export default withRouter(connect(
    mapStateToProps,
    {setAdharManual, changeLoader}
)(AdharPan));
