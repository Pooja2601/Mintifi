import React from "react";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import { changeLoader } from "../actions";

const { PUBLIC_URL } = process.env;
const Header = props => {
  const { anchorObj } = props;
  if (window.location === window.parent.location)
    return (
      <>
        <header>
          <div className="mt-3 text-center">
            <div className="mb-4">
              {/*    ToDo : Swap All $PUBLIC_URL$ to ./ in production */}
              <img
                src={`${PUBLIC_URL}/images/Mintifi-logo-1.png`}
                alt="Mintifi Logo"
                className={"logoHeader"}
              />
              {/*<b className={"anchorText"}>Anchor Merchant</b>*/}
              {anchorObj === Object(anchorObj) && anchorObj ? (
                <img
                  src={anchorObj.anchor_logo}
                  alt="Anchor Logo"
                  className={"anchorLogo"}
                />
              ) : (
                <></>
              )}
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
  else return <></>;
};

const mapStateToProps = state => ({
  token: state.eNachReducer.token,
  anchorObj: state.authPayload.anchorObj
});

export default withRouter(
  connect(
    mapStateToProps,
    { changeLoader }
  )(Header)
);
