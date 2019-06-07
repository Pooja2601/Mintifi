import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {defaultLender, landingPayload} from "../../../shared/constants";
import {pan_adhar, setAdharManual, setBusinessDetail} from "../../../actions/index";
import {base64Logic} from "../../../shared/commonLogic";

const {PUBLIC_URL} = process.env;

class Dashboard extends Component {

    componentWillMount() {
        const {payload, authObj, businessObj, history} = this.props;

        /*     if (payload === Object(payload)) {
                 if (authObj !== Object(authObj))
                     history.push(`${PUBLIC_URL}/preapprove/auth`);
             }
             else history.push(`${PUBLIC_URL}/preapprove/token`);
             */
    }

    _editPersonal(e) {
        e.preventDefault();

    }

    render() {
        let {match, preFlightResp, history, payload, token} = this.props;
        // ToDo :  Hide it in Prod
        // match = {params: {status: 'declined'}};  // declined  // expired
        let credit_eligibility = {
            product_offered: 'LoC',
            loan_status: 'pending',
            loan_amount_approved: '500000',
            loan_tenor: '16',
            roi: '7',
            emi: '33440'
        };
        let loan_application_id = 1740;
        match = {params: {status: 'pending'}};
        let base64_encode = base64Logic(payload, 'encode');
        return (
            <>
                {/* <button onClick={() => history.push(`${PUBLIC_URL}/preapprove/businessdetail`)} className={"btn btn-link"}>
                    Go Back
                </button>*/}
                <br/>
                <h4 className={"text-center"}>Dashboard</h4>
                <br/>
                {/*<i style={{fontSize: '60px'}} className={"fa fa-exclamation-triangle closeCircle"}></i>*/}
                <h5 className="alert-heading text-center"> Dear <b><i> Hello</i></b></h5>
                <br/>
                <div className="paragraph_styling text-left" role="alert" style={{margin: 'auto 5%'}}>
                    <b className={"text-center"}> Your Credit Line details are as below:</b><br/>
                    <div
                        className={(match.params.status === 'pending') ? 'alert alert-info' : 'alert alert-success'}>

                        <table width="100%" style={{margin: 'auto 10%'}}>
                            <tbody>
                            {/*<tr>
                                    <td>PRODUCT OFFERED</td>
                                    <td>{credit_eligibility.product_offered}</td>
                                </tr>*/}
                            <tr>
                                <td className={"tableDataRight"}>Loan ID</td>
                                <td>{loan_application_id}</td>
                            </tr>
                            <tr>
                                <td className={"tableDataRight"}>Application Status</td>
                                <td>{credit_eligibility.loan_status}</td>
                            </tr>
                            <tr>
                                <td className={"tableDataRight"}>Lender</td>
                                <td>{defaultLender}</td>
                            </tr>
                            <tr>
                                <td className={"tableDataRight"}>Credit Approved</td>
                                <td>Rs. {credit_eligibility.loan_amount_approved}</td>
                            </tr>
                            <tr>
                                <td className={"tableDataRight"}>Tenure</td>
                                <td>{credit_eligibility.loan_tenor} Months</td>
                            </tr>
                            <tr>
                                <td className={"tableDataRight"}>EMI</td>
                                <td>Rs. {credit_eligibility.emi}</td>
                            </tr>
                            <tr>
                                <td className={"tableDataRight"}>Interest Rate</td>
                                <td> {credit_eligibility.roi} % p.a.</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {<div className="mt-5 mb-5 text-center ">

                    {/*ToDo : Applying the name of the anchor*/}

                    <button
                        type="button"
                        onClick={e => history.push(`${PUBLIC_URL}/drawdown/token/`, {
                            token: token,
                            payload: base64_encode
                        })}
                        className="form-submit btn btn-raised greenButton"
                    >Make Drawdown
                    </button>
                </div>}
                <div className="mt-5 mb-5 text-center"
                     style={{visibility: (credit_eligibility.loan_status) ? 'visible' : 'hidden'}}>

                    {/*ToDo : Applying the name of the anchor*/}

                    <button
                        type="button"
                        onClick={e => this._editPersonal(e)}
                        className="form-submit btn btn-raised greenButton"
                    >Edit Personal Information
                    </button>
                </div>
                <br/>
                <div className="paragraph_styling  text-center" style={{margin: 'auto 5%'}}>

                    <div className={"blockquote-footer"}>
                        In case of any query, please contact us at <a
                        href={"mailto:support@mintifi.com"}>support@mintifi.com</a> or <a href={"tel:+919999999999"}>+91
                        9999999999</a>. <br/>Please
                        mention your <b>( loan application id : )</b> in the
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
    // preFlightResp: state.businessDetail.preFlightResp
});

export default withRouter(
    connect(
        mapStateToProps,
        {setBusinessDetail, pan_adhar, setAdharManual}
    )(Dashboard)
);

