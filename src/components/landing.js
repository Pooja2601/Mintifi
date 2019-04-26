import React, {Component} from "react";
import {Link, withRouter} from 'react-router-dom';
// import {GetinTouch} from "../../shared/getin_touch";
// import {baseUrl} from "../shared/constants";
import {connect} from "react-redux";
import {checkExists, setToken, changeLoader} from "../actions";

const Timer = 10;

class Login extends Component {

    componentDidMount() {
        this.props.changeLoader(false);
        const {setToken, match, payload} = this.props;
        let base64_decode = (match.params.payload !== undefined) ? JSON.parse(new Buffer(match.params.payload, 'base64').toString('ascii')) : {};
        setToken(match.params.token, base64_decode);
        if (match.params.token !== undefined && payload !== Object(payload))
            alert("You cannot access this page directly without Credential Payload!! ");
        // console.log(base64_decode);
    }

    _generateToken() {
        this.props.changeLoader(true);
        let payload = {
            "anchor_id": "uyh65t",
            "distributor_dealer_code": "R1T89563",
            "sales_agent_mobile_number": "9876543210",
            "anchor_transaction_id": "hy76515",
            "retailer_onboarding_date": "2006-09-19",
            "loan_amount": "500000"
        };
        fetch('https://test.mintifi.com/api/v1/auth', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: "uyh65t",
                secret_key: "3f147e1bf610b5f3",
                app_id: "3",
                type: "anchor"
            })
        }).then(resp => resp.json()).then(resp => {
            this.props.changeLoader(false);
            if (resp.response === Object(resp.response))
                if (resp.response.status === 'success')
                    this.props.setToken(resp.response.auth.token, payload);
        });
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
        const {setToken, match, existing, payload} = this.props;
        return (
            <>
                {/*<Link to={'/'} >Go Back </Link>*/}
                <h5 align="center">User Registration</h5>
                <p className="paragraph_styling text-center">
                    Find out how our platform can help you climb the ladder to
                    another level of success today.
                    {/*{token} , {trans_id}*/}
                </p>
                <div className="mt-5 mb-5 text-center row">
                    <div className={"col-sm-12 col-md-6"}><img
                        src="/images/supply_chain/new.png"
                        style={{
                            width: "150px", boxShadow: '0 0 8px #cccccc', cursor: 'pointer', padding: '10px',
                            borderRadius: '15%', opacity: (existing === 'new') ? '1.0' : '0.4'
                        }}
                        onClick={() => this._newCustomer()}
                    /><br/> New Customer
                    </div>
                    <div className={"col-sm-12 col-md-6"}><img
                        src="/images/supply_chain/existing.png"
                        style={{
                            width: "150px", boxShadow: '0 0 8px #cccccc', cursor: 'pointer', padding: '10px',
                            borderRadius: '15%', opacity: (existing === 'exist') ? '1.0' : '0.4'
                        }}
                        onClick={() => this._existCustomer()}
                    /> <br/>Existing Customer
                    </div>
                    <br/>
                    <br/>
                    <button
                        onClick={() => this._generateToken()}
                        style={{visibility: (payload !== Object(payload) && !match.params.token) ? 'visible' : 'hidden'}}
                        style={{
                            padding: "5px 35px", width: '100%',
                            margin: '50px 20%'
                        }}
                        className="form-submit btn greenButton text-center"
                    >
                        Create TOKEN and PAYLOAD
                    </button>
                    <br/>
                    <small>(above button is for development use only)</small>

                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    existing: state.authPayload.existing,
    token: state.authPayload.token,
    payload: state.authPayload.payload
});

export default withRouter(connect(
    mapStateToProps,
    {checkExists, setToken, changeLoader}
)(Login));
