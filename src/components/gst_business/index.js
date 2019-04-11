import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
// import {baseUrl} from "../../shared/constants";
import {connect} from "react-redux";
import {setBusinessDetail, setAdharManual} from "../../actions";
import {Link, withRouter} from "react-router-dom";
// import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class BusinessDetail extends Component {

    state = {companytype: '', gst: '', bpan: '', avgtrans: '', dealercode: ''};

    _formSubmit(e) {
        e.preventDefault();
        // this.props.setBusinessDetail(this.state);
        setTimeout(() => {
            this.props.history.push('/ReviewChanges')
        });
    }

    _PANEnter = e => {
        let regex = /^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]{1}?$/;
        if (e.target.value.length <= 10) {
            // this.obj.pan_correct = regex.test(e.target.value);
            // this.props.pan_adhar(e.target.value, '');
        }
    }

    businessGst(e) {
        if (e.target.value.length <= 15) {
            let bpan = e.target.value.substr(2, 10);
            this.setState({gst: e.target.value, bpan}, () => this.props.setBusinessDetail(this.state))
        }
    }

    componentWillMount() {
        if (this.props.businessObj === Object(this.props.businessObj))
            this.setState(this.props.businessObj);
        else this.props.setBusinessDetail(this.state);

        if (this.props.gstProfile === Object(this.props.gstProfile))
            this.setState({gst: this.props.gstProfile.result.gstin}, () => this.props.setBusinessDetail(this.state));
    }

    render() {
        return (
            <>
                {/*<Link to={'/AdharPan'} className={"btn btn-link"}>Go Back </Link>*/}
                <button onClick={() => this.props.history.goBack()} className={"btn btn-link"}>Go Back</button>
                <br/><br/>
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
                                onChange={(e) => this.setState({companytype: e.target.value}, () => this.props.setBusinessDetail(this.state))}
                                className="form-control font_weight" id="companyType">
                            <option value={''}>Select Company Type</option>
                            <option value={"proprietor"}>Proprietorship</option>
                            <option value={"partner"}>Partnership</option>
                            <option value={"trust"}>Trust</option>
                            <option value={"llp"}>LLP</option>
                            <option value={"pvt_ltd"}>Private Limited</option>
                            <option value={"ltd"}>Limited</option>
                            <option value={"other"}>Others</option>
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
                            // ref={ref => (this.obj.pan = ref)}
                            onChange={(e) => this.businessGst(e)}
                        />
                    </div>
                    {(this.state.companytype !== "proprietor" && this.state.companytype !== "") ? (
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
                                value={this.state.avgTrans}
                                // ref={ref => (this.obj.pan = ref)}
                                onChange={(e) => {
                                    if (e.target.value.length <= 10) this.setState({avgTrans: e.target.value}, () => this.props.setBusinessDetail(this.state))
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
                            onChange={(e) => {
                                if (e.target.value.length <= 8) this.setState({dealercode: e.target.value}, () => this.props.setBusinessDetail(this.state))
                            }}
                        />
                    </div>

                    <div className="mt-5 mb-5 text-center ">

                        <button
                            type="submit"
                            onClick={e => this._formSubmit(e)}
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
    businessObj: state.businessDetail.businessObj,
    gstProfile: state.businessDetail.gstProfile
});

export default withRouter(connect(
    mapStateToProps,
    {setBusinessDetail}
)(BusinessDetail));
