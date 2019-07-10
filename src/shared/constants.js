// Just change the following line to Test it on Prod or Dev environment
const env_mode = 'dev'; // dev , prod , local,
const subUrl = (env_mode === 'dev' || env_mode === 'local') ? 'test' : 'live'; //  `live` | `test`  , Sub url for Mintifi API webhook
const payMintifiUrl = (env_mode === 'dev' || env_mode === 'local') ? 'http://test.pay.mintifi.com' : 'https://pay.mintifi.com';
// For Deployment of Base Root

// For redirection after Failure and Success (of enach or drawdwon) (Its a dummy and Optional)
const baseRootPath = (env_mode === 'local') ? 'http://localhost' : (env_mode === 'dev') ? 'http://test.pay.mintifi.com' : 'https://pay.mintifi.com';

const anchorUrls = {
    "success_url": `${baseRootPath}/`,
    "cancel_url": `${baseRootPath}/`,
    "error_url": `${baseRootPath}/`
};

module.exports = {
    environment: env_mode,
    app_id: '1', // For React
    user_id: '7KhXdg', // For React
    auth_secret: 'PYj055HtW7sDxsd2GD4Cgw',
    payMintifiUrl: payMintifiUrl,
    baseUrl: `https://${subUrl}.mintifi.com/api/v1`,
    baseUrl2: `https://${subUrl}.mintifi.com/api/v2`,
    loanUrl: `https://${subUrl}.mintifi.com/api/loan/v1`,
    otpUrl: `https://${subUrl}.mintifi.com/api/v2/communications`,
    gst_karza: "https://gst.karza.in/uat/v1",
    test_kscan: "https://testapi.kscan.in/v1/gst/",
    karza_key: "jdughfoP51majvjAUW6W",
    digio: "",
    BusinessType: [
        {value: "", label: "Select Company type"},
        {value: "proprietorship", label: "Proprietorship"},
        {value: "private_limited", label: "Private Limited Company"},
        {value: "partnership", label: "Partnership"},
        {value: "llp", label: "Limited Liability Partnership"},
        {value: "trust", label: "Trust"},
        {value: "others", label: "Others"},
    ],
    /*    accountType: {
            "sa": "Savings Account",
            "ca": "Current Account"
        },*/
    accountType: [
        {value: "", label: "Select Account type"},
        {value: "sa", label: "Savings Account"},
        {value: "ca", label: "Current Account"}
    ],
    defaultLender: "Mintifi Finserv Private Limited", // Fullerton India Private Limtited
    OTP_Timer: 60,
    landingPayload: {
        "anchor_id": "uyh65t",
        "distributor_dealer_code": "WC001",
        "sales_agent_mobile_number": "9876543210",
        "anchor_transaction_id": Math.random().toString(36).substr(2, 6),
        "retailer_onboarding_date": "2006-09-19",
        "product_type": "term_loan", // ["over_draft", "term_loan", "daily_emi", "supply_chain"]
        "vintage": null,
        "loan_amount": "500000",
        "success_url": anchorUrls.success_url,
        "error_url": anchorUrls.error_url,
        "cancel_url": anchorUrls.cancel_url,
    },
    eNachPayloadStatic: {
        "mandate_id": "ENA19061214540850995IU6FCU1LE1AP",
        "document_id": "ENA19061214540850995IU6FCU1LE1AP",
        "user_name": "Arun Garg",
        "user_mobile": "9738361083",
        "loan_application_id": 2369,
        "company_id": 700,
        "anchor_id": "8186bc",
        "success_url": `${payMintifiUrl}/enach/success_url`,
        "cancel_url": `${payMintifiUrl}/enach/cancel_url`,
        "error_url": `${payMintifiUrl}/enach/error_url`
    },
    drawdownPayload: {
        "anchor_id": "uyh65t",
        "loan_amount": "500000",
        "anchor_drawdown_id": "s65d7f8",
        "loan_application_id": "8456",
        "company_id": "629",
        "drawdown_amount": "20000",
        "disbursement_account_code": "sdtf78",
        "success_url": anchorUrls.success_url,
        "cancel_url": anchorUrls.cancel_url,
        "error_url": anchorUrls.error_url
    },
    existUserPayload: {
        "user_name": "Mahesh Pai",
        "user_email": "mahesh.pai@gmail.com",
        "loan_application_id": "1740",
        "loan_status": "pending",
        "loan_amount_approved": "500000",
        "loan_product_type": "term_loan",
        loan_details: {
            loan_tenor: '16',
            roi: '7',
            emi: '33440'
        }
    }

};
