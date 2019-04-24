import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {pan_adhar, setAdharManual, setBusinessDetail} from "../../actions";

class AppRejected extends Component {

    render() {
        const {match, adharObj} = this.props;
        return (
            <>
                {/* <button onClick={() => this.props.history.push('/BusinessDetail')} className={"btn btn-link"}>
                    Go Back
                </button>*/}
                <br/>
                <i className={"fa fa-times-circle closeCircle"}></i>
                <h3 className={"text-center"}> Application {(match.params === 'decline') ? 'Rejected' : 'Error'} !</h3>
                <br/>
                <div className="paragraph_styling  text-center">

                    <div className={(match.params === 'decline') ? 'alert alert-error' : 'alert alert-warning'}
                         role="alert">
                        <h4 className="alert-heading">{(match.params === 'decline') ? 'Insufficient Credit Line/CIBIL' : 'Something went wrong !'}</h4>
                        We're sorry for the inconvenience
                        caused <b><i> {adharObj.f_name} {adharObj.l_name}</i></b>, we cannot move
                        ahead with your application as of now.
                        <br/>
                        <b>{(match.params === 'decline') ? 'Kindly try again after 3 months' : 'Kindly try again after some time'}</b>
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
