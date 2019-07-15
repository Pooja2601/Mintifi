import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {changeLoader, EnachsetAttempt, EnachsetPayload} from "../../actions";


class Error_URL extends Component {

    render() {
        return (
            <>
                <i className="fa fa-times-circle checkCircle" style={{color:'red'}}></i>
                <h3 className={"text-center"}> E-NACH Failed !</h3>
                <br/>

                <div className="alert alert-danger" role="alert">
                    {/*<h4 className="alert-heading">Dear {f_name} {l_name}</h4>*/}
                    <p className="paragraph_styling  ">
                        Thank you for completing the process, For some reason we couldn't complete the e-NACH, you'll be
                        redirected to Anchor dashboard within a moment..
                    </p>
                </div>
            </>)
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
    )(Error_URL)
);
