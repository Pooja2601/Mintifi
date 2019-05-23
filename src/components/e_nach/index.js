import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {changeLoader, EnachsetPayload, EnachsetAttempt} from "../../actions";
import {alertModule} from "../../shared/commonLogic";
import {eNachPayload} from "../../shared/constants";


class ENach extends Component {

    state = {ctr: 0};

    componentWillMount() {

        const {match, changeLoader, EnachsetPayload} = this.props;
        changeLoader(false);
        const {payload} = match.params;
        let base64_decode = (payload !== undefined) ? JSON.parse(new Buffer(payload, 'base64').toString('ascii')) : {};
        // ToDo : hide this in prod
        eNachPayload.document_id = eNachPayload.mandate_id;
        Object.assign(base64_decode, eNachPayload);

        if (base64_decode !== Object(base64_decode))
            alertModule('You cannot access this page directly without Authorised Session !!', 'error');
        else EnachsetPayload(base64_decode);

    }

    componentDidMount() {
        let that = this;

        document.addEventListener("responseDigio", function (obj) {
            // console.log(JSON.stringify(obj.detail));
            if (obj.detail.error_code !== undefined && that.state.ctr < 3) {
                alertModule(`Failed to register with error :  ${obj.detail.message}`, 'error');
                this.setState((prevState) => ({
                    ctr: prevState.ctr + 1
                }, () => EnachsetAttempt(that.state.ctr)))
                // that.props.history();
            }
            else {
                // that.props.history();
                alertModule("Register successful for " + obj.detail.digio_doc_id, 'success');
            }
        });
    }

    _triggerDigio = () => {
        // console.log(this.props.eNachPayload);
// Create the event
        let event = new CustomEvent("dispatchDigio", {
            detail: this.props.eNachPayload
        });
// Dispatch/Trigger/Fire the event
        document.dispatchEvent(event);
    };

    render() {
        // let {payload, match} = this.props;
        return (
            <>
                {/*<i style={{fontSize: '60px'}} className={"fa fa-check-circle checkCircle"}></i>*/}
                <h3 className={"text-center"}> e-NACH Mandate</h3>
                <br/>

                <div className="paragraph_styling text-left alert alert-success" role="alert"
                     style={{margin: 'auto 5%'}}
                >
                    <p className="paragraph_styling ">
                        Kindly complete the eNACH procedure by clicking the button below.
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
    eNachPayload: state.eNachReducer.eNachPayload,
});

export default withRouter(
    connect(
        mapStateToProps,
        {changeLoader, EnachsetPayload, EnachsetAttempt}
    )(ENach)
);
