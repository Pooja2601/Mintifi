import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl, gst_karza} from "../../shared/constants";
import {connect} from "react-redux";
import {pan_adhar, changeLoader, setGstProfile} from "../../actions";
import {Link, withRouter} from "react-router-dom";

class AdharPan extends Component {
    state = {pan: '', adhar: '', pan_correct: false, adhar_skip: false, adhar_correct: false};

    //ToDo : Check the PAN with the backend AP for Confirmation of new user
    _formSubmit(e) {
        // alert('hi')
        e.preventDefault();
        this.adharSkipped();
    }

    _PANEnter = e => {
        let regex = /^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]{1}?$/;
        if (e.target.value.length <= 10) {
            let pan_correct = regex.test(e.target.value);
            this.setState({pan: (e.target.value).toUpperCase(), pan_correct});
            this.props.pan_adhar((e.target.value).toUpperCase(), '');
        }
    };

    _AdharEnter = e => {
        let regex = /^([0-9]){12}$/;
        if (e.target.value.length <= 12) {
            let adhar_correct = regex.test(e.target.value);
            this.setState({adhar: e.target.value, adhar_correct});
            this.props.pan_adhar(this.props.pan, e.target.value);
        }
    };

    adharSkipped = () => {
        this.setState({adhar_skip: !this.state.adhar_skip});
        // this.props.changeLoader(true);
        this.props.history.push('/AdharComplete'); // comment to allow PAN/GST request
        // this._panFetch();  // uncomment to allow PAN/GST request
    };

    _gstFetch = (gstPayload) => {
        this.props.changeLoader(true);
        fetch(`https://testapi.kscan.in/v1/gst/profile`, {
            method: 'POST',
            headers: {'Content-Type': "application/json", 'x-karza-key': "jdughfoP51majvjAUW6W"},
            body: JSON.stringify({
                consent: 'Y', gstin: gstPayload
            })
        })
            .then(resp => resp.json())
            .then(resp => {
                this.props.changeLoader(false);
                //  ADDPA8664N -prop // AAKCM7569B -pvt
                if (resp.result === Object(resp.result)) {
                    console.log("Could Not fetch GST Info"); // status 103
                    this.props.history.push('/AdharComplete');
                }
                else {
                    this.props.setGstProfile(resp.result);
                    setTimeout(() => this.props.history.push('/AdharComplete'), 500);
                    //  console.log(JSON.stringify(resp)); // status 101
                }
            }, () => {
                this.props.changeLoader(false)
            });
    };

    _panFetch = () => {
        fetch(`${gst_karza}/search`, {
            method: 'POST',
            headers: {'Content-Type': "application/json", 'x-karza-key': "jdughfoP51majvjAUW6W"},
            body: JSON.stringify({consent: 'Y', pan: (this.state.pan).toUpperCase()})
        })
            .then(resp => resp.json())
            .then(resp => {
                this.props.changeLoader(false);
                //  ADDPA8664N -prop // AAKCM7569B -pvt
                if (resp.result !== Object(resp.result)) {
                    console.log("Not a Company"); // status 103
                    this.props.history.push('/AdharComplete');
                }
                else {
                    this._gstFetch(resp.result[0].gstinId);  // status 101
                }
            }, () => {
                this.props.changeLoader(false)
            });
    };

    componentWillMount() {
        const {payload, changeLoader} = this.props;
        if (payload !== Object(payload))
            this.props.history.push("/Token");
        changeLoader(false);
    }

    componentDidMount() {
        console.log(this.props.pan.length);
        const {pan} = this.props;
        if (pan.length === 10)
            this.setState({pan_correct: true});
    }

    render() {
        return (
            <>
                <Link to={'/Token'} className={"btn btn-link"}>Go Back </Link>
                <h4 className={"text-center"}>New Customer?</h4>
                <h5 className="paragraph_styling  text-center">
                    <b>
                        Let us fetch some information for you.
                    </b>
                </h5>
                <form
                    id="serverless-contact-form"
                    onSubmit={e => this._formSubmit(e)}
                >


                    <div className={"row"}>
                        <div className={"col-sm-11 col-md-8"} style={{margin: 'auto'}}>
                            <div className="form-group mb-3">
                                {/*#00b7a5*/}
                                <label htmlFor="numberPAN" className={"bmd-label-floating"}>PAN Number * </label>

                                <input
                                    type="text"
                                    className="form-control font_weight"
                                    // placeholder="10 digit PAN Number"
                                    autoComplete={"off"}
                                    name="url"
                                    maxLength={10}
                                    minLength={10}
                                    style={{fontWeight: 600}}
                                    pattern="^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]{1}?$"
                                    title="Please enter valid PAN number. E.g. AAAAA9999A"
                                    autoCapitalize="characters"
                                    id="numberPAN"
                                    required={true}
                                    value={this.props.pan}
                                    // ref={ref => (this.obj.pan = ref)}
                                    onChange={(e) => this._PANEnter(e)}

                                />
                                <br/>
                            </div>
                        </div>
                        {/*<div className={"col-sm-11 col-md-8"} style={{ margin: 'auto 45%'}}>
                            Or
                        </div>*/}
                        <div className={"col-sm-11 col-md-8"} style={{margin: 'auto'}}>
                            <div className="form-group"
                                 style={{visibility: (this.state.pan_correct) ? 'visible' : 'hidden'}}>
                                <label htmlFor="numberAdhar" className={"bmd-label-floating"}>Aadhaar Number
                                    (optional)</label>
                                <div className={"input-group"}>
                                    <input
                                        type="number"
                                        className="form-control font_weight"
                                        name="url"
                                        pattern="^[0-9]{12}$"
                                        title="This field is required"
                                        autoComplete={"off"}
                                        style={{fontWeight: 600}}
                                        id="numberAdhar"
                                        maxLength={12}
                                        minLength={12}
                                        value={this.props.adhar}
                                        onChange={(e) => this._AdharEnter(e)}
                                        // ref={ref => (this.obj.adhar = ref)}
                                        aria-describedby="adhar-area"
                                    /><br/>


                                    <div className="input-group-append">
                                        <button
                                            className={(this.state.adhar_skip) ? 'btn btn-secondary' : 'btn btn-default'}
                                            style={{fontSize: '13px'}}
                                            type="button" onClick={() => this.adharSkipped()}
                                            id="adhar-area">Skip Aadhaar
                                        </button>
                                    </div>
                                </div>
                                <span className="bmd-help">Don't have mobile linked with Aadhaar ?</span>
                                <span className="bmd-help">No problem, skip it on the right side.</span>
                            </div>

                        </div>
                    </div>

                    <div className="mt-5 mb-5 text-center ">
                        {(this.state.pan_correct) && (
                            <input
                                type="submit"
                                name="submit"
                                value={"Proceed"}
                                onClick={e => this._formSubmit(e)}
                                className="form-submit btn btn-raised btn-raised greenButton"
                            />

                        )}
                    </div>
                </form>
            </>
        );
    }
}

const mapStateToProps = state => ({
    pan: state.adharDetail.pan,
    adhar: state.adharDetail.adhar,
    payload: state.authPayload.authObj
});

export default withRouter(connect(
    mapStateToProps,
    {pan_adhar, changeLoader, setGstProfile}
)(AdharPan));
