import React from 'react';
// import {withRouter} from "react-router-dom";
// import {changeLoader,  DrawsetToken} from "../../actions";
import {toast} from 'react-toastify';

export const alertModule = (props, type) => {
    if (!props) {
        console.log('Looks like a connectivity issue..!');
        toast.error('Looks like a connectivity issue..!');
    }
    else {
        if (type === 'warn') toast.warn(props);
        else if (type === 'success') toast.success(props);
        else if (type === 'error') toast.error(props);
        else toast.info(props);
    }
    // props.changeLoader(false);
};

