import React from 'react';
import {checkObject, regexTrim} from "../shared/common_logic";
import {withRouter} from "react-router-dom";
import connect from "react-redux/es/connect/connect";

const InputWrapper = (props) => {

    const {validation, onChangeHandler, localState, alertObj, addText} = props;
    const VALIDATION = validation;
    const {showError, slug} = alertObj;
    return (<>
        <div className="form-group mb-2">
            {/*#00b7a5*/}
            <label htmlFor={VALIDATION.id} className={"bmd-label-floating"}>
                {VALIDATION.label}
            </label>

            <input
                type={VALIDATION.type}
                className="form-control font_weight"
                // placeholder="10 digit PAN Number"
                pattern={regexTrim(VALIDATION.pattern)}
                title={VALIDATION.title}
                autoCapitalize={VALIDATION.autoCapitalize}
                id={VALIDATION.id}
                required={VALIDATION.required}
                value={localState[VALIDATION.slug]}
                onChange={e => onChangeHandler(VALIDATION, e.target.value)}
            />
            {showError && (slug === VALIDATION.slug) ?
                <small style={{color: 'crimson', fontSize: '11px'}}>{VALIDATION.error}</small> : ''}
            {addText && <span className="bmd-help">
                   {addText}
                </span>}
        </div>
    </>)
}

InputWrapper.defaultProps = {
    alertObj: {showError: false, slug: ''},
    validation: {},
    onChangeHandler: () => {
    },
    localState: {},
    addText: ""
}


const mapStateToProp = (state) => ({
    alertObj: state.extraReducer.alertObj
});

export default withRouter(connect(mapStateToProp, {})(InputWrapper));

