import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {
    changeLoader,
    EnachsetPayload,
    EnachsetAttempt,
    showAlert
} from "../../../../actions";
import {
    // alertModule,
    base64Logic,
    checkObject,
    retrieveParam
} from "../../../../shared/common_logic";
import {
    eNachPayloadStatic,
    baseUrl,
    app_id,
    environment,
    ENachResponseUrl
} from "../../../../shared/constants";
import PropTypes from "prop-types";
import {apiActions, postAPI} from "../../../../api";

const {PUBLIC_URL} = process.env;

class ENach extends Component {
    static propTypes = {
        eNachPayload: PropTypes.object.isRequired,
        showAlert: PropTypes.func,
        token: PropTypes.string.isRequired,
        changeLoader: PropTypes.func.isRequired
    };

    state = {ctr: 0, errorMsg: false, backendError: 0};

    _updateBackend = async result => {
        let {token, changeLoader, eNachPayload, history, showAlert} = this.props;
        let redirectURL = "";
        const options = {
            URL: `${baseUrl}/loans/enach_status`,
            data: {
                app_id: app_id,
                status: result.status, // result.message
                mandate_id: result.mandate_id,
                anchor_id: eNachPayload.anchor_id,
                loan_application_id: eNachPayload.loan_application_id,
                company_id: eNachPayload.company_id
            },
            token: token,
            showAlert: showAlert,
            changeLoader: changeLoader
        };

        const resp = await postAPI(options);

        if (resp.status === apiActions.ERROR_RESPONSE) {
            showAlert(resp.data.message, "warn");
            // this.setState({ backendError: this.state.backendError + 1 });
            redirectURL = ENachResponseUrl.cancel_url;
        } else if (resp.status === apiActions.SUCCESS_RESPONSE) {
            redirectURL = ENachResponseUrl.success_url;
        } else {
            redirectURL = ENachResponseUrl.cancel_url;
        }
        window.setTimeout(() => {
            // ToDo : Uncomment the below line in Prod
            if (environment === "prod" || environment === "dev")
                history.push(redirectURL);
        }, 1000);
    };

    _triggerDigio = () => {
        // console.log(this.props.eNachPayload);
        const {eNachPayload, history, showAlert} = this.props;
        let eNachPayDigio = eNachPayload;
        eNachPayDigio.code_mode = environment;

        if (this.state.ctr < 2) {
            let event = new CustomEvent("dispatchDigio", {
                detail: eNachPayDigio
            });
            document.dispatchEvent(event);
        } else {
            showAlert("You can not try eNACH more than twice", "warn");
            showAlert("Redirecting you back to Anchor portal..", "info");
            this.setState({errorMsg: true});
            setTimeout(() => {
                // ToDo : Uncomment this line in Prod
                if (environment === "prod" || environment === "dev")
                    history.push(ENachResponseUrl.error_url);
            }, 3000);
        }
    };

    componentWillMount() {
        let {changeLoader, token, eNachPayload, showAlert} = this.props;
        changeLoader(false);
        showAlert();
        if (!checkObject(eNachPayload) && !token)
            showAlert(
                "You cannot access this page directly without Authorised Session !!",
                "error"
            );
    }

    componentDidMount() {
        const {
            eNachAttempt,
            eNachPayload,
            history,
            showAlert,
            EnachsetAttempt
        } = this.props;
        // if (eNachAttempt) this.setState({ctr: eNachAttempt});
        let that = this;

        document.addEventListener("responseDigio", function (obj) {
            let {detail} = obj;

            // console.log(JSON.stringify(detail));
            if (detail.error_code !== undefined) {
                showAlert(
                    `Failed to register with error :  ${detail.message}`,
                    "error"
                );
                that.setState(
                    prevState => ({
                        ctr: prevState.ctr + 1
                    }),
                    () => EnachsetAttempt(that.state.ctr)
                );

                detail.mandate_id = detail.digio_doc_id;
                detail.status = detail.error_code === "CANCELLED" ? "cancel" : "error";
                // console.log(JSON.stringify(detail));
                if (detail.error_code !== "CANCELLED")
                    setTimeout(() => {
                        // ToDo : uncomment in prod
                        if (environment === "prod" || environment === "dev")
                            if (checkObject(eNachPayload))
                                history.push(ENachResponseUrl.error_url);
                    }, 1000);
            } else {
                showAlert("Register successful for e-NACH", "success");
                detail.mandate_id = detail.digio_doc_id;
                detail.status = "success";
            }

            if (detail.error_code !== "CANCELLED") that._updateBackend(detail);
        });

        // ToDo : uncomment in prod
        if (environment === "prod" || environment === "dev")
            if (checkObject(eNachPayload) && eNachPayload.mandate_id)
                setTimeout(() => this._triggerDigio(), 1000);
    }

    render() {
        // let {payload, match} = this.props;
        const {eNachPayload} = this.props;
        return (
            <>
                {/*<i style={{fontSize: '60px'}} className={"fa fa-check-circle checkCircle"}></i>*/}
                <h4 className={"text-center"}> e-NACH Mandate</h4>
                <br/>

                <div className=" text-left " role="alert" style={{margin: "auto"}}>
                    {checkObject(eNachPayload) && eNachPayload.mandate_id ? (
                        <p className="paragraph_styling alert alert-info">
                            Kindly complete the eNACH procedure by clicking the button below.
                            Remember, you may only try twice.
                        </p>
                    ) : (
                        <p className="paragraph_styling alert alert-danger">
                            You may not access this page directly without appropriate
                            payload/session.
                        </p>
                    )}
                </div>
                <br/>
                <div
                    className=" text-left alert alert-danger"
                    role="alert"
                    style={{
                        margin: "auto",
                        display: this.state.errorMsg ? "block" : "none"
                    }}
                >
                    <p className="paragraph_styling">
                        You have tried more than twice, Redirecting you back to Anchor
                        Portal...
                    </p>
                </div>
                <div className="mt-5 mb-4 text-center">
                    <button
                        type="button"
                        onClick={e => this._triggerDigio()}
                        disabled={!checkObject(eNachPayload) || !eNachPayload.mandate_id}
                        className="form-submit btn btn-raised greenButton"
                    >
                        Initiate E-NACH
                    </button>
                </div>
                {/* <div className={"text-right"}>
                    <button type="button"
                            disabled={
                                eNachPayload !== Object(eNachPayload) || !eNachPayload.mandate_id
                            } onClick={() => {
                        this.props.history.push(`${PUBLIC_URL}/enach/pnach`);
                    }} className={"btn btn-sm form-submit btn-default "}>
                        Bank Not Listed
                    </button>
                </div>*/}
            </>
        );
    }
}

const mapStateToProps = state => ({
    token: state.eNachReducer.token,
    eNachPayload: state.eNachReducer.eNachPayload,
    bankObj: state.eNachReducer.bankObj
});

export default withRouter(
    connect(
        mapStateToProps,
        {changeLoader, EnachsetPayload, EnachsetAttempt, showAlert}
    )(ENach)
);
