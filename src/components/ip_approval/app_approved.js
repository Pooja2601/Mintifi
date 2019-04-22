import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {setAdharManual} from "../../actions";

class AppRejected extends Component {

    state = {confirmed: false};

    componentWillMount() {
        if (this.props.adharObj !== Object(this.props.adharObj))
            this.props.history.push("/");

    }

    render() {
        const {adharObj, match} = this.props;

        if (adharObj === Object(adharObj)) {
            const {f_name, l_name} = adharObj;
            const {loan_application_id, credit_eligibility} = this.props.preFlightResp;
            return (
                <>
                    {/* <button onClick={() => this.props.history.push('/BusinessDetail')} className={"btn btn-link"}>
                    Go Back
                </button>*/}
                    <br/>
                    <i className={"fa fa-check-circle checkCircle"}></i>
                    <h3 className={"text-center"}> Application {(match.params === 'pending') ? 'Pending' : 'Approved'} !</h3>
                    <br/>

                    <div className={(match.params === 'pending') ? 'alert alert-warning' : 'alert alert-success'}
                         role="alert">
                        <h4 className="alert-heading">Congratulations {f_name} {l_name}</h4>
                        <p className="paragraph_styling  text-center">
                            We're happy to inform you about the loan you're requesting.
                            As your information aligned with our
                            norms, {(match.params === 'pending') ? 'It is under pending state.' : 'It got approved by our Team.'}
                            <br/> One of our representative will be in touch with you soon.
                        </p>
                    </div>

                    <div className="paragraph_styling text-left alert alert-success" role="alert">

                        <table width="100%">
                            <tbody>
                            <tr>
                                <td>PRODUCT OFFERED</td>
                                <td>{credit_eligibility.product_offered}</td>
                            </tr>
                            <tr>
                                <td>LOAN ID</td>
                                <td>{loan_application_id}</td>
                            </tr>
                            <tr>
                                <td>LENDER</td>
                                <td>FULLERTON</td>
                            </tr>
                            <tr>
                                <td>CREDIT APPROVED</td>
                                <td>Rs. {credit_eligibility.loan_amount_approved}</td>
                            </tr>
                            {/*<tr>
                                <td>DURATION</td>
                                <td>12 Months</td>
                            </tr>*/}
                            {/*<tr>
                                <td>EMI</td>
                                <td>Rs. 35,000</td>
                            </tr>*/}
                            </tbody>
                        </table>

                    </div>
                    <br/>
                    {(match.params !== 'pending')?
                    (<><div className="checkbox">
                        <label>

                            <input type="checkbox" checked={this.state.confirmed}
                                   onChange={(e) =>
                                       this.setState(prevState => ({confirmed: !prevState.confirmed}))
                                   }/> I confirm the Loan Amount and ready to proceed with the above Credit details.
                        </label>
                    </div>
                    <div className="mt-5 mb-5 text-center ">
                        <button
                            type="button"
                            disabled={!this.state.confirmed}
                            onClick={e => this.props.history.push('/')}
                            className="form-submit btn btn-raised greenButton"
                        >Process Loan
                        </button>
                    </div></>): <></>
                    }
                </>
            )
        }
    }
}

const mapStateToProps = state => ({
    adharObj: state.adharDetail.adharObj,
    preFlightResp: state.businessDetail.preFlightResp
});

export default withRouter(
    connect(
        mapStateToProps,
        {setAdharManual}
    )(AppRejected)
);
