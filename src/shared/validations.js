import React from "react";
import { accountType } from "../shared/constants";
import { BusinessType } from "../shared/constants";

// normaliser
const phoneNumber = {
  type: "number",
  pattern: /^[0-9]{10}$/,
  title: "Enter Mobile Number",
  error: "Invalid Mobile Number entered",
  min: 1000000000,
  max: 9999999999,
  maxLength: 10,
  minLength: 10
};
// normaliser
const emailText = {
  type: "text",
  pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  error: "Invalid Email",
  autoCapitalize: "characters"
};

const validationPersonalDetails = {
  F_NAME: {
    slug: "f_name",
    type: "text",
    pattern: /^[a-zA-Z]{2,}[^]+$/,
    title: "Please enter First Name",
    error: "Invalid First Name",
    required: true,
    id: "firstName",
    autoCapitalize: "characters",
    label: "First Name *"
  },
  M_NAME: {
    slug: "m_name",
    type: "text",
    pattern: /^[a-zA-Z]{2,}[^]+$/,
    title: "Please enter Middle Name",
    error: "Invalid Middle Name",
    required: false,
    id: "middleName",
    autoCapitalize: "characters",
    label: "Middle Name"
  },
  L_NAME: {
    slug: "l_name",
    type: "text",
    pattern: /^[a-zA-Z]{2,}[^]+$/,
    // pattern: /^[a-zA-Z]{3,}(\s)?([a-zA-Z]+)?$/,
    title: "Please enter Last Name",
    error: "Invalid Last Name",
    required: true,
    id: "lastName",
    autoCapitalize: "characters",
    label: "Last Name *"
  },
  MOBILE: {
    slug: "mobile",
    ...phoneNumber,
    required: true,
    id: "numberMobile",
    label: "Mobile Number *",
    error: "Invalid Mobile Number",
    pattern: /^[0-9]{10}$/
  },
  EMAIL: {
    slug: "email",
    title: "Please enter Email",
    required: true,
    id: "textEmail",
    ...emailText,
    label: "Email ID *"
  },
  GENDER: {
    slug: "gender",
    type: "button",
    required: false,
    id: "genderHuman",
    pattern: /^[a-z]$/,
    label: "Gender *",
    options: [
      { key: "m", value: "Male", icon: "fa fa-male" },
      { key: "f", value: "Female", icon: "fa fa-female" }
    ]
  },
  OWNERSHIP: {
    slug: "ownership",
    type: "button",
    required: false,
    id: "residenceOwnership",
    pattern: /^[a-z]+$/,
    label: "Ownership *",
    options: [
      { key: "rented", value: "Rented", icon: "fa fa-building" },
      { key: "owned", value: "Owned", icon: "fa fa-home" }
    ]
  },
  ADDRESS1: {
    slug: "address1",
    type: "text",
    required: true,
    pattern: /^[a-zA-Z0-9]{2,}[^]+$/,
    id: "textAddress1",
    title: "Please enter Address 1",
    error: "Invalid Address 1",
    autoCapitalize: "characters",
    label: "Address 1 *"
  },
  ADDRESS2: {
    slug: "address2",
    type: "text",
    required: false,
    pattern: /^[a-zA-Z0-9]{2,}[^]+$/,
    id: "textAddress2",
    title: "Please enter Address 2",
    error: "Invalid Address 2",
    autoCapitalize: "characters",
    label: "  Address 2"
  },
  DOB: {
    slug: "dob",
    id: "dobDate",
    required: false,
    dateFormat: "dd/MM/yyyy",
    pattern: /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/,
    label: "Date of Birth"
  },
  PINCODE: {
    slug: "pincode",
    type: "number",
    title: "Please enter Pincode",
    required: true,
    id: "numberPincode",
    pattern: /^[0-9]{6}$/,
    autoCapitalize: "characters",
    label: " Pincode *"
  }
};

const validationAdharPan = {
  PAN_NUMBER: {
    slug: "pan",
    type: "text",
    title: "Please enter valid PAN number. E.g. AAAAA9999A",
    pattern: /^[a-zA-Z]{3}[pP][a-zA-Z]([0-9]){4}[a-zA-Z]$/,
    required: true,
    autoCapitalize: "characters",
    autoComplete: "off",
    minLength: 10,
    maxLength: 10,
    error: "Invalid PAN Number",
    label: "PAN Number *",
    id: "numberPAN"
  },
  ADHAR_NUMBER: {
    slug: "adhar",
    label: "Enter Aadhaar (optional)",
    type: "number",
    pattern: /^[0-9]{12}$/,
    title: "Enter Aadhaar Number",
    autoComplete: "off",
    required: false,
    maxLength: 12,
    minLength: 12,
    error: "Invalid Aadhaar Number",
    id: "numberAdhar"
  }
};

const validationMobileOtp = {
  MOBILE_NUMBER: {
    slug: "mobile",
    ...phoneNumber,
    required: true,
    readOnly: true,
    disabled: true,
    id: "numberMobile",
    label: "Enter Mobile Number *",
    error: "Invalid Mobile Number"
  },
  VERIFY_OTP: {
    slug: "otp",
    type: "number",
    pattern: /^[0-9]{6}$/,
    error: "Invalid OTP Number",
    title: "This field is required",
    id: "otpVerify",
    min: 100000,
    max: 999999,
    maxLength: 6,
    minLength: 6,
    required: false,
    label: "Enter OTP *"
  }
};

const validationBank = {
  ACCOUNT_NAME: {
    type: "text",
    id: "nameAccount",
    slug: "acc_name",
    title: "Enter Account Name",
    error: "Invalid Account Name",
    required: true,
    pattern: /^[a-zA-Z]{2,}[^]+$/,
    autoCapitalize: "characters",
    label: "Account Name *"
  },
  ACCOUNT_NUMBER: {
    type: "text",
    id: "numberAccount",
    slug: "acc_number",
    title: "Enter Account Number",
    error: "Invalid Account Number",
    pattern: /^[0-9]{9,18}$/,
    required: true,
    label: "Account Number *"
  },
  IFSC: {
    type: "text",
    id: "ifscCode",
    title: "Enter IFSC Code",
    error: "Invalid IFSC Code",
    required: true,
    slug: "ifsc_code",
    autoCapitalize: "characters",
    pattern: /[A-Za-z]{4}\d{7}$/,
    label: "IFSC *"
  },
  ACCOUNT_TYPE: {
    type: "dropdown",
    id: "accountType",
    slug: "acc_type",
    title: "Select Account Type",
    error: "Select Account Type",
    pattern: /^[a-z]{2,}$/,
    options: accountType,
    required: true,
    label: "Account Type *"
  },
  BANK_NAME: {
    id: "nameBank",
    type: "text",
    title: "Enter Bank Name",
    error: "Invalid Bank Name",
    pattern: /^[a-zA-Z0-9]{2,}[^]+$/,
    slug: "bank_name",
    autoCapitalize: "characters",
    disabled: true,
    required: true,
    label: "Bank Name *"
  },
  MICR_CODE: {
    type: "text",
    pattern: /^[0-9]{9}$/,
    title: "Enter MICR Code",
    error: "Invalid MICR Code",
    autoCapitalize: "characters",
    id: "micrCode",
    slug: "micr_code",
    required: false,
    disabled: true,
    label: "MICR Code"
  },
  BRANCH_NAME: {
    type: "text",
    title: "Enter Branch Name",
    error: "Invalid Branch Name",
    id: "nameBranch",
    slug: "branch_name",
    pattern: /^[a-zA-Z0-9]{2,}[^]+$/,
    required: true,
    disabled: true,
    label: "Branch Name *"
  }
};

const validationBusinessDetails = {
  COMPANY_NAME: {
    slug: "company_name",
    type: "text",
    title: "Company Legal Name",
    autoCapitalize: "characters",
    id: "companyName",
    pattern: /^[a-zA-Z0-9]{2,}[^]+$/,
    required: true,
    readOnly: false,
    disabled: false,
    error: "Invalid Company Name",
    label: "Company Legal Name"
  },
  COMPANY_TYPE: {
    slug: "company_type",
    required: true,
    id: "companyType",
    pattern: /^[^]+$/,
    inputId: "companyType",
    options: BusinessType,
    error: "Invalid Company Type",
    label: "Company Type *"
  },
  GST_NUMBER: {
    slug: "gst",
    type: "text",
    pattern: /^\d{2}[a-zA-Z]{5}\d{4}[a-zA-Z][a-zA-Z1-9][zZ][a-zA-Z0-9]$/,
    title: "Enter GST Number",
    autoCapitalize: "characters",
    id: "numberGST",
    required: false,
    error: "Invalid GST Number",
    label: "GST Number"
  },
  PAN_NUMBER: {
    slug: "bpan",
    type: "text",
    pattern: /^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]?$/,
    title: "Enter Business PAN",
    autoCapitalize: "characters",
    id: "numberPAN",
    required: false,
    readOnly: true,
    disabled: true,
    error: "Invalid Pan Number",
    label: "PAN Number"
  },
  AVERAGE_TRANSACTION: {
    slug: "avgtrans",
    type: "text",
    pattern: /^[0-9]{5,10}$/,
    title: "Enter Average monthly Transactions",
    autoCapitalize: "characters",
    id: "avgTrans",
    required: false,
    error: "Invalid Transaction Amount",
    label: "Average Monthly Trans."
  },
  DEALER_CODE: {
    slug: "dealer_code",
    type: "text",
    pattern: /^[0-9A-Za-z]{4,10}$/,
    title: "Enter Dealer Code",
    autoCapitalize: "characters",
    id: "dealerCode",
    required: false,
    error: "Invalid Dealer Code",
    label: "Dealer Code"
  },
  BUSINESS_EMAIL: {
    slug: "business_email",
    id: "business_email",
    ...emailText,
    required: false,
    title: "Enter Business Email",
    label: "Business Email"
  },
  BUSINESS_PHONE: {
    slug: "business_phone",
    required: false,
    readOnly: false,
    disabled: false,
    ...phoneNumber,
    id: "business_phone",
    label: "Business Phone"
  },
  NO_OF_FOUNDERS: {
    slug: "no_of_founders",
    type: "number",
    pattern: /^[0-9]+$/,
    title: "Enter Number of Founders",
    required: false,
    error: "Invalid Number",
    min: 1000,
    max: 1000,
    maxLength: 5,
    minLength: 5,
    id: "no_of_founders",
    label: "Number of Founders"
  },
  NO_OF_EMPLOYEES: {
    slug: "no_of_employees",
    type: "number",
    pattern: /^[0-9]+$/,
    title: "Enter Number of Employees",
    required: false,
    error: "Invalid Number",
    min: 1000,
    max: 1000,
    maxLength: 5,
    minLength: 5,
    id: "no_of_employees",
    label: "Number of Employees"
  },
  INC_DATE: {
    slug: "inc_date",
    id: "incDate",
    required: true,
    dateFormat: "dd/MM/yyyy",
    // pattern: /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/,
    pattern: /^[^]{2,}$/,
    error: "Invalid Date",
    label: "Date of Incorporation *"
  },
  PINCODE: {
    slug: "pincode",
    type: "number",
    title: "Please enter Pincode",
    required: false, // custom validation on business page
    id: "numberPincode",
    pattern: /^[0-9]{6}$/,
    autoCapitalize: "characters",
    label: "Pincode *"
  },
  ADDRESS1: {
    slug: "address1",
    type: "text",
    required: false, // custom validation on business page
    pattern: /^[a-zA-Z0-9]{2,}[^]+$/,
    id: "textAddress1",
    title: "Please enter Address 1",
    error: "Invalid Address 1",
    autoCapitalize: "characters",
    label: " Address 1 *"
  },
  ADDRESS2: validationPersonalDetails.ADDRESS2,
  OWNERSHIP: {
    slug: "ownership",
    type: "button",
    required: true,
    id: "businessOwnership",
    pattern: /^[a-z]+$/,
    label: "Ownership *",
    options: [
      { key: "rented", value: "Rented", icon: "fa fa-building" },
      { key: "owned", value: "Owned", icon: "fa fa-home" }
    ]
  },
  RETAILER_VINTAGE: {
    slug: "retailer_vintage",
    type: "number",
    required: false,
    id: "retailerVintage",
    pattern: /^[0-9]{3,8}$/,
    error: "Invalid Retailer Vintage",
    title: "Retailer Vintage",
    label: "Retailer Vintage *"
  }
};

export {
  validationPersonalDetails,
  validationAdharPan,
  validationMobileOtp,
  validationBusinessDetails,
  validationBank
};
