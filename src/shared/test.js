import React from 'react'
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {changeLoader, EnachsetAttempt, EnachsetPayload} from "../actions";

class AccessRoute extends React.Component {
    constructor(props) {
        super(props);
    }

    //If you want to find the location on mount use this

    componentDidMount() {
        const {anchorObj} = this.props;
        if (anchorObj === Object(anchorObj))
            console.log("the path name is mount ", anchorObj.anchor_name);
    }

    //If you want to find the location on change use this

    componentDidUpdate(prevprops) {
        const {anchorObj} = this.props;
        if (this.props.location.pathname != prevprops.location.pathname) {
            console.log("the new path name is update ", this.props.location.pathname);
        }
        if (anchorObj === Object(anchorObj))
            console.log("the path name is ", anchorObj.anchor_name);
    }

    componentWillReceiveProps(props) {
        const {anchorObj} = props;
        if (anchorObj === Object(anchorObj))
            console.log("the path name is receive ", anchorObj.anchor_name);
    }

    render() {
        const {anchorObj} = this.props;
        return (<>{(anchorObj === Object(anchorObj)) ? anchorObj.anchor_name : ''}</>);
    }
}

const mapStateToProps = state => ({
    token: state.eNachReducer.token,
    eNachPayload: state.eNachReducer.eNachPayload,
    anchorObj: state.authPayload.anchorObj
});

export default withRouter(
    connect(
        mapStateToProps,
        {changeLoader, EnachsetPayload, EnachsetAttempt}
    )(AccessRoute)
);
