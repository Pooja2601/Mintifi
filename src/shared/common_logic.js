// import React from "react";
import { toast } from "react-toastify";
import { app_id, auth_secret, baseUrl, user_id } from "./constants";
import { apiActions, postAPI } from "../api";

const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
export const Base64 = {
  btoa: (input = "") => {
    try {
      let str = input;
      let output = "";

      for (
        let block = 0, charCode, i = 0, map = chars;
        str.charAt(i | 0) || ((map = "="), i % 1);
        output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
      ) {
        charCode = str.charCodeAt((i += 3 / 4));

        if (charCode > 0xff) {
          throw new Error(
            "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
          );
        }

        block = (block << 8) | charCode;
      }

      return output;
    } catch (e) {
      return null;
    }
  },

  atob: (input = "") => {
    try {
      let str = input.replace(/=+$/, "");
      let output = "";

      if (str.length % 4 === 1) {
        throw new Error(
          "'atob' failed: The string to be decoded is not correctly encoded."
        );
      }
      for (
        let bc = 0, bs = 0, buffer, i = 0;
        (buffer = str.charAt(i++));
        ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
          ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
          : 0
      ) {
        buffer = chars.indexOf(buffer);
      }

      return output;
    } catch (e) {
      return null;
    }
  }
};

// Not used anymore, a Plugin for triggering Alerts
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

// Encodes or Decodes to and from Base64 string (input or output will be an object)
export const base64Logic = (payload, action) => {
  let base64 = {},
    newPayload = payload;
  if (action === "decode") {
    try {
      base64 = eval(`(${Base64.atob(newPayload)})`);
    } catch (e) {
      base64 = {};
    }

    /* try {
                      base64 = newPayload
                        ? JSON.parse(new Buffer(newPayload, "base64").toString("ascii"))
                        : {};
                    } catch (e) {
                      base64 = Base64.atob(newPayload);
                    } */
  }
  if (action === "encode") {
    newPayload = JSON.stringify(newPayload);
    try {
      base64 = newPayload ? new Buffer(newPayload).toString("base64") : {};
    } catch (e) {
      base64 = Base64.btoa(newPayload);
    }
  }
  return base64;
};

// Retrieves param(key) from URL (key, value basis)
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

export const generateToken = async () => {
  const options = {
    URL: `${baseUrl}/auth`,
    data: {
      user_id: user_id,
      secret_key: auth_secret,
      app_id: app_id,
      type: "react_web_user"
    }
  };

  const resp = await postAPI(options);

  if (resp.status === apiActions.ERROR_RESPONSE) return 30;
  else if (resp.status === apiActions.SUCCESS_RESPONSE) return resp.data; // ToDo : issue need to look

  return 31;
};

// Useful to dispatch an JS event, ideal when PWM is opened vai a POPup
export const postMessage = obj => {
  window.setTimeout(() => {
    window.parent.postMessage(obj, `*`);
  }, 4000);
};

export const retrieveDate = dateString => {
  let dt, date, month, year;
  try {
    let dt = new Date(dateString);
    date = dt.getDate();
    month = dt.getMonth() + 1;
    year = dt.getFullYear();

    date = date.toString().length === 1 ? `0${date}` : date;
    month = month.toString().length === 1 ? `0${month}` : month;
    return `${year}-${month}-${date}`;
  } catch (e) {
    return dateString;
  }
};

// Self Explanatory
export const checkObject = obj => {
  try {
    if (obj === null) return false;
    if (obj === undefined) return false;
    if (obj !== Object(obj)) return false;

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return true;
    }
  } catch (e) {
    return false;
  }
  // return true;
};

// Removes trimming slashes
export const regexTrim = regex => {
  var str = `${regex}`;
  return str.split("/")[1];
};

// Validates all the fields
export const fieldValidationHandler = props => {
  const { showAlert, validations, localState } = props;

  const lomo = Object.entries(validations).some((val, key) => {
    // console.log(val[1].slug);
    if (val[1].required) {
      let regexTest = val[1].pattern.test(localState[val[1].slug]);
      if (!regexTest) {
        // false : failed pattern
        if (localState[val[1].slug]) showAlert(val[1].error);
        return val[1];
      }
    }
  });

  if (!lomo) {
    showAlert();
  }
  return lomo; // true : for disabling
};
