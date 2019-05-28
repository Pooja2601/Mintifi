// import React from 'react';

module.exports = {
    baseUrl: "https://test.mintifi.com/api/v1",
    loanUrl: "https://test.mintifi.com/api/loan/v1",
    otpUrl: "https://test.mintifi.com/api/v2/communications",
    gst_karza: "https://gst.karza.in/uat/v1",
    test_kscan: "https://testapi.kscan.in/v1/gst/",
    karza_key: "jdughfoP51majvjAUW6W",
    digio: "",
    /*   BusinessType: {
           "proprietorship": "Proprietorship",
           "private_limited": "Private Limited Company",
           "partnership": "Partnership",
           "llp": "Limited Liability Partnership",
           "trust": "Trust",
           "others": "Others"
       },*/
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
        "mandate_id": "ENA1905241743051373W7G6CY5YAFMAP",
        "user_name": "Mohan Das",
        "user_mobile": "7892517116",
        "user_email": "mohan.das@gmail.com",
        "loan_application_id": '1005',
        "company_id": '940',
        "anchor_id": "uyh65t",
        "success_url": "https://success_url",
        "cancel_url": "https://cancel_url",
        "error_url": "https://error_url"
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
