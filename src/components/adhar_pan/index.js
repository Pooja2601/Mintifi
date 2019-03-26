import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
// import {baseUrl} from "../../shared/constants";
import {connect} from "react-redux";
import {pan_adhar} from "../../actions";
import {Link, withRouter} from "react-router-dom";

const Timer = 10;

class AdharPan extends Component {
    state = {submitted: false, loading: false, showMsg: {}, timer: Timer, mobile: '', otp: ''};
    obj = {pan: '', adhar: ''};

    _formSubmit(e) {
        // alert('hi')
        e.preventDefault();
    }

    _PANEnter = e => {
        if (e.target.value.length <= 10) this.props.pan_adhar(e.target.value, '');
        else this.props.pan_adhar('', '');
    }

    _AdharEnter = e => {
        if (e.target.value.length <= 12) this.props.pan_adhar(this.props.pan, e.target.value);
        // else this.props.pan_adhar('', '');
    }

    render() {
        return (
            <>
                <Link to={'/'}>Go Back </Link>
                <p className="paragraph_styling  text-center">
                    <b> New Customer?</b><br/>
                    Let us fetch some information for you.
                </p>
                <form
                    id="serverless-contact-form"
                    onSubmit={e => this._formSubmit(e)}
                >
                    <label htmlFor="numberPAN">PAN Number *</label>
                    <div className="input-group mb-3">

                        <input
                            type="text"
                            className="form-control font_weight"
                            placeholder="10 digit PAN Number"
                            name="url"
                            maxLength={10}
                            minLength={10}
                            style={{textTransform: "uppercase", fontWeight: 600}}
                            pattern="^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]{1}?$"
                            title="Please enter valid PAN number. E.g. AAAAA9999A"
                            autoCapitalize="characters"
                            id="numberPAN"
                            required={true}
                            value={this.props.pan}
                            // ref={ref => (this.obj.pan = ref)}
                            onChange={(e) => this._PANEnter(e)}
                            // onBlur={() => this.props.pan_adhar(this.obj.pan.value, '')}

                        />
                    </div>
                    {(this.props.pan) && (
                        <div className="input-group mb-3">
                            <input
                                type="number"
                                className="form-control font_weight"
                                placeholder="Enter the Aadhaar"
                                name="url"
                                pattern="^[0-9]{12}$"
                                title="This field is required"
                                style={{fontWeight: 600}}
                                id="numberAdhar"
                                maxLength={12}
                                minLength={12}
                                value={this.props.adhar}
                                min={100000000000}
                                max={999999999999}
                                onChange={(e) => this._AdharEnter(e)}
                                // ref={ref => (this.obj.adhar = ref)}
                                aria-describedby="adhar-area"
                            />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary"
                                        type="button"
                                        id="adhar-area">Skip Aadhaar
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="mt-5 mb-5 text-center ">
                        {this.props.pan && (
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
    pan: state.authPayload.pan,
    adhar: state.authPayload.adhar

});

export default withRouter(connect(
    mapStateToProps,
    {pan_adhar}
)(AdharPan));
