import React from "react";
import { checkObject, regexTrim } from "../shared/common_logic";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InputWrapper = props => {
  const {
    validation,
    onChangeHandler,
    localState,
    alertObj,
    addText,
    isPhone,
    isSubmitted,
    isDatepicker
  } = props;
  const VALIDATION = validation;
  const { showError, slug } = alertObj;
  let phoneClass = isPhone ? "input-group" : "";
  let disabled = VALIDATION.disabled ? VALIDATION.disabled : false;

  const datePickerFunction = () => {
    return (
      <>
        <div className="form-group mb-3">
          <label htmlFor={VALIDATION.id} className="bmd-label-floating">
            {VALIDATION.label}
          </label>
          <div className={"d-block"}>
            <DatePicker
              className="form-control font_weight"
              // placeholderText={"Date of Birth"}
              selected={new Date(localState[VALIDATION.slug])}
              id={VALIDATION.id}
              pattern={regexTrim(VALIDATION.pattern)}
              scrollableYearDropdown
              showMonthDropdown
              dropdownMode={"scroll"}
              required={VALIDATION.required}
              showYearDropdown
              dateFormat={VALIDATION.dateFormat}
              onChange={e => onChangeHandler(VALIDATION, e)}
            />
          </div>
        </div>
      </>
    );
  };

  const inputFunction = () => {
    debugger;
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

  return isDatepicker ? datePickerFunction() : inputFunction();
};

InputWrapper.defaultProps = {
  alertObj: { showError: false, slug: "" },
  validation: {},
  onChangeHandler: () => {},
  localState: {},
  addText: "",
  isPhone: false,
  isSubmitted: false,
  isDatepicker: false
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
