import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {setAdharManual} from "../../actions";
import {defaultLender} from '../../shared/constants';

class AppRejected extends Component {

    state = {confirmed: false};

    componentWillMount() {
        const {payload, authObj, adharObj, businessObj} = this.props;
        if (payload !== Object(payload))
            if (authObj !== Object(authObj))
                if (adharObj !== Object(adharObj))
                    if (businessObj !== Object(businessObj))
                        this.props.history.push("/Token");
    }

    render() {
        const {adharObj, match, preFlightResp} = this.props;

        if (adharObj === Object(adharObj))
        // if(preFlightResp ===Object(preFlightResp))
        {
            const {f_name, l_name} = adharObj;
            const load_status = 'pending';  // pending // approved
            // const {loan_application_id, credit_eligibility} = preFlightResp;

            let credit_eligibility = {
                product_offered: 'LoC',
                loan_status: load_status,
                loan_amount_approved: '500000',
                loan_tenor: '16',
                roi: '7',
                emi: '33440'
            };
            let loan_application_id = 1740;
            let match = {params: {status: load_status}};
            let iconCss = 'fa checkCircle ';
            return (
                <>
                    {/* <button onClick={() => this.props.history.push('/BusinessDetail')} className={"btn btn-link"}>
                    Go Back
                </button>*/}
                    <h4 className={"text-center"}>Credit Eligibility</h4>
                    <br/>

                    <i className={(match.params.status === 'pending') ? iconCss + 'fa-hourglass-half' : iconCss + 'fa-check-circle'}
                       style={{color: (match.params.status === 'pending') ? '#02587F' : '', fontSize: '60px'}}></i>
                    <h5 className={"text-center"}> Application {(match.params.status === 'pending') ? 'Pending...' : 'Approved !'}</h5>

                    <div className={'alert text-center'}
                         role="alert">
                        <p className="paragraph_styling">{(match.params.status === 'pending') ? <>Thank you {f_name} for
                            completing the Loan Application process <br/>However, we need more information for
                            processing your loan application .<br/> We will get in touch with you in next 24
                            hours.</> : <> Dear {f_name} {l_name}, Congratulations. You are eligible for a credit limit
                            of <b
                                style={{fontWeight: '700'}}> Rs. {credit_eligibility.loan_amount_approved}/-</b></>} </p>
                        {/*<p className="paragraph_styling " style={{fontSize: '14px'}}>
                            Thank you for completing the Loan Application process.<br/>
                            {(match.params.status === 'pending') ? <>However, we need more information for
                                    processing your loan application .<br/> We will get in touch with you in next 24
                                    hours.</> :
                                <b><br/>Your Application is approved for a credit line of
                                    <b style={{fontWeight: '700'}}> Rs. {credit_eligibility.loan_amount_approved}/-</b>.</b>}
                            <br/>
                        </p>*/}
                    </div>
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
                    <br/>
                    {(match.params.status !== 'pending') ?
                        (<>
                            <div className="checkbox " style={{marginLeft: '2.3rem'}}>
                                <label style={{color: 'black'}}>
                                    <input type="checkbox" checked={this.state.confirmed}
                                           onChange={(e) =>
                                               this.setState(prevState => ({confirmed: !prevState.confirmed}))
                                           }/> I accept the terms of the credit eligibility as given above.
                                </label>
                            </div>
                            <div className="mt-5 mb-3 text-center ">
                                <button
                                    type="button"
                                    disabled={!this.state.confirmed}
                                    onClick={e => this.props.history.push('/DocsUpload')}
                                    className="form-submit btn btn-raised greenButton"
                                >Complete Your KYC
                                </button>
                            </div>
                        </>) : <>
                            <div className={"blockquote-footer mb-5 text-center"}>
                                In case of any query, please contact us at <a
                                href={"mailto:support@mintifi.com"}>support@mintifi.com</a> or <a
                                href={"tel:+919999999999"}>+91 9999999999</a>. <br/>Please
                                mention your ( loan application id ) in the request.
                            </div>
                            <div className="mt-5 mb-5 text-center ">
                                {/*
                    ToDo : Applying the name of the anchor
                    */}
                                <button
                                    type="button"
                                    onClick={e => this.props.history.push('/')}
                                    className="form-submit btn btn-raised greenButton"
                                >Back to Yatra
                                </button>
                            </div>
                        </>
                    }
                </>
            )
        }
    }
}

const mapStateToProps = state => ({
    adharObj: state.adharDetail.adharObj,
    authObj: state.authPayload.authObj,
    businessObj: state.businessDetail.businessObj,
    payload: state.authPayload.payload,
    preFlightResp: state.businessDetail.preFlightResp
});

export default withRouter(
    connect(
        mapStateToProps,
        {setAdharManual}
    )(AppRejected)
);
