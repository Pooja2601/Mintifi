import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {baseUrl, drawdownPayload, environment, app_id} from "../../shared/constants";
import {alertModule, base64Logic} from '../../shared/commonLogic';
import {connect} from "react-redux";
import {changeLoader, DrawsetToken} from "../../actions";

const {PUBLIC_URL} = process.env;

class DrawLanding extends Component {

    componentDidMount() {

        const {DrawsetToken, match, history, changeLoader} = this.props;
        const {token, payload} = match.params;
        changeLoader(false);

        let base64_decode = base64Logic(payload, 'decode');

// ToDo : comment in production
        if (environment === 'dev')
            base64_decode = drawdownPayload;

        if (base64_decode !== Object(base64_decode))
            alertModule('You cannot access this page directly without Authorised Session!!', 'error');
        else if (token === undefined) {
            alertModule('Token Invalid Kindly Retry the eNACH process!!', 'error');
            DrawsetToken(null, base64_decode);
            // console.log(this.props.payload);
        }
        else {
            DrawsetToken(token, base64_decode);
            // console.log(this.props.payload);
            setTimeout(() => history.push(`${PUBLIC_URL}/drawdown/auth/`, {token: token, payload: base64_decode}), 500);
        }
    }

    _generateToken = () => {
        const {changeLoader, DrawsetToken, payload, history} = this.props;
        // console.log(JSON.stringify(payload));
        changeLoader(true);
        fetch(`${baseUrl}/auth`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: payload.anchor_id,// 'uyh65t',
                secret_key: "3f147e1bf610b5f3",
                app_id: app_id,
                type: "anchor"
            })
        }).then(resp => resp.json()).then(resp => {
            changeLoader(false);
            if (resp.response === Object(resp.response))
                if (resp.response.status === 'success') {
                    DrawsetToken(resp.response.auth.token, payload);
                    setTimeout(() => history.push(`${PUBLIC_URL}/drawdown/auth/`, {
                        token: resp.response.auth.token,
                        payload: payload
                    }), 500);
                }
            // setTimeout(() => console.log(this.props.token),2000)
        }, () => {
            alertModule();
            changeLoader(false);
        });
    };

    render() {
        const {payload, match, token} = this.props;
        return (<>
            <div className={"alert alert-warning"}>You may not access this page as the session seems to be expired</div>
            <div className={"text-center"}>
                <a className={"btn btn-raised greenButton"} href={drawdownPayload.error_url}>Go Back</a>
            </div>
            <button
                onClick={() => this._generateToken()}
                style={{visibility: (payload !== Object(payload) && !token) ? 'visible' : 'hidden'}}
                style={{
                    padding: "5px 35px", width: '100%',
                    margin: '50px 0%'
                }}
                className="form-submit btn greenButton text-center"
            >
                Create TOKEN and PAYLOAD
            </button>
            <br/>
            <small>(above button is for development use only)</small>
        </>)
    }
}

// export default withRouter(DrawLanding);

const mapStateToProps = state => ({
    token: state.drawdownReducer.token,
    payload: state.drawdownReducer.payload
});

export default withRouter(connect(
    mapStateToProps,
    {DrawsetToken, changeLoader}
)(DrawLanding));

