import React from 'react';
import {withRouter} from 'react-router-dom';

const {PUBLIC_URL} = process.env;
const Header = withRouter(props =>
    <>
        <header>
            <div className="mt-3 text-center">
                <div className="mb-4">
                    {/*    ToDo : Swap All $PUBLIC_URL$ to ./ in production */}
                    <img
                        src={`${PUBLIC_URL}/images/Mintifi-Logo-white_2.png`}
                        className={"logoHeader"}
                    />
                    {/*<b className={"anchorText"}>Anchor Merchant</b>*/}
                    <img style={{
                        position: 'absolute', right: '25%', top: "18px",
                        width: '85px'
                    }}
                         src={(props.anchorObj === Object(props.anchorObj)) ? props.anchorObj.anchor_logo : `${PUBLIC_URL}/images/company/yatra.png`}
                         className={"anchorLogo"}
                    />
                    {/*{props.anchorObj.anchor_logo}*/}
                </div>
            </div>
            {/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
                                         preserveAspectRatio="none">
                                        <polygon className="svg--sm" fill="white"
                                                 points="0,0 30,100 65,21 90,100 100,75 100,100 0,100"/>
                                        <polygon className="svg--lg" fill="white"
                                                 points="0,0 15,100 33,21 45,100 50,75 55,100 72,20 85,100 95,50 100,80 100,100 0,100"/>
            </svg>*/}
        </header>
    </>
);

export default Header;