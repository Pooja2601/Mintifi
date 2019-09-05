import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {baseUrl, drawdownPayload, environment, app_id, user_id, auth_secret} from "../../shared/constants";
import {alertModule, base64Logic, generateToken} from '../../shared/common_logic';
import {connect} from "react-redux";
import {changeLoader, DrawsetToken, showAlert} from "../../actions";

const {PUBLIC_URL} = process.env;

class DrawLanding extends Component {

    componentDidMount() {

        const {DrawsetToken, match, history, changeLoader, location, showAlert} = this.props;
        const {token, payload} = match.params;
        changeLoader(false);
        let base64_decode;

// ToDo : comment in production
        if (environment === 'dev' || environment === 'local')
            if (!payload)
                base64_decode = drawdownPayload;

        if (environment === 'dev' || environment === 'prod')
            if (payload)
                base64_decode = base64Logic(payload, 'decode');

        console.log(base64_decode);

        if (base64_decode !== Object(base64_decode) && !base64_decode)
            showAlert('You cannot access this page directly without Authorised Session/Payload!!', 'error');
        else if (token === undefined) {
            showAlert('Token invalid or session invalid, kindly go back and retry the process !!', 'error');
            DrawsetToken(null, base64_decode);
            // console.log(this.props.payload);
        } else {
            DrawsetToken(token, base64_decode);
            // console.log(this.props.payload);
            setTimeout(() => history.push(`${PUBLIC_URL}/drawdown/auth/`, {token: token, payload: base64_decode}), 500);
        }
    }

    async _generateToken() {
        const {changeLoader, DrawsetToken, payload, history, showAlert} = this.props;

        changeLoader(true);
        let authToken = await generateToken();
        changeLoader(false);

        DrawsetToken(authToken, payload);
        setTimeout(() => history.push(`${PUBLIC_URL}/drawdown/auth/`, {
            token: authToken,
            payload: payload
        }), 500);
        // console.log(JSON.stringify(payload));

    };

    render() {
        const {payload, match, token} = this.props;
        // console.log(payload);
        return (<>
            <div style={{visibility: ((payload !== Object(payload) && !payload) || !token) ? 'visible' : 'hidden'}}
                 className={"alert alert-warning"}>You may not access this page as the session seems to be expired
            </div>
            {/* <div className={"text-center"}>
                <a className={"btn btn-raised greenButton"}
                   style={{visibility: (payload !== Object(payload)) ? 'visible' : 'hidden'}} href={payload.error_url}>Go
                    Back</a>
            </div>*/}
            <div className={"devTool_PayloadBtn"}>
                <button
                    onClick={() => this._generateToken()}
                    style={{display: (environment === 'dev' || environment === 'local') ? 'block' : 'none'}}

                    className="form-submit btn greenButton text-center"
                >
                    Create PAYLOAD
                </button>
                <br/>
                <small>(above button is for development use only)</small>
            </div>
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
    {DrawsetToken, changeLoader, showAlert}
)(DrawLanding));

