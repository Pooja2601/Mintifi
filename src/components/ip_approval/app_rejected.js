import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {pan_adhar, setAdharManual, setBusinessDetail} from "../../actions";

class AppRejected extends Component{

    render(){
        return(
            <>
               {/* <button onClick={() => this.props.history.push('/BusinessDetail')} className={"btn btn-link"}>
                    Go Back
                </button>*/}
                <br/>
                <i className={"fa fa-times-circle closeCircle"}></i>
                <h3 className={"text-center"}>  Application Rejected !</h3>
                <br/>
                <p className="paragraph_styling  text-center">

                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">Insufficient Credit Line/CIBIL</h4>
                        We're sorry for the inconvenience caused <b><i> {this.props.adharObj.f_name} {this.props.adharObj.l_name}</i></b>, we cannot move ahead with your application as of now.

                        Kindly try again after 3 months
                    </div>
                </p>
                <div className="mt-5 mb-5 text-center ">
                    <button
                        type="button"
                        onClick={e => this.props.history.push('/')}
                        className="form-submit btn btn-raised partenrs_submit_btn"
                    >Exit Application</button>
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
