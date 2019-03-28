import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
// import {baseUrl} from "../../shared/constants";
import {connect} from "react-redux";
import {pan_adhar} from "../../actions";
import {Link, withRouter} from "react-router-dom";


class AdharPan extends Component {
    obj = {pan: '', adhar: '', pan_correct: false, adhar_skip: false, adhar_correct: false};
    state = {adhar_skip: false};

    _formSubmit(e) {
        // alert('hi')
        e.preventDefault();
    }

    _PANEnter = e => {
        let regex = /^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]{1}?$/;
        if (e.target.value.length <= 10) {
            this.obj.pan_correct = regex.test(e.target.value);
            this.props.pan_adhar(e.target.value, '');
        }
    }

    _AdharEnter = e => {
        let regex = /^([0-9]){12}$/;
        if (e.target.value.length <= 12) {
            this.obj.adhar_correct = regex.test(e.target.value);
            this.props.pan_adhar(this.props.pan, e.target.value);
        }
    }

    adharSkipped = () => {
        // alert('skipped');
        // this.obj.adhar_skip = !this.obj.adhar_skip;
        this.setState({adhar_skip: !this.state.adhar_skip});
        this.props.history.push('/AdharComplete')
        // alert(this.state.adhar_skip);

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
                            autoComplete={"off"}
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

                        />
                    </div>
                    {(this.obj.pan_correct) && (
                        <div className="input-group mb-3">
                            <input
                                type="number"
                                className="form-control font_weight"
                                placeholder="Enter the Aadhaar"
                                name="url"
                                pattern="^[0-9]{12}$"
                                title="This field is required"
                                autoComplete={"off"}
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
                                <button
                                    className={(this.state.adhar_skip) ? 'btn btn-secondary' : 'btn btn-default'}
                                    style={{fontSize: '13px'}}
                                    type="button" onClick={() => this.adharSkipped()}
                                    id="adhar-area">Skip Aadhaar
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="mt-5 mb-5 text-center ">
                        {(this.obj.pan_correct && this.obj.adhar_correct) && (
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
