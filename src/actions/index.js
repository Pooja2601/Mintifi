export const types = {
    CHECK_USER_EXISTS: "CHECK_USER_EXISTS",
    PAN_ADHAR: "PAN_ADHAR",
    FETCH_AUTH: "FETCH_AUTH",
    FETCH_AUTH_SUCCESS: "FETCH_AUTH_SUCCESS",
    FETCH_POSTS: "FETCH_POSTS",
    FETCH_POSTS_SUCCESS: "FETCH_POSTS_SUCCESS",
    FETCH_UPCOMING: "FETCH_UPCOMING",
    FETCH_UPCOMING_SUCCESS: "FETCH_UPCOMING_SUCCESS",
    SORT_UPCOMING: "SORT_UPCOMING",
    FILTER_UPCOMING: "FILTER_UPCOMING"
};

export const checkExists = existing => ({
    type: types.CHECK_USER_EXISTS,
    existing
});

// export const setPan = pan => ({type.})

export const pan_adhar = (pan, adhar) => ({
    type: types.PAN_ADHAR,
    pan, adhar
});

export const setAuth = (mobile, otp) => ({
    type: types.FETCH_AUTH, mobile,
    otp,
});

export const fetchUpcoming = () => ({type: types.FETCH_UPCOMING});

export const filterUpcoming = query => ({type: types.FILTER_UPCOMING, query});

export const sortUpcoming = (method, order) => ({
    type: types.SORT_UPCOMING,
    method,
    order
});

export const fetchPosts = query => ({type: types.FETCH_POSTS, query});

export const fetchPost = id => ({type: types.FETCH_POST, id});

export const sortArr = (action, state) => {
    let tempArr = [...state.upcome];
    let {method, order} = action;

    if (method === "alpha")
        if (order === "asc")
            tempArr.sort((a, b) => (a.title > b.title) - (a.title < b.title));
        else tempArr.sort((a, b) => (a.title < b.title) - (a.title > b.title));

    if (method === "year")
        if (order === "asc")
            tempArr.sort((a, b) => {
                return (
                    (a.release_date > b.release_date) - (a.release_date < b.release_date)
                );
            });
        else
            tempArr.sort((a, b) => {
                return (
                    (a.release_date < b.release_date) - (a.release_date > b.release_date)
                );
            });
    // console.log(tempArr);
    return tempArr;
};

export const filterArr = (action, state) => {
    let titleStr, yearStr;
    return state.upcome.filter(val => {
        titleStr = val.title.toLowerCase();
        yearStr = val.release_date.toLowerCase();
        return titleStr.includes(action.query) || yearStr.includes(action.query);
    });
};
