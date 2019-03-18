import React, { Component } from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import { baseUrl } from "../shared/constants";
import { connect } from "react-redux";
import { checkExists } from "../actions";

const Timer = 10;

class Auth extends Component {
  //   state = { loading: "" };
  _formSubmit(e) {}

  render() {
    return (
      <div
        className="row justify-content-center background-color"
        style={{ backgroundColor: "#DDD", marginTop: "100px" }}
      >
        <div className="col-11 col-md-5 ml-5 mr-5 partner_section">
          <div className="ml-2">
            <div className="mt-4 text-center">
              <div className="mt-4 mb-4 border_bottom">
                <img
                  src="images/logo.png"
                  style={{ width: "150px", paddingBottom: "10px" }}
                />
                <h4>User Registration</h4>
                <p className="paragraph_styling">
                  Find out how our platform can help you climb the ladder to
                  another level of success today. {this.props.existing}
                </p>
              </div>
            </div>
            <div className="mt-5 mb-5 text-center ">
              <button
                onClick={() => this.props.checkExists("new")}
                name="submit"
                className="form-submit btn partenrs_submit_btn"
              >
                New User
              </button>
              <br />
              OR
              <br />
              <button
                onClick={() => this.props.checkExists("exist")}
                className="btn partenrs_submit_btn"
              >
                Existing User
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  existing: state.authPayload.existing
});

export default connect(
  mapStateToProps,
  { checkExists }
)(Auth);
