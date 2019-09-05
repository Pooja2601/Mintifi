import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {
    changeLoader,
    EnachsetPayload,
    EnachsetAttempt,
    setAnchorObj,
    showAlert
} from "../../../actions";

import {
    alertModule,
    base64Logic,
    retrieveParam
} from "../../../shared/commonLogic";

import {
    eNachPayloadStatic,
    baseUrl,
    app_id,
    environment,
    ENachResponseUrl
} from "../../../shared/constants";

import PropTypes from "prop-types";

const {PUBLIC_URL} = process.env;

class PNach extends Component {
    static propTypes = {
        eNachPayload: PropTypes.object.isRequired,
        token: PropTypes.string.isRequired,
        changeLoader: PropTypes.func.isRequired,
        showAlert: PropTypes.func.isRequired
    };

    state = {
        upload_nach_msg: "Upload a Signed NACH",
        disableUpload: false
    };

    componentWillMount() {
        let {changeLoader, showAlert} = this.props;
        changeLoader(false);
        showAlert();
    }

    _onChangeFile(e, targetMsg) {
        let {value, files} = e.target;
        var allowedExt = /(\.jpg|\.jpeg|\.png|\.gif|\.pdf)$/i;

        if (!allowedExt.exec(value)) {
            // this.triggerModal.click();
            if (targetMsg === "nach_form") this.nachForm.value = "";
            return false;
        }

        const name = value.split(/\\|\//).pop();
        const truncated = name.length > 20 ? name.substr(name.length - 20) : name;

        this.setState({upload_nach_msg: truncated});
    }

    formSubmit() {
        let {eNachPayload, token, changeLoader, history, showAlert} = this.props;
        changeLoader(true);

        // ToDo : To be removed while shipping
        token =
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozNiwidHlwZSI6ImFuY2hvciIsImV4cCI6MTU2Mzk2ODk4M30.bH_5rMRu_ru8S5pbPLYzyHS-R_jD7weAmA8yrtVYM4c";
        eNachPayload = {
            anchor_id: "05cc584e39f34d0e97fc4bb6cd1fa8aa",
            loan_application_id: "2850"
        };

        let ctr = 0;

        const inputFiles = document.querySelectorAll('input[type="file"]');
        const formData = new FormData();

        formData.append("app_id", app_id);
        formData.append("anchor_id", eNachPayload.anchor_id);
        formData.append("loan_application_id", eNachPayload.loan_application_id);

        // console.log(JSON.stringify(this.state.checked[doc_type_attr[ctr]]));
        for (const file of inputFiles) {
            formData.append(`documents[][doc_type]`, "signed_nach");
            formData.append(`documents[][doc_category]`, "payment_type");
            formData.append(`documents[][doc_owner]`, "loan");
            formData.append(`documents[][file]`, file.files[0]);
            ctr++;
        }

        fetch(`${baseUrl}/documents`, {
            method: "POST",
            headers: {
                // "Content-Type": "",
                token: token,
                cache: "no-cache"
            },
            body: formData // This is your file object
        })
            .then(resp => resp.json())
            .then(resp => {
                changeLoader(false);
                // console.log(resp); // Handle the success response object
                if (resp.error === Object(resp.error))
                    showAlert("We couldn't upload the file, Kindly try again !", "error");
                else if (resp.response === Object(resp.response)) {
                    this.setState({disableUpload: true});
                    history.push(ENachResponseUrl.success_url);
                }
            })
            .catch(error => {
                changeLoader(false);
                // console.log(error); // Handle the error response object
                showAlert("net");
            });
    }

    render() {
        return (
            <>
                <Link to={`${PUBLIC_URL}/enach`} className={"btn btn-link go-back-btn"}>
                    Go Back{" "}
                </Link>
                <h4 className={"text-center"}> Physical-NACH Mandate</h4>
                <br/>

                <div className={"alert alert-info text-center"}>
                    Kindly Download the Pre-filled NACH form,
                    <br/>
                    then take a print, sign on it and Upload it back.
                </div>
                <div className={"row text-center mt-3"}>
                    <div className={"col-12"}>
                        <a
                            target={"_blank"}
                            onClick={() => this.props.showAlert("net")}
                            className={"btn btn-raised greenButton downloadPNach"}
                        >
                            Download NACH
                        </a>
                    </div>
                </div>
                <div className={"row text-center mt-3"}>
                    {/*<div className={"col-6"}>
                        <a target={"_blank"} onClick={() => this.props.showAlert('net')}
                           className={"btn btn-raised greenButton downloadPNach"}>Download NACH</a>
                    </div>*/}
                    <div className={"col-12"}>
                        <div
                            className="input-container text-left"
                            style={{cursor: "pointer"}}
                            onClick={() => this.nachForm.click()}
                        >
                            <input
                                type="file"
                                id="nachFormInput"
                                onChange={e => this._onChangeFile(e, "nach_form")}
                                ref={ref => (this.nachForm = ref)}
                            />
                            <button
                                className="btn btn-raised uploadButtonIcon inputFilebutton"
                                id={"nachFormBtn"}
                            >
                                <i className={"fa fa-upload"}/>
                            </button>
                            <span className="helperUploadTxt">
                {this.state.upload_nach_msg}
              </span>
                        </div>
                        <button
                            disabled={this.state.disableUpload}
                            onClick={() => {
                                this.formSubmit();
                            }}
                            className={"btn btn-raised greenButton mt-2"}
                        >
                            Upload
                        </button>
                        {/* <small className="text-muted" style={{fontSize: 'x-small'}}>Upload a Signed NACH Form.
                        </small>*/}
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    token: state.eNachReducer.token,
    eNachPayload: state.eNachReducer.eNachPayload
});

export default withRouter(
    connect(
        mapStateToProps,
        {changeLoader, EnachsetPayload, EnachsetAttempt, setAnchorObj, showAlert}
    )(PNach)
);
