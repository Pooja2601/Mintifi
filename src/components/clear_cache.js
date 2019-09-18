import React from 'react';

const {PUBLIC_URL} = process.env;

const ClearCache = () => {
    let persistStorage = localStorage.getItem('persist:root');
    if (persistStorage) {
        localStorage.removeItem('persist:root');
        window.setTimeout(() => window.location.href = `${PUBLIC_URL}/preapprove/token`, 2000);
    }
    return (<>
        <p className={'alert alert-info'}>
            Cleared the Cache , redirecting you to the Portal !
        </p>
    </>);
}

export default ClearCache;