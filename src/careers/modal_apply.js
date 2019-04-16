import React, {Component} from "react";
import {baseUrl} from "../shared/constants";

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

class ModalCareerApply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitted: false,
            loading: false,
            showMsg: "",
            btnDisabled: true,
            fileName: ""
        };
        this.obj = {};
    }

    fileValidation(e) {
        let fileInput = e.target.files[0];
        let filePath = e.target.value;
        this.setState({
            fileName: filePath.substr(filePath.lastIndexOf("\\") + 1)
        });
        let allowedExtensions = /(\.doc|\.pdf|\.docx)$/i;
        if (!allowedExtensions.exec(filePath)) {
            this.setState({
                showMsg: "Please upload file having extensions .doc/.docx/.pdf only.",
                btnDisabled: true
            });
            // fileInput.value = "";
        } else {
            this.setState({
                showMsg: "",
                btnDisabled: false
            });
            //Image preview
            // if (fileInput.files && fileInput.files[0]) {
            //   var reader = new FileReader();
            //   reader.onload = function(e) {
            //     document.getElementById("imagePreview").innerHTML =
            //       '<embed src="' + e.target.result + '"></embed>';
            //   };
            //   reader.readAsDataURL(fileInput.files[0]);
            // }
        }
    }

    _uploadResume(e) {
        e.preventDefault();
        // alert("hi");
        const {name, email, phone, resume} = this.obj;
        let that = this;
        let formData = new FormData();

        this.job_applied = {
            name: name.value,
            email: email.value,
            mobile: phone.value
        };
        console.log(JSON.stringify(this.job_applied));
        formData.append("applied_job", this.job_applied);
        formData.append("file", resume.files[0]);
        // console.log(this.job_applied);
        this.setState({loading: true});

        console.log(JSON.stringify(formData));

        fetch(`${baseUrl}/opening/apply`, {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(resp => {
                let showMsg;
                if (resp.status === "success") {
                    showMsg = message.success.content;
                } else showMsg = message.error.content;
                this.setState({loading: false, submitted: true, showMsg});
            })
            .catch(e => {
                this.setState({
                    loading: false,
                    submitted: true,
                    showMsg: message.error.content
                });
                console.log("Unexpected error occured");
            });
        setTimeout(() => {
            that.setState({submitted: false});
        }, 5000);
    }

    render() {
        const appliedJob = this.props.appliedJob;
        return (
            <div
                className="modal fade"
                id="careerModalApply"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <form onSubmit={e => this._uploadResume(e)}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel" style={{maxWidth: '335px'}}>
                                    {appliedJob.title}{" "}
                                </h5>
                                <small style={{
                                    right: "10%",
                                    marginTop: "-5px",
                                    position: "absolute"
                                }}>
                                    <i
                                        className="fa fa-map-marker-alt"
                                        style={{fontSize: "14px"}}
                                    />{" "}
                                    <span className="badge badge-info">
                    {appliedJob.location}
                  </span>
                                    <br/>
                                    <div
                                        className="alert alert-light float-right"
                                        style={{padding: "2px"}}
                                        role="alert"
                                    >
                                        {appliedJob.min_experience}
                                    </div>
                                </small>
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
                                <div className="form-group">
                                    <label htmlFor="recipient-name" className="col-form-label">
                                        Name: *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="recipient-name"
                                        ref={ref => (this.obj.name = ref)}
                                        required={true}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="recipient-email" className="col-form-label">
                                        Email: *
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="recipient-email"
                                        ref={ref => (this.obj.email = ref)}
                                        required={true}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="recipient-phone" className="col-form-label">
                                        Phone: *
                                    </label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    + 91
                  </span>
                                        </div>
                                        <input
                                            type="number"
                                            min={0}
                                            className="form-control"
                                            id="recipient-phone"
                                            ref={ref => (this.obj.phone = ref)}
                                            required={true}
                                        />
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <div className="custom-file">
                                        <input
                                            type="file"
                                            className="custom-file-input"
                                            id="inputGroupFile01"
                                            onChange={e => this.fileValidation(e)}
                                            ref={ref => (this.obj.resume = ref)}
                                            required={true}
                                        />
                                        <label
                                            className="custom-file-label"
                                            htmlFor="inputGroupFile01"
                                        >
                                            {this.state.fileName ? this.state.fileName : "Upload CV"}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div>{this.state.showMsg}</div>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-dismiss="modal"
                                >
                                    Close
                                </button>
                                {!this.state.loading ? (
                                    <button
                                        type="submit"
                                        name="submit"
                                        disabled={this.state.btnDisabled}
                                        className="form-submit btn greenButton"
                                    >
                                        Send Application
                                    </button>
                                ) : (
                                    <button className="btn greenButton" disabled>
                                        <span className="spinner-border spinner-border-sm"/>
                                        Shooting..
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default ModalCareerApply;
