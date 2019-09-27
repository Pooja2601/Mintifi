import React from "react";
import { checkObject, regexTrim } from "../shared/common_logic";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";

const InputWrapper = props => {
  const {
    validation,
    onChangeHandler,
    localState,
    alertObj,
    addText,
    isPhone,
    isSubmitted
  } = props;
  const VALIDATION = validation;
  const { showError, slug } = alertObj;
  let phoneClass = isPhone ? "input-group" : "";
  let disabled = VALIDATION.disabled ? VALIDATION.disabled : false;
  return (
    <>
      <div className="form-group mb-2">
        {/*#00b7a5*/}
        <label htmlFor={VALIDATION.id} className={"bmd-label-floating"}>
          {VALIDATION.label}
        </label>
        <div className={phoneClass}>
          {isPhone ? (
            <div className="input-group-prepend phoneDisplay">
              <span className="input-group-text" id="basic-addon3">
                +91
              </span>
            </div>
          ) : (
            ""
          )}
          <input
            type={VALIDATION.type}
            className={`form-control font_weight ${
              isPhone ? "prependInput" : ""
            }`}
            // placeholder="10 digit PAN Number"
            pattern={regexTrim(VALIDATION.pattern)}
            title={VALIDATION.title}
            autoCapitalize={VALIDATION.autoCapitalize}
            id={VALIDATION.id}
            disabled={isSubmitted ? false : disabled}
            required={VALIDATION.required}
            value={localState[VALIDATION.slug]}
            onChange={e => onChangeHandler(VALIDATION, e.target.value)}
          />
        </div>
        {showError && slug === VALIDATION.slug ? (
          <small style={{ color: "crimson", fontSize: "11px" }}>
            {VALIDATION.error}
          </small>
        ) : (
          ""
        )}
        {addText && <span className="bmd-help">{addText}</span>}
      </div>
    </>
  );
};

InputWrapper.defaultProps = {
  alertObj: { showError: false, slug: "" },
  validation: {},
  onChangeHandler: () => {},
  localState: {},
  addText: "",
  isPhone: false,
  isSubmitted: false
};

const mapStateToProp = state => ({
  alertObj: state.extraReducer.alertObj
});

export default withRouter(
  connect(
    mapStateToProp,
    {}
  )(InputWrapper)
);
