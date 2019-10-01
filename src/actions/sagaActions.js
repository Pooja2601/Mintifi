export const sagaTypes = {
  GST_PROFILE_TRIGGER: "GST_PROFILE_TRIGGER"
};

export const fetchGstProfile = gstProfile => ({
  type: sagaTypes.GST_PROFILE_TRIGGER,
  gstProfile
});
console.log("action called");
