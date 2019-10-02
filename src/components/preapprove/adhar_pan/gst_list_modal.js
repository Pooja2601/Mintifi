import React from "react";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import { checkObject } from "./../../../shared/common_logic";
import ButtonWrapper from "../../../layouts/button_wrapper";

const RenderModalGST = props => {
  const { localState, triggerRefs, onChangeRadio, setGst } = props;

  return (
    <>
      <ButtonWrapper
        localState={this.state}
        style={{ visibility: "hidden" }}
        ref={ref => (this.triggerModalGST = ref)}
        id={"triggerModalGST"}
        data-toggle="modal"
        data-target="#GSTSelModal"
      />
      {/* <button
        type="button"
        style={{ visibility: "hidden" }}
        ref={ref => (this.triggerModalGST = ref)} //triggerRefs
        id={"triggerModalGST"}
        data-toggle="modal"
        data-target="#GSTSelModal"
      /> */}

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
              <ButtonWrapper
                className="close"
                data-dismiss="model"
                aria-label="CLOSE"
              >
                <span aria-hidden="true">&times;</span>
              </ButtonWrapper>
              {/* <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button> */}
            </div>
            <div className="modal-body">
              <div className="checkbox">
                <div className={"row"}>
                  {checkObject(localState.gst_details) ? (
                    localState.gst_details.map((val, key) => (
                      <div key={key} className={"col-sm-6"}>
                        <label>
                          <input
                            type="radio"
                            name={"gst_details"}
                            checked={localState.checked[key] || ""}
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
              <ButtonWrapper
                localState={this.state}
                onClick={this._setGST}
                disabled={!localState.selectedGST.length}
                style={{ padding: "7px 11px 8px 11px" }}
                data-dismiss="model"
                label="SELECT GST"
              />

              <ButtonWrapper
                style={{ padding: "7px 11px 8px 11px" }}
                data-dismiss="modal"
                label="CLOSE"
              />

              {/* <button
                type="button"
                className="btn greenButton btn-raised align-left"
                onClick={() => this._setGST()}
                disabled={!localState.selectedGST.length}
                style={{ padding: "7px 11px 8px 11px" }}
                data-dismiss="modal"
              >
                Select GST
              </button>

              <button
                type="button"
                style={{ padding: "7px 11px 8px 11px" }}
                data-dismiss="modal"
              >
                Close
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProp = () => ({});

export default withRouter(
  connect(
    mapStateToProp,
    {}
  )(RenderModalGST)
);
