import React, {Component} from "react";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Switch, Link} from "react-router-dom";
import ScrollToTop from "./shared/scrollhack";
import {TransitionGroup, CSSTransition} from "react-transition-group";

// import Header from "./shared/header";
// import Footer from "./shared/footer";
import Error from "./shared/error";
import Privacy from "./shared/privacy_policy";
import Login from "./components";
import Auth from "./components/auth";
import AdharPan from "./components/adhar_pan";
import AdharComplete from "./components/adhar_pan/adhar_complete";
import BusinessDetail from "./components/gst_business";
import ReviewChanges from "./components/gst_business/review_changes";
import AppRejected from "./components/ip_approval/app_rejected";
import AppApproved from "./components/ip_approval/app_approved";
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
                                    style={{backgroundColor: "#DDD", marginTop: "100px", marginLeft: 0, marginRight: 0}}
                                >
                                    <div className="col-11 col-md-7 ml-5 mr-5 partner_section"
                                         style={{backgroundColor: '#fff'}}>
                                        <div className="ml-2">
                                            <div className="mt-4 text-center">
                                                <div className="mt-4 mb-4 border_bottom">
                                                    <img
                                                        src="images/logo.png"
                                                        style={{width: "150px", paddingBottom: "10px"}}
                                                    />
                                                </div>
                                            </div>

                                            {/*<TransitionGroup>*/}
                                            {/* <CSSTransition
                                                key={location.key}
                                                classNames="fade"
                                                timeout={50}>*/}
                                            <Switch location={location}>
                                                <Route exact path="/" component={Login}/>
                                                <Route path="/Auth" component={Auth}/>
                                                <Route path="/AdharPan" component={AdharPan}/>
                                                <Route path="/AdharComplete" component={AdharComplete}/>
                                                <Route path="/BusinessDetail" component={BusinessDetail}/>
                                                <Route path="/ReviewChanges" component={ReviewChanges}/>
                                                <Route path="/AppRejected" component={AppRejected}/>
                                                <Route path="/AppApproved" component={AppApproved}/>
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
