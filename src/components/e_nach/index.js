import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {changeLoader, EnachsetPayload, EnachsetAttempt} from "../../actions";
import {alertModule} from "../../shared/commonLogic";
import {eNachPayload, baseUrl} from "../../shared/constants";


class ENach extends Component {

    state = {ctr: 0, errorMsg: false};

    _updateBackend = (result) => {
        const {token, changeLoader, eNachPayload} = this.props;
        changeLoader(false);
        fetch(`${baseUrl}/loans/enach_status`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', token: token},
            body: JSON.stringify({
                app_id: '3',
                status: result.status,
                mandate_id: result.mandate_id,
                anchor_id: eNachPayload.anchor_id,
                loan_application_id: eNachPayload.loan_application_id,
                company_id: eNachPayload.company_id
            })
        }).then((resp) => {
            alertModule(resp.status);
            changeLoader(false);

            if (resp.response.status === 'success')
                setTimeout(() => {
                    // ToDo : Uncomment the below line in Prod
                    // window.location.href = eNachPayload.success_url;
                }, 1000);

            if (resp.error === Object(resp.error))
                alertModule(resp.error.message, 'warn');

        }, (resp) => {
            alertModule();
            changeLoader(false);
        });
    };

    _triggerDigio = () => {
        // console.log(this.props.eNachPayload);

        if (this.state.ctr < 2) {
            let event = new CustomEvent("dispatchDigio", {
                detail: this.props.eNachPayload
            });
            document.dispatchEvent(event);
        }
        else {
            // alertModule("You can not try eNACH more than twice", 'warn');
            // alertModule("Redirecting you back to Anchor portal..", 'info');
            this.setState({errorMsg: true});
            setTimeout(() => {
                // ToDo : Uncomment this line in Prod
                // window.location.href = this.props.payload.error_url;
            }, 1000);
        }
    };

    componentWillMount() {

        const {match, changeLoader, EnachsetPayload} = this.props;
        changeLoader(false);
        const {payload, token} = match.params;
        let base64_decode = (payload !== undefined) ? JSON.parse(new Buffer(payload, 'base64').toString('ascii')) : {};

        // ToDo : hide the 2 lines in prod
        eNachPayload.document_id = eNachPayload.mandate_id;
        Object.assign(base64_decode, eNachPayload);


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
            // console.log(JSON.stringify(obj.detail));
            if (obj.detail.error_code !== undefined) {
                alertModule(`Failed to register with error :  ${obj.detail.message}`, 'error');
                that.setState((prevState) => ({
                    ctr: prevState.ctr + 1
                }), () => EnachsetAttempt(that.state.ctr));
                setTimeout(() => {
                    // ToDo : uncomment in prod
                    // window.location.href = eNachPayload.error_url;
                }, 1000);
            }
            else {
                alertModule("Register successful for " + obj.detail.digio_doc_id, 'success');
                this._updateBackend(obj.detail);
            }
        });


        // ToDo : uncomment in prod
        // setTimeout(() => this._triggerDigio(), 1000);
    }

    //, as there are few changes needed to be made after putting it on the server (like changing the resource e.g, css, js location if required)
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
                <div className="mt-5 mb-5 text-center ">
                    <button
                        type="button"
                        onClick={e => this._triggerDigio()}
                        // onClick={e => this.props.history.push('/Drawdown/Auth')}
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
