import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {defaultLender, landingPayload, existUserPayload, environment} from "../../../shared/constants";
import {pan_adhar, setAdharManual, setBusinessDetail} from "../../../actions/index";
import {base64Logic} from "../../../shared/commonLogic";

const {PUBLIC_URL} = process.env;

class Dashboard extends Component {

    componentWillMount() {
        const {payload, authObj, history, summaryObj} = this.props;
        console.log(summaryObj);
        if (payload === Object(payload)) {
            if (authObj !== Object(authObj))
                history.push(`${PUBLIC_URL}/preapprove/auth`);
            if (summaryObj === Object(summaryObj))
                history.push(`${PUBLIC_URL}/preapprove/auth`);
        }
        else history.push(`${PUBLIC_URL}/preapprove/token`);
    }

    _editPersonal(e) {
        e.preventDefault();

    }

    render() {
        let {match, history, payload, token, summaryObj} = this.props;
        let loan_app_payload;

        if (environment === 'local')
            loan_app_payload = existUserPayload;

        loan_app_payload = summaryObj;

        let base64_encode = base64Logic(payload, 'encode');
        return (
            <>
                {/* <button onClick={() => history.push(`${PUBLIC_URL}/preapprove/businessdetail`)} className={"btn btn-link"}>
                    Go Back
                </button>*/}
                <br/>
                <h4 className={"text-center"}>Dashboard</h4>
                <br/>
                {(loan_app_payload === Object(loan_app_payload)) ?
                    <h5 className="alert-heading text-center"> Dear <b><i> {loan_app_payload.user_name}</i></b>
                    </h5> : null
                }
                <br/>

                {(loan_app_payload === Object(loan_app_payload)) ?
                    <div className="paragraph_styling text-left" role="alert" style={{margin: 'auto 5%'}}>
                        <b className={"text-center"}> Your Credit Line details are as below:</b><br/>
                        <div
                            className={(loan_app_payload.loan_status === 'pending') ? 'alert alert-info' : 'alert alert-success'}>

                            <table width="100%" style={{margin: 'auto 10%'}}>
                                <tbody>
                                <tr>
                                    <td className={"tableDataRight"}>Product Offered</td>
                                    <td>Rs. {loan_app_payload.loan_product_type}</td>
                                </tr>
                                <tr>
                                    <td className={"tableDataRight"}>Loan ID</td>
                                    <td>{loan_app_payload.loan_application_id}</td>
                                </tr>
                                <tr>
                                    <td className={"tableDataRight"}>Application Status</td>
                                    <td>{loan_app_payload.loan_status}</td>
                                </tr>
                                <tr>
                                    <td className={"tableDataRight"}>Credit Approved</td>
                                    <td>Rs. {loan_app_payload.loan_amount_approved}</td>
                                </tr>
                                {/* <tr>
                                <td className={"tableDataRight"}>Lender</td>
                                <td>{loan_app_payload.defaultLender}</td>
                            </tr>*/}
                                {/*<tr>
                                <td className={"tableDataRight"}>Tenure</td>
                                <td>{loan_details.loan_tenor} Months</td>
                            </tr>
                            <tr>
                                <td className={"tableDataRight"}>EMI</td>
                                <td>Rs. {loan_details.emi}</td>
                            </tr>
                            <tr>
                                <td className={"tableDataRight"}>Interest Rate</td>
                                <td> {loan_details.roi} % p.a.</td>
                            </tr>*/}
                                </tbody>
                            </table>
                        </div>
                    </div> : <></>}
                <div className="mt-5 mb-5 text-center ">

                    {/*ToDo : Applying the name of the anchor*/}

                    <button
                        type="button"
                        style={{visibility: (loan_app_payload === Object(loan_app_payload)) ? 'visible' : 'hidden'}}
                        onClick={e => history.push(`${PUBLIC_URL}/drawdown/token/`, {
                            token: token,
                            payload: base64_encode
                        })}
                        className="form-submit btn btn-raised greenButton"
                    >Make Drawdown
                    </button>
                </div>
                {/*<div className="mt-5 mb-5 text-center"
                     style={{visibility: (loan_details.loan_status) ? 'visible' : 'hidden'}}>

                    ToDo : Applying the name of the anchor

                    <button
                        type="button"
                        onClick={e => this._editPersonal(e)}
                        className="form-submit btn btn-raised greenButton"
                    >Edit Personal Information
                    </button>
                </div>*/}
                <br/>
                <div className="paragraph_styling  text-center" style={{margin: 'auto 5%'}}>

                    <div className={"blockquote-footer"}>
                        In case of any query, please contact us at <a
                        href={"mailto:support@mintifi.com"}>support@mintifi.com</a> or <a href={"tel:+919999999999"}>+91
                        9999999999</a>. <br/>Please
                        mention your <b>( loan application id
                        : {(loan_app_payload === Object(loan_app_payload)) ? loan_app_payload.loan_application_id : null})</b> in
                        the
                        request.
                    </div>
                    <br/>

                </div>

            </>
        )
    }
}

const mapStateToProps = state => ({
    authObj: state.authPayload.authObj,
    payload: state.authPayload.payload,
    token: state.authPayload.token,
    summaryObj: state.authPayload.summaryObj
    // preFlightResp: state.businessDetail.preFlightResp
});

export default withRouter(
    connect(
        mapStateToProps,
        {setBusinessDetail, pan_adhar, setAdharManual}
    )(Dashboard)
);

