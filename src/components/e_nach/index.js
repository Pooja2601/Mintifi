import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {changeLoader, EnachsetPayload, EnachsetAttempt} from "../../actions";
import {alertModule, base64Logic, retrieveParam} from "../../shared/commonLogic";
import {eNachPayloadStatic, baseUrl, payMintifiUrl, app_id, environment} from "../../shared/constants";

const {PUBLIC_URL} = process.env;

class ENach extends Component {

    state = {ctr: 0, errorMsg: false};

    _updateBackend = (result) => {
        let {token, changeLoader, eNachPayload} = this.props;

        changeLoader(true);
        fetch(`${baseUrl}/loans/enach_status`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', token: token},
            body: JSON.stringify({
                app_id: app_id,
                status: result.status, // result.message
                mandate_id: result.mandate_id,
                anchor_id: eNachPayload.anchor_id,
                loan_application_id: eNachPayload.loan_application_id,
                company_id: eNachPayload.company_id
            })
        }).then((resp) => {
            // alertModule(resp.status);
            changeLoader(false);

            if (resp.response === Object(resp.response)) {
                let payload = retrieveParam(resp.response.nach_url, 'payload');
                let base64_decode = base64Logic(payload, 'decode');
                setTimeout(() => {
                    // ToDo : Uncomment the below line in Prod
                    if (environment === 'prod' || environment === 'dev')
                        window.location.href = base64_decode.success_url;
                }, 1000);
            }
            if (resp.error === Object(resp.error))
                alertModule(resp.error.message, 'warn');

        }, (resp) => {
            alertModule();
            changeLoader(false);
        });
    };

    _triggerDigio = () => {
        // console.log(this.props.eNachPayload);
        const {eNachPayload, payload} = this.props;
        let eNachPayDigio = eNachPayload;
        eNachPayDigio.code_mode = environment;

        if (this.state.ctr < 2) {
            let event = new CustomEvent("dispatchDigio", {
                detail: eNachPayDigio
            });
            document.dispatchEvent(event);
        }
        else {
            // alertModule("You can not try eNACH more than twice", 'warn');
            // alertModule("Redirecting you back to Anchor portal..", 'info');
            this.setState({errorMsg: true});
            setTimeout(() => {
                // ToDo : Uncomment this line in Prod
                if (environment === 'prod' || environment === 'dev')
                    window.location.href = eNachPayload.error_url;
            }, 1000);
        }
    };

    componentWillMount() {

        let {match, changeLoader, EnachsetPayload, token, eNachPayload} = this.props;
        changeLoader(false);

        // let token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyNiwidHlwZSI6InJlYWN0X3dlYl91c2VyIiwiZXhwIjoxNTYwMzMzNTYxfQ.yzD-pIyaf4Z7zsXEJZG-Hm0ka80CjMjMB74q6dpRSPM`;
        let {href} = window.location, base64_decode, payload;

        if (environment === 'local')
            base64_decode = eNachPayloadStatic;

        // ToDo : hide the 2 lines in prod
        if (eNachPayload === Object(eNachPayload)) {
            // coming from constant
            Object.assign(base64_decode, eNachPayload);
        }

        if (environment === 'prod' || environment === 'dev') {
            payload = retrieveParam(href, 'payload');
            console.log(payload);
            token = retrieveParam(href, 'token');
            console.log(token);
            base64_decode = base64Logic(payload, 'decode');
        }

        if (base64_decode !== Object(base64_decode))
            alertModule('You cannot access this page directly without Authorised Session !!', 'error');
        else EnachsetPayload(token, base64_decode);

        this.setState({errorMsg: false});
    }

    componentDidMount() {
        let that = this;

        const {eNachAttempt, eNachPayload} = this.props;
        if (eNachAttempt)
            this.setState({ctr: eNachAttempt});
        document.addEventListener("responseDigio", function (obj) {
            let {detail} = obj;
            console.log(JSON.stringify(detail));
            if (detail.error_code !== undefined) {
                alertModule(`Failed to register with error :  ${detail.message}`, 'error');
                that.setState((prevState) => ({
                    ctr: prevState.ctr + 1
                }), () => EnachsetAttempt(that.state.ctr));

                detail.mandate_id = detail.digio_doc_id;
                detail.status = (detail.error_code === 'CANCELLED') ? 'cancel' : 'error';
                setTimeout(() => {
                    // ToDo : uncomment in prod
                    if (environment === 'prod' || environment === 'dev')
                        window.location.href = (detail.error_code === 'CANCELLED') ? eNachPayload.cancel_url : eNachPayload.error_url;
                }, 1000);
            }
            else {
                alertModule("Register successful for" + detail.digio_doc_id, 'success');
                detail.mandate_id = detail.digio_doc_id;
                detail.status = 'success';

            }
            // console.log(obj.detail);
            that._updateBackend(detail);
        });

        // ToDo : uncomment in prod
        if (environment === 'prod' || environment === 'dev')
            setTimeout(() => this._triggerDigio(), 1000);
    }

    render() {
        // let {payload, match} = this.props;
        return (
            <>
                {/*<i style={{fontSize: '60px'}} className={"fa fa-check-circle checkCircle"}></i>*/}
                <h3 className={"text-center"}> e-NACH Mandate</h3>
                <br/>

                <div className=" text-left alert alert-success" role="alert"
                     style={{margin: 'auto'}}
                >
                    <p className="paragraph_styling ">
                        Kindly complete the eNACH procedure by clicking the button below. Remember, you may only try
                        twice.
                    </p>
                </div>
                <br/>
                <div className=" text-left alert alert-danger" role="alert"
                     style={{margin: 'auto', display: (this.state.errorMsg) ? 'block' : 'none'}}
                >
                    <p className="paragraph_styling">
                        You have tried more than twice, Redirecting you back to Anchor Portal...
                    </p>
                </div>
                <div className="mt-5 mb-5 text-center">
                    <button
                        type="button"
                        onClick={e => this._triggerDigio()}
                        // onClick={e => this.props.history.push(`${PUBLIC_URL}/Drawdown/Auth`)}
                        className="form-submit btn btn-raised greenButton"
                    >Initiate E-NACH
                    </button>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    token: state.eNachReducer.token,
    eNachPayload: state.eNachReducer.eNachPayload,
});

export default withRouter(
    connect(
        mapStateToProps,
        {changeLoader, EnachsetPayload, EnachsetAttempt}
    )(ENach)
);
