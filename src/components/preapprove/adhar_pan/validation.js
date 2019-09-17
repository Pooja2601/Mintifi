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
    pattern: /^[a-zA-Z]{3}[pP][a-zA-Z]{1}([0-9]){4}[a-zA-Z]{1}?$/,
    required: true,
    autoCapitalize: "characters",
    autoComplete: "off",
    minLength: 10,
    maxLength: 10,
    error: "Please Enter Right PAN Number",
    id: "numberPAN"
  },
  ADHAR_NUMBER: {
    slug: "adhar",
    type: "number",
    pattern: /^[0-9]{12}$/,
    title: "This field is required",
    autoComplete: "off",
    maxLength: 12,
    minLength: 12,
    error: "Please Enter Right Adhar Number",
    id: "numberAdhar"
  }
};

const validationMobileOtp = {
  MOBILE_NUMBER: {
    slug: "mobile",
    type: "number",
    pattern: /^[0-9]{10}$/,
    title: "This field is required",
    min: 1000000000,
    max: 9999999999,
    maxLength: 10,
    minLength: 10,
    required: true,
    readOnly: true,
    disabled: true,
    error: "Please Enter Right Mobile Number",
    id: "numberMobile"
  },
  VERIFY_OTP: {
    slug: "otp",
    type: "number",
    pattern: /^[0-9]{6}$/,
    title: "This field is required",
    min: 100000,
    max: 999999,
    error: "Please Enter Right Otp",
    id: "otpVerify"
  }
};

export { validationPersonalDetails, validationAdharPan, validationMobileOtp };
