import React from "react";
import { checkObject, regexTrim } from "../shared/common_logic";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";

const SwitchButtonWrapper = props => {
  const {
    validation,
    onChangeHandler,
    localState,
    alertObj,
    addText,
    isPhone
  } = props;
  const VALIDATION = validation;
  const { showError, slug } = alertObj;
  return (
    <>
      <div className="form-group mb-2">
        {/*#00b7a5*/}
        <label htmlFor={VALIDATION.id} className={"bmd-label-floating"}>
          {VALIDATION.label}
        </label>
        <br />
        <div
          className="btn-group ToggleBtn"
          id={VALIDATION.id}
          role="groupProperty"
          aria-label="..."
        >
          {VALIDATION.options.map((val, index) => (
            <button
              key={index}
              type={VALIDATION.type}
              className={`btn btn-default ${
                (index + 1) % 2 === 0 ? "btnRight" : "btnLeft"
              }`}
              onClick={() => onChangeHandler(VALIDATION, val.key)}
              style={{
                border: localState.ownership === val.key && "2px solid #00bfa5"
              }}
            >
              <i className={val.icon} />
              <small>{val.value}</small>
            </button>
          ))}
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

SwitchButtonWrapper.defaultProps = {
  alertObj: { showError: false, slug: "" },
  validation: {},
  onChangeHandler: () => {},
  localState: {},
  addText: "",
  isPhone: false
};

const mapStateToProp = state => ({
  alertObj: state.extraReducer.alertObj
});

export default withRouter(
  connect(
    mapStateToProp,
    {}
  )(SwitchButtonWrapper)
);
