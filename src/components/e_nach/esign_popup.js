import React from 'react';
import {base64Logic, retrieveParam} from "../../shared/commonLogic";

let adharForm = '';
const TriggerPopUp = () => {

    const {href} = window.location;
    const payload = payload && (retrieveParam(href, "payload") || undefined);
    const payloadPopUp = payload && base64Logic(payload, 'decode');

    let checkPayload = !!(payloadPopUp === Object(payloadPopUp) && payloadPopUp.length);

    if (checkPayload)
        window.setTimeout(() => {
            adharForm.submit()
        }, 1000);

    return (<>
        <div className=" text-left " role="alert" style={{margin: "auto"}}>
            {(checkPayload) ? (
                <form ref={ref => adharForm = ref} method="post"
                      action="https://preprod.aadhaarbridge.com/api/_init">
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
                    <button type="submit" style={{visibility: 'hidden'}}>Proceed</button>
                </form>
            ) : (
                <p className="paragraph_styling alert alert-danger">
                    You may not access this page directly without appropriate
                    payload/session.
                </p>
            )}
        </div>

    </>)
}

export default TriggerPopUp;