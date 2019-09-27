import React from "react";
import { checkObject, regexTrim } from "../shared/common_logic";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";

const ButtonWrapper = props => {
  let missed_fields = false;
  const {
    validation,
    onChangeHandler,
    localState,
    alertObj,
    addText,
    disabled,
    label
  } = props;
  const VALIDATION = validation;
  const { showError, slug } = alertObj;
  return (
    <>
      <div className="form-group mb-2">
        {/*#00b7a5*/}
        <div className="btn-group ToggleBtn" aria-label="...">
          <button
            type={VALIDATION.type}
            className={`btn btn-raised greenButton`}
            onClick={e => onChangeHandler(e)}
            disabled={localState.missed_fields ? disabled : ""}
          >
            {label}
          </button>
        </div>
      </div>
    </>
  );
};

ButtonWrapper.defaultProps = {
  alertObj: { showError: false, slug: "" },
  validation: {},
  onChangeHandler: () => {},
  localState: {},
  disabled: false,
  missed_fields: false
};

const mapStateToProp = state => ({
  alertObj: state.extraReducer.alertObj
});

export default withRouter(
  connect(
    mapStateToProp,
    {}
  )(ButtonWrapper)
);
