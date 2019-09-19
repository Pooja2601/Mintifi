import React from 'react';
import {base64Logic, checkObject, retrieveParam} from "../../../shared/common_logic";

let adharForm = '';
const TriggerPopUp = () => {

    const {href} = window.location;
    let tempPayloadKeys;
    const payload = retrieveParam(href, "payload") || undefined;

    const payloadPopUp = payload && base64Logic(payload, 'decode');

    // console.log(JSON.stringify(payloadPopUp));
    if (checkObject(payloadPopUp)) {
        payloadPopUp['timeStamp'] = payloadPopUp.time_stamp;
        tempPayloadKeys = Object.keys(payloadPopUp);
        window.setTimeout(() => {
            adharForm.submit()
        }, 2000);
    }

    // ToDo : need to put input fields in for loop , with array destructuring of payload
    return (<>
        <div className=" text-left " role="alert" style={{margin: "auto"}}>
            {(checkObject(payloadPopUp)) ? (
                <form ref={ref => adharForm = ref} method="post"
                      action={payloadPopUp.url}>
                    {tempPayloadKeys.map((val, key) =>
                        <input key={key} type="hidden" name={val} value={payloadPopUp[val]}/>
                    )}
                   
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