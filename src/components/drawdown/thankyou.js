import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {changeLoader, setAdharManual} from "../../actions";
import {defaultLender, environment} from '../../shared/constants';
import {postMessage} from "../../shared/common_logic";

const {PUBLIC_URL} = process.env;

class ThankYou extends Component {

    componentWillMount() {

        const {payload, authObj, changeLoader, history} = this.props;
        if (payload !== Object(payload) && !payload)
            history.push(`${PUBLIC_URL}/drawdown/token`);
        if (authObj !== Object(authObj) && !authObj)
            history.push(`${PUBLIC_URL}/drawdown/auth`);
        changeLoader(false);
    }

    render() {
        let {payload, match, preFlightResp, loanPayload, authObj, history} = this.props;

        if (payload === Object(payload)) {

            let {f_name, l_name} = payload;
            let loan_product = '';

            // ToDo : Comment the below code in production
            if (environment === 'local') {
                f_name = 'Mahesh';
                l_name = 'Pai';
            }
            // ToDo : make it const in prod.
            // let {creditLimit, loanStatus, loanOffers} = loanPayload;


            if (preFlightResp === Object(preFlightResp)) {
                loan_product = (preFlightResp.offer.product_type).split('_');
                loan_product = loan_product[0] + ' ' + loan_product[1];
            }

            if (window.location !== window.parent.location)
                postMessage({
                    drawdown_status: "success",
                    drawdown_offer: preFlightResp.offer,
                    loan_id: loanPayload.loanOffers.loan.loan_application_id,
                    drawdown_id: preFlightResp.drawdown_id,
                    action: "close"
                });

            return (
                <>
                    {/* <button onClick={() => history.push(`${PUBLIC_URL}/businessdetail`)} className={"btn btn-link"}>
                    Go Back
                </button>*/}
                    <div className={"thankYouPage"}>
                        <i className={"fa fa-check-circle checkCircle"}></i>
                        <h3 className={"text-center"}> Processing Application</h3>
                        <br/>

                        <div className="alert  text-center" role="alert">
                            {/*<h5 className="alert-heading">Dear {f_name} {l_name}</h5>*/}
                            <p className="paragraph_styling ">
                                Your payment request has been processed successfully.<br/> Your payment request details
                                are
                                as
                                below :
                            </p>
                        </div>

                        <div className="paragraph_styling text-left alert alert-success innerDiv" role="alert"
                        >
                            {(preFlightResp === Object(preFlightResp) && loanPayload === Object(loanPayload)) ? (
                                <table>
                                    <tbody>
                                    <tr>
                                        <td className={"tableDataRight"}>Product Selected</td>
                                        <td className={'text-capitalize'}>{loan_product}</td>
                                    </tr>
                                    <tr>
                                        <td className={"tableDataRight"}>Loan ID</td>
                                        <td>{loanPayload.loanOffers.loan.loan_application_id}</td>
                                    </tr>
                                    <tr>
                                        <td className={"tableDataRight"}>DrawDown ID</td>
                                        <td>{preFlightResp.drawdown_id}</td>
                                    </tr>
                                    {/*
                                    <tr>
                                        <td className={"tableDataRight"}>Loan Status</td>
                                        <td>{loanPayload.loanStatus.loan_application_status}</td>
                                    </tr>*/}
                                    <tr>
                                        <td className={"tableDataRight"}>Lender</td>
                                        <td>{defaultLender}</td>
                                    </tr>
                                    <tr>
                                        <td className={"tableDataRight"}>Credit Balance</td>
                                        <td>Rs. {loanPayload.creditLimit.balance_credit_limit}</td>
                                    </tr>
                                    <tr>
                                        <td className={"tableDataRight"}>Tenure</td>
                                        <td>{preFlightResp.offer.tenor} Months</td>
                                    </tr>
                                    <tr>
                                        <td className={"tableDataRight"}>EMI</td>
                                        <td>Rs. {preFlightResp.offer.emi}</td>
                                    </tr>
                                    <tr>
                                        <td className={"tableDataRight"}>Rate of Interest</td>
                                        <td> {preFlightResp.offer.roi} %</td>
                                    </tr>
                                    </tbody>
                                </table>) : <></>}

                        </div>
                        <div className="mt-5 mb-5 text-center ">
                            <button
                                type="button"
                                onClick={e => history.push(`${PUBLIC_URL}/drawdown/auth`)}
                                className="form-submit btn btn-raised greenButton"
                            >Alright
                            </button>
                        </div>
                    </div>
                </>
            )
        }
        else return (<></>)
    }
}

const mapStateToProps = state => ({
    token: state.drawdownReducer.token,
    payload: state.drawdownReducer.payload,
    authObj: state.drawdownReducer.authObj,
    preFlightResp: state.drawdownReducer.preFlightResp,
    loanPayload: state.drawdownReducer.loanPayload,
});

export default withRouter(
    connect(
        mapStateToProps,
        {changeLoader}
    )(ThankYou)
);
