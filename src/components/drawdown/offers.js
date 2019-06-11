import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {changeLoader, DrawsetLoanPayload, DrawsetPreflight} from "../../actions";
import {otpUrl, baseUrl, environment, app_id} from "../../shared/constants";
import {PrivacyPolicy, TnCPolicy} from "../../shared/policy";
import {alertModule} from "../../shared/commonLogic";

const {PUBLIC_URL} = process.env;

const creditLimit = {
    "status": "success",
    "error_code": "E000",
    "approved_credit_limit": 200000,
    "balance_credit_limit": 100000,
    "timestamp": "2019-09-09T06:42:12.000Z"
};

const loanStatus = {
    "status": "success",
    "error_code": "E000",
    "loan_status": "bank_approved",
    "loan_status_date": "2019-09-07T06:42:12.000Z",
    "timestamp": "2019-09-09T06:42:12.000Z"
};

const loanOffers = {
    "status": "success",
    "error_code": "E000",
    "company_id": 8765,
    "amount": 50000,
    "loan": {
        "loan_application_id": 994,
        "offers": [{
            "product_type": "term_loan",
            "roi": 18,
            "tenor": 3,
            "emi": 19666
        }, {
            "product_type": "term_loan",
            "roi": 18,
            "tenor": 6,
            "emi": 9833
        }, {
            "product_type": "term_loan",
            "roi": 18,
            "tenor": 9,
            "emi": 6555
        }, {
            "product_type": "term_loan",
            "roi": 18,
            "tenor": 12,
            "emi": 4916
        }]
    },
    "timestamp": "2019-09-09T06:42:12.000Z"
};


// Before submitting the drawdown Form , Its a Request Object
const preFlightResp = {
        "status": "success",
        "error_code": "E000",
        "drawdown_id": 23879879,
        "offer": {
            "product_type": "term_loan",
            "roi": 18,
            "tenor": 3,
            "emi": 2000
        },
        "timestamp": "2019-09-09T06:42:12.000Z"
    }
;


class Offers extends Component {

    state = {tnc_consent: false, selected: {}};

    _fetchInformation = () => {

        const {token, payload, DrawsetLoanPayload, loanPayload, changeLoader} = this.props;
        changeLoader(true);
        // Getting Credit Limit
        fetch(`${baseUrl}/companies/${payload.company_id}/limit/`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', token: token},
            body: JSON.stringify({
                "app_id": app_id,
                "anchor_id": "6iu89o",
                "loan_application_id": "1975"
            })
        }).then((resp) => {
            changeLoader(false);
            if (resp.status === "success") {
                DrawsetLoanPayload({loanOffers: null, loanStatus: null, creditLimit: resp});
            }
            else alertModule('An error occurred while fetching credit limit', 'warn');
        }, (resp) => {
            changeLoader(false);
            alertModule();
        });

        // Getting Loan Status
        setTimeout(() => {
                changeLoader(true);
                fetch(`${baseUrl}/loans/${payload.loan_application_id}/status/`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json', token: token},
                    body: JSON.stringify({
                        "app_id": app_id,
                        "anchor_id": "6iu89o"
                    })
                }).then((resp) => {
                    changeLoader(false);
                    if (resp.status === "success") {
                        DrawsetLoanPayload({loanOffers: null, loanStatus: resp, creditLimit: loanPayload.creditLimit});
                    }
                    else alertModule('An error occurred while fetching Loan Status', 'warn');
                }, (resp) => {
                    changeLoader(false);
                    alertModule();
                })
            }
            , 1000);

        // Getting Loan Offers
        setTimeout(() => {
                changeLoader(true);
                fetch(`${baseUrl}/loans/${payload.loan_application_id}/offers/`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json', token: token},
                    body: JSON.stringify({
                        "app_id": app_id,
                        "anchor_id": "6iu89o",
                        "amount": payload.drawdown_amount,
                    })
                }).then((resp) => {
                    changeLoader(false);
                    if (resp.status === "success") {
                        DrawsetLoanPayload({
                            loanOffers: resp,
                            loanStatus: loanPayload.loanStatus,
                            creditLimit: loanPayload.creditLimit
                        });
                    }
                    else alertModule('An error occurred while fetching Loan Offers', 'warn');
                }, (resp) => {
                    changeLoader(false);
                    alertModule();
                })
            }
            , 1500);
    };


    RenderModalTnC = () => {
        return (
            <>
                <button type="button" style={{visibility: 'hidden'}} ref={ref => this.triggerTnCModal = ref}
                        id={"triggerTnCModal"} data-toggle="modal"
                        data-target="#TnCMsgModal">
                </button>

                <div className="modal fade" id={"TnCMsgModal"} tabIndex="-1"
                     role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document" style={{margin: '5.75rem auto'}}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{(this.state.tncModal) ? 'Terms and Conditions' : 'Privacy policy'}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {(this.state.tncModal) ? TnCPolicy({fontSize: 13}) : PrivacyPolicy({
                                    fontSize: 13,
                                    headSize: 1.5
                                })}

                            </div>
                            <div className="modal-footer">
                                {/*<button type="button" className="btn btn-primary">Save changes</button>*/}
                                <button type="button" className="btn btn-primary" ref={ref => this.closeModal = ref}
                                        data-dismiss="modal">Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>);
    };

    _submitForm(e) {
        const {payload, token, changeLoader, authObj, loanPayload, history, DrawsetPreflight} = this.props;
        // e.preventDefault();
        this.props.changeLoader(true);
        fetch(`${baseUrl}/loans/${loanPayload.loanOffers.loan.loan_application_id}/drawdown/`, {
            method: "POST",
            headers: {'Content-Type': 'application/json', token: token},
            body: JSON.stringify({
                    "app_id": app_id,
                    "anchor_id": payload.anchor_id, //6iu89o
                    "anchor_drawdown_id": payload.anchor_drawdown_id, //hy76543
                    "drawdown_amount": payload.drawdown_amount,
                    "otp_reference_id": authObj.otp_reference_code,
                    "otp": authObj.otp,
                    "offer": this.state.selected,
                    "disbursement_account_code": payload.disbursement_account_code,
                    "timestamp": new Date()
                }
            )
        }).then(resp => resp.json()).then(resp => {
            changeLoader(false);
            if (resp.response === Object(resp.response)) {
                // ToDo : uncomment this 2 lines for production
                if (environment === 'prod' || environment === 'dev') {
                    DrawsetPreflight(resp.response);
                    setTimeout(() => history.push(`${PUBLIC_URL}/drawdown/thankyou`), 500);
                }
            }
            // ToDo : comment this for production
            if (environment === 'local')
                setTimeout(() => history.push(`${PUBLIC_URL}/drawdown/thankyou`), 500);

        }, resp => {
            alertModule();
            changeLoader(false);
        })
    }

    componentWillMount() {
        // ToDo : comment this development
        if (environment === 'prod' || environment === 'dev')
            this._fetchInformation();
        const {payload, authObj, changeLoader, history} = this.props;

        if (authObj !== Object(authObj))
            history.push(`${PUBLIC_URL}/drawdown/auth`);
        if (payload !== Object(payload))
            history.push(`${PUBLIC_URL}/drawdown/`);
        changeLoader(false);
    }

    componentDidMount() {
        const {DrawsetLoanPayload, DrawsetPreflight, changeLoader} = this.props;
        changeLoader(false);

        // ToDo : uncomment this 2 lines for development
        if (environment === 'local') {
            DrawsetLoanPayload({loanOffers: loanOffers, loanStatus: loanStatus, creditLimit: creditLimit});
            DrawsetPreflight(preFlightResp);
        }
    }

    render() {

        let cardBox = 'card card-body mt-1 ml-1 list-group-item list-group-item-action flex-column align-items-start';
        // ToDo :  make the line const in prod.
        let {payload, loanPayload} = this.props;

        // ToDo :  uncomment in prod & make it const.
        let {loanOffers, loanStatus, creditLimit} = loanPayload;

        if (payload === Object(payload)) {

            let {f_name, l_name} = payload;

            // ToDo :  comment this 2 line in prod.
            if (environment === 'local') {
                f_name = 'Mahesh';
                l_name = 'Pai';
            }

            return (<>
                <h4 className={"text-center"}>Loan Offers</h4>
                <br/>
                {/*<h5 className={"text-center"}></h5>*/}
                <div className="row justify-content-center mt-3 mb-3">

                    <p className={"text-center"} style={{padding: '0 12px'}}>Dear {f_name} {l_name}, glad to see you
                        back
                        !<br/>Select
                        the below available EMI
                        option that best suits your needs</p>
                </div>
                <div className="col-sm-12">

                    <div className="card alert leftFixedCard" role="alert"
                    >
                        <div className="card-header">
                            <b> Transaction ID : # {payload.anchor_drawdown_id}</b>
                        </div>

                        <div className="row mb-1 mt-3 "
                             style={{padding: '0.5rem', flexWrap: 'inherit', fontSize: '13px'}}>
                            <div className="col-sm-7">
                                Anchor ID
                            </div>
                            <div className="col-sm-5">
                                # {payload.anchor_id}
                            </div>
                        </div>

                        <div className="row mb-1" style={{padding: '0.5rem', flexWrap: 'inherit', fontSize: '13px'}}>
                            <div className="col-sm-7">
                                Drawdown Amount
                            </div>
                            <div className="col-sm-5">
                                Rs {payload.drawdown_amount}
                            </div>
                        </div>

                    </div>

                    <div className="card alert leftFixedCard2" role="alert"
                    >
                        <div className="row mb-1" style={{padding: '0.5rem', flexWrap: 'inherit', fontSize: '13px'}}>
                            <div className="col-sm-7">
                                Application ID
                            </div>
                            <div className="col-sm-5">
                                # {payload.loan_application_id}
                            </div>
                        </div>
                        <div className="row mb-1 " style={{padding: '0.5rem', flexWrap: 'inherit', fontSize: '13px'}}>
                            <div className="col-sm-7">
                                Credit Approved
                            </div>
                            <div className="col-sm-5">
                                Rs {creditLimit.approved_credit_limit}
                            </div>
                        </div>

                        <div className="row mb-1" style={{padding: '0.5rem', flexWrap: 'inherit', fontSize: '13px'}}>
                            <div className="col-sm-7">
                                Balance Credit
                            </div>
                            <div className="col-sm-5">
                                Rs {creditLimit.balance_credit_limit}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="alert alert-primary" role="alert"
                     style={{
                         display: (this.state.selected.product_type !== undefined) ? 'block' : 'none',
                         margin: '2% 5%'
                     }}>
                    You have selected <strong
                    className="text-primary text-capitalize">`{(this.state.selected.product_type)} - {this.state.selected.tenor} Months`</strong>
                </div>
                <div className="row" style={{overflowY: 'auto', width: '90%', margin: 'auto'}}>
                    {<div className="list-group flex-row" style={{padding: '0.2rem 5px'}}>
                        {loanOffers.loan.offers.map((val, key) => (
                            <a href="#" key={key} onClick={e => {
                                e.preventDefault();
                                this.setState({selected: val});
                            }}
                               className={(this.state.selected.tenor === val.tenor) ? cardBox + ' active' : cardBox}
                               style={{borderRadius: '5px', minWidth: '185px'}}>
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1 text-capitalize"
                                        style={{marginRight: '0rem'}}> {val.product_type} - {val.tenor} M</h5>
                                    {/*<small>3 days ago</small>*/}
                                </div>
                                <ul className="mb-1 list-group" style={{width: '100%'}}>
                                    <li className="mt-3  d-flex justify-content-between align-items-center"
                                        style={{padding: '0.5rem', marginRight: 0}}>
                                        <div className={""}>Interest :</div>
                                        <div className={""}> {val.roi}%</div>
                                    </li>
                                    <li className="mt-1  d-flex justify-content-between align-items-center"
                                        style={{padding: '0.5rem'}}>
                                        <div className={""}>Tenor :</div>
                                        <div className={""}>{val.tenor} Months</div>
                                    </li>
                                    <li className="mt-1 d-flex justify-content-between align-items-center"
                                        style={{padding: '0.5rem'}}>
                                        <div className={""}>EMI :</div>
                                        <div className={""}> Rs {val.emi} </div>
                                    </li>
                                </ul>
                            </a>
                        ))}
                    </div>}
                </div>


                <div className="checkbox mt-4 ml-5 mr-3"
                     style={{visibility: (this.state.selected.product_type !== undefined) ? 'visible' : 'hidden'}}>
                    <label style={{color: 'black', cursor: 'pointer'}}>
                        <input type="checkbox" checked={this.state.tnc_consent}
                               onChange={(e) =>
                                   this.setState(prevState => ({tnc_consent: !prevState.tnc_consent}), () => console.log(this.state.tnc_consent))
                               }/> I accept the <a href={'#'} onClick={(e) => {
                        e.preventDefault();
                        this.setState({tncModal: true}, () => this.triggerTnCModal.click());
                    }}>Terms &
                        Condition</a>, <a href={'#'} onClick={(e) => {
                        e.preventDefault();
                        this.setState({tncModal: false}, () => this.triggerTnCModal.click());
                    }}
                                          href={"#"}>Privacy
                        Policy</a> of the Mintifi and agree upon the selected the EMI Tenure .
                    </label>
                </div>

                <div className={"row justify-content-center text-center mb-3 mt-3 "}
                     style={{display: (this.state.selected.product_type !== undefined) ? 'block' : 'none'}}>
                    <button className={"greenButton btn btn-raised"} onClick={(e) => this._submitForm(e)}
                            disabled={!this.state.tnc_consent}>Proceed
                    </button>
                </div>
                {this.RenderModalTnC()}
            </>)
        }
        else return (<></>)
    }
}

const mapStateToProps = state => ({
    token: state.drawdownReducer.token,
    payload: state.drawdownReducer.payload,
    authObj: state.drawdownReducer.authObj,
    loanPayload: state.drawdownReducer.loanPayload,
});

export default withRouter(connect(
    mapStateToProps,
    {changeLoader, DrawsetLoanPayload, DrawsetPreflight}
)(Offers));
