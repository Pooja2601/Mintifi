import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="page-footer stylish-color-dark pt-4 footer_of_the_page">
    <div className=" container-fluid text-md-left pt-lg-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-10 col-lg-10">
          <div className="row footer_border">
            <div className="col-md-5 col-sm-12 col-lg-6">
              <Link className="navbar-brand" to="/">
                <img
                  src="/images/Mintifi-Logo-white.png"
                  alt="Your Logo"
                  className="mb-lg-4 mb-3 image_size_footer"
                />
              </Link>
              <span className="height_of_footer">
                <div>
                  "Mintifi is India's one of the first online lending platforms
                  committed towards the growth of small and medium businesses,
                  across sectors.
                </div>
                <div className="font_footer_para mt-lg-3">
                  Today, it is very difficult for most small businesses to get
                  fund from large financial corporations. Our thorough analysis
                  and digital ecosystem helps you solve all your fund problems,
                  that too in the simplest yet fastest way possible. We believe
                  India has immense opportunity and talent, but lacks the right
                  resources at the right time.
                </div>
                <div className="font_footer_para mt-lg-3">
                  Our aim is to fund each SME in the country, to eventually
                  support our country be a global super power across industries.
                </div>
              </span>
            </div>
            <div className="col-md-2 col-sm-4 col-xs-6 mx-auto usefull_links">
              <h5 className="mb-lg-4 mt-0 font_weight_footer font-weight-light mb-3">
                Useful Links
              </h5>
              <ul className="list-unstyled mb-5">
                <li>
                  <Link
                    to="/Partners"
                    className="font-weight-light footer_color"
                  >
                    <span
                      className="font_list_type"
                      style={{ color: "#00BFA5 !important" }}
                    >
                      <i className="fa fa-angle-right mr-3 mr-lg-1" />
                      Partners
                    </span>
                  </Link>
                </li>
                <br />
                <li>
                  <Link
                    to="/Careers"
                    className="font-weight-light footer_color"
                  >
                    <span className="font_list_type">
                      <i className="fa fa-angle-right mr-3 mr-lg-1" />
                      Careers
                    </span>
                  </Link>
                </li>
                <br />
                <li>
                  <Link
                    to="/ContactUs"
                    className="font-weight-light footer_color"
                  >
                    <span className="font_list_type">
                      <i className="fa fa-angle-right mr-3 mr-lg-1" />
                      Contact Us
                    </span>
                  </Link>
                </li>
                <br />
                <li>
                  <Link
                    to="/Privacy"
                    className="font-weight-light footer_color"
                  >
                    <span className="font_list_type">
                      <i className="fa fa-angle-right mr-3 mr-lg-1" />
                      Privacy Policy
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-2 col-sm-4 col-xs-6 mx-auto usefull_links">
              <h5 className="mb-lg-4 mt-0 font_weight_footer font-weight-light mb-3">
                Getting a loan
              </h5>
              <ul className="list-unstyled mb-5">
                <li>
                  <Link
                    to="/BusinessLoan"
                    className="font-weight-light footer_color"
                  >
                    <span className="font_list_type">
                      <i className="fa fa-angle-right mr-3 mr-lg-1" />
                      Apply
                    </span>
                  </Link>
                </li>
                <br />
                <li>
                  <Link
                    to="/Regulatory"
                    className="font-weight-light footer_color"
                  >
                    <span className="font_list_type">
                      <i className="fa fa-angle-right mr-3 mr-lg-1" />
                      Regulatory
                    </span>
                  </Link>
                </li>
                <br />
                {/* <!-- <li>
                            <Link to="#" className="font-weight-light" style="cursor: not-allowed; color: #979797; text-decoration: none;"><span className="font_list_type"><i className="fa fa-angle-right mr-3 mr-lg-1"></i>Privacy Policy</span></a>
                        </li><br/>
                        <li>
                            <Link to="#" className="font-weight-light" style="cursor: not-allowed; color: #979797; text-decoration: none;"><span className="font_list_type"><i className="fa fa-angle-right mr-3 mr-lg-1"></i>Terms of Service</span></a>
                        </li> --> */}
              </ul>
            </div>
            <div className="col-md-2 col-sm-4 col-xs-6 mx-auto usefull_links">
              <h5 className="mb-lg-4 mt-0 font_weight_footer font-weight-light mb-3">
                Our Products
              </h5>
              <ul className="list-unstyled mb-5">
                <li>
                  <Link
                    to="/WorkingCapital"
                    className="font-weight-light footer_color"
                  >
                    <span className="font_list_type">
                      <i className="fa fa-angle-right mr-3 mr-lg-1" />
                      Working Capital Loan
                    </span>
                  </Link>
                </li>
                <br />
                <li>
                  <Link
                    to="/BillDiscount"
                    className="font-weight-light footer_color"
                  >
                    <span className="font_list_type">
                      <i className="fa fa-angle-right mr-3 mr-lg-1" />
                      Bill Discounting Loan
                    </span>
                  </Link>
                </li>
                <br />
                <li>
                  <Link
                    to="/TermLoan"
                    className="font-weight-light footer_color"
                  >
                    <span className="font_list_type">
                      <i className="fa fa-angle-right mr-3 mr-lg-1" />
                      Term Loan
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/*  <div className="float-right">
                <img src="%PUBLIC_URL%/images/quations.png" className="img-fluid quations_image"/>
            </div>  */}
          <div className="row mt-4 mb-4 mt-lg-4 mb-lg-4">
            <div className="col-5 col-lg-9 mintifi_font_footer">
              <Link to="/" className="footer_color font_footer">
                &copy; 2019 Mintifi Pvt. Ltd.
              </Link>
            </div>
            <div className="col-7 col-lg-3 footer_social_media_icons">
              <div>
                <a
                  href=" https://www.facebook.com/officialmintifi/"
                  target="blank"
                >
                  <p>
                    <img
                      src="/images/facebook.png"
                      className="img-fluid pb-1"
                    />
                  </p>
                </a>
                {/* <p className="ml-1"><img src="/images/twitter1.png" className="img-fluid" /></p>  */}
                <a
                  href="https://www.linkedin.com/company/mintifi/"
                  target="blank"
                >
                  <p className="ml-1">
                    <img
                      src="/images/linkedin1.png"
                      className="img-fluid pb-1"
                    />
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
