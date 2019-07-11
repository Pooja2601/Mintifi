import React from "react";
import { withRouter } from "react-router-dom";

const { PUBLIC_URL } = process.env;

const Landing = props => {
  const { token, payload } = props.match.params;
  props.history.push(`${PUBLIC_URL}/preapprove/token/`, {
    token: token,
    payload: payload
  });

  return <> </>;
};

export default withRouter(Landing);
