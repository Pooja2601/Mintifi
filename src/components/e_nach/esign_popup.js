import React from 'react';


const TriggerPopUp = () => {

    return (<>
        <form method="post" action="https://preprod.aadhaarbridge.com/api/_init">
            <input type="hidden" name="saCode" value="<your sa code>"/>
            <input type="hidden" name="api" value="ESIGN"/> >
            <input type="hidden" name="requestId" value="<request id which was sent in
document upload api>"/>
            <input type="hidden" name="timeStamp" value="<timestamp in millisecond>"/>
            <input type="hidden" name="purpose" value="<purpose of doing Esign>"/>
            <input type="hidden" name=" otp " value="N/Y"/>
            <input type="hidden" name=" fingerPrint " value="N/Y"/>
            <input type="hidden" name=" iris " value="N/Y"/>
            <input type="hidden" name=" face " value="N/Y"/>
            <input type="hidden" name="channel" value="BOTH"/>
            <input type="hidden" name="esignName" value="abc"/>
            <input type="hidden" name="successUrl" value="<successUrl>"/>
            <input type="hidden" name="failureUrl" value="<failureUrl>"/>
            <input type="hidden" name="hash" value="<sha256 hash value>"/>
            <button type="submit">Proceed</button>
        </form>
    </>)
}

export default TriggerPopUp;