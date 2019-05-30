import React, {Component} from "react";
import {withRouter} from "react-router-dom";

const {PUBLIC_URL} = process.env;

const LandingDrawdown = (props) => {

    const {token, payload} = props.match.params;
    props.history.push(`${PUBLIC_URL}/Drawdown/Token/`, {token: token, payload: payload});

    return (<> </>);
};

export default withRouter(LandingDrawdown);
