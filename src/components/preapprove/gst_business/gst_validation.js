import { BusinessType } from "../../../shared/constants";

export const validationBusinessDetails = {
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
    pattern: /^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d][Z][A-Z\d]$/,
    title: "Please enter GST Number",
    autoCapitalize: "characters",
    id: "numberGST",
    required: true,
    error: "Invalid GST Number"
  },
  PAN_NUMBER: {
    slug: "bpan",
    type: "text",
    pattern: /^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]?$/,
    title: "Please enter Business PAN",
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
