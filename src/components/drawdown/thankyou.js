import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {changeLoader, setAdharManual} from "../../actions";
import {defaultLender} from '../../shared/constants';

class ThankYou extends Component {

    componentWillMount() {

        const {payload, authObj, changeLoader} = this.props;
        if (payload !== Object(payload))
            if (authObj !== Object(authObj))
                this.props.history.push("/Drawdown/Auth");
        changeLoader(false);
    }

    render() {
        let {payload, match, preFlightResp, loanPayload, authObj} = this.props;
        // if (payload === Object(payload)) {

        // ToDo : Comment the below code in production
        let {f_name, l_name} = payload;
        f_name = 'Mahesh';
        l_name = 'Pai';

        // ToDo : make it const in prod.
        let {creditLimit, loanStatus, loanOffers} = loanPayload;

        return (
            <>
                {/* <button onClick={() => this.props.history.push('/BusinessDetail')} className={"btn btn-link"}>
                    Go Back
                </button>*/}
                <i style={{fontSize: '60px'}} className={"fa fa-check-circle checkCircle"}></i>
                <h3 className={"text-center"}> Processing Application ...</h3>
                <br/>

                <div className="alert  text-center" role="alert">
                    <h5 className="alert-heading">Dear {f_name} {l_name}</h5>
                    <p className="paragraph_styling ">
                        Your payment request has been processed successfully.<br/> Your payment request details are as
                        below :
                    </p>
                </div>

                <div className="paragraph_styling text-left alert alert-success" role="alert"
                     style={{margin: 'auto 5%'}}
                >

                    {(preFlightResp === Object(preFlightResp) && loanPayload === Object(loanPayload)) ? (
                        <table width="100%" style={{margin: 'auto 10%'}}>
                            <tbody>
                            <tr>
                                <td className={"tableDataRight"}>Product Selected</td>
                                <td className={'text-capitalize'}>{preFlightResp.offer.product_type}</td>
                            </tr>
                            {/*<tr>
                                <td className={"tableDataRight"}>Loan ID</td>
                                <td>{loanOffers.loan.loan_application_id}</td>
                            </tr>*/}
                            {/*<tr>
                                <td className={"tableDataRight"}>DrawDown ID</td>
                                <td>{preFlightResp.anchor_drawdown_id}</td>
                            </tr>*/}
                            <tr>
                                <td className={"tableDataRight"}>Loan Status</td>
                                <td>{loanStatus.loan_status}</td>
                            </tr>
                            <tr>
                                <td className={"tableDataRight"}>Lender</td>
                                <td>{defaultLender}</td>
                            </tr>
                            <tr>
                                <td className={"tableDataRight"}>Credit Balance</td>
                                <td>Rs. {creditLimit.balance_credit_limit}</td>
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
                        onClick={e => this.props.history.push('/Drawdown/Auth')}
                        className="form-submit btn btn-raised greenButton"
                    >Alright
                    </button>
                </div>
            </>
        )
        // }
        // else return (<></>)
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
