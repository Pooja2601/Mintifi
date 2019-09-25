import React, {Component} from "react";
import {Provider} from "react-redux";
import {
    BrowserRouter,
    Route,
    Switch,
    Link,
    withRouter
} from "react-router-dom";
import ScrollToTop from "./shared/scrollhack";
import {payMintifiUrl} from './shared/constants'
import configureStore from "./store";
import {PersistGate} from "redux-persist/integration/react";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {routes} from './routes'

// import {TransitionGroup, CSSTransition} from "react-transition-group";

// import Header from "./shared/header";
// import Footer from "./shared/footer";
import Loader from "./shared/loader";
import Error_404 from "./layouts/404_page";

import Headers from "./layouts/header";
import CustomAlert from "./layouts/custom_alerts";

const {store, persistor} = configureStore();

// const store = configureStore();   // without redux-persist
const {PUBLIC_URL} = process.env;
// const anchor_logo = `${PUBLIC_URL}/images/company/yatra.png`;

const toastError = {marginTop: "-20px", position: "absolute"};

const isIframe = window.location !== window.parent.location;

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    {/* ToDo : Change to sub Dir name in Prod (if placed in a sub) */}
                    <BrowserRouter basename={"./"}>
                        <Route
                            render={({location}) => (
                                <>
                                    <ScrollToTop/>
                                    {/*<AccessRoute/>*/}
                                    <Headers/>
                                    <div
                                        className="row justify-content-center background-color ml-0 mr-0"
                                        style={{
                                            marginTop: isIframe ? "100px" : "180px"
                                        }}
                                    >
                                        <div
                                            className="col-11 col-md-6 ml-5 mr-5 mb-3 partner_section mainCardBody"
                                        >
                                            <CustomAlert/>
                                            <Loader/>
                                            <div className="ml-2 mt-3">
                                                {/*<TransitionGroup>*/}
                                                {/* <CSSTransition
                                                key={location.key}
                                                classNames="fade"
                                                timeout={50}>*/}
                                                <Switch location={location}>
                                                    {routes.map((val, key) => (
                                                        <Route
                                                            key={key}
                                                            exact
                                                            path={`${PUBLIC_URL}/${val.path}`}
                                                            component={val.component}
                                                        />
                                                    ))}

                                                    <Route component={Error_404}/>
                                                </Switch>
                                                {/*</CSSTransition>*/}
                                                {/*</TransitionGroup>*/}
                                            </div>
                                            {/*<CustomAlerts/>*/}
                                            <ToastContainer
                                                style={toastError}
                                                autoClose={8000}
                                                position={toast.POSITION.TOP_CENTER}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        />
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        );
    }
}

export default App;
