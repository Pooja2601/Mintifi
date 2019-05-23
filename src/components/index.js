import React, {Component} from "react";
import {withRouter} from "react-router-dom";

const Landing = (props) => {

    const {token, payload} = props.match.params;
    props.history.push("/preapprove/token/", {token: token, payload: payload});

    return (<> </>);
};

export default withRouter(Landing);
