// Just change the following line to Test it on Prod or Dev environment
const isDev = window.location.host.localeCompare("test.pay.mintifi.com");
const isLocal = window.location.host.localeCompare("localhost:3000");
const isLocal2 = window.location.host.localeCompare("192.168.0.165:3000");
// const env_mode = process.env.NODE_ENV === "development" ? "dev" : "prod"; // dev , prod , local,
const env_mode =
    isDev === 0 || isLocal === 0 || isLocal2 === 0 ? "dev" : "prod"; // dev , prod , local,

const subUrl = env_mode === "dev" || env_mode === "local" ? "test" : "live"; //  `live` | `test`  , Sub url for Mintifi API webhook
const payMintifiUrl =
    env_mode === "dev" || env_mode === "local"
        ? `http://${window.location.host}`
        : `https://${window.location.host}`;

const anchorUrls = {
    success_url: `https://www.travelboutiqueonline.com/`,
    cancel_url: `https://www.travelboutiqueonline.com/`,
    error_url: `https://www.travelboutiqueonline.com/`
};

const anchor_id = "05cc584e39f34d0e97fc4bb6cd1fa8aa";
//TBO : 05cc584e39f34d0e97fc4bb6cd1fa8aa , Indiamart : 8186bc , wirecard : uyh65t

const {PUBLIC_URL} = process.env;
// console.log(window.location.host);
module.exports = {
    environment: env_mode,
    app_id: "1", // For React
    user_id: "7KhXdg", // For React
    auth_secret: "PYj055HtW7sDxsd2GD4Cgw",
    mintifiMail: "care@mintifi.com",
    mintifiMobile: "22-28201230",
    payMintifiUrl: payMintifiUrl,
    baseUrl: `https://${subUrl}.mintifi.com/api/v1`,
    baseUrl2: `https://${subUrl}.mintifi.com/api/v2`,
    loanUrl: `https://${subUrl}.mintifi.com/api/loan/v1`,
    otpUrl: `https://${subUrl}.mintifi.com/api/v2/communications`,
    gst_karza: "https://gst.karza.in/uat/v1",
    test_kscan: "https://testapi.kscan.in/v1/gst/",
    karza_key: "jdughfoP51majvjAUW6W",
    digio: "",
    ENachResponseUrl: {
        success_url: `${PUBLIC_URL}/enach/success_url`,
        cancel_url: `${PUBLIC_URL}/enach/cancel_url`,
        error_url: `${PUBLIC_URL}/enach/error_url`
    },
    BusinessType: [
        {value: "", label: "Select Company type"},
        {value: "proprietorship", label: "Proprietorship"},
        {value: "private_limited", label: "Private Limited Company"},
        {value: "partnership", label: "Partnership"},
        {value: "llp", label: "Limited Liability Partnership"},
        {value: "trust", label: "Trust"},
        {value: "others", label: "Others"}
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
    defaultLender: "Mintifi Finserv Pvt Ltd", // Fullerton India Private Limtited
    OTP_Timer: 60,
    landingPayload: {
        anchor_id: anchor_id,
        distributor_dealer_code: "WC001",
        sales_agent_mobile_number: "9876543210",
        anchor_transaction_id: Math.random()
            .toString(36)
            .substr(2, 6),
        retailer_onboarding_date: "2006-09-19",
        product_type: "term_loan", // ["over_draft", "term_loan", "daily_emi", "supply_chain"]
        vintage: null,
        loan_amount: "500000",
        success_url: anchorUrls.success_url,
        error_url: anchorUrls.error_url,
        cancel_url: anchorUrls.cancel_url
    },
    eSignPayloadStatic: {
        loan_application_id: 3211,
        company_id: 12259,
        anchor_id: anchor_id,
        success_url: anchorUrls.success_url,
        cancel_url: anchorUrls.error_url,
        error_url: anchorUrls.cancel_url
    },
    eSignDocsPayloadStatic: {
        url: "https://preprod.aadhaarbridge.com/api/_init",
        saCode: "b4237b",
        api: "ESIGN",
        requestId: "4fffe68a707c9d83",
        time_stamp: "1566411759787",
        purpose: "Agreement Signing",
        otp: "Y",
        fingerPrint: "N",
        iris: "N",
        face: "N",
        channel: "BOTH",
        esignName: "RENJITH THAMPAN THAMPAN",
        successUrl: "http://test.mintifi.com/esigns/38934/success",
        failureUrl: "http://test.mintifi.com/esigns/38934/failure",
        hash: "8a908178b7f4fb6f7787ac6d71551cfe1535dd4a3284c7ce8ed94b8515f822d2"
    },
    eNachPayloadStatic: {
        mandate_id: "ENA19061214540850995IU6FCU1LE1AP",
        document_id: "ENA19061214540850995IU6FCU1LE1AP",
        user_name: "Arun Garg",
        user_mobile: "7892517116",
        loan_application_id: 2369,
        company_id: 700,
        anchor_id: anchor_id,
        success_url: anchorUrls.success_url,
        cancel_url: anchorUrls.cancel_url,
        error_url: anchorUrls.error_url
    },
    drawdownPayload: {
        anchor_id: anchor_id,
        loan_amount: "500000",
        anchor_drawdown_id: Math.random()
            .toString(36)
            .substr(2, 6),
        loan_application_id: "2971",
        company_id: "745",
        drawdown_amount: "20000",
        disbursement_account_code: "sdtf78",
        success_url: anchorUrls.success_url,
        cancel_url: anchorUrls.cancel_url,
        error_url: anchorUrls.error_url
    },
    existUserPayload: {
        user_name: "Mahesh Pai",
        user_email: "mahesh.pai@gmail.com",
        loan_application_id: "1740",
        loan_status: "pending",
        loan_amount_approved: "500000",
        loan_product_type: "term_loan",
        loan_details: {
            loan_tenor: "16",
            roi: "7",
            emi: "33440"
        }
    }
};
