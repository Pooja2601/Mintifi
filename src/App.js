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

import configureStore from "./store";

const store = configureStore();

class App extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>

                    <Route
                        render={({location}) => (<>
                            <ScrollToTop/>
                            <div
                                className="row justify-content-center background-color"
                                style={{backgroundColor: "#DDD", marginTop: "100px"}}
                            >
                                <div className="col-11 col-md-6 ml-5 mr-5 partner_section"
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
            </Provider>
        );
    }
}

export default App;
