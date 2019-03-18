import React, { Component } from "react";
const Error = () => (
  <div className="row justify-content-center" style={{ height: "100vh" }}>
    <div className="col-lg-10" style={{ marginTop: "12rem" }}>
      <div className="error_card">
        <div className="error_image">
          <img className="img-fluid" src="images/404-bg.png" />
        </div>
        <div className="content_div">
          <div className="error_page_not_found">Page not found</div>
          <div className="mt-3 error_page">
            Sorry, the page you are looking for could not be found !!
          </div>
          {/* <div className="mt-4">
            <a href="https://sme.mintifi.com">
              <button
                className="btn my-2 my-sm-0 error_button_styling"
                type="submit"
              >
                APPLY NOW
              </button>
            </a>
          </div> */}
        </div>
      </div>
    </div>
  </div>
);
export default Error;
