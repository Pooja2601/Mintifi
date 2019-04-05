import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {setAdharManual} from "../../actions";

class AppRejected extends Component {

    componentWillMount() {
        if (this.props.adharObj !== Object(this.props.adharObj))
            this.props.history.push("/");
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
                    <i className={"fa fa-check-circle checkCircle"}></i>
                    <h3 className={"text-center"}> Application Approved !</h3>
                    <br/>

                    <div className="alert alert-success" role="alert">
                        <h4 className="alert-heading">Congratulations {f_name} {l_name}</h4>
                        <p className="paragraph_styling  text-center">
                            We're happy to inform you about the loan you're requesting.
                            As your information aligned with our norms, It got approved by our Team.
                        </p>
                    </div>

                    <div className="paragraph_styling text-left alert alert-success" role="alert">

                        <table width="100%">
                            <tbody>
                            <tr>
                                <td>LOAN ID</td>
                                <td>342HBJK4H3JKNL2K23J</td>
                            </tr>
                            <tr>
                                <td>LENDER</td>
                                <td>FULLERTON</td>
                            </tr>
                            <tr>
                                <td>CREDIT APPROVED</td>
                                <td>Rs. 4,00,000</td>
                            </tr>
                            <tr>
                                <td>DURATION</td>
                                <td>12 Months</td>
                            </tr>
                            <tr>
                                <td>EMI</td>
                                <td>Rs. 35,000</td>
                            </tr>
                            </tbody>
                        </table>

                    </div>
                    <br/>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" value={""} on={(e) => console.log(e.target.value)}/> I confirm the Loan Amount and ready to proceed with the above Credit details.
                        </label>
                    </div>
                    <div className="mt-5 mb-5 text-center ">
                        <button
                            type="button"
                            // onClick={e => this.props.history.push('/')}
                            className="form-submit btn btn-raised partenrs_submit_btn"
                        >Process Loan
                        </button>
                    </div>
                </>
            )
        }
    }
}

const mapStateToProps = state => ({
    adharObj: state.adharDetail.adharObj,
});

export default withRouter(
    connect(
        mapStateToProps,
        {setAdharManual}
    )(AppRejected)
);
