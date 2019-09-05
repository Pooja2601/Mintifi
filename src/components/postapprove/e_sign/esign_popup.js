import React from 'react';
import {base64Logic, retrieveParam} from "../../../shared/commonLogic";

let adharForm = '';
const TriggerPopUp = () => {

    const {href} = window.location;
    const payload = retrieveParam(href, "payload") || undefined;

    const payloadPopUp = payload && base64Logic(payload, 'decode');


    let checkPayload = !!(payloadPopUp === Object(payloadPopUp) && payloadPopUp);

    // alert(JSON.stringify(payloadPopUp));
    if (checkPayload)
        window.setTimeout(() => {
            adharForm.submit()
        }, 2000);

    return (<>
        <div className=" text-left " role="alert" style={{margin: "auto"}}>
            {(checkPayload) ? (
                <form ref={ref => adharForm = ref} method="post"
                      action={payloadPopUp.url}>
                    <input type="hidden" name="saCode" value={payloadPopUp.saCode}/>
                    <input type="hidden" name="api" value={payloadPopUp.api}/>
                    <input type="hidden" name="requestId" value={payloadPopUp.requestId}/>
                    <input type="hidden" name="timeStamp" value={payloadPopUp.time_stamp}/>
                    <input type="hidden" name="purpose" value={payloadPopUp.purpose}/>
                    <input type="hidden" name="otp" value={payloadPopUp.otp}/>
                    <input type="hidden" name="fingerPrint" value={payloadPopUp.fingerPrint}/>
                    <input type="hidden" name="iris" value={payloadPopUp.iris}/>
                    <input type="hidden" name="face" value={payloadPopUp.face}/>
                    <input type="hidden" name="channel" value={payloadPopUp.channel}/>
                    <input type="hidden" name="esignName" value={payloadPopUp.esignName}/>
                    <input type="hidden" name="successUrl" value={payloadPopUp.successUrl}/>
                    <input type="hidden" name="failureUrl" value={payloadPopUp.failureUrl}/>
                    <input type="hidden" name="hash" value={payloadPopUp.hash}/>
                    <p>Uploading data to server...</p>
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