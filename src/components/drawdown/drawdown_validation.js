export const drawdownValidation = {
  MOBILE_NUMBER: {
    slug: "mobile",
    type: "number",
    pattern: /^\d{10}$/,
    error: "Invalid Mobile Number",
    min: 1000000000,
    max: 9999999999,
    maxLength: 10,
    minLength: 10,
    title: "This field is required",
    id: "numberMobile",
    required: true
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
    required: false
  }
};
