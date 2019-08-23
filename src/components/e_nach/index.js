import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  changeLoader,
  EnachsetPayload,
  EnachsetAttempt,
  setAnchorObj,
  showAlert
} from "../../actions";
import {
  // alertModule,
  base64Logic,
  retrieveParam
} from "../../shared/commonLogic";
import {
  eNachPayloadStatic,
  baseUrl,
  app_id,
  environment,
  ENachResponseUrl
} from "../../shared/constants";
import PropTypes from "prop-types";

const { PUBLIC_URL } = process.env;

class ENach extends Component {
  static propTypes = {
    eNachPayload: PropTypes.object,
    showAlert: PropTypes.func,
    token: PropTypes.string.isRequired,
    changeLoader: PropTypes.func.isRequired
  };

  state = { ctr: 0, errorMsg: false, backendError: 0 };

  _updateBackend = result => {
    let { token, changeLoader, eNachPayload, history, showAlert } = this.props;

    changeLoader(true);
    fetch(`${baseUrl}/loans/enach_status`, {
      method: "POST",
      headers: { "Content-Type": "application/json", token: token },
      body: JSON.stringify({
        app_id: app_id,
        status: result.status, // result.message
        mandate_id: result.mandate_id,
        anchor_id: eNachPayload.anchor_id,
        loan_application_id: eNachPayload.loan_application_id,
        company_id: eNachPayload.company_id
      })
    })
      .then(resp => resp.json())
      .then(
        resp => {
          // showAlert(resp.status);
          changeLoader(false);

          if (resp.response === Object(resp.response)) {
            setTimeout(() => {
              // ToDo : Uncomment the below line in Prod
              if (environment === "prod" || environment === "dev")
                history.push(ENachResponseUrl.success_url);
              // window.location.href = ENachResponseUrl.success_url;
            }, 1000);
            // this.setState({ backendError: 0 });
            // return 1;
          } else if (resp.error === Object(resp.error)) {
            showAlert(resp.error.message, "warn");
            // this.setState({ backendError: this.state.backendError + 1 });
            setTimeout(() => {
              // ToDo : Uncomment the below line in Prod
              if (environment === "prod" || environment === "dev")
                history.push(ENachResponseUrl.cancel_url);
              // window.location.href = ENachResponseUrl.cancel_url;
            }, 1000);
          }
          /*  if (this.state.backendError < 2)
                      setTimeout(() => {
                        this._updateBackend(result);
                      }, 500);
                    else */
        },
        resp => {
          showAlert("net");
          changeLoader(false);
        }
      );
  };

  _triggerDigio = () => {
    // console.log(this.props.eNachPayload);
    const { eNachPayload, history, showAlert } = this.props;
    let eNachPayDigio = eNachPayload;
    eNachPayDigio.code_mode = environment;

    if (this.state.ctr < 2) {
      let event = new CustomEvent("dispatchDigio", {
        detail: eNachPayDigio
      });
      document.dispatchEvent(event);
    } else {
      showAlert("You can not try eNACH more than twice", "warn");
      showAlert("Redirecting you back to Anchor portal..", "info");
      this.setState({ errorMsg: true });
      setTimeout(() => {
        // ToDo : Uncomment this line in Prod
        if (environment === "prod" || environment === "dev")
          history.push(ENachResponseUrl.error_url);
        // window.location.href = ENachResponseUrl.error_url;
      }, 1000);
    }
  };

  _fetchAnchorDetail() {
    const {
      token,
      eNachPayload,
      setAnchorObj,
      showAlert,
      changeLoader
    } = this.props;
    changeLoader(true);
    if (eNachPayload === Object(eNachPayload) && eNachPayload)
      fetch(
        `${baseUrl}/merchants/${
          eNachPayload.anchor_id
        }/get_details?app_id=${app_id}`,
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
            //   console.log(resp.response);
          },
          resp => {
            changeLoader(false);
            // showAlert('net');
          }
        );
    else changeLoader(false);
  }

  componentWillMount() {
    let {
      changeLoader,
      EnachsetPayload,
      token,
      eNachPayload,
      showAlert
    } = this.props;
    changeLoader(false);

    // let token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyNiwidHlwZSI6InJlYWN0X3dlYl91c2VyIiwiZXhwIjoxNTYwMzMzNTYxfQ.yzD-pIyaf4Z7zsXEJZG-Hm0ka80CjMjMB74q6dpRSPM`;
    let { href } = window.location,
      base64_decode = {},
      payload;

    if (environment === "local") base64_decode = eNachPayloadStatic;

    // ToDo : hide the 2 lines in prod
    if (eNachPayload === Object(eNachPayload) && eNachPayload) {
      // coming from constant
      Object.assign(base64_decode, eNachPayload);
    }

    this.setState({ errorMsg: false });
    if (environment === "prod" || environment === "dev") {
      payload = retrieveParam(href, "payload") || undefined;
      token = retrieveParam(href, "token") || undefined;
      if (payload) base64_decode = base64Logic(payload, "decode");
      // else this.setState({errorMsg: true});
      // console.log(base64_decode);
    }

    if (base64_decode !== Object(base64_decode) && !base64_decode && !token)
      showAlert(
        "You cannot access this page directly without Authorised Session !!",
        "error"
      );
    else {
      EnachsetPayload(token, base64_decode);
      this._fetchAnchorDetail();
    }
  }

  componentDidMount() {
    const {
      eNachAttempt,
      eNachPayload,
      history,
      showAlert,
      EnachsetAttempt
    } = this.props;
    if (eNachAttempt) this.setState({ ctr: eNachAttempt });
    let that = this;

    document.addEventListener("responseDigio", function(obj) {
      let { detail } = obj;

      // console.log(JSON.stringify(detail));
      if (detail.error_code !== undefined) {
        showAlert(
          `Failed to register with error :  ${detail.message}`,
          "error"
        );
        that.setState(
          prevState => ({
            ctr: prevState.ctr + 1
          }),
          () => EnachsetAttempt(that.state.ctr)
        );

        detail.mandate_id = detail.digio_doc_id;
        detail.status = detail.error_code === "CANCELLED" ? "cancel" : "error";
        setTimeout(() => {
          // ToDo : uncomment in prod
          if (environment === "prod" || environment === "dev")
            if (eNachPayload === Object(eNachPayload))
              if (detail.error_code !== "CANCELLED")
                history.push(ENachResponseUrl.error_url);
          // window.location.href = ENachResponseUrl.error_url;
        }, 1000);
      } else {
        showAlert("Register successful for e-NACH", "success");
        detail.mandate_id = detail.digio_doc_id;
        detail.status = "success";
      }
      // console.log(eNachPayload);
      that._updateBackend(detail);
    });

    // ToDo : uncomment in prod
    if (environment === "prod" || environment === "dev")
      if (eNachPayload === Object(eNachPayload) && eNachPayload.mandate_id)
        setTimeout(() => this._triggerDigio(), 1000);
  }

  render() {
    // let {payload, match} = this.props;
    const { eNachPayload } = this.props;
    return (
      <>
        {/*<i style={{fontSize: '60px'}} className={"fa fa-check-circle checkCircle"}></i>*/}
        <h4 className={"text-center"}> e-NACH Mandate</h4>
        <br />

        <div className=" text-left " role="alert" style={{ margin: "auto" }}>
          {eNachPayload === Object(eNachPayload) && eNachPayload.mandate_id ? (
            <p className="paragraph_styling alert alert-info">
              Kindly complete the eNACH procedure by clicking the button below.
              Remember, you may only try twice.
            </p>
          ) : (
            <p className="paragraph_styling alert alert-danger">
              You may not access this page directly without appropriate
              payload/session.
            </p>
          )}
        </div>
        <br />
        <div
          className=" text-left alert alert-danger"
          role="alert"
          style={{
            margin: "auto",
            display: this.state.errorMsg ? "block" : "none"
          }}
        >
          <p className="paragraph_styling">
            You have tried more than twice, Redirecting you back to Anchor
            Portal...
          </p>
        </div>
        <div className="mt-5 mb-4 text-center">
          <button
            type="button"
            onClick={e => this._triggerDigio()}
            disabled={
              eNachPayload !== Object(eNachPayload) || !eNachPayload.mandate_id
            }
            className="form-submit btn btn-raised greenButton"
          >
            Initiate E-NACH
          </button>
        </div>
        {/* <div className={"text-right"}>
                    <button type="button"
                            disabled={
                                eNachPayload !== Object(eNachPayload) || !eNachPayload.mandate_id
                            } onClick={() => {
                        this.props.history.push(`${PUBLIC_URL}/enach/pnach`);
                    }} className={"btn btn-sm form-submit btn-default "}>
                        Bank Not Listed
                    </button>
                </div>*/}
      </>
    );
  }
}

const mapStateToProps = state => ({
  token: state.eNachReducer.token,
  eNachPayload: state.eNachReducer.eNachPayload
});

export default withRouter(
  connect(
    mapStateToProps,
    { changeLoader, EnachsetPayload, EnachsetAttempt, setAnchorObj, showAlert }
  )(ENach)
);
