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
        gender: 'male',
        pincode: '',
        // address1: '',
        address2: '',
        list_posts: '',
        missed_fields: false
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
        // address1: false,
        // address2: false,
    };

    componentWillMount() {
        let state = this.props.adharObj;
        if (state === Object(state))
            this.setState(state, () => {
                Object.keys(this.state).map((val, key) => {
                    if (this.validate[val] !== undefined)
                        this.validate[val] = (this.state[val].length > 0);
                    // console.log(this.validate);
                });
            });
        else this.props.setAdharManual(this.state);

        this._loadGstProfile();
        this.props.changeLoader(false);
    }

    _loadGstProfile() {

    }

    _formSubmit(e) {
        e.preventDefault();
        setTimeout(() => {
            this.props.history.push('/BusinessDetail');
        }, 500);
        // alert('Blank fields ' + this.state.missed_fields);
    }

    handleValidation() {
        let ctrerror = 0, missed_fields;
        // let missed_fields = Object.keys(this.validate).some(x => this.validate[x]);
        Object.values(this.validate).map((val, key) => {
            if (val)
                --ctrerror;
            else ++ctrerror;
            console.log(val);
        });
        if (ctrerror <= 0)
            missed_fields = false;
        else missed_fields = true;

        this.setState({missed_fields},()=> console.log('All Fields Validated : ' + missed_fields));

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
                                        this.setState({gender: 'male'}, () => this.props.setAdharManual(this.state));
                                    }}
                                    style={{
                                        width: "105px",
                                        backgroundColor:
                                            this.state.gender === "male" && "#00bfa5",
                                        color: this.state.gender === "male" && "white",
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
                                        this.setState({gender: 'female'}, () => this.props.setAdharManual(this.state));

                                    }}
                                    style={{
                                        width: "105px",
                                        backgroundColor:
                                            this.state.gender === "female" && "#00bfa5",
                                        color: this.state.gender === "female" && "white",
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
                                onChange={(date) => {
                                    this.setState({dob: date});
                                }}
                                onBlur={() => this.props.setAdharManual(this.state)}
                            />
                        </div>
                    </div>

                    <div className="form-group mb-3">
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
                                let regex = /^[0-9]{6}$/;
                                if (e.target.value.length <= 6) this.setState({pincode: e.target.value});
                                this.validate.pincode = (regex.test(e.target.value)) ? true : false;
                            }}
                        />
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
                        <button
                            type="submit"
                            onClick={e => this._formSubmit(e)}
                            disabled={this.state.missed_fields}
                            className="form-submit btn btn-raised partenrs_submit_btn"
                        >Proceed
                        </button>
                    </div>
                </form>
            </>
        );
    }
}

const mapStateToProps = state => ({
    adharObj: state.adharDetail.adharObj

});

export default withRouter(connect(
    mapStateToProps,
    {setAdharManual, changeLoader}
)(AdharPan));
