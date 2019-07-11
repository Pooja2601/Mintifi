// import React from "react";
// import {withRouter} from "react-router-dom";
// import {changeLoader,  DrawsetToken} from "../../actions";
import { toast } from "react-toastify";
import { app_id, auth_secret, baseUrl, user_id } from "./constants";

export const alertModule = (msg, type) => {
  if (!msg) {
    console.log("Looks like a connectivity issue..!");
    toast.error("Looks like a connectivity issue..!");
  } else {
    if (type === "warn") toast.warn(msg);
    else if (type === "success") toast.success(msg);
    else if (type === "error") toast.error(msg);
    else if (type === "info") toast.info(msg);
    else toast(msg);
  }
};

export const base64Logic = (payload, action) => {
  let base64 = {};
  if (action === "decode") {
    try {
      base64 = payload
        ? JSON.parse(new Buffer(payload, "base64").toString("ascii"))
        : {};
    } catch (e) {
      toast.error("Not a Valid JSON Response");
    }
  }
  if (action === " encode") {
    try {
      base64 =
        payload === Object(payload)
          ? JSON.stringify(new Buffer(payload).toString("base64"))
          : {};
    } catch (e) {
      toast.error("Not a Valid Javascript Object");
    }
  }
  return base64;
};

export const retrieveParam = (urlToParse, key) => {
  // if (urlToParse.length > 0)
  try {
    let url = new URL(urlToParse);
    let paramVal = url.searchParams.get(key);

    return paramVal;
  } catch (e) {
    return null;
  }
};

export const generateToken = () => {
  // ToDo : make it const in Prod

  return fetch(`${baseUrl}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: user_id,
      secret_key: auth_secret,
      app_id: app_id,
      type: "react_web_user"
    })
  })
    .then(resp => resp.json())
    .then(
      resp => {
        if (resp.response === Object(resp.response)) {
          if (resp.response.status === "success")
            return resp.response.auth.token;
        } else return 31;
        // console.log(this.props.token);
      },
      () => {
        alertModule();
        return 30;
      }
    );
};
