import React, {Component} from "react";
import {withRouter} from "react-router-dom";

const Landing = (props) => {
    props.history.push("/Token/");

    return (<> </>);
};

export default withRouter(Landing);
