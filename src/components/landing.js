import React, {Component} from "react";
import {Link, withRouter} from 'react-router-dom';
// import {GetinTouch} from "../../shared/getin_touch";
import {baseUrl, landingPayload} from "../shared/constants";
import {connect} from "react-redux";
import {checkExists, setToken, changeLoader} from "../actions";
import {alertModule} from "../shared/commonLogic";

const Timer = 10;

class Login extends Component {

    componentDidMount() {
        this.props.changeLoader(false);
        const {setToken, match, payload} = this.props;
        let base64_decode = (match.params.payload !== undefined) ? JSON.parse(new Buffer(match.params.payload, 'base64').toString('ascii')) : {};
        setToken(match.params.token, base64_decode);
        if (match.params.token !== undefined && payload !== Object(payload))
            alertModule("You cannot access this page directly without Appropriate Permission!!", 'warn');
        // console.log(base64_decode);
    }

    // ToDo : Not useful in Prod
    _generateToken() {
        // ToDo : make it const in Prod
        let {changeLoader, setToken, payload} = this.props;
        changeLoader(true);

        // ToDo : hide it in Prod
        payload = landingPayload;

        fetch('https://test.mintifi.com/api/v1/auth', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: payload.anchor_id,
                secret_key: "3f147e1bf610b5f3",
                app_id: "3",
                type: "anchor"
            })
        }).then(resp => resp.json()).then(resp => {
            changeLoader(false);
            if (resp.response === Object(resp.response))
                if (resp.response.status === 'success')
                    setToken(resp.response.auth.token, payload);
        }, () => {
            alertModule();
            changeLoader(false);
        });
    }

    _existCustomer = () => {
        this.props.checkExists("exist");
        setTimeout(() => {
            this.props.history.push('/preapprove/auth')
        }, 500);
    };

    _newCustomer = () => {
        this.props.checkExists("new");
        setTimeout(() => {
            this.props.history.push('/preapprove/adharpan')
        }, 500);
    };

    render() {
        const {setToken, match, existing, payload} = this.props;
        return (
            <>
                {/*<Link to={'/'} >Go Back </Link>*/}
                <h5 align="center">Mintifi Pay</h5>
                <p className="paragraph_styling text-center">
                    Get a credit line of upto Rs. 5 lacs instantly and pay for your purchases.
                    {/*{token} , {trans_id}*/}
                </p>
                <div className="mt-5 mb-5 text-center row">
                    <div className={"col-sm-12 col-md-2"}></div>
                    <div className={"col-sm-12 col-md-4 text-center"}><img
                        src="/images/supply_chain/new.png"
                        style={{
                            width: "150px",
                            border: (existing === 'new') && '1px solid #00bfa5',
                            cursor: 'pointer',
                            padding: '10px',
                            borderRadius: '15%',
                            opacity: (existing === 'new') ? '1.0' : '0.4'
                        }}
                        onClick={() => this._newCustomer()}
                    /><br/> <p style={{paddingRight: '0%'}}>New User</p>
                    </div>
                    <div className={"col-sm-12 col-md-4 text-center"}><img
                        src="/images/supply_chain/existing.png"
                        style={{
                            width: "150px",
                            border: (existing === 'exist') && '1px solid #00bfa5',
                            cursor: 'pointer',
                            padding: '10px',
                            borderRadius: '15%',
                            opacity: (existing === 'exist') ? '1.0' : '0.4'
                        }}
                        onClick={() => this._existCustomer()}
                    /> <br/> <p style={{paddingLeft: '0%'}}>Existing User</p>
                    </div>

                    <div className={"col-sm-12 col-md-2"}></div>

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
