import React from "react";
import { accountType } from "../shared/constants";
import { BusinessType } from "../shared/constants";

const validationPersonalDetails = {
  F_NAME: {
    slug: "f_name",
    type: "text",
    pattern: /^[a-zA-Z]{2,}[^]+$/,
    title: "Please enter First Name",
    error: "Invalid First Name",
    required: true,
    id: "firstName",
    autoCapitalize: "characters"
  },
  M_NAME: {
    slug: "m_name",
    type: "text",
    pattern: /^[a-zA-Z]{2,}[^]+$/,
    title: "Please enter Middle Name",
    error: "Invalid Middle Name",
    required: false,
    id: "middleName",
    autoCapitalize: "characters"
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
    autoCapitalize: "characters"
  },
  MOBILE: {
    slug: "mobile",
    type: "number",
    pattern: /^[0-9]{10}$/,
    title: "Please enter Mobile Number",
    error: "Invalid Mobile Number",
    required: true,
    id: "numberMobile"
  },
  EMAIL: {
    slug: "email",
    type: "text",
    pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    title: "Please enter Email",
    error: "Invalid Email",
    required: true,
    id: "textEmail",
    autoCapitalize: "characters"
  },
  GENDER: {
    slug: "gender",
    type: "button",
    required: false,
    id: "genderHuman",
    pattern: /^[a-z]$/
  },
  OWNERSHIP: {
    slug: "ownership",
    type: "button",
    required: false,
    id: "residenceOwnership",
    pattern: /^[a-z]+$/
  },
  ADDRESS1: {
    slug: "address1",
    type: "text",
    required: true,
    pattern: /^[^]+$/,
    id: "textAddress1",
    title: "Please enter Address 1",
    error: "Invalid Address 1",
    autoCapitalize: "characters"
  },
  ADDRESS2: {
    slug: "address2",
    type: "text",
    required: false,
    pattern: /^[^]+$/,
    id: "textAddress2",
    title: "Please enter Address 2",
    error: "Invalid Address 2",
    autoCapitalize: "characters"
  },
  DOB: {
    slug: "dob",
    id: "dobDate",
    required: false,
    dateFormat: "dd/MM/yyyy",
    pattern: /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/
  },
  PINCODE: {
    slug: "pincode",
    type: "number",
    title: "Please enter Pincode",
    required: true,
    id: "numberPincode",
    pattern: /^[0-9]{6}$/,
    autoCapitalize: "characters"
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
    id: "numberPAN"
  },
  ADHAR_NUMBER: {
    slug: "adhar",
    type: "number",
    pattern: /^[0-9]{12}$/,
    title: "Aadhaar is required",
    autoComplete: "off",
    required: false,
    maxLength: 12,
    minLength: 12,
    error: "Invalid Adhar Number",
    id: "numberAdhar"
  }
};

const validationMobileOtp = {
  MOBILE_NUMBER: {
    slug: "mobile",
    type: "number",
    pattern: /^[0-9]{10}$/,
    title: "Enter Mobile Number",
    min: 1000000000,
    max: 9999999999,
    maxLength: 10,
    minLength: 10,
    required: true,
    readOnly: true,
    disabled: true,
    error: "Invalid Mobile Number entered",
    id: "numberMobile"
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
    required: true
  }
};

const bankValidations = {
  ACCOUNT_NAME: {
    type: "text",
    id: "nameAccount",
    slug: "acc_name",
    title: "Enter Account Name",
    error: "Invalid Account Name",
    required: true,
    pattern: /^[a-zA-Z]{2,}[^]+$/,
    autoCapitalize: "characters"
  },
  ACCOUNT_NUMBER: {
    type: "text",
    id: "numberAccount",
    slug: "acc_number",
    title: "Enter Account Number",
    error: "Invalid Account Number",
    pattern: /^[0-9]{9,18}$/,
    required: true
  },
  IFSC: {
    type: "text",
    id: "ifscCode",
    title: "Enter IFSC Code",
    error: "Invalid IFSC Code",
    required: true,
    slug: "ifsc_code",
    autoCapitalize: "characters",
    pattern: /[A-Za-z]{4}\d{7}$/
  },
  ACCOUNT_TYPE: {
    type: "dropdown",
    id: "accountType",
    slug: "acc_type",
    title: "Select Account Type",
    error: "Select Account Type",
    pattern: /^[a-z]{2,}$/,
    options: accountType,
    required: true
  },
  BANK_NAME: {
    id: "nameBank",
    type: "text",
    title: "Enter Bank Name",
    error: "Invalid Bank Name",
    pattern: /^[^]+$/,
    slug: "bank_name",
    autoCapitalize: "characters",
    disabled: true,
    required: true
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
    disabled: true
  },
  BRANCH_NAME: {
    type: "text",
    title: "Enter Branch Name",
    error: "Invalid Branch Name",
    id: "nameBranch",
    slug: "branch_name",
    pattern: /^[^]+$/,
    required: true,
    disabled: true
  }
};

const validationBusinessDetails = {
  COMPANY_NAME: {
    slug: "gstProfile",
    type: "text",
    title: "Company Legal Name",
    autoCapitalize: "characters",
    id: "companyName",
    pattern: /^[^]+$/,
    required: true,
    readOnly: true,
    disabled: true,
    error: "Invalid Company Name"
  },
  COMPANY_TYPE: {
    slug: "companytype",
    required: true,
    id: "companyType",
    pattern: /^[^]+$/,
    inputId: "companyType",
    options: BusinessType,
    error: "Invalid Company Type"
  },
  GST_NUMBER: {
    slug: "gst",
    type: "text",
    pattern: /^\d{2}[a-zA-Z]{5}\d{4}[a-zA-Z][a-zA-Z1-9][zZ][a-zA-Z0-9]$/,
    title: "Enter GST Number",
    autoCapitalize: "characters",
    id: "numberGST",
    required: true,
    error: "Invalid GST Number"
  },
  PAN_NUMBER: {
    slug: "bpan",
    type: "text",
    pattern: /^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]?$/,
    title: "Enter Business PAN",
    autoCapitalize: "characters",
    id: "numberPAN",
    required: true,
    readOnly: true,
    disabled: true,
    error: "Invalid Pan Number"
  },
  AVERAGE_TRANSACTION: {
    slug: "avgtrans",
    type: "text",
    pattern: /^[0-9]{5,10}$/,
    title: "Enter Average monthly Transactions",
    autoCapitalize: "characters",
    id: "avgTrans",
    required: true,
    error: "Invalid Transaction Amount"
  },
  DEALER_CODE: {
    slug: "dealercode",
    type: "text",
    pattern: /^[0-9A-Za-z]{4,10}$/,
    title: "Enter Dealer Code",
    autoCapitalize: "characters",
    id: "dealerCode",
    required: true,
    error: "Invalid Dealer Code"
  }
};

export {
  validationPersonalDetails,
  validationAdharPan,
  validationMobileOtp,
  validationBusinessDetails,
  bankValidations
};
