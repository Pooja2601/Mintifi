import React from "react";
import {withRouter} from "react-router-dom";
import {changeLoader} from '../actions';
import connect from "react-redux/es/connect/connect";

const Loader = (props) => {

    return (<>
        <div className={"loaderOverlay"}
             style={{display: (props.loader) ? 'block' : 'none'}}>
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>

    </>);
};

const mapStateToProps = state => ({
    loader: state.extraReducer.loader,
});

export default withRouter(connect(
    mapStateToProps,
    {changeLoader}
)(Loader));
