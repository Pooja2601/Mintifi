import React, {Component} from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl, gst_karza} from "../../../shared/constants";
import {connect} from "react-redux";
import {pan_adhar, changeLoader, setGstProfile, setBusinessDetail} from "../../../actions/index";
import {Link, withRouter} from "react-router-dom";
import {alertModule} from "../../../shared/commonLogic";

class AdharPan extends Component {
    state = {
        pan: '',
        adhar: '',
        pan_correct: false,
        adhar_skip: false,
        adhar_correct: false,
        gst_details: {},
        checked: {}
    };
    gstDetails = {
        companytype: '',
        gst: '',
        bpan: '',
        avgtrans: '',
        dealercode: '',
        lgnm: '',
        tnc_consent: false
    };
    // gst_profile = {};

    RenderModalGST = () => {

        return (
            <>
                <button type="button" style={{visibility: 'hidden'}} ref={ref => this.triggerModalGST = ref}
                        id={"triggerModalGST"} data-toggle="modal"
                        data-target="#GSTSelModal">
                </button>

                <div className="modal fade" id={"GSTSelModal"} ref={ref => this.docsSelModal = ref} tabIndex="-1"
                     role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document" style={{margin: '5.75rem auto'}}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Select the GST for which you need loan</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="checkbox">
                                    <div className={"row"}>
                                        {(this.state.gst_details === Object(this.state.gst_details) && this.state.gst_details.length) ? this.state.gst_details.map((val, key) => (
                                            <div key={key} className={"col-sm-6"}>

                                                <label>
                                                    <input type="radio" name={"gst_details"}
                                                           checked={(this.state.checked[key])}
                                                           onChange={(e) => {
                                                               this.setState(prevState => ({
                                                                   checked: {
                                                                       [key]: true
                                                                   }
                                                               }));
                                                           }
                                                           }/> <b
                                                    style={{
                                                        marginLeft: "20px",
                                                        fontSize: '13.5px',
                                                        color: 'black',
                                                        cursor: 'pointer',
                                                        textTransform: 'capitalize'
                                                    }}>{val.gstinId}</b>
                                                </label>


                                            </div>)) : <></>}
                                        <br/>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn greenButton btn-raised align-left"
                                        onClick={() => this._setGST()}
                                        style={{padding: '7px 11px 8px 11px'}}
                                        data-dismiss="modal">Select GST
                                </button>
                                <button type="button" className="btn btn-primary pull-right"
                                        data-dismiss="modal">Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>);
    };

    //ToDo : Check the PAN with the backend AP for Confirmation of new user
    _formSubmit(e) {
        e.preventDefault();
        this._panFetch();

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

    _setGST = () => {
        Object.keys(this.state.checked).map((val) => {
            this.gstDetails.gst = this.state.gst_details[val].gstinId;
        });
        this.props.setBusinessDetail(this.gstDetails);
        console.log(this.gstDetails);
        setTimeout(() => console.log(JSON.stringify(this.props.businessObj)), 1000);
        // setTimeout(() => this.adharSkipped(), 500);
    };

    adharSkipped = () => {
        this.setState({adhar_skip: !this.state.adhar_skip});
        this.props.history.push('/preapprove/personaldetail');
    };

    _gstFetch = (gstPayload) => {
        const {changeLoader, history, setGstProfile} = this.props;
        changeLoader(true);
        fetch(`https://testapi.kscan.in/v1/gst/profile`, {
            method: 'POST',
            headers: {'Content-Type': "application/json", 'x-karza-key': "jdughfoP51majvjAUW6W"},
            body: JSON.stringify({
                consent: 'Y', gstin: gstPayload
            })
        })
            .then(resp => resp.json())
            .then(resp => {
                changeLoader(false);
                //  ADDPA8664N -prop // AAKCM7569B -pvt
                if (resp.result === Object(resp.result)) {
                    console.log("Could Not fetch GST Info"); // status 103
                    history.push('/preapprove/personaldetail');
                }
                else {
                    setGstProfile(resp.result);
                    setTimeout(() => history.push('/preapprove/personaldetail'), 500);
                    //  console.log(JSON.stringify(resp)); // status 101
                }
            }, () => {
                changeLoader(false);
                alertModule();
            });
    };
    /*
        body: JSON.stringify({
        app_id: '3',
        anchor_id: '8186bc', //8186bc
        pan: pan
    })*/
    _panFetch = () => {
        let checked = {};
        const {changeLoader, history, payload, pan, token} = this.props;
        changeLoader(true);
        fetch(`${baseUrl}/companies/get_gst_details?app_id=3&anchor_id=8186bc&pan=${pan}`, {
            method: 'GET',
            headers: {'Content-Type': "application/json", token: token},
        })
            .then(resp => resp.json())
            .then(resp => {
                changeLoader(false);
                //  ADDPA8664N -prop // AAKCM7569B -pvt
                if (resp.response === Object(resp.response)) {

                    resp.response.gst_details.map((val, key) => {
                        checked[key] = false;
                    });
                    this.setState({checked, gst_details: resp.response.gst_details});
                    this.triggerModalGST.click();
                    // console.log(this.state.gst_details);
                }
                else {
                    alertModule(resp.error.message, 'error');
                    // this._gstFetch(resp.result[0].gstinId);  // status 101
                }
            }, () => {
                changeLoader(false);
                alertModule();
            });
    };

    componentWillMount() {
        const {payload, changeLoader} = this.props;
        if (payload !== Object(payload))
            this.props.history.push("/preapprove/token");
        changeLoader(false);
    }

    componentDidMount() {
        // console.log(this.props.pan.length);
        const {pan} = this.props;
        if (pan)
            if (pan.length === 10)
                this.setState({pan_correct: true});
    }

    render() {
        return (
            <>
                <Link to={'/Token'} className={"btn btn-link"}>Go Back </Link>
                {/*<h4 className={"text-center"}>New Customer?</h4>*/}
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


                                    {/* <div className="input-group-append">
                                        <button
                                            className={(this.state.adhar_skip) ? 'btn btn-secondary' : 'btn btn-default'}
                                            style={{fontSize: '13px'}}
                                            type="button" onClick={() => this.adharSkipped()}
                                            id="adhar-area">Skip Aadhaar
                                        </button>
                                    </div>*/}
                                </div>
                                <span className="bmd-help">Don't have mobile linked with Aadhaar ?</span>
                                <span className="bmd-help">No problem, you may skip it {/*on the right side*/}.</span>
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
                {this.RenderModalGST()}
            </>
        );
    }
}

const mapStateToProps = state => ({
    pan: state.adharDetail.pan,
    adhar: state.adharDetail.adhar,
    payload: state.authPayload.payload,
    token: state.authPayload.token,
    businessObj: state.businessDetail.businessObj
});

export default withRouter(connect(
    mapStateToProps,
    {pan_adhar, changeLoader, setGstProfile, setBusinessDetail}
)(AdharPan));
