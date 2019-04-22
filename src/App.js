import React, {Component} from "react";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Switch, Link, withRouter} from "react-router-dom";
import ScrollToTop from "./shared/scrollhack";

import {TransitionGroup, CSSTransition} from "react-transition-group";

// import Header from "./shared/header";
// import Footer from "./shared/footer";
import Loader from "./shared/loader";
import Error from "./shared/error";
import Privacy from "./shared/privacy_policy";
import Index from "./components/";
import Login from "./components/landing";
import Auth from "./components/auth";
import AdharPan from "./components/adhar_pan";
import AdharComplete from "./components/adhar_pan/adhar_complete";
import MobileOTP from "./components/adhar_pan/mobile_otp";
import BusinessDetail from "./components/gst_business";
import ReviewChanges from "./components/gst_business/review_changes";
import AppRejected from "./components/ip_approval/app_rejected";
import AppApproved from "./components/ip_approval/app_approved";
import DocsUpload from "./components/ip_approval/docs_upload";
import ThankYou from "./components/ip_approval/thank_you";

import configureStore from "./store";
import {PersistGate} from 'redux-persist/integration/react';

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
                                <div
                                    className="row justify-content-center background-color"
                                    style={{marginTop: "100px", marginLeft: 0, marginRight: 0}}
                                >
                                    <div className="col-11 col-md-7 ml-5 mr-5 partner_section"
                                         style={{
                                             /*background: "url('/images/bg_textures/21617450.jpg')",*/
                                             backgroundColor: '#fff',
                                             border: '0px'
                                         }}>
                                        <header>
                                            <div className="mt-4 text-center">
                                                <div className="mt-4 mb-4">
                                                    <img
                                                        src="/images/Mintifi-Logo-white_2.png"
                                                        className={"logoHeader"}
                                                    />
                                                </div>
                                            </div>
                                            {/*<h1 className={"h1"}>Header Content</h1>*/}
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
                                                 preserveAspectRatio="none">
                                                <polygon className="svg--sm" fill="white"
                                                         points="0,0 30,100 65,21 90,100 100,75 100,100 0,100"/>
                                                <polygon className="svg--lg" fill="white"
                                                         points="0,0 15,100 33,21 45,100 50,75 55,100 72,20 85,100 95,50 100,80 100,100 0,100"/>
                                            </svg>
                                        </header>
                                        <Loader/>
                                        <div className="ml-2" style={{marginTop: '30px'}}>


                                            {/*<TransitionGroup>*/}
                                            {/* <CSSTransition
                                                key={location.key}
                                                classNames="fade"
                                                timeout={50}>*/}
                                            <Switch location={location}>
                                                <Route exact path="/" component={Index}/>
                                                <Route exact path="/Token/:token?/:payload?" component={Login}/>
                                                <Route path="/Auth/" component={Auth}/>
                                                <Route path="/AdharPan" component={AdharPan}/>
                                                <Route path="/AdharComplete" component={AdharComplete}/>
                                                <Route path="/MobileOTP" component={MobileOTP}/>
                                                <Route path="/BusinessDetail" component={BusinessDetail}/>
                                                <Route path="/ReviewChanges" component={ReviewChanges}/>
                                                <Route path="/AppRejected" component={AppRejected}/>
                                                <Route path="/AppApproved" component={AppApproved}/>
                                                <Route path="/DocsUpload" component={DocsUpload}/>
                                                <Route path="/ThankYou" component={ThankYou}/>
                                                <Route path="/Privacy" component={Privacy}/>
                                                <Route component={Error}/>
                                            </Switch>
                                            {/*</CSSTransition>*/}
                                            {/*</TransitionGroup>*/}
                                        </div>
                                    </div>
                                </div>
                            </>)}/>

                    </BrowserRouter>
                </PersistGate>
            </Provider>
        );
    }
}

export default App;
