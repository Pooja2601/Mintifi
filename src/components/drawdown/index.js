import React, {Component} from "react";
import {withRouter} from "react-router-dom";

const LandingDrawdown = (props) => {

    const {token, payload} = props.match.params;
    props.history.push(`${process.env.PUBLIC_URL}/Drawdown/Token/`, {token: token, payload: payload});

    return (<> </>);
};

export default withRouter(LandingDrawdown);
