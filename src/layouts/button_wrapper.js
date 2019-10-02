import React from "react";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";

const ButtonWrapper = props => {
  let missed_fields = false;
  const {
    validation,
    onClick,
    localState,
    alertObj,
    addText,
    disabled,
    label,
    style
  } = props;
  const VALIDATION = validation;
  return (
    <>
      <div className="form-group mb-2">
        {/*#00b7a5*/}
        <div className="btn-group ToggleBtn" aria-label="...">
          <button
            style={style}
            localState={localState}
            className={`btn btn-raised greenButton`}
            onClick={e => onClick(e)}
            disabled={disabled}
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
  localState: {},
  disabled: false,
  missed_fields: false,
  onClick: () => {}
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
