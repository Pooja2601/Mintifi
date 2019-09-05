import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import {baseUrl, app_id, environment} from "../../../shared/constants";
import {pan_adhar, setAdharManual, setBusinessDetail, changeLoader, showAlert} from "../../../actions/index";
// import {alertModule} from "../../../shared/common_logic";

const file_msg = "Select a file";
const {PUBLIC_URL} = process.env;

const file_catalog = {
    id_proof: ['pan', 'aadhaar', 'passport', 'driving_license', 'voterid'],
    add_proof: ['aadhaar', 'driving_license', 'electricity_bill', 'gas_bill', 'passport', 'rent_agreement', 'property_tax', 'voterid'],
    entity_proof: ['ghumasta_license', 'gst_certificate', 'other_govt_reg', 'st_vat_cst_registration'],
    caddr_proof: ['electricity_bill', 'rent_agreement']
};

const doc_att = [
    {doc_type: 'pan', doc_category: 'kyc', doc_owner: 'user'},
    {doc_type: 'electricity_bill', doc_category: 'address', doc_owner: 'user'},
    {doc_type: 'gst_certificate', doc_category: 'entity_proof', doc_owner: 'company'},
    {doc_type: 'rent_agreement', doc_category: 'address', doc_owner: 'company'},
];

const doc_type_attr = [
    'id_proof',
    'add_proof',
    'entity_proof',
    'caddr_proof'
];

class DocsUpload extends Component {

    static propTypes = {
        adharObj: PropTypes.object.isRequired,
        anchorObj: PropTypes.object,
        payload: PropTypes.object.isRequired,
        businessObj: PropTypes.object.isRequired,
        gstProfile: PropTypes.object,
        preFlightResp: PropTypes.object
    };

    state = {
        id_proof_msg: file_msg,
        add_proof_msg: file_msg,
        // bank_proof_msg: file_msg,
        entity_proof_msg: file_msg,
        caddr_proof_msg: file_msg,
        validated: false,
        active_modal: 'add_proof',
        checked: {
            id_proof: 'pan',
            add_proof: 'electricity_bill',
            entity_proof: 'gst_certificate',
            caddr_proof: 'rent_agreement'
        }
    };

    RenderModalMessage = () => {
        return (
            <>
                <button type="button" style={{visibility: 'hidden'}} ref={ref => this.triggerModal = ref}
                        id={"triggerModal"} data-toggle="modal"
                        data-target="#errorMsgModal">
                </button>

                <div className="modal fade" id={"errorMsgModal"} ref={ref => this.errorMsgModal = ref} tabIndex="-1"
                     role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document" style={{margin: '5.75rem auto'}}>
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
                                <button type="button" className="btn btn-primary" ref={ref => this.closeModal = ref}
                                        data-dismiss="modal">Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>);
    };

    uploadFiles = targetVal => {

        switch (targetVal) {

            case 'id_proof':
                this.idProofInput.click();
                break;
            case 'add_proof':
                this.addProofInput.click();
                break;
            case 'entity_proof':
                this.entityProofInput.click();
                break;
            case 'caddr_proof':
                this.cAddressProofInput.click();
                break;
        }
    };

    RenderModalUpload = () => {

        return (
            <>
                <button type="button" style={{visibility: 'hidden'}} ref={ref => this.triggerModalUpload = ref}
                        id={"triggerModalUpload"} data-toggle="modal"
                        data-target="#docsSelModal">
                </button>

                <div className="modal fade" id={"docsSelModal"} ref={ref => this.docsSelModal = ref} tabIndex="-1"
                     role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document" style={{margin: '5.75rem auto'}}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Select the Document Type</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="checkbox">
                                    {file_catalog[this.state.active_modal].map((val, key) => (
                                        <div key={val}><label>
                                            <input type="radio" name={this.state.active_modal}
                                                   checked={(this.state.checked[this.state.active_modal] === val)}
                                                   onChange={(e) => {
                                                       this.setState(prevState => ({
                                                           checked: {
                                                               ...this.state.checked,
                                                               [this.state.active_modal]: val
                                                           }
                                                       }));
                                                   }
                                                   }/> <b
                                            style={{
                                                marginLeft: "20px",
                                                fontSize: '12px',
                                                color: 'black',
                                                cursor: 'pointer'
                                            }}>{val.toUpperCase()}</b>
                                        </label><br/></div>))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn greenButton btn-raised align-left"
                                        onClick={() => this.uploadFiles(this.state.active_modal)}
                                        style={{padding: '7px 11px 8px 11px'}}
                                        data-dismiss="modal">Upload File
                                </button>
                                <button type="button" className="btn btn-primary pull-right"
                                        data-dismiss="modal">Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>);
    }


    _multiDimDocsUpload = (target) => {
        this.setState({
            active_modal: target
        }, () => this.triggerModalUpload.click());

        // if (target === 'add_proof')
        //     this.addProofInput.click();
    };


    _onChangeFile(e, targetMsg) {

        let {value, files} = e.target;
        var allowedExt = /(\.jpg|\.jpeg|\.png|\.gif|\.pdf)$/i;

        if (!allowedExt.exec(value)) {
            // jQuery('#errorMsgModal').modal('show');
            this.triggerModal.click();
            if (targetMsg === 'id_proof')
                this.idProofInput.value = '';
            else if (targetMsg === 'add_proof')
                this.addProofInput.value = '';
            /*else if (targetMsg === 'bank_proof')
                this.bankProofInput.value = '';*/
            else if (targetMsg === 'reg_proof')
                this.entityProofInput.value = '';
            else if (targetMsg === 'caddr_proof')
                this.cAddressProofInput.value = '';
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
            case 'entity_proof':
                this.setState({entity_proof_msg: truncated});
                break;
            case 'caddr_proof':
                this.setState({caddr_proof_msg: truncated});
                break;
            /*            case 'bank_proof':
                            this.setState({bank_proof_msg: truncated});
                            break;*/
        }
    }

    formSubmit() {

        let {payload, token, preFlightResp, changeLoader, history, showAlert} = this.props;
        changeLoader(true);

        if (environment === 'local')
            preFlightResp = {loan_application_id: '1780'};

        let ctr = 0;

        const inputFiles = document.querySelectorAll('input[type="file"]');
        const formData = new FormData();

        formData.append("app_id", app_id);
        formData.append("anchor_id", payload.anchor_id);
        formData.append("loan_application_id", preFlightResp.loan_application_id);

        // console.log(JSON.stringify(this.state.checked[doc_type_attr[ctr]]));
        for (const file of inputFiles) {

            formData.append(`documents[][doc_type]`, this.state.checked[doc_type_attr[ctr]]);
            formData.append(`documents[][doc_category]`, doc_att[ctr].doc_category);
            formData.append(`documents[][doc_owner]`, doc_att[ctr].doc_owner);
            formData.append(`documents[][file]`, file.files[0]);
            ctr++;
        }

        fetch(`${baseUrl}/documents`, {
            method: 'POST',
            headers: {
                // "Content-Type": "",
                "token": token,
                "cache": "no-cache",
            },
            body: formData // This is your file object
        })
            .then(resp => resp.json())
            .then(
                resp => {
                    changeLoader(false);
                    // console.log(resp); // Handle the success response object
                    if (resp.error === Object(resp.error))
                        showAlert("We couldn't upload the files, Kindly try again !", 'warn');
                    else if (resp.response === Object(resp.response))
                        history.push(`${PUBLIC_URL}/preapprove/bankdetail`);
                }
            ).catch(
            error => {
                changeLoader(false);
                // console.log(error); // Handle the error response object
                showAlert();
            }
        );
    }

    componentWillMount() {

        const {payload, adharObj, businessObj, changeLoader, token, history} = this.props;
        changeLoader(false);
        if (!token)
            history.push(`${PUBLIC_URL}/preapprove/token`);

        if (payload === Object(payload) && payload) {
            if (adharObj !== Object(adharObj))
                history.push(`${PUBLIC_URL}/preapprove/personaldetail`);

            if (businessObj !== Object(businessObj))
                history.push(`${PUBLIC_URL}/preapprove/businessdetail`);
        } else history.push(`${PUBLIC_URL}/preapprove/token`);

        // console.log(adharObj);
        // console.log(payload);
        // console.log(businessObj);
        this.errorMsgModal = '';
        this.idProofInput = {value: ''};
        this.addProofInput = {value: ''};
        this.entityProofInput = {value: ''};
        this.cAddressProofInput = {value: ''};
        // this.bankProofInput = {value: ''};
    }

    render() {
        if (this.props.adharObj === Object(this.props.adharObj)) {
            const {f_name, l_name} = this.props.adharObj;
            return (
                <>
                    {/* <button onClick={() => this.props.history.push('${PUBLIC_URL}/preapprove/businessdetail`)} className={"btn btn-link"}>
                    Go Back
                </button>*/}
                    {/*<i className={"fa fa-file-pdf checkCircle"} style={{color: 'cadetblue'}}></i>*/}
                    <h4 className={"text-center mt-5"}> KYC Documents </h4>
                    <h5 className="secondLinePara paragraph_styling  text-center">
                        Hi {f_name} {l_name}, Please upload following documents
                        in
                        pdf or png/jpg
                        format.
                    </h5>

                    <div className="alert " role="alert">
                        <div className="paragraph_styling  text-center">

                            <div className={"row mb-4 mt-4"}>
                                <div className={"col-md-6 col-sm-6 col-xs-12"}>
                                    <div className="input-container text-left" style={{cursor: 'pointer'}}
                                         onClick={() => this.idProofInput.click()}>
                                        <input type="file" id="idProofInput"
                                               onChange={(e) => this._onChangeFile(e, 'id_proof')}
                                               ref={ref => this.idProofInput = ref}/>
                                        <button className="btn btn-raised uploadButton inputFilebutton"
                                                id={"idProofBtn"}>
                                            ID Proof
                                        </button>
                                        <span className="helperUploadTxt">{this.state.id_proof_msg}</span>
                                    </div>
                                    <small className="text-muted" style={{fontSize: 'x-small'}}>Upload a PAN or
                                        Passport.
                                    </small>
                                </div>
                                <div className={"col-md-6 col-sm-6 col-xs-12"}>
                                    <div className="input-container text-left" style={{cursor: 'pointer'}}
                                         onClick={() => this._multiDimDocsUpload('add_proof')}>
                                        <input type="file" id="addressProofInput"
                                               onChange={(e) => this._onChangeFile(e, 'add_proof')}
                                               ref={ref => this.addProofInput = ref}/>
                                        <button className="btn btn-raised uploadButton inputFilebutton"
                                                onClick={() => this._multiDimDocsUpload('add_proof')}
                                                id={"addressProofBtn"}>
                                            Address Proof
                                        </button>
                                        <span className="helperUploadTxt"
                                        >{this.state.add_proof_msg}</span>
                                    </div>
                                    <small className="text-muted" style={{fontSize: 'x-small'}}>Upload Aadhaar, Driving
                                        License or Ration Card or
                                        Passport..
                                    </small>
                                </div>
                            </div>

                            {/*    <div className={"row"}>
                                <div className={"col-md-6 col-sm-12"}>
                                    <div className="input-container text-left">
                                        <input type="file" id="addressProofInput"
                                               onChange={(e) => this._onChangeFile(e, 'bank_proof')}
                                               ref={ref => this.bankProofInput = ref}/>
                                        <button className="btn btn-raised uploadButton inputFilebutton "
                                                onClick={() => this.bankProofInput.click()}

                                                id={"addressProofBtn"}>
                                            Bank Proof
                                        </button>
                                        <span className="helperUploadTxt"
                                        >{this.state.bank_proof_msg}</span>
                                    </div>
                                    <small className="text-muted">Upload cancelled Cheque or a Bank statement.
                                    </small>
                                </div>
                                <div className={"col-md-6 col-sm-12"}></div>
                            </div>*/}

                            <div className={"row"}>
                                <div className={"col-md-6 col-sm-6 col-xs-12"}>
                                    <div className="input-container text-left" style={{cursor: 'pointer'}}
                                         onClick={() => this._multiDimDocsUpload('entity_proof')}>
                                        <input type="file" id="addressProofInput"
                                               onChange={(e) => this._onChangeFile(e, 'entity_proof')}
                                               ref={ref => this.entityProofInput = ref}/>
                                        <button className="btn btn-raised uploadButton inputFilebutton "
                                                onClick={() => this._multiDimDocsUpload('entity_proof')}
                                                id={"addressProofBtn"}>
                                            Shop Registration

                                        </button>
                                        <span className="helperUploadTxt"
                                        >{this.state.entity_proof_msg}</span>
                                    </div>
                                    <small className="text-muted" style={{fontSize: 'x-small'}}>Upload Shop &
                                        Establishment Certificate or GST
                                        Registration Certificate.
                                    </small>
                                </div>
                                <div className={"col-md-6 col-sm-6 col-xs-12 uploadContatiner"}>
                                    <div className="input-container text-left" style={{cursor: 'pointer'}}
                                         onClick={() => this._multiDimDocsUpload('caddr_proof')}>
                                        <input type="file" id="addressProofInput"
                                               onChange={(e) => this._onChangeFile(e, 'caddr_proof')}
                                               ref={ref => this.cAddressProofInput = ref}/>
                                        <button className="btn btn-raised uploadButton inputFilebutton "
                                                onClick={() => this._multiDimDocsUpload('caddr_proof')}
                                                id={"addressProofBtn"}>
                                            Shop Address
                                        </button>
                                        <span className="helperUploadTxt"
                                        >{this.state.caddr_proof_msg}</span>
                                    </div>
                                    <small className="text-muted" style={{fontSize: 'x-small'}}>Upload Company's
                                        Electricity Bill or Rent Agreement.
                                    </small>
                                </div>
                            </div>
                            <br/>
                            <br/>
                        </div>
                    </div>

                    <div className="mb-3 text-center ">
                        <button
                            type="button"
                            disabled={(this.idProofInput.value === undefined && this.addProofInput.value === undefined && this.entityProofInput.value === undefined && this.cAddressProofInput.value === undefined)}
                            onClick={e => this.formSubmit(e)}
                            className="form-submit btn btn-raised greenButton"
                        >Complete Loan Application
                        </button>
                    </div>
                    <div>
                        {this.RenderModalMessage()}
                        {this.RenderModalUpload()}
                    </div>
                </>
            )
        } else return null;
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
        {setBusinessDetail, pan_adhar, setAdharManual, changeLoader, showAlert}
    )(DocsUpload)
);
