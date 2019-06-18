import React, {Component} from "react";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Switch, Link, withRouter} from "react-router-dom";
import ScrollToTop from "./shared/scrollhack";

import configureStore from "./store";
import {PersistGate} from 'redux-persist/integration/react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import {TransitionGroup, CSSTransition} from "react-transition-group";

// import Header from "./shared/header";
// import Footer from "./shared/footer";
import Loader from "./shared/loader";
import Error from "./shared/error";
import Privacy from "./shared/privacy_policy";
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
import Offers from "./components/drawdown/offers";
import DrawThankYou from "./components/drawdown/thankyou";

//E-NACH
import ENach from "./components/e_nach";
import SuccessUrl from "./components/e_nach/success_url";
import ErrorUrl from "./components/e_nach/error_url";
import CancelUrl from "./components/e_nach/cancel_url";

import Headers from "./shared/header";
import CustomAlerts from "./shared/custom_alerts";
import AccessRoute from "./shared/test";

const {store, persistor} = configureStore();

// const store = configureStore();   // without redux-persist
const {PUBLIC_URL} = process.env;
const anchor_logo = `${PUBLIC_URL}/images/company/yatra.png`;

class App extends Component {

    render() {

        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    {/* ToDo : Change to sub Dir name in Prod (if placed in a sub) */}
                    <BrowserRouter basename={"./"}>

                        <Route
                            render={({location}) => (<>
                                <ScrollToTop/>
                                {/*<AccessRoute/>*/}
                                <Headers/>
                                <div
                                    className="row justify-content-center background-color"
                                    style={{marginTop: "180px", marginLeft: 0, marginRight: 0}}
                                >
                                    <div className="col-11 col-md-6 ml-5 mr-5 mb-3 partner_section"
                                         style={{
                                             backgroundColor: '#fff',
                                             border: '0px',
                                             paddingLeft: '1%',
                                             paddingRight: '1%'
                                         }}>

                                        <Loader/>
                                        <div className="ml-2" style={{marginTop: '30px'}}>

                                            {/*<TransitionGroup>*/}
                                            {/* <CSSTransition
                                                key={location.key}
                                                classNames="fade"
                                                timeout={50}>*/}
                                            <Switch location={location}>
                                                <Route exact path={`${PUBLIC_URL}/`} component={Index}/>
                                                <Route exact path={`${PUBLIC_URL}/preapprove/`}
                                                       component={Index}/>
                                                <Route exact
                                                       path={`${PUBLIC_URL}/preapprove/token/:token?/:payload?`}
                                                       component={Login}/>
                                                <Route path={`${PUBLIC_URL}/preapprove/auth/`}
                                                       component={Auth}/>
                                                <Route path={`${PUBLIC_URL}/preapprove/adharpan`}
                                                       component={AdharPan}/>
                                                <Route path={`${PUBLIC_URL}/preapprove/personaldetail`}
                                                       component={PersonalDetail}/>
                                                <Route path={`${PUBLIC_URL}/preapprove/mobileotp`}
                                                       component={MobileOTP}/>
                                                <Route path={`${PUBLIC_URL}/preapprove/businessdetail`}
                                                       component={BusinessDetail}/>
                                                <Route path={`${PUBLIC_URL}/preapprove/finalize`}
                                                       component={Finalize}/>
                                                {/*<Route path="/ReviewChanges" component={ReviewChanges}/>*/}
                                                <Route path={`${PUBLIC_URL}/preapprove/apprejected`}
                                                       component={AppRejected}/>
                                                <Route path={`${PUBLIC_URL}/preapprove/appapproved`}
                                                       component={AppApproved}/>
                                                <Route path={`${PUBLIC_URL}/preapprove/docsupload`}
                                                       component={DocsUpload}/>
                                                <Route path={`${PUBLIC_URL}/preapprove/bankdetail`}
                                                       component={BankDetail}/>
                                                <Route path={`${PUBLIC_URL}/preapprove/thankyou`}
                                                       component={ThankYou}/>
                                                <Route path={`${PUBLIC_URL}/preapprove/privacy`}
                                                       component={Privacy}/>
                                                <Route path={`${PUBLIC_URL}/exist/dashboard/`}
                                                       component={Dashboard}/>
                                                <Route exact path={`${PUBLIC_URL}/drawdown`}
                                                       component={DrawIndex}/>
                                                <Route exact
                                                       path={`${PUBLIC_URL}/drawdown/token/:token?/:payload?`}
                                                       component={Drawdown}/>
                                                <Route path={`${PUBLIC_URL}/drawdown/auth`}
                                                       component={DrawAuth}/>
                                                <Route path={`${PUBLIC_URL}/drawdown/offers`}
                                                       component={Offers}/>
                                                <Route path={`${PUBLIC_URL}/drawdown/thankyou`}
                                                       component={DrawThankYou}/>
                                                <Route exact path={`${PUBLIC_URL}/enach`}
                                                       component={ENach}/>
                                                <Route exact path={`${PUBLIC_URL}/enach/success_url`}
                                                       component={SuccessUrl}/>
                                                <Route exact path={`${PUBLIC_URL}/enach/cancel_url`}
                                                       component={CancelUrl}/>
                                                <Route exact path={`${PUBLIC_URL}/enach/error_url`}
                                                       component={ErrorUrl}/>
                                                <Route component={Error}/>
                                            </Switch>
                                            {/*</CSSTransition>*/}
                                            {/*</TransitionGroup>*/}
                                        </div>

                                        <CustomAlerts/>
                                    </div>
                                </div>

                                <ToastContainer style={{marginTop: '80px'}} autoClose={8000}
                                                position={toast.POSITION.TOP_RIGHT}/>
                            </>)}/>

                    </BrowserRouter>
                </PersistGate>
            </Provider>
        );
    }
}

export default App;
