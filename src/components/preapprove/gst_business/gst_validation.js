export const validationBusinessDetails = {
  COMPANY_NAME: {
    slug: "gstProfile",
    type: "text",
    title: "Company Legal Name",
    autoCapitalize: "characters",
    id: "companyName",
    required: true,
    readOnly: true,
    disabled: true
  },
  COMPANY_TYPE: {
    slug: "companytype",
    required: true,
    id: "companyType",
    inputId: "companyType"
  },
  GST_NUMBER: {
    slug: "gst",
    type: "text",
    pattern: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,
    title: "Please enter GST Number",
    autoCapitalize: "characters",
    id: "numberGST",
    required: true
  },
  PAN_NUMBER: {
    slug: "bpan",
    type: "text",
    pattern: /^[a-zA-Z]{5}([0-9]){4}[a-zA-Z]{1}?$/,
    title: "Please enter Business PAN",
    autoCapitalize: "characters",
    id: "numberPAN",
    required: true,
    readOnly: true,
    disabled: true
  },
  AVERAGE_TRANSACTION: {
    slug: "avgtrans",
    type: "text",
    pattern: /^[0-9]{5,10}$/,
    title: "Enter Average monthly Transactions",
    autoCapitalize: "characters",
    id: "avgTrans",
    required: true
  },
  DEALER_CODE: {
    slug: "dealercode",
    type: "text",
    pattern: /^[0-9A-Za-z]{4,}$/,
    title: "Enter Dealer Code",
    autoCapitalize: "characters",
    id: "dealerCode",
    required: true
  }
};
