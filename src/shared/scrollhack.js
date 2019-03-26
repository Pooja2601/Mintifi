import React, { useEffect, Fragment } from "react";
import { withRouter } from "react-router-dom";

let paths;
// regexB, regexP, regexA;
// regexB = new RegExp("BusinessLoan");
// regexP = new RegExp("PersonalLoan");
// regexA = new RegExp("Auth");

const ScrollToTop = ({ history, children }) => {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
      paths = history.location.pathname.split("/").slice(-1)[0];
      console.log(paths);
    });
    return () => {
      unlisten();
    };
  }, []);

  return <>{children}</>;
};

export default withRouter(ScrollToTop);