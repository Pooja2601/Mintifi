import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import {
  changeLoader,
  setAnchorObj,
  EsignsetAttempt,
  EsignsetDocPayload,
  EsignsetPayload,
  showAlert
} from "../../../actions";
import {
  base64Logic,
  checkObject,
  retrieveParam
} from "../../../shared/common_logic";
import { apiActions, fetchAPI, postAPI } from "../../../api";
import {
  app_id,
  baseUrl,
  environment,
  eSignPayloadStatic
} from "../../../shared/constants";

const { PUBLIC_URL } = process.env;

class ESign extends Component {
  static defaultProps = {
    eSignPayload: null,
    token: null
  };

  static propTypes = {
    setAnchorObj: PropTypes.func.isRequired,
    changeLoader: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired
  };

  popUpWindow = "";
  intervalPing = "";
  checkStatusPopup = "";
  COUNTER_PING = 10; // 2 minutes
  INTERVAL_TIMER = 15000;
  eSignAttempt = 0;

  state = {
    checkStatus: false
  };

  _fetchAnchorDetail = async () => {
    const {
      token,
      eSignPayload,
      setAnchorObj,
      showAlert,
      changeLoader
    } = this.props;

    if (checkObject(eSignPayload)) {
      let triggerEsign = false;
      const options = {
        URL: `${baseUrl}/merchants/${eSignPayload.anchor_id}/get_details?app_id=${app_id}`,
        token: token,
        changeLoader: changeLoader
      };
      const resp = await fetchAPI(options);

      if (resp.status === apiActions.SUCCESS_RESPONSE) {
        setAnchorObj(resp.data);
        triggerEsign = true;
      }

      if (resp.status === apiActions.ERROR_RESPONSE)
        if (resp.data.code === "ER-AUTH-102") {
          triggerEsign = false;
          showAlert("Session expired, please try again");
        } else triggerEsign = true;

      if (triggerEsign) window.setTimeout(() => this._triggerESign(), 1000);
    }
  };

  _triggerESign = async () => {
    const {
      eSignPayload,
      token,
      changeLoader,
      showAlert,
      EsignsetDocPayload
    } = this.props;

    if (checkObject(eSignPayload) && token) {
      EsignsetAttempt(this.eSignAttempt++);
      const options = {
        URL: `${baseUrl}/esign/init`,
        token: token,
        data: {
          app_id: app_id,
          loan_application_id: eSignPayload.loan_application_id,
          document_type: "agreement_document",
          timestamp: new Date()
        },
        showAlert: showAlert,
        changeLoader: changeLoader
      };

      if (this.eSignAttempt > 3) {
        if (this.popUpWindow) this.popUpWindow.close();
        window.setTimeout(
          () => (window.location.href = `${eSignPayload.error_url}`),
          5000
        );
      }

      const resp = await postAPI(options);

      if (resp.status === apiActions.ERROR_RESPONSE)
        showAlert(resp.data.message, "warn");
      if (resp.status === apiActions.SUCCESS_RESPONSE) {
        EsignsetDocPayload(resp.data);
        const eSignPopUpPayload = base64Logic(resp.data, "encode");
        // console.log(eSignPopUpPayload);
        // ToDo : ideal for checking esign_status before Ahdarbridge opens up

        this.setState({ checkStatus: true });
        window.setTimeout(() => {
          this.popUpWindow = window.open(
            `${PUBLIC_URL}/esign/esign_popup?payload=${eSignPopUpPayload}`,
            "ESign PopUp",
            "width=600,height=500,location=no,menubar=no,toolbar=no,titlebar=no"
          );
          this._pingDBStatus();
          this.intervalPing = window.setInterval(
            () => this._pingDBStatus(),
            this.INTERVAL_TIMER
          );
        }, 1000);
      }
    }
  };

  _pingDBStatus = async () => {
    const {
      eSignPayload,
      token,
      changeLoader,
      showAlert,
      history
    } = this.props;

    let base64_encoded = "";
    this.COUNTER_PING -= 1;

    const { adharObj, businessObj, bankObj, payload } = this.props;

    const reqParam = `loan_application_id=${eSignPayload.loan_application_id}&document_type=agreement_document`;
    const options = {
      URL: `${baseUrl}/esign/status?${reqParam}`,
      token: token,
      showAlert: showAlert
      // changeLoader: changeLoader
    };

    const resp = await fetchAPI(options);

    if (resp.status === apiActions.ERROR_RESPONSE) {
      if (resp.data.code !== "ER-ES-101") showAlert(resp.data.message, "warn");
      // ToDo : need to look after it
      // this.popUpWindow.close();
      // window.setTimeout(() => window.location.href = `${eSignPayload.error_url}`, 5000);
    }

    // ToDo : Navigating to anchor urls
    if (resp.status === apiActions.SUCCESS_RESPONSE) {
      let redLocation = `${eSignPayload.success_url}`; // Anchor URL
      if (resp.data.success) {
        showAlert(
          "Great, we're done with eSign, redirecting you to Anchor portal",
          "success"
        );
        if (this.popUpWindow) this.popUpWindow.close();
        this.setState({ checkStatus: false });
        if (
          checkObject(payload) &&
          checkObject(adharObj) &&
          checkObject(businessObj) &&
          checkObject(bankObj)
        ) {
          /// check if coming from React Flow
          base64_encoded = base64Logic(eSignPayload, "encode");
          redLocation = `${PUBLIC_URL}/emandate?payload=${base64_encoded}&token=${token}`;
        }
        window.setTimeout(
          () => (window.location.href = `${redLocation}`),
          4000
        );
      }
    }

    if (this.COUNTER_PING === 0)
      if (this.intervalPing) window.clearInterval(this.intervalPing);
  };

  componentWillUnmount() {
    if (this.intervalPing) window.clearInterval(this.intervalPing);
    if (this.checkStatusPopup) window.clearInterval(this.checkStatusPopup);
  }

  componentWillMount() {
    let {
      changeLoader,
      EsignsetPayload,
      token,
      eSignPayload,
      showAlert
    } = this.props;
    changeLoader(false);

    let { href } = window.location,
      base64_decode = {},
      payload;
    let that = this;

    // Coming from constant
    if (environment === "local") base64_decode = eSignPayloadStatic;

    // coming from redux
    if (checkObject(eSignPayload)) {
      Object.assign(base64_decode, eSignPayload);
    }

    // console.log(token)
    if (environment === "prod" || environment === "dev") {
      payload = retrieveParam(href, "payload") || undefined;
      token = retrieveParam(href, "token") || undefined;
      if (payload) base64_decode = base64Logic(payload, "decode");
    }

    if (!checkObject(base64_decode) && !token)
      showAlert(
        "You cannot access this page directly without Authorised Session !!",
        "error"
      );
    else {
      EsignsetPayload(token, base64_decode);
      window.setTimeout(() => {
        that._fetchAnchorDetail();
      }, 500);
    }
  }

  componentDidMount() {
    // window.setTimeout(() => this._triggerESign(), 1000);
    this.props.EsignsetAttempt(0);
    window.setInterval(() => {
      try {
        if (this.popUpWindow)
          if (this.popUpWindow.closed) {
            this.setState({ checkStatus: false });
          } else if (this.popUpWindow.closed === undefined) {
            this.setState({ checkStatus: false });
          } else {
            this.setState({ checkStatus: true });
          }
      } catch (e) {
        this.setState({ checkStatus: false });
      }
    }, 10000);
  }

  render() {
    const { eSignPayload, token } = this.props;
    // console.log(eSignPayload)
    return (
      <>
        <h4 className={"text-center"}> e-SIGN Process</h4>
        {/*<small >(via Aadhaar)</small>*/}
        <br />

        <div className=" text-left " role="alert" style={{ margin: "auto" }}>
          {checkObject(eSignPayload) && token ? (
            <>
              <p className="paragraph_styling alert alert-info">
                Kindly complete the eSIGN procedure by clicking the button
                below.{" "}
              </p>
              <p className="paragraph_styling alert alert-info">
                <small>
                  Make sure to enable pop-up in your browser, for ESign to
                  proceed.
                  <br />
                  <a
                    href={"#"}
                    onClick={e => {
                      this._triggerESign();
                      return false;
                    }}
                    disabled={!checkObject(eSignPayload) || !token}
                  >
                    Click here
                  </a>{" "}
                  to trigger eSign again after enabling in your browser.
                </small>
              </p>
            </>
          ) : (
            <p className="paragraph_styling alert alert-danger">
              You may not access this page directly without appropriate
              payload/session.
            </p>
          )}
        </div>
        <br />
        <div className="mt-5 mb-4 text-center">
          {this.state.checkStatus ? (
            <button
              type="button"
              onClick={e => this._pingDBStatus()}
              disabled={!checkObject(eSignPayload) || !token}
              className="form-submit btn btn-raised greenButton"
            >
              Check E-SIGN Status
            </button>
          ) : (
            <button
              type="button"
              onClick={e => this._triggerESign()}
              disabled={!checkObject(eSignPayload) || !token}
              className="form-submit btn btn-raised greenButton"
            >
              Initiate E-SIGN
            </button>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  token: state.eSignReducer.token,
  eSignPayload: state.eSignReducer.eSignPayload,
  eSignAttempt: state.eSignReducer.eSignAttempt,
  payload: state.authPayload.payload,
  adharObj: state.adharDetail.adharObj,
  businessObj: state.businessDetail.businessObj,
  bankObj: state.businessDetail.bankObj
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      changeLoader,
      EsignsetPayload,
      EsignsetDocPayload,
      EsignsetAttempt,
      setAnchorObj,
      showAlert
    }
  )(ESign)
);
