import React from 'react'

import Index from "./components/";
import Login from "./components/landing";
import AdharPan from "./components/preapprove/adhar_pan";
import PersonalDetail from "./components/preapprove/adhar_pan/personal_details";
import MobileOTP from "./components/preapprove/adhar_pan/mobile_otp";
import BusinessDetail from "./components/preapprove/gst_business";
import Finalize from "./components/preapprove/gst_business/finalize";
import AppRejected from "./components/preapprove/ip_approval/app_rejected";
import AppApproved from "./components/preapprove/ip_approval/app_approved";
import DocsUpload from "./components/preapprove/docs_bank/docs_upload";
import BankDetail from "./components/preapprove/docs_bank/bank_details";
import ThankYou from "./components/preapprove/ip_approval/thank_you";

//Existing User
import Auth from "./components/preapprove/exist_user";
import Dashboard from "./components/preapprove/exist_user/dashboard";

//Drawdown
import DrawIndex from "./components/drawdown/";
import Drawdown from "./components/drawdown/token";
import DrawAuth from "./components/drawdown/auth";
import DrawOffers from "./components/drawdown/offers";
import DrawFetchOffers from "./components/drawdown/fetch_offers";
import DrawThankYou from "./components/drawdown/thankyou";

//E-NACH
import ENach from "./components/e_nach";
import SuccessUrl from "./components/e_nach/success_url";
import ErrorUrl from "./components/e_nach/error_url";
import CancelUrl from "./components/e_nach/cancel_url";
import PNach from "./components/e_nach/pnach";
import ESign from "./components/e_nach/esign";
import ESignPopUp from "./components/e_nach/esign_popup";


const routes = [
    {
        path: '',
        component: Index,
    },
    {
        path: 'preapprove/token/:token?/:payload?',
        component: Login
    },
    {
        path: 'preapprove/auth/',
        component: Auth
    },
    {
        path: 'preapprove/adharpan',
        component: AdharPan
    },
    {
        path: 'preapprove/personaldetail',
        component: PersonalDetail
    },
    {
        path: 'preapprove/mobileotp',
        component: MobileOTP
    },
    {
        path: 'preapprove/businessdetail',
        component: BusinessDetail
    },
    {
        path: 'preapprove/finalize',
        component: Finalize
    },
    {
        path: 'preapprove/apprejected',
        component: AppRejected
    },
    {
        path: 'preapprove/appapproved',
        component: AppApproved
    },
    {
        path: 'preapprove/docsupload',
        component: DocsUpload
    },
    {
        path: 'preapprove/bankdetail',
        component: BankDetail
    },
    {
        path: 'preapprove/thankyou',
        component: ThankYou
    },
    {
        path: 'exist/dashboard',
        component: Dashboard
    },
    {
        path: 'drawdown',
        component: DrawIndex
    },
    {
        path: 'drawdown/token/:token?/:payload?',
        component: Drawdown
    },
    {
        path: 'drawdown/auth',
        component: DrawAuth
    },
    {
        path: 'drawdown/fetch_offers',
        component: DrawFetchOffers
    },
    {
        path: 'drawdown/offers',
        component: DrawOffers
    },
    {
        path: 'drawdown/thankyou',
        component: DrawThankYou
    },
    {
        path: 'enach',
        component: ENach
    },
    {
        path: 'enach/success_url',
        component: SuccessUrl
    },
    {
        path: 'enach/cancel_url',
        component: CancelUrl
    },
    {
        path: 'enach/error_url',
        component: ErrorUrl
    },
    {
        path: 'enach/pnach',
        component: PNach
    },
    {
        path: 'enach/esign',
        component: ESign
    },
    {
        path: 'enach/esign_popup',
        component: ESignPopUp
    }
];

export {routes};