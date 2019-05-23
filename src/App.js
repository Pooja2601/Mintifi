import React, {Component} from "react";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Switch, Link, withRouter} from "react-router-dom";
import ScrollToTop from "./shared/scrollhack";

import configureStore from "./store";
import {PersistGate} from 'redux-persist/integration/react';
// import { withSnackbar } from 'material-ui-snackbar-provider';
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
import Auth from "./components/preapprove/auth";
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

//Drawdown
import DrawIndex from "./components/drawdown/";
import Drawdown from "./components/drawdown/token";
import DrawAuth from "./components/drawdown/auth";
import Offers from "./components/drawdown/offers";
import DrawThankYou from "./components/drawdown/thankyou";

//E-NACH
import ENach from "./components/e_nach";

const {store, persistor} = configureStore();

// const store = configureStore();   // without redux-persist

class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>

                        <Route
                            render={({location}) => (<>
                                <ScrollToTop/>
                                {/*<button style={{visibility: 'hidden'}} type={"button"}
                                        ref={ref => this.showSnackbary = ref}
                                        data-toggle='snackbar'
                                        data-content={''}>.
                                </button>*/}
                                <header>
                                    <div className="mt-3 text-center">
                                        <div className="mb-4">
                                            <img
                                                src="/images/Mintifi-Logo-white_2.png"
                                                className={"logoHeader"}
                                            />
                                            {/*<b className={"anchorText"}>Anchor Merchant</b>*/}
                                            <img style={{
                                                position: 'absolute', right: '24.4%', top: "18px",
                                                width: '85px'
                                            }}
                                                 src="/images/company/yatra.png"
                                                 className={"anchorLogo"}
                                            />
                                        </div>
                                    </div>
                                    {/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
                                         preserveAspectRatio="none">
                                        <polygon className="svg--sm" fill="white"
                                                 points="0,0 30,100 65,21 90,100 100,75 100,100 0,100"/>
                                        <polygon className="svg--lg" fill="white"
                                                 points="0,0 15,100 33,21 45,100 50,75 55,100 72,20 85,100 95,50 100,80 100,100 0,100"/>
                                    </svg>*/}
                                </header>
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
                                                <Route exact path="/preapprove/" component={Index}/>
                                                <Route exact path="/preapprove/token/:token?/:payload?"
                                                       component={Login}/>
                                                <Route path="/preapprove/auth/" component={Auth}/>
                                                <Route path="/preapprove/adharpan" component={AdharPan}/>
                                                <Route path="/preapprove/personaldetail" component={PersonalDetail}/>
                                                <Route path="/preapprove/mobileotp" component={MobileOTP}/>
                                                <Route path="/preapprove/businessdetail" component={BusinessDetail}/>
                                                <Route path="/preapprove/finalize" component={Finalize}/>
                                                {/*<Route path="/ReviewChanges" component={ReviewChanges}/>*/}
                                                <Route path="/preapprove/apprejected" component={AppRejected}/>
                                                <Route path="/preapprove/appapproved" component={AppApproved}/>
                                                <Route path="/preapprove/docsupload" component={DocsUpload}/>
                                                <Route path="/preapprove/bankdetail" component={BankDetail}/>
                                                <Route path="/preapprove/thankyou" component={ThankYou}/>
                                                <Route path="/preapprove/privacy" component={Privacy}/>

                                                <Route exact path="/drawdown" component={DrawIndex}/>
                                                <Route exact path="/drawdown/token/:token?/:payload?"
                                                       component={Drawdown}/>
                                                <Route path="/drawdown/auth" component={DrawAuth}/>
                                                <Route path="/drawdown/offers" component={Offers}/>
                                                <Route path="/drawdown/thankyou" component={DrawThankYou}/>
                                                <Route exact path="/enach/token/:token?/:payload?" component={ENach}/>
                                                <Route component={Error}/>
                                            </Switch>
                                            {/*</CSSTransition>*/}
                                            {/*</TransitionGroup>*/}
                                        </div>
                                    </div>
                                </div>
                                <ToastContainer style={{marginBottom: '100px'}} autoClose={8000}
                                                position={toast.POSITION.BOTTOM_RIGHT}/>
                            </>)}/>

                    </BrowserRouter>
                </PersistGate>
            </Provider>
        );
    }
}

export default App;
