import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {
    changeLoader,
    EsignsetPayload,
    EsignsetAttempt,
    setAnchorObj,
    showAlert
} from "../../actions";
import {
    // alertModule,
    base64Logic,
    retrieveParam
} from "../../shared/commonLogic";
import {
    eSignPayloadStatic,
    baseUrl,
    app_id,
    environment,
    ENachResponseUrl
} from "../../shared/constants";
import PropTypes from "prop-types";

const {PUBLIC_URL} = process.env;

class ESign extends Component {
    static defaultProps = {
        eSignPayload: {}
    }

    _fetchAnchorDetail() {
        const {
            token,
            eSignPayload,
            setAnchorObj,
            showAlert,
            changeLoader
        } = this.props;
        changeLoader(true);
        if (eSignPayload === Object(eSignPayload) && eSignPayload)
            fetch(
                `${baseUrl}/merchants/${
                    eSignPayload.anchor_id
                    }/get_details?app_id=${app_id}`,
                {
                    method: "GET",
                    headers: {"Content-type": "application/json", token: token}
                }
            )
                .then(resp => resp.json())
                .then(
                    resp => {
                        changeLoader(false);
                        if (resp.response === Object(resp.response))
                            setAnchorObj(resp.response);
                        //   console.log(resp.response);
                    },
                    resp => {
                        changeLoader(false);
                        // showAlert('net');
                    }
                );
        else changeLoader(false);
    }

    _triggerESign = () => {
        const {eSignPayload} = this.props;
        const eSignPopUpPayload = base64Logic(eSignPayload, 'encode');
        window.open(`${PUBLIC_URL}/enach/esign_popup?payload=${eSignPopUpPayload}`, 'ESign PopUp', "width=600,height=500,location=no,menubar=no,toolbar=no,titlebar=no")
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

        if (environment === "local") base64_decode = eSignPayloadStatic;

        // ToDo : hide the 2 lines in prod
        if (eSignPayload === Object(eSignPayload) && eSignPayload) {
            // coming from constant
            Object.assign(base64_decode, eSignPayload);
        }

        this.setState({errorMsg: false});
        if (environment === "prod" || environment === "dev") {
            payload = retrieveParam(href, "payload") || undefined;
            token = retrieveParam(href, "token") || undefined;
            if (payload) base64_decode = base64Logic(payload, "decode");
            // else this.setState({errorMsg: true});
            // console.log(base64_decode);
        }

        if (base64_decode !== Object(base64_decode) && !base64_decode && !token)
            showAlert(
                "You cannot access this page directly without Authorised Session !!",
                "error"
            );
        else {
            EsignsetPayload(token, base64_decode);
            this._fetchAnchorDetail();
        }
    }


    render() {
        const {eSignPayload} = this.props;
        return (
            <>
                <h4 className={"text-center"}> e-SIGN Process</h4>
                <small>(via Aadhaar)</small>
                <br/>

                <div className=" text-left " role="alert" style={{margin: "auto"}}>
                    {eSignPayload === Object(eSignPayload) ? (
                        <p className="paragraph_styling alert alert-info">
                            Kindly complete the eSIGN procedure by clicking the button below.
                            Remember.
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
                            eSignPayload !== Object(eSignPayload)
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
        {changeLoader, EsignsetPayload, EsignsetAttempt, setAnchorObj, showAlert}
    )(ESign)
);
