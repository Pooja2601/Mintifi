import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { changeLoader, DrawsetLoanPayload, showAlert } from "../../actions";
import { otpUrl, baseUrl, environment, app_id } from "../../shared/constants";
import { fetchAPI, apiActions, postAPI } from "../../api";

const { PUBLIC_URL } = process.env;

/*
let creditLimit = {
    "status": "success",
    "error_code": "E000",
    "approved_credit_limit": 200000,
    "balance_credit_limit": 100000,
    "timestamp": "2019-09-09T06:42:12.000Z"
};

let loanStatus = {
    "status": "success",
    "error_code": "E000",
    "loan_status": "bank_approved",
    "loan_status_date": "2019-09-07T06:42:12.000Z",
    "timestamp": "2019-09-09T06:42:12.000Z"
};

let loanOffers = {
    "status": "success",
    "error_code": "E000",
    "company_id": 8765,
    "amount": 50000,
    "loan": {
        "loan_application_id": 994,
        "offers": [{
            "product_type": "term_loan",
            "roi": 18,
            "tenor": 3,
            "emi": 19666
        }, {
            "product_type": "term_loan",
            "roi": 18,
            "tenor": 6,
            "emi": 9833
        }, {
            "product_type": "term_loan",
            "roi": 18,
            "tenor": 9,
            "emi": 6555
        }, {
            "product_type": "term_loan",
            "roi": 18,
            "tenor": 12,
            "emi": 4916
        }]
    },
    "timestamp": "2019-09-09T06:42:12.000Z"
};
*/

class FetchOffers extends Component {
  state = {
    tnc_consent: false,
    selected: {}
  };

  // Getting Credit Limit
  _fetchCreditLimit = async () => {
    const { token, payload, showAlert, changeLoader } = this.props;

    let reqParam = `?app_id=${app_id}&anchor_id=${payload.anchor_id}&loan_application_id=${payload.loan_application_id}`;

    const options = {
      URL: `${baseUrl}/companies/${payload.company_id}/limit/${reqParam}`,
      token: token
    };

    const resp = await fetchAPI(options);

    // ToDo : fixed : forgot to add both lines under brackets
    if (resp.status === apiActions.ERROR_NET) {
      showAlert("net");
      return undefined;
    }
    if (resp.status === apiActions.SUCCESS_RESPONSE) {
      return resp.data;
    } else if (resp.status === apiActions.ERROR_RESPONSE) {
      // ToDo : fixed : forgot to add both lines under brackets
      showAlert("An error occurred while fetching credit limit", "warn");
      return null;
    }
  };

  // Getting Loan Status
  _fetchLoanStatus = async () => {
    const { token, payload, showAlert, changeLoader } = this.props;
    changeLoader(true);
    let reqParam = `?app_id=${app_id}&anchor_id=${payload.anchor_id}`;
    // TODO: check fetchAPI function
    const options = {
      URL: `${baseUrl}/loans/${payload.loan_application_id}/status/${reqParam}`,
      token: token
    };

    const resp = await fetchAPI(options);

    if (resp.status === apiActions.ERROR_NET) {
      showAlert("net");
      return undefined;
    }

    // DrawsetLoanPayload({loanOffers: null, loanStatus: resp, creditLimit: loanPayload.creditLimit});
    if (resp.status === apiActions.ERROR_RESPONSE) {
      showAlert("An error occurred while fetching Loan Status", "warn");
      return null;
    } else if (resp.status === apiActions.SUCCESS_RESPONSE) {
      return resp.data;
    }
  };

  // Getting Loan Offers
  _fetchLoanOffers = async () => {
    const { token, payload, showAlert, changeLoader } = this.props;
    changeLoader(true);
    let reqParam = `?app_id=${app_id}&anchor_id=${payload.anchor_id}&amount=${payload.drawdown_amount}`;

    // TODO: check fetchAPI function
    const options = {
      URL: `${baseUrl}/loans/${payload.loan_application_id}/offers/${reqParam}`,
      token: token
    };

    const resp = await fetchAPI(options);

    if (resp.status === apiActions.ERROR_NET) {
      showAlert("net");
      return undefined;
    }

    if (resp.status === apiActions.ERROR_RESPONSE) {
      showAlert("An error occurred while fetching Loan Offers", "warn");
      return null;
    } else if (resp.status === apiActions.SUCCESS_RESPONSE) {
      return resp.data;
    }
  };

  _fetchInformation = async () => {
    const { DrawsetLoanPayload, loanPayload, history } = this.props;

    let creditLimit = await this._fetchCreditLimit();
    let loanStatus = await this._fetchLoanStatus();
    let loanOffers = await this._fetchLoanOffers();

    DrawsetLoanPayload({
      loanOffers: loanOffers,
      loanStatus: loanStatus,
      creditLimit: creditLimit
    });

    if (creditLimit && loanStatus && loanOffers) {
      if (loanStatus.loan_application_status === "to_settle")
        setTimeout(() => {
          console.log(JSON.stringify(loanPayload));
          history.push(`${PUBLIC_URL}/drawdown/offers`);
        });
    } else history.push(`${PUBLIC_URL}/drawdown/auth`);
  };

  componentWillMount() {
    const { payload, authObj, changeLoader, history } = this.props;
    changeLoader(true);
    if (authObj !== Object(authObj) && !authObj)
      history.push(`${PUBLIC_URL}/drawdown/auth`);
    if (payload !== Object(payload) && !payload) {
      history.push(`${PUBLIC_URL}/drawdown/token`);
    }
  }

  componentDidMount() {
    // const {DrawsetLoanPayload, changeLoader} = this.props;

    // ToDo : comment this development
    if (environment === "prod" || environment === "dev")
      this._fetchInformation();

    // ToDo : uncomment this 2 lines for development
    /*  if (environment === 'local') {
              DrawsetLoanPayload({loanOffers: loanOffers, loanStatus: loanStatus, creditLimit: creditLimit});
              DrawsetPreflight(preFlightResp);
          }*/
  }

  render() {
    return (
      <>
        <div className="justify-content-center text-center fetchLoadPage">
          <i className={"fa fa-clipboard-list"} /> <br />
          <div className="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
          </div>{" "}
          <p className="paragraph_section">
            Processing your Application.. <br />
            Fetching the best offers for you, Hold on!
          </p>{" "}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  token: state.drawdownReducer.token,
  payload: state.drawdownReducer.payload,
  authObj: state.drawdownReducer.authObj,
  loanPayload: state.drawdownReducer.loanPayload
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      changeLoader,
      DrawsetLoanPayload,
      showAlert
    }
  )(FetchOffers)
);
