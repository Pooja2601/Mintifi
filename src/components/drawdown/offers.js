import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {changeLoader, DrawsetLoanPayload, DrawsetPreflight} from "../../actions";
import {otpUrl, baseUrl} from "../../shared/constants";
import {PrivacyPolicy, TnCPolicy} from "../../shared/policy";

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
            "emi": 11333
        }, {
            "product_type": "term_loan",
            "roi": 18,
            "tenor": 12,
            "emi": 7166
        }, {
            "product_type": "term_loan",
            "roi": 18,
            "tenor": 12,
            "emi": 7166
        }]
    },
    "timestamp": "2019-09-09T06:42:12.000Z"
};

const preFlightResp = {
    "app_id": 2,
    "anchor_id": "6iu89o",
    "anchor_drawdown_id": "hy76543",
    "drawdown_amount": 67000,
    "otp_reference_id": 87699,
    "otp": "9876",
    "offer": {
        "product_type": "term_loan",
        "roi": 18,
        "tenor": 3,
        "emi": 2000
    },
    "disbursement_account_code": "98jhy6",
    "timestamp": "2019-09-12T00:00:00.000Z"
};


class Offers extends Component {

    state = {tnc_consent: false, selected: {}};

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
        const {payload, token, changeLoader, authObj, loanPayload} = this.props;
        // e.preventDefault();
        this.props.changeLoader(true);
        fetch(`${baseUrl}/loans/${loanPayload.loanOffers.loan.loan_application_id}/drawdown/`, {
            method: "POST",
            headers: {'Content-Type': 'application/json', token: token},
            body: JSON.stringify({
                    "app_id": 2,
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
                // this.props.DrawsetPreflight(resp.response);
                // this.props.history.push('/Drawdown/Thankyou');
            }
            setTimeout(() => this.props.history.push('/Drawdown/Thankyou'), 500);

        }, resp => {
            console.log('Looks like a connectivity issue..!');
            changeLoader(false);
        })
    }

    componentDidMount() {
        this.props.DrawsetLoanPayload({loanOffers: loanOffers, loanStatus: loanStatus, creditLimit: creditLimit});
        this.props.DrawsetPreflight(preFlightResp);
        // setTimeout(() => console.log(this.props.loanPayload), 2000);
    }

    render() {

        let cardBox = 'card card-body mt-1 ml-1 list-group-item list-group-item-action flex-column align-items-start';
        return (<>
            <h4 className={"text-center"}>Offers Section</h4>
            <br/>
            <div className="row justify-content-center mt-3 mb-3" style={{minHeight: '300px'}}>
                <div className={"col-md-6 col-sm-11"} style={{borderRight: '1px dashed black'}}>
                    <h5 className={"text-center"}>Welcome Mahesh</h5>
                    <br/>
                    <div className="card" style={{borderRadius: '5px', boxShadow: '0px 0px 0px 0px'}}>
                        <div className="card-header">
                            Credit Status
                        </div>

                        <div className="row mb-1 mt-3 " style={{padding: '0.5rem', flexWrap: 'inherit'}}>
                            <div className="col-sm-6">
                                Credit Approved :
                            </div>
                            <div className="col-sm-6">
                                Rs {creditLimit.approved_credit_limit}
                            </div>
                        </div>

                        <div className="row mb-1" style={{padding: '0.5rem', flexWrap: 'inherit'}}>
                            <div className="col-sm-6">
                                Balance Credit Limit :
                            </div>
                            <div className="col-sm-6">
                                Rs {creditLimit.balance_credit_limit}
                            </div>
                        </div>
                        <div className="row mb-1" style={{padding: '0.5rem', flexWrap: 'inherit'}}>
                            <div className="col-sm-6">
                                Loan Status :
                            </div>
                            <div className="col-sm-6">
                                {loanStatus.loan_status.toUpperCase()}
                            </div>
                        </div>
                        <div className="row mb-1" style={{padding: '0.5rem', flexWrap: 'inherit'}}>
                            <div className="col-sm-6">
                                Loan Approval Date :
                            </div>
                            <div className="col-sm-6">
                                {loanStatus.loan_status_date.substr(0, 10)}
                            </div>
                        </div>

                    </div>
                </div>
                <div className="col-md-6 col-sm-11 mt-3">

                    <p className={"text-center"}>Select the best offers suitable for your needs</p>
                    <div className="alert alert-primary" role="alert" style={{fontSize: '14px'}}>
                        <div className={"row"}>
                            <div className={"col-sm-7"}>Loan Application Id :</div>
                            <div className={"col-sm-5"}>{loanOffers.loan.loan_application_id}</div>
                        </div>
                        <div className={"row"}>
                            <div className={"col-sm-7"}>Loan Amount :</div>
                            <div className={"col-sm-5"}> Rs {loanOffers.amount}</div>
                        </div>

                    </div>
                    <br/>
                    <div className="alert alert-primary" role="alert"
                         style={{display: (this.state.selected.product_type !== undefined) ? 'block' : 'none'}}>
                        You have selected <strong
                        className="text-primary text-capitalize">`{(this.state.selected.product_type)} - {this.state.selected.tenor} Months`</strong>
                    </div>
                    <br/>
                    {/* {<div id="carouselExampleSlidesOnly" data-interval="3000" className="carousel slide"
                         data-ride="carousel" style={{padding: '10px'}}>
                        <div className="carousel-inner" style={{minHeight: '230px'}}>
                            <div className="carousel-item active">
                                <div className="card p-3 text-right" style={{background: '#6eb9c2'}}>
                                    <blockquote className="blockquote mb-0">
                                        <p style={{color: 'white'}}>
                                            Offer are best calculated according to your Credit history and Bureau
                                            report.</p>
                                        <footer className="blockquote-footer">
                                            <small className="text-muted" style={{color: 'white'}}>
                                                Someone famous in <cite title="Source Title">Source Title</cite>
                                            </small>
                                        </footer>
                                    </blockquote>
                                </div>
                            </div>
                            {loanOffers.loan.offers.map((val, key) => (
                                <div key={key} className="carousel-item">
                                    <div className="card mb-3" style={{background: '#eee'}}>
                                        <div className="card-header text-white text-capitalize"
                                             style={{backgroundColor: '#00bfa5',
                                                 opacity: '0.7555'}}>
                                            {val.product_type} - {val.tenor} Months
                                        </div>
                                        <div className="card-body text-secondary">
                                            <div className="card-title">
                                                <ul>
                                                    <li>Rate of Interest : {val.roi}%</li>
                                                    <li>Tenor : {val.tenor} Months</li>
                                                    <li>EMI : Rs {val.emi} </li>
                                                </ul>
                                            </div>
                                            <a href="#" className="btn btn-primary ml-3" onClick={(e) => {
                                                e.preventDefault();
                                                this.setState({selected: val});
                                            }}>Select</a>
                                        </div>
                                    </div>
                                </div>
                            ))
                            }
                            <a className="carousel-control-prev" href="#carouselExampleSlidesOnly" role="button"
                               data-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="sr-only">Previous</span>
                            </a>
                            <a className="carousel-control-next" href="#carouselExampleSlidesOnly" role="button"
                               data-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                            </a>
                        </div>
                    </div>}*/}
                </div>
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
                <label style={{color: 'black'}}>
                    <input type="checkbox" checked={this.state.tnc_consent}
                           onChange={(e) =>
                               this.setState(prevState => ({tnc_consent: !prevState.tnc_consent}), () => console.log(this.state.tnc_consent))
                           }/> I accept the <a href={'#'} onClick={(e) => {
                    e.preventDefault();
                    this.setState({tncModal: false}, () => this.triggerTnCModal.click());
                }}>Terms &
                    Condition</a>, <a href={'#'} onClick={(e) => {
                    e.preventDefault();
                    this.setState({tncModal: true}, () => this.triggerTnCModal.click());
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
