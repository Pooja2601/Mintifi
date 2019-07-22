import React from "react";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import { changeLoader } from "../actions";

const { PUBLIC_URL } = process.env;
const Header = props => {
  const style = `${PUBLIC_URL}/includes/css/styles.css`;
  return (
    <>
      <link rel="stylesheet" type="text/css" href={style} />
      <header>
        <div className="mt-3 text-center">
          <div className="mb-4">
            {/*    ToDo : Swap All $PUBLIC_URL$ to ./ in production */}
            <img
              src={`${PUBLIC_URL}/images/Mintifi-Logo-white_2.png`}
              alt="Mintifi Logo"
              className={"logoHeader"}
            />
            {/*<b className={"anchorText"}>Anchor Merchant</b>*/}
            {props.anchorObj === Object(props.anchorObj) ? (
              <img
                src={props.anchorObj.anchor_logo}
                alt="Anchor Logo"
                className={"anchorLogo"}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </header>
    </>
  );
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
