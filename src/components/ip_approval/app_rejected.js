import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {pan_adhar, setAdharManual, setBusinessDetail} from "../../actions";

class AppRejected extends Component {

    render() {
        let {match, adharObj} = this.props;
        match = {params: {status: 'decline'}};
        return (
            <>
                {/* <button onClick={() => this.props.history.push('/BusinessDetail')} className={"btn btn-link"}>
                    Go Back
                </button>*/}
                <h4 className={"text-center"}>Credit Eligibility</h4>
                <br/>
                {/*fa-exclamation-circle*/}
                <i className={"fa fa-exclamation-triangle closeCircle"}></i>
                <h5 className={"text-center"}> Application {(match.params.status === 'decline') ? 'Rejected' : 'Error'}</h5>
                <br/>
                <div className="paragraph_styling  text-center" style={{margin: 'auto 5%'}}>

                    <div className={(match.params.status === 'decline') ? 'alert alert-danger' : 'alert alert-warning'}
                         role="alert">
                        <h4 className="alert-heading">{(match.params.status === 'decline') ? 'Insufficient Credit Line/CIBIL' : 'Something went wrong !'}</h4>
                        We're sorry for the inconvenience
                        caused <b><i> {adharObj.f_name} {adharObj.l_name}</i></b>,<br/> we cannot move
                        ahead with your application as of now.
                        <br/>
                        <b>{(match.params.status === 'decline') ? 'Kindly try again after 3 months' : 'Kindly try again after some time'}</b>
                    </div>
                    <div className={"blockquote-footer"}>
                        In case of any query, please contact us at <a
                        href={"mailto:support@mintifi.com"}>support@mintifi.com</a> or <a href={"tel:+919999999999"}>+91
                        9999999999</a>. <br/>Please
                        mention your ( loan application id ) in the request.
                    </div>

                </div>
                <div className="mt-5 mb-5 text-center ">
                    <button
                        type="button"
                        onClick={e => this.props.history.push('/')}
                        className="form-submit btn btn-raised greenButton"
                    >Exit Application
                    </button>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    adharObj: state.adharDetail.adharObj,
});

export default withRouter(
    connect(
        mapStateToProps,
        {setBusinessDetail, pan_adhar, setAdharManual}
    )(AppRejected)
);

