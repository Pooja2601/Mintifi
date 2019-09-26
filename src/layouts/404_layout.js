import React from "react";

const Error = props => {
  // console.log(props.history);
  return (
    <div className="row justify-content-center">
      <div className="col-lg-10" style={{ marginTop: "2rem" }}>
        <div className="error_card">
          <div className="error_image">
            <img
              className="img-fluid"
              alt="404 Error"
              src={`${process.env.PUBLIC_URL}/images/404-bg.png`}
            />
          </div>
          <div className="content_div_error" style={{ position: "static" }}>
            <div className="error_page_not_found">Page not found</div>
            <div className="mt-3 error_page">
              Sorry, the page you are looking for could not be found !!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Error;
