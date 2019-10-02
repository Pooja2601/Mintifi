import React, { Component } from "react";
// import {GetinTouch} from "../../shared/getin_touch";
import { baseUrl, BusinessType, app_id } from "../../../shared/constants";
import { connect } from "react-redux";
import {
  pan_adhar,
  changeLoader,
  setGstProfile,
  setBusinessDetail,
  showAlert,
  fieldAlert
} from "../../../actions";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import {
  checkObject,
  fieldValidationHandler,
  regexTrim
} from "../../../shared/common_logic";
import { apiActions, fetchAPI } from "../../../api";
import { validationAdharPan } from "./../../../shared/validations";
import InputWrapper from "../../../layouts/input_wrapper";
import ButtonWrapper from "../../../layouts/button_wrapper";
import RenderGSTModal from "./gst_list_modal";
const { PUBLIC_URL } = process.env;

class AdharPan extends Component {
  static propTypes = {
    pan: PropTypes.string,
    adhar: PropTypes.string,
    payload: PropTypes.object.isRequired
  };

  state = {
    pan: "",
    adhar: "",
    // pan_correct: false,
    adhar_skip: false,
    adhar_correct: false,
    gst_details: {},
    checked: {},
    selectedGST: "",
    missed_fields: true
  };
  gstDetails = {
    company_type: "",
    gst: "",
    bpan: "",
    avgtrans: "",
    dealer_code: "",
    lgnm: "",
    tnc_consent: false
  };
  // gst_profile = {};

  RenderModalGST = () => {
    return (
      <>
        <button
          type="button"
          style={{ visibility: "hidden" }}
          ref={ref => (this.triggerModalGST = ref)}
          id={"triggerModalGST"}
          data-toggle="modal"
          data-target="#GSTSelModal"
        />

        <div
          className="modal fade"
          id={"GSTSelModal"}
          ref={ref => (this.docsSelModal = ref)}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog"
            role="document"
            style={{ margin: "5.75rem auto" }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Select the GST for which you need loan
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="checkbox">
                  <div className={"row"}>
                    {this.state.gst_details ===
                      Object(this.state.gst_details) &&
                    this.state.gst_details.length ? (
                      this.state.gst_details.map((val, key) => (
                        <div key={key} className={"col-sm-6"}>
                          <label>
                            <input
                              type="radio"
                              name={"gst_details"}
                              checked={this.state.checked[key] || ""}
                              onChange={e => {
                                this.setState(prevState => ({
                                  checked: {
                                    [key]: true
                                  },
                                  selectedGST: val.gstinId
                                }));
                              }}
                            />{" "}
                            <b
                              style={{
                                marginLeft: "20px",
                                fontSize: "13.5px",
                                color: "black",
                                cursor: "pointer",
                                textTransform: "capitalize"
                              }}
                            >
                              {val.gstinId}
                            </b>
                          </label>
                        </div>
                      ))
                    ) : (
                      <></>
                    )}
                    <br />
                  </div>
                </div>
                {/*{this.state.selectedGST}*/}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn greenButton btn-raised align-left"
                  onClick={() => this._setGST()}
                  disabled={!this.state.selectedGST.length}
                  style={{ padding: "7px 11px 8px 11px" }}
                  data-dismiss="modal"
                >
                  Select GST
                </button>

                <button
                  type="button"
                  className="btn btn-primary pull-right"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  //ToDo : Check the PAN with the backend AP for Confirmation of new user
  _formSubmit = e => {
    e.preventDefault();
    this._panFetch();
  };

  _setGST = () => {
    /* Object.keys(this.state.checked).map(val => { //0, 1, 2, 3
                     this.gstDetails.gst = this.state.gst_details[val].gstinId;
                 });*/
    this.gstDetails.gst = this.state.selectedGST;
    this.props.setBusinessDetail(this.gstDetails);
    this._gstFetch(this.gstDetails.gst);
    // setTimeout(() => this.adharSkipped(), 500);
  };

  adharSkipped = () => {
    // this.setState({adhar_skip: !this.state.adhar_skip});
    this.props.history.push(`${PUBLIC_URL}/preapprove/personaldetail`);
  };

  _gstFetch = async gstSelected => {
    const {
      changeLoader,
      //   history,
      setGstProfile,
      token,
      payload,
      setBusinessDetail,
      showAlert
    } = this.props;

    const options = {
      URL: `${baseUrl}/companies/get_company_details_by_gstin?app_id=${app_id}&anchor_id=${payload.anchor_id}&gstin=${gstSelected}`,
      token: token,
      showAlert: showAlert,
      changeLoader: changeLoader
    };

    const resp = await fetchAPI(options);

    if (resp.status === apiActions.ERROR_RESPONSE)
      showAlert(
        "Could Not fetch GST information, Something went wrong !",
        "warn"
      );
    else if (resp.status === apiActions.SUCCESS_RESPONSE) {
      const { company_details } = resp.data;
      setGstProfile(company_details);
      BusinessType.map((val, key) => {
        if (company_details.ctb !== undefined)
          if (val.label.localeCompare(company_details.ctb) === 0)
            this.gstDetails.companytype = val.value;
      });

      this.gstDetails.lgnm = company_details.lgnm;
      // console.log(this.gstDetails);
      setBusinessDetail(this.gstDetails);
    }
    setTimeout(() => this.adharSkipped(), 500);
  };

  _panFetch = async () => {
    let checked = {};
    const { changeLoader, payload, pan, token, showAlert } = this.props;
    // console.log(token);

    const options = {
      token: token,
      URL: `${baseUrl}/companies/get_gst_details?app_id=${app_id}&anchor_id=${payload.anchor_id}&pan=${pan}`,
      showAlert: showAlert,
      changeLoader: changeLoader
    };

    const resp = await fetchAPI(options);

    if (resp.status === apiActions.ERROR_RESPONSE) {
      showAlert(resp.data.message, "error");
      if (resp.data.code !== "ER-AUTH-102")
        // token expire
        setTimeout(() => this.adharSkipped(), 500);
    } else if (resp.status === apiActions.SUCCESS_RESPONSE) {
      resp.data.gst_details.map((val, key) => {
        checked[key] = false;
      });
      this.setState({ checked, gst_details: resp.data.gst_details });
      this.triggerModalGST.click();
    }
  };

  validationHandler = () => {
    const { showAlert, fieldAlert } = this.props;

    const missed_fields = fieldValidationHandler({
      validations: validationAdharPan,
      localState: this.state,
      fieldAlert
    });

    this.setState({ missed_fields }); // true : for disabling
  };

  onChangeHandler = (field, value) => {
    let that = this,
      regex,
      doby;
    const { pan_adhar } = this.props;
    // fields is Equivalent to F_NAME , L_NAME... thats an object

    // ToDo : comment those that are not required
    const { PAN_NUMBER, ADHAR_NUMBER } = validationAdharPan;

    this.tempState = Object.assign({}, this.state);

    switch (field) {
      case PAN_NUMBER:
        if (value.length <= 10)
          this.tempState[PAN_NUMBER.slug] = value.toUpperCase();

        break;
      case ADHAR_NUMBER:
        if (value.length <= 12) this.tempState[ADHAR_NUMBER.slug] = value;

        break;
      default:
        this.tempState[field.slug] = value;
        break;
    }

    this.setState({ ...this.state, ...this.tempState });

    window.setTimeout(() => {
      pan_adhar(
        this.tempState[PAN_NUMBER.slug],
        this.tempState[ADHAR_NUMBER.slug]
      );
      this.validationHandler();
    }, 10);
  };

  componentWillMount() {
    const { payload, changeLoader, showAlert } = this.props;
    changeLoader(false);
    showAlert();
    if (!checkObject(payload))
      this.props.history.push(`${PUBLIC_URL}/preapprove/token`);
    // console.log(typeof payload);
  }

  componentDidMount() {
    const { pan, adhar, pan_adhar } = this.props;
    if (!!pan || !!adhar) this.setState({ pan: pan, adhar: adhar });
    else pan_adhar(this.state.pan, this.state.adhar);
    window.setTimeout(() => this.validationHandler(), 500);
  }

  render() {
    const { PAN_NUMBER, ADHAR_NUMBER } = validationAdharPan;
    return (
      <>
        <Link to={`${PUBLIC_URL}/preapprove/token`} className={"btn btn-link"}>
          Go Back{" "}
        </Link>
        {/*<h4 className={"text-center"}>New Customer?</h4>*/}
        <h5 className="paragraph_styling  text-center">
          <b>Let us fetch some information for you.</b>
        </h5>
        <div id="serverless-contact-form">
          <div className={"row"}>
            <div className={"col-sm-11 col-md-8 m-auto"}>
              <InputWrapper
                validation={PAN_NUMBER}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
              />
            </div>

            <div
              style={{
                visibility: !this.state.missed_fields ? "visible" : "hidden"
              }}
              className={"col-sm-11 col-md-8 m-auto"}
            >
              <InputWrapper
                validation={ADHAR_NUMBER}
                localState={this.state}
                onChangeHandler={this.onChangeHandler}
                addText={
                  "Don't have mobile linked with Aadhaar ? No problem, you may skip it "
                }
                isNumber={true}
              />
            </div>
          </div>

          <div className="mt-5 mb-5 text-center ">
            {/* <ButtonWrapper
              localState={this.state}
              onClick={e => this._formSubmit(e)}
              disabled={this.state.missed_fields}
              label="PROCEED"
            /> */}
            {!this.state.missed_fields && (
              <input
                type="submit"
                name="submit"
                value={"Proceed"}
                onClick={e => this._formSubmit(e)}
                className="form-submit btn btn-raised btn-raised greenButton"
              />
            )}
          </div>
        </div>
        {this.RenderModalGST()}
      </>
    );
  }
}

const mapStateToProps = state => ({
  pan: state.adharDetail.pan,
  adhar: state.adharDetail.adhar,
  payload: state.authPayload.payload,
  token: state.authPayload.token,
  businessObj: state.businessDetail.businessObj
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      pan_adhar,
      changeLoader,
      setGstProfile,
      setBusinessDetail,
      showAlert,
      fieldAlert
    }
  )(AdharPan)
);
