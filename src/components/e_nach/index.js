import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {changeLoader, EnachsetPayload} from "../../actions";
import {alertModule} from "../../shared/commonLogic";


class ENach extends Component {

    componentWillMount() {

        const {match, changeLoader, EnachsetPayload} = this.props;
        changeLoader(false);
        const {payload} = match.params;
        let base64_decode = (payload !== undefined) ? JSON.parse(new Buffer(payload, 'base64').toString('ascii')) : {};
        if (base64_decode === Object(base64_decode))
            alertModule('You cannot access this page directly without Authorised Session !!', 'error');
        else EnachsetPayload(base64_decode);
    }

    _triggerDigio = () => {
// Create the event
        let event = new CustomEvent("dispatchDigio", {
            detail: {
                document_id: "ENA190412174540465E7NFYCKAC5GYPH",
                mobile_number: "9738361083"
            }
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
    eNachPayload: state.EnachReducer.eNachPayload,
});

export default withRouter(
    connect(
        mapStateToProps,
        {changeLoader}
    )(ENach)
);
