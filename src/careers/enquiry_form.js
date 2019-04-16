import React, { Component } from "react";
import { baseUrl } from "../shared/constants";
const message = {
  success: {
    title: "We'll get back to you soon.",
    content: "Thank you for reaching out, form has been submitted successfully."
  },
  error: {
    title: "Something went wrong !",
    content:
      "Thank you for reaching out, we couldn't submit the form due to unexpected error, kindly try again."
  }
};

class EnquiryForm extends Component {
  state = { submitted: false, loading: false, showMsg: {} };
  obj = {};

  _formSubmit = e => {
    e.preventDefault();
    let { en_name, en_email, en_phone, en_enquiry } = this.obj;
    let that = this;
    this.enquiry_form = {
      name: en_name.value,
      email: en_email.value,
      mobile: en_phone.value,
      message: en_enquiry.value
    };
    console.log(this.enquiry_form);
    this.setState({ loading: true });

    fetch(`${baseUrl}/enquiries/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        timeout: 5000
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(this.enquiry_form)
    })
      .then(res => res.json())
      .then(resp => {
        let showMsg;
        if (resp.status === "success") {
          showMsg = message.success;
        } else showMsg = message.error;
        this.setState({ loading: false, submitted: true, showMsg });
        this._resetThank();
      })
      .catch(e => {
        this.setState({
          loading: false,
          submitted: true,
          showMsg: message.error
        });
        console.log("Unexpected error occured");
        this._resetThank();
      });
  };

  _resetThank = () => {
    setTimeout(() => {
      this.setState({ submitted: false });
    }, 6000);
  };

  _renderThank() {
    return (
      <div className="card width_of_big_card" style={{ width: "auto" }}>
        <div className="card-body color_of_card p-lg-5">
          <h2 className="font_of">{this.state.showMsg.title}</h2>
          <p className="card-text big_card mt-lg-4 ">
            {this.state.showMsg.content}
          </p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="col-sm-12 col-md-4 p-0 bill_discounting_upper_margin loan_product_sidebar">
        <div className="bill_discounting text-center">
          <i className="fa fa-file-alt" style={{ fontSize: "16px" }} />{" "}
          <span className="working_capital_font" style={{ fontWeight: 500 }}>
            Enquiry Form
          </span>
        </div>
        {!this.state.submitted ? (
          <form onSubmit={e => this._formSubmit(e)}>
            <div className="sizing_of_box side_bar">
              <ul className="pl-0">
                <li className="main_div" style={{ border: "none" }}>
                  <div className="form-group">
                    {/* <label htmlFor="exampleInputName1">Your Name</label> */}
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputName1"
                      pattern="[a-zA-Z/\s]+"
                      aria-describedby="NameHelp"
                      placeholder="Enter Name *"
                      required={true}
                      ref={ref => (this.obj.en_name = ref)}
                    />
                    <small id="NameHelp" className="form-text text-muted">
                      We'll keep your identity private.
                    </small>
                  </div>
                </li>
                <li className="main_div" style={{ border: "none" }}>
                  <div className="form-group">
                    {/* <label htmlFor="exampleInputEmail1">
                        Email address
                      </label> */}
                    <input
                      type="email"
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="Enter Email *"
                      required={true}
                      ref={ref => (this.obj.en_email = ref)}
                    />
                    <small id="emailHelp" className="form-text text-muted">
                      We'll never share your email with anyone else.
                    </small>
                  </div>
                </li>
                <li className="main_div" style={{ border: "none" }}>
                  <div className="form-group">
                    {/* <label htmlFor="exampleInputEmail1">
                        Email address
                      </label> */}
                    <input
                      type="number"
                      className="form-control"
                      id="exampleInputNumber1"
                      min={0}
                      pattern="^[\d]{10}$"
                      aria-describedby="numberHelp"
                      placeholder="Enter Phone *"
                      required={true}
                      ref={ref => (this.obj.en_phone = ref)}
                    />
                    <small id="numberHelp" className="form-text text-muted">
                      Its just to contact you if we lost the communication over
                      mail.
                    </small>
                  </div>
                </li>
                <li className="main_div" style={{ border: "none" }}>
                  <div className="form-group">
                    {/* <label htmlFor="exampleInputEmail1">
                        Email address
                      </label> */}
                    <textarea
                      className="form-control"
                      id="exampleInputTextarea1"
                      aria-describedby="textareaHelp"
                      placeholder="Enter your queries *"
                      required={true}
                      ref={ref => (this.obj.en_enquiry = ref)}
                    />
                  </div>
                </li>
              </ul>

              <a href="#">
                <p style={{ textAlign: "center" }}>
                  {!this.state.loading ? (
                    <button
                      type="submit"
                      name="submit"
                      value="Submit"
                      className="form-submit btn greenButton"
                    >
                      Submit
                    </button>
                  ) : (
                    <button className="btn greenButton" disabled>
                      <span className="spinner-border spinner-border-sm" />
                      Submitting..
                    </button>
                  )}
                </p>
              </a>
              <div className="text-center">
                <span className="font4">Need help?</span>
              </div>
              <hr className="horizontal mt-2 mb-3" />
              <p className="text-center mb-0 font5">
                Phone No:{" "}
                <span className="color_of_help_section_call_us">
                  +91 22-28201230
                </span>
              </p>
              <p className="text-center font6">
                Email:{" "}
                <span className="color_of_help_section_call_us">
                  help@mintifi.com
                </span>
              </p>
            </div>
          </form>
        ) : (
          this._renderThank()
        )}
      </div>
    );
  }
}

export default EnquiryForm;
