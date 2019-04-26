import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {baseUrl, loanUrl} from "../../shared/constants";
import {pan_adhar, setAdharManual, setBusinessDetail, changeLoader} from "../../actions";

const file_msg = "Select a file to upload";

class DocsUpload extends Component {

    state = {id_proof_msg: file_msg, add_proof_msg: file_msg, bank_proof_msg: file_msg, validated: false};

    RenderModalMessage = () => {
        return (
            <>
                <button type="button" style={{visibilty: 'hidden'}} ref={ref => this.triggerModal = ref}
                        id={"triggerModal"} data-toggle="modal"
                        data-target="#errorMsgModal">
                </button>

                <div className="modal fade" id={"errorMsgModal"} ref={ref => this.errorMsgModal = ref} tabIndex="-1"
                     role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Invalid Filetype</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Please upload file having extensions .jpeg .jpg .png .gif and .pdf only.</p>
                            </div>
                            <div className="modal-footer">
                                {/*<button type="button" className="btn btn-primary">Save changes</button>*/}
                                <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>);
    }

    _onChangeFile(e, targetMsg) {

        let {value, files} = e.target;
        var allowedExt = /(\.jpg|\.jpeg|\.png|\.gif|\.pdf)$/i;


        if (!allowedExt.exec(value)) {
            // jQuery('#errorMsgModal').modal('show');
            this.triggerModal.click();
            // modalBackface.style.position = 'initial';
            if (targetMsg === 'id_proof')
                this.idProofInput.value = '';
            else if (targetMsg === 'add_proof')
                this.addProofInput.value = '';
            else this.bankProofInput.value = '';
            return false;
        }

        const name = value.split(/\\|\//).pop();
        const truncated = name.length > 20
            ? name.substr(name.length - 20)
            : name;

        switch (targetMsg) {
            case 'id_proof':
                this.setState({id_proof_msg: truncated});
                break;
            case 'add_proof':
                this.setState({add_proof_msg: truncated});
                break;
            case 'bank_proof':
                this.setState({bank_proof_msg: truncated});
                break;
        }
    }

    formSubmit() {

        let {payload, token, preFlightResp} = this.props;
        this.props.changeLoader(true);

        preFlightResp = {loan_application_id: '1780'};

        let doc_type = ['pan', 'aadhaar', 'cheque'];
        let doc_cat = ['kyc', 'kyc', 'payment_type'];
        let ctr = 0, documents = {};

        const inputFiles = document.querySelectorAll('input[type="file"]');
        const formData = new FormData();

        formData.append("app_id", "3");
        formData.append("anchor_id", payload.anchor_id);
        formData.append("loan_application_id", preFlightResp.loan_application_id);

        for (const file of inputFiles) {

            formData.append(`documents[][doc_type]`, doc_type[ctr]); //
            formData.append(`documents[][doc_category]`, doc_cat[ctr]); //
            formData.append(`documents[][file]`, file.files[0]);
            ctr++;
        }
        // console.log(formData);

        fetch(`${baseUrl}/documents`, {
            method: 'POST',
            // mode: 'cors',
            headers: {
                // "Authorization": 'Bearer:'+token,
                // "Content-Type": "",
                "token": token,
                "cache": "no-cache",
            },
            body: formData // This is your file object
        })
            .then(resp => resp.json())
            .then(
                resp => {
                    this.props.changeLoader(false);
                    console.log(resp); // Handle the success response object
                    if (resp.error === Object(resp.error))
                        alert("We couldn't upload the files, Kindly try again !");
                    else if (resp.response === Object(resp.response))
                        this.props.history.push('/ThankYou');
                }
            ).catch(
            error => {
                this.props.changeLoader(false);
                console.log(error); // Handle the error response object
                alert("Something went wrong !");
            }
        );
    }

    componentWillMount() {
        this.props.changeLoader(false);
        const {payload, authObj, adharObj, businessObj} = this.props;
        if (payload !== Object(payload))
            if (authObj !== Object(authObj))
                if (adharObj !== Object(adharObj))
                    if (businessObj !== Object(businessObj))
                        this.props.history.push("/Token");

        this.errorMsgModal = '';
        this.idProofInput = {value: ''};
        this.addProofInput = {value: ''};
        this.bankProofInput = {value: ''};
    }

    render() {
        if (this.props.adharObj === Object(this.props.adharObj)) {
            const {f_name, l_name} = this.props.adharObj;
            return (
                <>
                    {/* <button onClick={() => this.props.history.push('/BusinessDetail')} className={"btn btn-link"}>
                    Go Back
                </button>*/}
                    <br/>
                    <i className={"fa fa-file-pdf checkCircle"} style={{color: 'cadetblue'}}></i>
                    <h3 className={"text-center"}> Documents Upload !</h3>
                    <br/>

                    <div className="alert alert-info" role="alert">
                        <p className="alert-heading">Hi {f_name} {l_name}, Kindly upload the documents in PDF or PNG/JPG
                            format for your ID and Address Proof. </p>
                        <div className="paragraph_styling  text-center">

                            <div className="input-container text-left">
                                <input type="file" id="idProofInput" onChange={(e) => this._onChangeFile(e, 'id_proof')}
                                       ref={ref => this.idProofInput = ref}/>
                                <button className="btn btn-raised greenButton inputFilebutton"
                                        style={{padding: '8px', marginBottom: '0px', textTransform: 'capitalize'}}
                                        onClick={() => this.idProofInput.click()}
                                        id={"idProofBtn"}>
                                    ID Proof
                                </button>
                                <span className="file-infoId"
                                      style={{paddingLeft: '10px'}}>{this.state.id_proof_msg}</span>
                            </div>
                            <small className="text-muted">Upload a Aadhar, VoterCard, PAN or Passport.</small>
                            <br/>
                            <div className="input-container text-left">
                                <input type="file" id="addressProofInput"
                                       onChange={(e) => this._onChangeFile(e, 'add_proof')}
                                       ref={ref => this.addProofInput = ref}/>
                                <button className="btn btn-raised greenButton inputFilebutton"
                                        onClick={() => this.addProofInput.click()}
                                        style={{padding: '8px', marginBottom: '0px', textTransform: 'capitalize'}}
                                        id={"addressProofBtn"}>
                                    Address Proof
                                </button>
                                <span className="file-infoAddress"
                                      style={{paddingLeft: '10px'}}>{this.state.add_proof_msg}</span>
                            </div>
                            <small className="text-muted">Upload Aadhar, Driving License or Ration Card or Passport..
                            </small>

                            <br/>
                            <div className="input-container text-left">
                                <input type="file" id="addressProofInput"
                                       onChange={(e) => this._onChangeFile(e, 'bank_proof')}
                                       ref={ref => this.bankProofInput = ref}/>
                                <button className="btn btn-raised greenButton inputFilebutton"
                                        onClick={() => this.bankProofInput.click()}
                                        style={{padding: '8px', marginBottom: '0px', textTransform: 'capitalize'}}
                                        id={"addressProofBtn"}>
                                    Bank Proof
                                </button>
                                <span className="file-infoAddress"
                                      style={{paddingLeft: '10px'}}>{this.state.bank_proof_msg}</span>
                            </div>
                            <small className="text-muted">Upload cancelled Cheque or a Bank statement.
                            </small>

                        </div>
                    </div>

                    <div className="mt-5 mb-5 text-center ">
                        <button
                            type="button"
                            disabled={(this.idProofInput.value === undefined && this.addProofInput.value === undefined && this.bankProofInput.value === undefined)}
                            onClick={e => this.formSubmit(e)}
                            className="form-submit btn btn-raised greenButton"
                        >Process Loan
                        </button>
                    </div>
                    {this.RenderModalMessage()}
                </>
            )
        }
    }
}

const mapStateToProps = state => ({
    adharObj: state.adharDetail.adharObj,
    authObj: state.authPayload.authObj,
    businessObj: state.businessDetail.businessObj,
    payload: state.authPayload.payload,
    token: state.authPayload.token,
    preFlightResp: state.businessDetail.preFlightResp
});

export default withRouter(
    connect(
        mapStateToProps,
        {setBusinessDetail, pan_adhar, setAdharManual, changeLoader}
    )(DocsUpload)
);
