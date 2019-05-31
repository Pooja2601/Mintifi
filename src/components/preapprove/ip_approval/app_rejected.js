import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {landingPayload} from "../../../shared/constants";
import {pan_adhar, setAdharManual, setBusinessDetail} from "../../../actions/index";

const {PUBLIC_URL} = process.env;

class AppRejected extends Component {

    componentWillMount() {
        const {payload, authObj, adharObj, businessObj, history} = this.props;

        if (payload === Object(payload)) {
            if (adharObj !== Object(adharObj))
                history.push(`${PUBLIC_URL}/preapprove/personaldetail`);

            if (businessObj !== Object(businessObj))
                history.push(`${PUBLIC_URL}/preapprove/businessdetail`);
        }
        else history.push(`${PUBLIC_URL}/preapprove/token`);
    }

    render() {
        let {match, adharObj, preFlightResp, history} = this.props;
        // ToDo :  Hide it in Prod
        match = {params: {status: 'declined'}};  // declined  // expired

        return (
            <>
                {/* <button onClick={() => history.push(`${PUBLIC_URL}/preapprove/businessdetail`)} className={"btn btn-link"}>
                    Go Back
                </button>*/}
                <h4 className={"text-center"}>Credit Eligibility</h4>
                <br/>
                {/*fa-exclamation-circle*/}
                <i style={{fontSize: '60px'}} className={"fa fa-exclamation-triangle closeCircle"}></i>
                {/*<h5 className={"text-center"}> Application {(match.params.status === 'decline') ? 'Rejected' : 'Error'}</h5>*/}
                <br/>
                <div className="paragraph_styling  text-center" style={{margin: 'auto 5%'}}>

                    <div className={(match.params.status === 'decline') ? 'alert alert-danger' : 'alert alert-warning'}
                         role="alert">
                        <h5 className="alert-heading">{(match.params.status === 'decline') ? <> Dear <b><i> {adharObj.f_name} {adharObj.l_name}</i></b></> : 'Something went wrong !'}</h5>
                        We regret to inform you that your application can not be approved at this point of time.

                        <br/>
                        <b>{(match.params.status === 'decline') ? 'You can try again with us after 6 months' : 'Kindly try again after some time'}</b>
                    </div>
                    <div className={"blockquote-footer"}>
                        In case of any query, please contact us at <a
                        href={"mailto:support@mintifi.com"}>support@mintifi.com</a> or <a href={"tel:+919999999999"}>+91
                        9999999999</a>. <br/>Please
                        mention your <b>( loan application id : {preFlightResp.loan_application_id} )</b> in the
                        request.
                    </div>

                </div>
                <div className="mt-5 mb-5 text-center ">
                    {/*
                    ToDo : Applying the name of the anchor
                    */}
                    <button
                        type="button"
                        onClick={e => history.push(`${PUBLIC_URL}/${landingPayload.error_url}`)}
                        className="form-submit btn btn-raised greenButton"
                    >Back to Yatra
                    </button>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    adharObj: state.adharDetail.adharObj,
    preFlightResp: state.businessDetail.preFlightResp
});

export default withRouter(
    connect(
        mapStateToProps,
        {setBusinessDetail, pan_adhar, setAdharManual}
    )(AppRejected)
);

