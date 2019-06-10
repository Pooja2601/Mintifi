// Just change the following line to Test it on Prod or Dev environment
const env_mode = 'prod'; // dev , prod , static,
const subUrl = (env_mode === 'prod') ? 'test' : 'test'; //  `live` | `test`  , Sub url for Mintifi API webhook
const payMintifiUrl = (env_mode === 'prod') ? 'https://pay.mintifi.com' : 'https://pay-test.mintifi.com';

module.exports = {
    environment: env_mode,
    app_id: '6', // For React
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
        "distributor_dealer_code": "R1T89563",
        "sales_agent_mobile_number": "9876543210",
        "anchor_transaction_id": "hy76520",
        "retailer_onboarding_date": "2006-09-19",
        "vintage": null,
        "loan_amount": "500000",
        "success_url": 'http://localhost',
        "error_url": 'http://localhost',
        "cancel_url": 'http://localhost',
    },
    eNachPayload: {
        "mandate_id": "ENA190607121623999YUPG9VAMFRXWAP",
        "user_name": "Arun Garg",
        "user_mobile": "9738361083",
        "loan_application_id": 2314,
        "company_id": 700,
        "anchor_id": "uyh65t",
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
        "success_url": "https://success_url",
        "cancel_url": "https://cancel_url",
        "error_url": "https://error_url"
    }

};
