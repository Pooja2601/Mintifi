import React, {Component} from "react";
// import { BreadCrumbs } from "./breadcrumbs";
// import { GetinTouch } from "../shared/getin_touch";
// import { Link } from "react-router-dom";
import ModalCareerApply from "./modal_apply";
import {JobCategory, JobLocation, JobsOpen} from "./api_simulation";
import EnquiryForm from "./enquiry_form";
import {baseUrl} from "../shared/constants";

const arr = [1, 2, 3, 4, 5, 2, 3, 4, 4];

const message = {
    success: {
        contentOpen:
            "Thank you for reaching out, Apply for the suitable roles given below.",
        contentClose:
            "Thank you for looking out careers in Mintifi, currently we don't have any openings, visit again later !!."
    },
    error: {
        content: " Unexpected error occured, try again later"
    }
};

class billDiscount extends Component {
    state = {
        openList: false,
        selJob: "",
        loading: false,
        selJobShow: "",
        selLoc: "",
        selLocShow: "",
        filteredJobs: JobsOpen,
        appliedJob: "",
        showMsg: "",
        openJobLocation: "",
        openJobDept: ""
    };

    _fetchCategory() {
        this.setState({
            openJobLocation: JobLocation,
            openJobDept: JobCategory
        });

        // fetch(`${baseUrl}/categories/`, {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //     timeout: 5000
        //     // 'Content-Type': 'application/x-www-form-urlencoded', magnet:?xt=urn:btih:906A68F2CB76A019089E62351C4967B20AB66692
        //   }
        // })
        //   .then(res => res.json())
        //   .then(resp => {
        //     let showMsg,
        //       openJobLocation,
        //       openJobDept,
        //       openRoles = {};
        //     if (resp.status === "SUCCESS") {
        //       openJobLocation = resp.data.location;
        //       openJobDept = resp.data.department;
        //       showMsg = "";
        //     } else showMsg = message.error.content;
        //     this.setState({
        //       showMsg,
        //       openJobLocation,
        //       openJobDept
        //     });
        //   })
        //   .catch(e => {
        //     this.setState({
        //       showMsg: message.error.content
        //     });
        //     console.log(
        //       "Unexpected error occured, Couldn't fetch Categories and Cities"
        //     );
        //   });
    }

    _openList() {
        // console.log(this.enquiry_form);
        this.setState({loading: true});
        this._fetchCategory();

        fetch(`${baseUrl}/opening/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                timeout: 5000
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
            .then(res => res.json())
            .then(resp => {
                let showMsg,
                    openRoles = {};
                if (resp.status === "success") {
                    if (resp.data.length) {
                        showMsg = message.success.contentOpen;
                        openRoles = resp.data;
                    } else showMsg = message.success.contentClose;
                } else showMsg = message.error.content;
                this.setState({
                    loading: false,
                    openList: true,
                    showMsg,
                    filteredJobs: openRoles
                });
            })
            .catch(e => {
                this.setState({
                    loading: false,
                    openList: true,
                    showMsg: message.error.content
                });
                console.log("Unexpected error occured, Couldn't fetch Open Jobs");
            });
    }

    _searchJob(query) {
        let filteredJobs,
            patt = new RegExp(query.toLowerCase());
        if (query == "") filteredJobs = JobsOpen;
        else {
            filteredJobs = JobsOpen.filter((val, key) => {
                if (patt.test(val.title.toLowerCase())) return val;
            });
        }
        this.setState({filteredJobs});
    }

    _selectCategory(selVal) {
        let filteredJobs;
        if (selVal.id === 1) {
            if (this.state.selLoc && this.state.selLoc != "all")
                filteredJobs = JobsOpen.filter((val, key) => {
                    if (val.location === this.state.selLoc) return val;
                });
            else filteredJobs = JobsOpen;
        } else
            filteredJobs = this.state.filteredJobs.filter((val, key) => {
                if (selVal.department === val.department) return val;
            });
        this.setState({
            filteredJobs,
            selJob: selVal.department,
            selJobShow: selVal.title
        });
    }

    _selectLocation(selVal) {
        let filteredJobs;
        if (selVal.id === 1) {
            if (this.state.selJob && this.state.selJob != "all")
                filteredJobs = JobsOpen.filter((val, key) => {
                    if (val.department === this.state.selJob) return val;
                });
            else filteredJobs = JobsOpen;
        } else
            filteredJobs = this.state.filteredJobs.filter((val, key) => {
                if (selVal.location === val.location) return val;
            });
        this.setState({
            filteredJobs,
            selLoc: selVal.location,
            selLocShow: selVal.location
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 p-0">
                        <div className="parallaxCareer darken-pseudo">
                            <div>
                                <h1 className="header4">Looking for a Career in Mintifi ?</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center transparency ">
                    <div className="col-11 col-md-10 col-lg-10">
                        <div id={"careerHeader"} data-spy="affix" data-offset-top="197">
                            {this.state.openList ? (
                                <div className="row margin careerHeader">
                                    <div
                                        className="col-4 sizing_of_box1"
                                        style={{
                                            backgroundColor: "#fff",
                                            borderRadius: "5px 0 0 5px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <div className="row">
                                            <div className="col-md-4">
                                                <i
                                                    className="fa fa-compass"
                                                    style={{fontSize: "54px"}}
                                                />
                                            </div>
                                            <div
                                                className="col-md-8 block_design"
                                                style={{left: "-12px"}}
                                            >
                                                <div className="dropdown">
                                                    <button
                                                        className="btn dropdown-toggle"
                                                        type="button"
                                                        style={{textTransform: "capitalize"}}
                                                        id="dropdownMenuButton"
                                                        data-toggle="dropdown"
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                    >
                                                        {this.state.selLoc
                                                            ? this.state.selLocShow
                                                            : "Select Location"}{" "}
                                                    </button>
                                                    <div
                                                        className="dropdown-menu"
                                                        aria-labelledby="dropdownMenuButton"
                                                    >
                                                        {JobLocation.map((val, key) => (
                                                            <a
                                                                key={key}
                                                                style={{textTransform: "capitalize"}}
                                                                className="dropdown-item"
                                                                href="javascript:return false;"
                                                                onClick={() => this._selectLocation(val)}
                                                            >
                                                                {val.location}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-4 sizing_of_box1"
                                        style={{cursor: "pointer"}}
                                    >
                                        <div className="row">
                                            <div className="col-md-4">
                                                <i
                                                    className="fa fa-user-md"
                                                    style={{fontSize: "54px"}}
                                                />
                                            </div>
                                            <div
                                                className="col-md-8 block_design"
                                                style={{left: "-12px"}}
                                            >
                                                <div className="dropdown">
                                                    <button
                                                        className="btn dropdown-toggle"
                                                        type="button"
                                                        id="dropdownMenuButton"
                                                        data-toggle="dropdown"
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                    >
                                                        {this.state.selJob
                                                            ? this.state.selJobShow
                                                            : "Job Category"}{" "}
                                                    </button>
                                                    <div
                                                        className="dropdown-menu"
                                                        aria-labelledby="dropdownMenuButton"
                                                    >
                                                        {JobCategory.map((val, key) => (
                                                            <a
                                                                key={key}
                                                                className="dropdown-item"
                                                                href="javascript:return false;"
                                                                onClick={() => this._selectCategory(val)}
                                                            >
                                                                {val.title}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-4 sizing_of_box1"
                                        style={{borderRadius: "0 0 5px 0", cursor: "pointer"}}
                                    >
                                        <div className="row">
                                            <div className="col-md-4">
                                                <i
                                                    className="fa fa-search"
                                                    style={{fontSize: "54px"}}
                                                />
                                            </div>
                                            <div
                                                className="col-md-8 block_design"
                                                style={{left: "-12px"}}
                                            >
                                                <div className="input-group mb-3">
                                                    <div className="input-group-prepend">
                                                        {/* <span className="input-group-text" id="search_by_title">
                      @
                    </span> */}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search by Title"
                                                        aria-label="Username"
                                                        aria-describedby="search_by_title"
                                                        ref={ref => (this.searchText = ref)}
                                                        onChange={() => {
                                                            this._searchJob(this.searchText.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}</div>
                        <div className="row margin_top">
                            <div
                                className="col-sm-12 col-md-8 pl-0 "
                                style={{maxHeight: "92vh", overflow: "auto"}}
                            >
                                <div className="alert alert-secondary" role="alert">
                                    {this.state.openList && this.state.showMsg
                                        ? this.state.showMsg
                                        : null}
                                </div>
                                {this.state.openList ? (
                                    this.state.filteredJobs.map((val, key) => (
                                        <div
                                            key={key}
                                            className="main_content main_content_div working_main_content"
                                            style={{height: "auto", marginBottom: "5px"}}
                                        >
                                            <p className="font3">
                                                {val.title}{" "}
                                                <button
                                                    type="button"
                                                    data-toggle="modal"
                                                    data-target="#careerModalApply"
                                                    data-whatever="@getbootstrap"
                                                    onClick={() => this.setState({appliedJob: val})}
                                                    className="btn color_of_btn font-weight-light float-right"
                                                    style={{padding: "10px"}}
                                                >
                                                    Apply
                                                </button>
                                            </p>
                                            <small style={{display: "block"}}>
                                                <i
                                                    className="fa fa-map-marker-alt"
                                                    style={{fontSize: "14px"}}
                                                />{" "}
                                                <span className="badge badge-info">
                          {val.location.toUpperCase()}
                        </span>
                                                <div
                                                    className="alert alert-light float-right"
                                                    role="alert"
                                                >
                                                    {val.min_experience}
                                                </div>
                                            </small>
                                            <br/>
                                            <div className="alert alert-secondary" role="alert">
                        <span
                            className="badge badge-secondary"
                            style={{backgroundColor: "#00BFA5"}}
                        >
                          Job Desciptions:{" "}
                        </span>
                                                <br/>
                                                {val.job_desc}
                                                <br/>
                                                <span
                                                    className="badge badge-secondary"
                                                    style={{backgroundColor: "#00BFA5"}}
                                                >
                          Job Skills:{" "}
                        </span>{" "}
                                                <br/> {val.job_skill}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div
                                        className="main_content main_content_div working_main_content"
                                        style={{height: "auto", marginBottom: "5px"}}
                                    >
                                        <p className="font3">
                                            Discover the Opportunities with Mintifi
                                            <br/>
                                            {!this.state.loading ? (
                                                <button
                                                    type="submit"
                                                    name="submit"
                                                    value="Submit"
                                                    className="form-submit btn greenButton"
                                                    onClick={() => this._openList()}
                                                >
                                                    Explore
                                                </button>
                                            ) : (
                                                <button className="btn greenButton" disabled>
                                                    <span className="spinner-border spinner-border-sm"/>
                                                    Fetching Jobs..
                                                </button>
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <EnquiryForm/>
                        </div>

                        <div className="col-12 p-0 margin_top">
                            <div className="border1"/>
                        </div>
                    </div>
                </div>
                <ModalCareerApply appliedJob={this.state.appliedJob}/>
            </div>
        );
    }
}

export default billDiscount;
