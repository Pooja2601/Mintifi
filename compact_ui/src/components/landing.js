import React, { Component } from "react";
import { withRouter } from "react-router-dom";
// import {GetinTouch} from "../../shared/getin_touch";
import {
  baseUrl,
  landingPayload,
  environment,
  app_id,
  payMintifiUrl
} from "../shared/constants";
import { connect } from "react-redux";
import { checkExists, setToken, changeLoader, setAnchorObj } from "../actions";
import {
  alertModule,
  base64Logic,
  generateToken,
  postMessage
} from "../shared/commonLogic";

// const Timer = 10;
const { PUBLIC_URL } = process.env;

class Login extends Component {
  state = {
    anchor_transaction_id: ""
  };

  componentDidMount() {
    const { setToken, match, payload, changeLoader } = this.props;
    let base64_decode;

    changeLoader(false);

    if (environment === "dev" || environment === "local")
      if (!match.params.payload) base64_decode = landingPayload;
    // ToDo : hide it in Prod

    if (match.params === Object(match.params))
      if (match.params.payload)
        base64_decode = base64Logic(match.params.payload, "decode");

    if (
      match.params.token === undefined &&
      base64_decode !== Object(base64_decode) &&
      !base64_decode
    )
      alertModule(
        "You cannot access this page directly without Appropriate Permission!!",
        "warn"
      );
    else setToken(match.params.token, base64_decode);

    window.setTimeout(() => {
      if (payload === Object(payload) || payload) this._fetchAnchorDetail();
      // console.log(payload);
    }, 100);

    // postMessage({ action: "close", loan_id: "XXXX" });
    // console.log(window.location.hostname);
  }

  _fetchAnchorDetail() {
    const { token, payload, setAnchorObj, changeLoader } = this.props;
    changeLoader(true);
    fetch(
      `${baseUrl}/merchants/${payload.anchor_id}/get_details?app_id=${app_id}`,
      {
        method: "GET",
        headers: { "Content-type": "application/json", token: token }
      }
    )
      .then(resp => resp.json())
      .then(
        resp => {
          changeLoader(false);
          if (resp.response === Object(resp.response))
            setAnchorObj(resp.response);

          // console.log(resp.response);
        },
        resp => {
          changeLoader(false);
          // alertModule();
        }
      );
  }

  // ToDo : Not useful in Live Production
  async _generateToken() {
    let { changeLoader, setToken, payload } = this.props;
    let { anchor_transaction_id } = this.state;
    changeLoader(true);
    let authToken = await generateToken();
    changeLoader(false);
    if (anchor_transaction_id.length > 0)
      payload.anchor_transaction_id = anchor_transaction_id;
    else
      payload.anchor_transaction_id = Math.random()
        .toString(36)
        .substr(2, 6);

    setToken(authToken, payload);
    console.log(payload);
    if (environment === "dev" || environment === "local")
      this._fetchAnchorDetail();
  }

  _existCustomer = () => {
    this.props.checkExists("exist");
    setTimeout(() => {
      this.props.history.push(`${PUBLIC_URL}/preapprove/auth`);
    }, 500);
  };

  _newCustomer = () => {
    this.props.checkExists("new");
    setTimeout(() => {
      this.props.history.push(`${PUBLIC_URL}/preapprove/adharpan`);
    }, 500);
  };

  render() {
    // const { match, existing, payload, anchorObj } = this.props;
    const { existing } = this.props;

    return (
      <>
        {/*<Link to={'/'} >Go Back </Link>*/}
        <h5 align="center">Mintifi Pay </h5>
        <p className="paragraph_styling text-center">
          Get a credit line of upto Rs. 5 lacs instantly and pay for your
          purchases.
          {/*{token} , {trans_id}*/}
          {/*{anchorObj.anchor_logo}*/}
        </p>
        <div className="mt-5 mb-5 text-center row">
          {/* <div className={"col-sm-2 col-md-2"} /> */}
          <div className={"col-6 text-center"}>
            <img
              src={`${PUBLIC_URL}/images/supply_chain/new.png`}
              alt="New User"
              style={{
                border: existing === "new" && "1px solid #00bfa5",
                opacity: existing === "new" ? "1.0" : "0.4"
              }}
              onClick={() => this._newCustomer()}
              className="user_type_img"
            />
            <br /> <p style={{ paddingRight: "0%" }}>New User</p>
          </div>
          <div className={"col-6 text-center"}>
            <img
              src={`${PUBLIC_URL}/images/supply_chain/existing.png`}
              alt="Existing User"
              style={{
                border: existing === "exist" && "1px solid #00bfa5",
                opacity: existing === "exist" ? "1.0" : "0.4"
              }}
              onClick={() => this._existCustomer()}
              className="user_type_img"
            />{" "}
            <br /> <p style={{ paddingLeft: "0%" }}>Existing User</p>
          </div>

          {/* <div className={"col-sm-2 col-md-2"} /> */}
          <br />
          <div
            className={"row col-sm-12"}
            style={{
              borderTop: "1px solid",
              marginLeft: "-3px",
              marginTop: "10%"
            }}
          >
            <input
              style={{ margin: "auto 25%" }}
              className="form-control bmd-form-group"
              onChange={e => {
                this.setState({ anchor_transaction_id: e.target.value });
              }}
              placeholder={"Anchor Trans ID (Dev use Only)"}
              type={"text"}
            />
          </div>

          {/*   visibility:
                payload !== Object(payload) && !match.params.token
                  ? "visible"
          : "hidden" */}
          <button
            onClick={() => this._generateToken()}
            style={{
              padding: "5px 35px",
              width: "100%",
              margin: "25px 10%"
            }}
            className="form-submit btn greenButton text-center"
          >
            Create TOKEN and PAYLOAD
          </button>

          <small>(above button is for development use only)</small>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  existing: state.authPayload.existing,
  token: state.authPayload.token,
  payload: state.authPayload.payload,
  anchorObj: state.authPayload.anchorObj
});

export default withRouter(
  connect(
    mapStateToProps,
    { checkExists, setToken, changeLoader, setAnchorObj }
  )(Login)
);
