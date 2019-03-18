import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ScrollToTop from "./shared/scrollhack";
// import Header from "./shared/header";
// import Footer from "./shared/footer";
import Error from "./shared/error";
import Privacy from "./shared/privacy_policy";
import Login from "./components";
import Auth from "./components/auth";

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
          <>
            <ScrollToTop />
            <Switch>
              <Route exact path="/" component={Login} />
              <Route path="/Auth" component={Auth} />
              <Route path="/Privacy" component={Privacy} />
              <Route component={Error} />
            </Switch>
          </>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
