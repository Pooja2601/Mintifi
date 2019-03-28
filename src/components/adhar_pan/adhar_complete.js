import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
// import {baseUrl} from "../../shared/constants";
import {connect} from "react-redux";
import {setAdharManual} from "../../actions";
import {Link, withRouter} from "react-router-dom";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class AdharPan extends Component {
    // obj = {pan: '', adhar: '', pan_correct: false, adhar_skip: false, adhar_correct: false};
    // state = {adhar_skip: false};
    state = {full_name: '', mobile: '', email: '', dob: new Date(), gender: 'male', pincode: ''};

    componentWillMount() {
        this.props.setAdharManual({});
    }

    _formSubmit(e) {
        // alert('hi')
        e.preventDefault();
    }

    _PANEnter = e => {
        let regex = /^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]{1}?$/;
        if (e.target.value.length <= 10) {
            // this.obj.pan_correct = regex.test(e.target.value);
            // this.props.pan_adhar(e.target.value, '');
        }
    }


    render() {
        return (
            <>
                <Link to={'/AdharPan'}>Go Back </Link><br/><br/>
                <p className="paragraph_styling  text-center">
                    Don't have mobile linked with Aadhaar ?<br/>
                    No problem !<br/>
                    <b> Enter your personal information to proceed.</b>
                </p>
                <form
                    id="serverless-contact-form"
                    onSubmit={e => this._formSubmit(e)}
                >
                    {/*<label htmlFor="fullName">Full Name *</label>*/}
                    <div className="input-group mb-3">

                        <input
                            type="text"
                            className="form-control font_weight"
                            placeholder="Full Name"
                            style={{textTransform: "uppercase", fontWeight: 600}}
                            pattern="^[a-zA-Z]+(\s)[a-zA-Z]+$"
                            title="Please enter Full Name"
                            autoCapitalize="characters"
                            id="fullName"
                            required={true}
                            value={this.state.full_name}
                            // ref={ref => (this.obj.pan = ref)}
                            onChange={(e) => this.setState({full_name: e.target.value})}
                        />
                    </div>
                    <div className="input-group mb-3">
                        <input
                            type="number"
                            className="form-control font_weight"
                            placeholder="Mobile Number"
                            style={{textTransform: "uppercase", fontWeight: 600}}
                            pattern="^[0-9]{10}+$"
                            title="Please enter Mobile Number"
                            autoCapitalize="characters"
                            id="numberMobile"
                            required={true}
                            value={this.state.mobile}
                            // ref={ref => (this.obj.pan = ref)}
                            onChange={(e) => {
                                if (e.target.value.length <= 10) this.setState({mobile: e.target.value})
                            }}
                        />
                    </div>
                    <div className="input-group mb-3 ">
                        <input
                            type="text"
                            className="form-control font_weight"
                            placeholder="Email"
                            style={{textTransform: "uppercase", fontWeight: 600}}
                            pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
                            title="Please enter Email"
                            autoCapitalize="characters"
                            id="textEmail"
                            required={true}
                            value={this.state.email}
                            // ref={ref => (this.obj.pan = ref)}
                            onChange={(e) => this.setState({email: e.target.value})}
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
                                        this.setState({gender: 'male'});
                                    }}
                                    style={{
                                        width: "80px",
                                        backgroundColor:
                                            this.state.gender === "male" && "#00bfa5",
                                        color: this.state.gender === "male" && "white"
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
                                    <small style={{fontSize: "55%"}}>Male</small>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    onClick={() => {
                                        this.setState({gender: 'female'});
                                        // this.obj.gender =  "female";
                                    }}
                                    style={{
                                        width: "80px",
                                        backgroundColor:
                                            this.state.gender === "female" && "#00bfa5",
                                        color: this.state.gender === "female" && "white"
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
                                    <small style={{fontSize: "55%"}}>Female</small>
                                </button>
                            </div>
                        </div>
                        <div className="input-group mb-3 col-md-6 col-sm-12">
                            {/* <input
                            type="text"
                            className="form-control font_weight"
                            placeholder="Date Of Birth"
                            style={{textTransform: "uppercase", fontWeight: 600}}
                            pattern="^[a-zA-Z]+(\s)[a-zA-Z]+$"
                            title="Please enter DoB"
                            autoCapitalize="characters"
                            id="textDOB"
                            required={true}
                            value={this.state.dob}
                            // ref={ref => (this.obj.pan = ref)}
                            onChange={(e) => this.setState({ dob: e.target.value })}
                        />*/}
                            <br/>
                            <DatePicker
                                className="form-control font_weight"
                                placeholderText={"Date of Birth"}
                                selected={this.state.dob}
                                id={"dobDate"}
                                pattern={"^[0-9]{2}/[0-9]{2}/[0-9]{4}$"}
                                scrollableYearDropdown
                                showMonthDropdown
                                showYearDropdown
                                style={{margin: 'auto'}}
                                dateFormat={'dd/MM/yyyy'}
                                onChange={(date) => this.setState({dob: date})}
                            />
                        </div>

                    </div>

                    <div className="input-group mb-3">
                        <input
                            type="number"
                            className="form-control font_weight"
                            placeholder="Pincode"
                            style={{textTransform: "uppercase", fontWeight: 600}}
                            pattern="^[0-9]{6}$"
                            title="Please enter Pincode"
                            autoCapitalize="characters"
                            id="numberPincode"
                            required={true}
                            value={this.state.pincode}
                            // ref={ref => (this.obj.pan = ref)}
                            onChange={(e) => {
                                if (e.target.value.length <= 6) this.setState({pincode: e.target.value})
                            }}
                        />
                    </div>

                    <div className="mt-5 mb-5 text-center ">
                        {(
                            <input
                                type="submit"
                                name="submit"
                                value={"Proceed"}
                                onClick={e => this._formSubmit(e)}
                                className="form-submit btn partenrs_submit_btn"
                            />

                        )}
                    </div>
                </form>
            </>
        );
    }
}

const mapStateToProps = state => ({
    adharObj: state.authPayload.adharObj

});

export default withRouter(connect(
    mapStateToProps,
    {setAdharManual}
)(AdharPan));
