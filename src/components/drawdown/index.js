import React from "react";
import {withRouter} from "react-router-dom";
// import {toast} from 'react-toastify';
import {alertModule} from '../../shared/commonLogic';

const Landing = (props) => {

    const {DrawsetToken, match, history} = props;
    const {token, payload} = match.params;

    let base64_decode = (payload !== undefined) ? JSON.parse(new Buffer(payload, 'base64').toString('ascii')) : {};

    // ToDo : comment in production
    base64_decode = {
        "anchor_id": "uyh65t",
        "distributor_dealer_code": "R1T89563",
        "sales_agent_mobile_number": "9876543210",
        // "anchor_transaction_id": "hy76515",
        "retailer_onboarding_date": "2006-09-19",
        "loan_amount": "500000",
        "anchor_drawdown_id ": "s65d7f8",
        "loan_application_id": "8456",
        "company_id": "629",
        "drawdown_amount": "20000",
        "disbursement_account_code": "sdtf78",
    };

    if (token === undefined && base64_decode === Object(base64_decode))
        alertModule('You cannot access this page directly without Authorised Session!!', 'error');
    // else console.log(token + ' ' + JSON.stringify(base64_decode));
    else history.push("/Drawdown/auth/", {token: token, payload: base64_decode});

    return (<>
        <div className={"alert alert-warning"}>You may not access this page as the session seems to be expired</div>
        <div className={"text-center"}>
            <button className={"btn btn-raised greenButton"}>Go Back</button>
        </div>
    </>);
};

export default withRouter(Landing);
