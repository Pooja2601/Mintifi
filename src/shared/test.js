import React from 'react'
import {withRouter} from 'react-router-dom';

class AccessRoute extends React.Component {
    constructor(props) {
        super(props);
    }

    //If you want to find the location on mount use this

    componentDidMount() {
        const {anchorObj} = this.props;

    }

    //If you want to find the location on change use this

    componentDidUpdate(prevprops) {
        const {anchorObj} = this.props;
        if (this.props.location.pathname != prevprops.location.pathname) {
            console.log("the new path name is ", this.props.location.pathname);
        }
        if (anchorObj === Object(anchorObj))
            console.log("the path name is ", anchorObj.anchor_name);
    }

    render() {
        return (<></>);
    }
}

export default withRouter(AccessRoute)