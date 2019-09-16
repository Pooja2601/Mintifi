import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {
    changeLoader,
    EnachsetPayload,
    setAnchorObj,
    showAlert
} from "../../../actions";
import {
    base64Logic,
    retrieveParam, checkObject
} from "../../../shared/common_logic";
import {
    eNachPayloadStatic,
    baseUrl,
    app_id,
    environment,
    ENachResponseUrl
} from "../../../shared/constants";
import PropTypes from "prop-types";
import {apiActions, fetchAPI, postAPI} from "../../../api";

const {PUBLIC_URL} = process.env;

class EMandate extends Component {
    static propTypes = {
        changeLoader: PropTypes.func.isRequired,
        showAlert: PropTypes.func.isRequired,
        token: PropTypes.string,
        eNachPayload: PropTypes.object,
    }

    static defaultProps = {
        eNachPayload: null,
        token: null
    }


    _fetchAnchorDetail = async () => {
        const {
            history,
            token,
            eNachPayload,
            setAnchorObj,
            changeLoader,
            showAlert
        } = this.props;

        if (checkObject(eNachPayload) && token) {
            let redirect = false;
            const options = {
                URL: `${baseUrl}/merchants/${
                    eNachPayload.anchor_id
                    }/get_details?app_id=${app_id}`,
                token: token,
                changeLoader: changeLoader,
                showAlert: showAlert
            }
            const resp = await fetchAPI(options);

            if (resp.status === apiActions.SUCCESS_RESPONSE) {
                setAnchorObj(resp.data);
                redirect = true;
            }
            if (resp.status === apiActions.ERROR_RESPONSE)
                if (resp.data.code === 'ER-AUTH-102') {
                    redirect = false;
                    showAlert('Session expired, please try again');
                } else redirect = true;

            if (redirect)
                window.setTimeout(() => {
                    history.push(`${PUBLIC_URL}/enach/bank_detail`);
                }, 2000)
        }

    }

    componentWillMount() {
        let {
            changeLoader,
            EnachsetPayload,
            token,
            eNachPayload,
            showAlert
        } = this.props;
        changeLoader(false);

        let {href} = window.location,
            base64_decode = {},
            payload;

        // coming from constants
        if (environment === "local") base64_decode = eNachPayloadStatic;

        // coming from redux
        if (checkObject(eNachPayload)) {
            Object.assign(base64_decode, eNachPayload);
        }
        // coming from URl payload
        if (environment === "prod" || environment === "dev") {
            payload = retrieveParam(href, "payload") || undefined;
            token = retrieveParam(href, "token") || undefined;
            if (payload) base64_decode = base64Logic(payload, "decode");
            // console.log(payload);
            // console.log(base64_decode);
        }

        if (!checkObject(base64_decode) && !token)
            showAlert(
                "You cannot access this page directly without Authorised Session !!",
                "error"
            );
        else {
            // ToDo : need to look later
            EnachsetPayload(token, base64_decode);
            window.setTimeout(() => {
                this._fetchAnchorDetail();
            });
        }
    }

    componentDidMount() {
        const {history, eNachPayload, token} = this.props;
        // console.log(token)

    }

    render() {
        const {eNachPayload, token} = this.props;
        return (<>
            <h4 className={"text-center"}> e-NACH Mandate</h4>
            <br/>

            <div className=" text-left " role="alert" style={{margin: "auto"}}>
                {checkObject(eNachPayload) && token ? (
                    <p className="paragraph_styling alert alert-info">
                        Welcome to Mintifi's eMandate Flow
                    </p>
                ) : (
                    <p className="paragraph_styling alert alert-danger">
                        You may not access this page directly without appropriate
                        payload/session.
                    </p>
                )}
            </div>
        </>)
    }
}

const mapStateToProps = state => ({
    token: state.eNachReducer.token,
    eNachPayload: state.eNachReducer.eNachPayload
});

export default withRouter(
    connect(
        mapStateToProps,
        {changeLoader, EnachsetPayload, setAnchorObj, showAlert}
    )(EMandate)
);


