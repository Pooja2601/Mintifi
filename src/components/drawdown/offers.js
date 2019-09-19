import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {
    changeLoader,
    DrawsetLoanPayload,
    DrawsetPreflight,
    showAlert
} from "../../actions";
import {otpUrl, baseUrl, environment, app_id} from "../../shared/constants";
import {PrivacyPolicy, TnCPolicy} from "../../shared/policy";
import {postMessage, checkObject} from "../../shared/common_logic";
import {fetchAPI, apiActions, postAPI} from "../../api";


const {PUBLIC_URL} = process.env;

class Offers extends Component {
    state = {tnc_consent: false, selected: {}};

    RenderModalTnC = () => {
        return (
            <>
                <button
                    type="button"
                    style={{visibility: "hidden"}}
                    ref={ref => (this.triggerTnCModal = ref)}
                    id={"triggerTnCModal"}
                    data-toggle="modal"
                    data-target="#TnCMsgModal"
                ></button>

                <div
                    className="modal fade"
                    id={"TnCMsgModal"}
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div
                        className="modal-dialog modal-lg"
                        role="document"
                        style={{margin: "5.75rem auto"}}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {this.state.tncModal
                                        ? "Terms and Conditions"
                                        : "Privacy policy"}
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {this.state.tncModal
                                    ? TnCPolicy({fontSize: 13})
                                    : PrivacyPolicy({
                                        fontSize: 13,
                                        headSize: 1.5
                                    })}
                            </div>
                            <div className="modal-footer">
                                {/*<button type="button" className="btn btn-primary">Save changes</button>*/}
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    ref={ref => (this.closeModal = ref)}
                                    data-dismiss="modal"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    _submitForm = async e => {
        const {
            payload,
            token,
            changeLoader,
            authObj,
            showAlert,
            loanPayload,
            history,
            DrawsetPreflight
        } = this.props;
        // e.preventDefault();

        // TODO: check postAPI function
        const options = {
            URL: `${baseUrl}/loans/${payload.loan_application_id}/drawdown/`,
            token: token,
            showAlert: showAlert,
            changeLoader: changeLoader,
            data: {
                app_id: app_id,
                anchor_id: payload.anchor_id, //6iu89o
                anchor_drawdown_id: payload.anchor_drawdown_id, //hy76543
                drawdown_amount: payload.drawdown_amount,
                otp_reference_id: authObj.otp_reference_id,
                otp: authObj.otp,
                offer: this.state.selected,
                disbursement_account_code: payload.disbursement_account_code,
                timestamp: new Date()
            }
        };
        const resp = await postAPI(options);

        if (resp.status === apiActions.ERROR_RESPONSE) {
            showAlert(resp.data.message);

            if (resp.data.code === "ER-AUTH-102") {
                setTimeout(() => {
                    window.location.href = `${PUBLIC_URL}/drawdown/token`;
                    // history.push(`${PUBLIC_URL}/drawdown/token`)
                }, 2000);
            }
            if (window.location !== window.parent.location) {
                postMessage({
                    drawdown_status: "error",
                    drawdown_offer: null,
                    loan_id: payload.loan_application_id,
                    drawdown_id: payload.anchor_drawdown_id,
                    action: "close"
                });
            }
        } else if (resp.status === apiActions.SUCCESS_RESPONSE) {
            // ToDo : uncomment this 2 lines for production
            if (environment === "prod" || environment === "dev") {
                DrawsetPreflight(resp.data);
                setTimeout(() => history.push(`${PUBLIC_URL}/drawdown/thankyou`), 500);
            }
        }

        // ToDo : comment this for production
        if (environment === "local") {
            setTimeout(() => history.push(`${PUBLIC_URL}/drawdown/thankyou`), 500);
        }
    };

    componentWillMount() {
        const {payload, authObj, changeLoader, history} = this.props;

        if (!checkObject(authObj))
            history.push(`${PUBLIC_URL}/drawdown/auth`);
        if (!checkObject(payload)) {
            history.push(`${PUBLIC_URL}/drawdown/token`);
        }
        changeLoader(false);
    }

    render() {
        let cardBox =
            "card card-body mt-1 ml-1 list-group-item list-group-item-action flex-column align-items-start cardBox";
        // ToDo :  make the line const in prod.
        let {payload, loanPayload} = this.props;

        // ToDo :  uncomment in prod & make it const.
        // let {loanOffers, loanStatus, creditLimit} = loanPayload;

        if (checkObject(payload) && loanPayload) {
            // let {f_name, l_name} = payload;
            // ToDo :  comment this 2 line in prod.
            if (environment === "local") {
                // f_name = 'Mahesh';
                // l_name = 'Pai';
            }
            return (
                <>
                    <h4 className={"text-center"}>Loan Offers</h4>
                    <br/>
                    <div className="row justify-content-center mt-3 mb-3">
                        <p className={"text-center"} style={{padding: "0 12px"}}>
                            {/*Dear {f_name} {l_name} ,*/} Glad to see you back !<br/>
                            Select the below available EMI option that best suits your needs
                        </p>
                    </div>
                    <div className="col-sm-12">
                        <div className="card alert leftFixedCard" role="alert">
                            <div className="card-header">
                                <b> Transaction ID : # {payload.anchor_drawdown_id}</b>
                            </div>

                            <div className="row mb-1 mt-3 p-2 drawdownTable">
                                <div className="col-sm-7">Anchor ID</div>
                                <div className="col-sm-5"># {payload.anchor_id}</div>
                            </div>

                            <div className="row mb-1 p-2 drawdownTable">
                                <div className="col-sm-7">Drawdown Amount</div>
                                <div className="col-sm-5">Rs {payload.drawdown_amount}</div>
                            </div>
                        </div>

                        <div className="card alert leftFixedCard2" role="alert">
                            <div className="row mb-1 p-2 drawdownTable">
                                <div className="col-sm-7">Application ID</div>
                                <div className="col-sm-5"># {payload.loan_application_id}</div>
                            </div>
                            <div className="row mb-1 p-2 drawdownTable">
                                <div className="col-sm-7">Credit Approved</div>
                                <div className="col-sm-5">
                                    Rs {loanPayload.creditLimit.approved_credit_limit}
                                </div>
                            </div>

                            <div className="row mb-1 p-2 drawdownTable">
                                <div className="col-sm-7">Balance Credit</div>
                                <div className="col-sm-5">
                                    Rs {loanPayload.creditLimit.balance_credit_limit}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="alert alert-primary"
                        role="alert"
                        style={{
                            display:
                                this.state.selected.product_type !== undefined
                                    ? "block"
                                    : "none",
                            margin: "2% 5%"
                        }}
                    >
                        You have selected{" "}
                        <strong className="text-primary text-capitalize">
                            `{this.state.selected.product_type} - {this.state.selected.tenor}{" "}
                            Months`
                        </strong>
                    </div>
                    <div className="row m-auto cardContainerOuter">
                        <div className="list-group flex-row ">
                            {checkObject(loanPayload) && loanPayload ? (
                                loanPayload.loanOffers.loan.offers.map((val, key) => (
                                    <a
                                        href="#"
                                        key={key}
                                        onClick={e => {
                                            e.preventDefault();
                                            this.setState({selected: val});
                                        }}
                                        className={
                                            this.state.selected.tenor === val.tenor
                                                ? cardBox + " active"
                                                : cardBox
                                        }
                                    >
                                        <div className="d-flex mr-0 w-100 justify-content-between">
                                            <h5 className="mb-1 mr-1 text-capitalize">
                                                {" "}
                                                {val.product_type} - {val.tenor} M
                                            </h5>
                                            {/*<small>3 days ago</small>*/}
                                        </div>
                                        <ul className="mb-1 list-group">
                                            <li className="mt-3 mr-0 p-2  d-flex justify-content-between align-items-center">
                                                <div>Interest :</div>
                                                <div> {val.roi}%</div>
                                            </li>
                                            <li className="mt-1 mr-0 p-2 d-flex justify-content-between align-items-center">
                                                <div>Tenor :</div>
                                                <div>{val.tenor} Months</div>
                                            </li>
                                            <li className="mt-1 mr-0 p-2 d-flex justify-content-between align-items-center">
                                                <div>EMI :</div>
                                                <div> Rs {val.emi} </div>
                                            </li>
                                        </ul>
                                    </a>
                                ))
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>

                    <div
                        className="mt-4 ml-5 mr-3"
                        style={{
                            visibility:
                                this.state.selected.product_type !== undefined
                                    ? "visible"
                                    : "hidden"
                        }}
                    >
                        <label className="main">
                            I accept the{" "}
                            <a
                                href={"#"}
                                onClick={e => {
                                    e.preventDefault();
                                    this.setState({tncModal: true}, () =>
                                        this.triggerTnCModal.click()
                                    );
                                }}
                            >
                                Terms & Condition
                            </a>
                            ,{" "}
                            <a
                                href={"#"}
                                onClick={e => {
                                    e.preventDefault();
                                    this.setState({tncModal: false}, () =>
                                        this.triggerTnCModal.click()
                                    );
                                }}
                            >
                                Privacy Policy
                            </a>{" "}
                            of the Mintifi and agree upon the selected the EMI Tenure .
                            <input
                                type="checkbox"
                                checked={this.state.tnc_consent}
                                onChange={e =>
                                    this.setState(prevState => ({
                                        tnc_consent: !prevState.tnc_consent
                                    }))
                                }
                            />
                            <span className="geekmark"></span>
                        </label>
                    </div>

                    <div
                        className={"row justify-content-center text-center mb-3 mt-3 "}
                        style={{
                            visibility:
                                this.state.selected.product_type !== undefined
                                    ? "visible"
                                    : "hidden"
                        }}
                    >
                        <button
                            className={"greenButton btn btn-raised"}
                            onClick={e => this._submitForm(e)}
                            disabled={!this.state.tnc_consent}
                        >
                            Proceed
                        </button>
                    </div>
                    {this.RenderModalTnC()}
                </>
            );
        } else return <></>;
    }
}

const mapStateToProps = state => ({
    token: state.drawdownReducer.token,
    payload: state.drawdownReducer.payload,
    authObj: state.drawdownReducer.authObj,
    loanPayload: state.drawdownReducer.loanPayload
});

export default withRouter(
    connect(
        mapStateToProps,
        {changeLoader, DrawsetLoanPayload, showAlert, DrawsetPreflight}
    )(Offers)
);
