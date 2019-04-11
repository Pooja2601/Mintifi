import React, {Component} from "react";
import {Link, withRouter} from 'react-router-dom';
// import {GetinTouch} from "../../shared/getin_touch";
// import {baseUrl} from "../shared/constants";
import {connect} from "react-redux";
import {checkExists, setToken} from "../actions";

const Timer = 10;

class Login extends Component {
    //   state = { loading: "" };

    _formSubmit(e) {
    }

    componentDidMount() {

        const {setToken, match} = this.props;
        setToken(match.params.token, match.params.trans_id);
        if (match.params.token === undefined)
            alert("You cannot access this page directly !! ");
        console.log(match.params.trans_id);
    }

    _existCustomer = () => {
        this.props.checkExists("exist");
        setTimeout(() => {
            this.props.history.push('/Auth')
        }, 500);
    };

    _newCustomer = () => {
        this.props.checkExists("new");
        setTimeout(() => {
            this.props.history.push('/AdharPan')
        }, 500);
    };

    render() {
        const {token, trans_id} = this.props;
        return (
            <>
                {/*<Link to={'/'} >Go Back </Link>*/}
                <h5 align="center">User Registration</h5>
                <p className="paragraph_styling text-center">
                    Find out how our platform can help you climb the ladder to
                    another level of success today.
                    {token} , {trans_id}
                </p>
                <div className="mt-5 mb-5 text-center row">
                    <div className={"col-sm-12 col-md-6"}><img
                        src="/images/supply_chain/sapling.jpg"
                        style={{
                            width: "150px", boxShadow: '0 0 8px #cccccc', cursor: 'pointer',
                            borderRadius: '15%', opacity: (this.props.existing === 'new') ? '1.0' : '0.4'
                        }}
                        onClick={() => this._newCustomer()}
                    /><br/> New Customer
                    </div>
                    <div className={"col-sm-12 col-md-6"}><img
                        src="/images/supply_chain/tree.jpg"
                        style={{
                            width: "150px", boxShadow: '0 0 8px #cccccc', cursor: 'pointer', padding: '10px',
                            borderRadius: '15%', opacity: (this.props.existing === 'exist') ? '1.0' : '0.4'
                        }}
                        onClick={() => this._existCustomer()}
                    /> <br/>Existing Customer
                    </div>
                    <br/>

                    {/* <button
                onClick={() => this._newCustomer()}
                name="submit"
                style={{ padding: "5px 35px" }}
                className="form-submit btn partenrs_submit_btn"
              >
                New User
              </button>
              <br />
              OR
              <br />
              <button
                onClick={() => this._existCustomer()}
                style={{ padding: "5px 35px" }}
                className="btn partenrs_submit_btn"
              >
                Existing User
              </button>*/}
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    existing: state.authPayload.existing,
    token: state.authPayload.token,
    trans_id: state.authPayload.trans_id
});

export default withRouter(connect(
    mapStateToProps,
    {checkExists, setToken}
)(Login));
