import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {
    changeLoader,
    setAnchorObj,
    EsignsetAttempt,
    EsignsetDocPayload,
    EsignsetPayload,
    showAlert
} from "../../../actions";
import {base64Logic, retrieveParam} from "../../../shared/commonLogic";
import {apiActions, fetchAPI, postAPI} from "../../../api";
import {app_id, baseUrl, environment, eSignPayloadStatic} from "../../../shared/constants";

const {PUBLIC_URL} = process.env;

class ESign extends Component {
    static defaultProps = {
        eSignPayload: null
    }

    checkPayload = false

    _fetchAnchorDetail = async () => {
        const {
            token,
            eSignPayload,
            setAnchorObj,
            changeLoader
        } = this.props;

        if (eSignPayload === Object(eSignPayload) && eSignPayload) {
            changeLoader(true);

            const options = {
                URL: `${baseUrl}/merchants/${
                    eSignPayload.anchor_id
                    }/get_details?app_id=${app_id}`,
                token: token,
            }
            const resp = await fetchAPI(options);

            if (resp.status === apiActions.SUCCESS_RESPONSE)
                setAnchorObj(resp.data);

            changeLoader(false);
        }

    }

    _triggerESign = async () => {
        const {eSignPayload, token, changeLoader, showAlert} = this.props;

        const options = {
            URL: `${baseUrl}/documents/esign_document`,
            token: token,
            data: {
                app_id: app_id,
                loan_application_id: eSignPayload.loan_application_id,
                timestamp: new Date()
            }
        }
        changeLoader(true);
        const resp = await postAPI(options);
        changeLoader(false);

        if (resp.status === apiActions.ERROR_NET)
            showAlert('net');
        if (resp.status === apiActions.ERROR_RESPONSE)
            showAlert(resp.data.message, 'warn');
        if (resp.status === apiActions.SUCCESS_RESPONSE) {
            EsignsetDocPayload(resp.data);
            const eSignPopUpPayload = base64Logic(resp.data, 'encode');
            // console.log(eSignPopUpPayload);
            window.setTimeout(() => {
                window.open(`${PUBLIC_URL}/esign/esign_popup?payload=${eSignPopUpPayload}`, 'ESign PopUp', "width=600,height=500,location=no,menubar=no,toolbar=no,titlebar=no")
                window.setInterval(() => this._pingDBStatus(), 3000);
            }, 2000);
        }
    }

    _pingDBStatus = async () => {

        const {eSignPayload, token, changeLoader, showAlert, history} = this.props;

        const reqParam = `app_id=${app_id}&loan_application_id=${eSignPayload.loan_application_id}`;
        const options = {
            URL: `${baseUrl}/documents/esign_status?${reqParam}`,
            token: token,
        };
        // changeLoader(true);
        const resp = await fetchAPI(options);
        // changeLoader(false)
        // ToDo : Navigating to Bank Details Page
        if (resp.status === apiActions.SUCCESS_RESPONSE) {
            (resp.data.success) && history.push(`${PUBLIC_URL}/esign/bank_detail`)
        }
        // ToDo : remove later : skips eISGN checks, only meant for testing
        // history.push(`${PUBLIC_URL}/esign/bank_detail`)
    }

    componentWillMount() {
        let {
            changeLoader,
            EsignsetPayload,
            token,
            eSignPayload,
            showAlert
        } = this.props;
        changeLoader(false);

        // let token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyNiwidHlwZSI6InJlYWN0X3dlYl91c2VyIiwiZXhwIjoxNTYwMzMzNTYxfQ.yzD-pIyaf4Z7zsXEJZG-Hm0ka80CjMjMB74q6dpRSPM`;
        let {href} = window.location,
            base64_decode = {},
            payload;
        let that = this;

        this.checkPayload = !!(eSignPayload === Object(eSignPayload) && eSignPayload);

        // Coming from constant
        if (environment === "local")
            base64_decode = eSignPayloadStatic;

        // ToDo : hide the 2 lines in prod
        if (this.checkPayload) {
            Object.assign(base64_decode, eSignPayload);
        }

        this.setState({errorMsg: false});
        if (environment === "prod" || environment === "dev") {
            payload = retrieveParam(href, "payload") || undefined;
            token = retrieveParam(href, "token") || undefined;
            if (payload) base64_decode = base64Logic(payload, "decode");
            // else this.setState({errorMsg: true});
        }

        if (base64_decode !== Object(base64_decode) && !base64_decode && !token)
            showAlert(
                "You cannot access this page directly without Authorised Session !!",
                "error"
            );
        else {
            EsignsetPayload(token, base64_decode);
            this.checkPayload = !!base64_decode;
            window.setTimeout(() => {
                that._fetchAnchorDetail()
            }, 500);
        }
    }


    render() {
        const {eSignPayload} = this.props;
        // console.log(eSignPayload)
        return (
            <>
                <h4 className={"text-center"}> e-SIGN Process</h4>
                {/*<small >(via Aadhaar)</small>*/}
                <br/>

                <div className=" text-left " role="alert" style={{margin: "auto"}}>
                    {(this.checkPayload) ? (
                        <p className="paragraph_styling alert alert-info">
                            Kindly complete the eSIGN procedure by clicking the button below.
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
                        onClick={e => this._triggerESign()}
                        disabled={
                            !this.checkPayload
                        }
                        className="form-submit btn btn-raised greenButton"
                    >
                        Initiate E-SIGN
                    </button>
                </div>

            </>
        );
    }
}

const mapStateToProps = state => ({
    token: state.eSignReducer.token,
    eSignPayload: state.eSignReducer.eSignPayload
});

export default withRouter(
    connect(
        mapStateToProps,
        {
            changeLoader,
            EsignsetPayload,
            EsignsetDocPayload,
            EsignsetAttempt,
            setAnchorObj,
            showAlert
        }
    )(ESign)
);
