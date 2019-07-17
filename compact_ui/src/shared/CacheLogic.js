// import React from "react";

const CACHE_NAME = "MOVIEDB_CACHE";

// let showSnackbary = '';

export function getUrlCache() {
  return sessionStorage.getItem(CACHE_NAME !== null)
    ? JSON.parse(sessionStorage.getItem(CACHE_NAME))
    : [];
}

export function isCached(url) {
  var urlCache = getUrlCache();

  return urlCache.indexOf(url) !== -1;
}

export function setCached(url) {
  if (isCached(url)) return false;

  var urlCache = getUrlCache();

  urlCache.push(url);

  sessionStorage.setItem(CACHE_NAME, urlCache);

  return true;
}

export function removeCached(url) {
  var urlCache,
    myCache = getUrlCache();

  var index = myCache.indexOf(url);

  if (index !== -1) {
    myCache = myCache.splice(index, 1);

    sessionStorage.setItem(CACHE_NAME, urlCache);

    return true;
  } else {
    return false;
  }
}

export function getObject(name) {
  try {
    let value = JSON.parse(localStorage.getItem(name));

    return (value !== undefined || value !== null) && value;
  } catch (e) {
    return null;
  }
}

export function setObject(name, data) {
  try {
    localStorage.setItem(name, JSON.stringify(data));

    return true;
  } catch (e) {
    return false;
  }
}

/*

export const showSnackbar = (message) => {

    let html = (<button style={{visibility: 'hidden'}} type={"button"} ref={ref => showSnackbary = ref}
                        data-toggle='snackbar'
                        data-content={message}>.</button>);
    // showSnackbary.click();
    console.log(showSnackbary);
    return html;
};*/
