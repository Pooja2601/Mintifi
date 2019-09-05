(function() {
  "use strict";

  // Creates a container for Popup
  document.addEventListener("dispatchMintifiPay", function(obj) {
    const { token, code_mode, payload, section } = obj.detail;
    // const encPayload = window.btoa(payload);

    let options = {
      //default environment 'stage' (sandbox)
      environment: code_mode === "prod" ? "production" : "stage", // 'production' , 'stage' ,
      section: section, //  'aip' , 'drawdown' , 'enach'
      callback: function(t) {
        let event = new CustomEvent("responseMintifiPay", {
          detail: t
        });
        document.dispatchEvent(event);
      },
      logo: "https://mintifi.com/images/logo.png", //Pass Logo URL here
      is_iframe: true //open in popup-iframe or else seperate window
    };
    let mintifiPay = new Mintifi(options);
    mintifiPay.init(); // Call init on user action (eg.button press and proceed to asynchronous upload)
    mintifiPay.submit(token, payload, section);
  });

  var CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  var CONSTANTS = {
    VERSION: "8.0",
    ENVIRONMENTS: {
      STAGE: "stage",
      SANDBOX: "sandbox",
      PRODUCTION: "production"
    },
    SIGN_METHODS: {
      OTP: "otp",
      BIOMETRIC: "biometric"
    },
    URLS: {
      //STAGE : "http://test.pay.mintifi.com",
      STAGE: "http://192.168.43.108:3000",
      SANDBOX: "http://192.168.43.108:3000",
      // SANDBOX: "http://test.pay.mintifi.com",
      PRODUCTION: "https://pay.mintifi.com",
      PREAPPROVE: "/preapprove/token",
      ENACH: "/enach",
      DRAWDOWN: "/drawdown/token"
    },
    EXCEPTIONS: {
      MISSING_CONSTRUCTOR_CONFIG: {
        message:
          "Mintifi constructor requires configuration options for initialization."
      },
      INVALID_SECTION: {
        message:
          "Provided section value is invalid. Possible values: `aip`, `drawdown`, `enach`"
      },
      INVALID_ENVIRONMENT: {
        message:
          "Provided environment value is invalid. Possible values: `prod`, `dev`"
      },
      INVALID_METHOD: {
        message: "Provided signing method value is invalid."
      },
      INVALID_IDENTIFIER: {
        message: "Provided email id or mobile number is invalid."
      },
      INVALID_REDIRECT_URL: {
        message: "Provided redirect url string is invalid."
      },
      INVALID_ERROR_URL: {
        message: "Provided error url string is invalid."
      },
      INVALID_LOGO_URL: {
        message: "Provided logo url is invalid."
      },
      INVALID_CALLBACK_METHOD: {
        message: "Provided callback method is not a function or is invalid."
      },
      INVALID_IFRAME_INVOCATION: {
        message: "Provided iframe invocation value is invalid or not a boolean."
      },
      INVALID_TOKEN: {
        message: "Invalid TOKEN provided, it could've been expired."
      },
      INVALID_BASE64_PAYLOAD: {
        message: "Invalid Base64 Payload provided,."
      }
    },
    THEME: {
      PRIMARY_COLOR: "#00bfa5",
      SECONDARY_COLOR: "#FFFFFF"
    },
    CLOSE_BTN_BASE64:
      "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAA60lEQVR42tXUPQqEMBAFYO+kYGFhYeFaWAm2qYyFlxBsraxELCzF1ip4Br2CR5klCyuLyeRni4UNTPf4ILxhHOfv3jzPMAwD6HJd1wFjTJ2r6xpc131NWZZoOMuyKzeOozzXtu0VUqGf2HuWZRHRKIqE4B2VYXwIISI4TZM0zIdSChjmeR5s2yb/dt/3KIph67qqizFFjTBT1ArTlcQnz3M7DCtAt1JfY8aoDaZFi6JQFqAqqmkaEU3TVNsmhlZVJYLHcUAQBNrVuKNxHMN5nvJv7/sOYRiC7/vKPePnjWNJkuCY7QOAx08O9BNR9VtE5qAr5wAAAABJRU5ErkJggg=="
  };

  var MintifiException = function(err) {
    this.message = err.message;
    this.name = "MintifiException";
  };

  MintifiException.prototype.toString = function() {
    return this.name + ': "' + this.message + '"';
  };

  var mintifiService = {
    validPayload: function(payload) {
      let decodeObj = payload;
      if (!payload) {
        throw new MintifiException(
          CONSTANTS.EXCEPTIONS.INVALID_BASE64_PAYLOAD + " : Payload Missing"
        );
      }
      /* if (typeof payload !== "string")
        throw new MintifiException(CONSTANTS.EXCEPTIONS.INVALID_BASE64_PAYLOAD); */

      if (decodeObj !== Object(decodeObj) && decodeObj.length)
        throw new MintifiException(CONSTANTS.EXCEPTIONS.INVALID_BASE64_PAYLOAD);
    },
    validateToken: function(token) {
      if (!token) {
        throw new MintifiException(
          CONSTANTS.EXCEPTIONS.INVALID_TOKEN + " : TOKEN Missing"
        );
      }
      if (typeof token !== "string")
        throw new MintifiException(CONSTANTS.EXCEPTIONS.INVALID_TOKEN);
    },
    generateUrl: function(
      base_url,
      base_suffix,
      token,
      payload,
      extendedConfig
    ) {
      var suffix =
        base_suffix == "aip"
          ? CONSTANTS.URLS.PREAPPROVE
          : base_suffix == "drawdown"
          ? CONSTANTS.URLS.DRAWDOWN
          : CONSTANTS.URLS.ENACH;
      var url = base_url + suffix;
      url += "/" + token;
      url += "/" + payload;

      // console.log(extendedConfig.section);
      console.log(url);
      return url;
    },

    btoa: function(input = "") {
      let str = JSON.stringify(input);
      let output = "";
      // console.log(JSON.stringify(str));

      for (
        let block = 0, charCode, i = 0, map = CHARS;
        str.charAt(i | 0) || ((map = "="), i % 1);
        output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
      ) {
        charCode = str.charCodeAt((i += 3 / 4));

        if (charCode > 0xff) {
          throw new Error(
            "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
          );
        }
        block = (block << 8) | charCode;
      }
      return output;
    },

    atob: function(input = "") {
      let str = input.replace(/=+$/, "");
      let output = "";

      if (str.length % 4 === 1) {
        throw new Error(
          "'atob' failed: The string to be decoded is not correctly encoded."
        );
      }
      for (
        let bc = 0, bs = 0, buffer, i = 0;
        (buffer = str.charAt(i++));
        ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
          ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
          : 0
      ) {
        buffer = CHARS.indexOf(buffer);
      }

      return output;
    },
    detectIE: function() {
      var ua = window.navigator.userAgent,
        msie = ua.indexOf("MSIE ");
      if (msie > 0)
        return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
      var trident = ua.indexOf("Trident/");
      if (trident > 0) {
        var rv = ua.indexOf("rv:");
        return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
      }
      var edge = ua.indexOf("Edge/");
      return (
        edge > 0 && parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10)
      );
    }
  };

  var mintifiHandle = (window.Mintifi = function(t) {
    // console.log(t.section);
    if (!t) {
      throw new MintifiException(
        CONSTANTS.EXCEPTIONS.MISSING_CONSTRUCTOR_CONFIG
      );
    }
    if (t.callback) {
      if (typeof t.callback !== "function") {
        throw new MintifiException(
          CONSTANTS.EXCEPTIONS.INVALID_CALLBACK_METHOD
        );
      }
      this.callback = t.callback;
    }
    if (t.section) {
      if (t.section == "aip" || t.section == "enach" || t.section == "drawdown")
        this.section = t.section;
      else {
        throw new MintifiException(CONSTANTS.EXCEPTIONS.INVALID_SECTION);
      }
    }

    // console.log(this.section);
    if (t.environment) {
      if (
        t.environment === CONSTANTS.ENVIRONMENTS.STAGE ||
        t.environment === CONSTANTS.ENVIRONMENTS.PRODUCTION
      ) {
        this.environment = t.environment;
      } else {
        throw new MintifiException(CONSTANTS.EXCEPTIONS.INVALID_ENVIRONMENT);
      }
    }
    if (t.token) {
      if (typeof t.token !== "string")
        throw new MintifiException(CONSTANTS.EXCEPTIONS.INVALID_TOKEN);
      this.token = t.token;
    }
    if (t.payload) {
      if (typeof t.payload !== "string")
        throw new MintifiException(CONSTANTS.EXCEPTIONS.INVALID_BASE64_PAYLOAD);
      this.payload = t.payload;
    }
    if (t.logo) {
      if (typeof t.logo !== "string") {
        throw new MintifiException(CONSTANTS.EXCEPTIONS.INVALID_LOGO_URL);
      }
      this.logo = t.logo;
    }
    if (t.method) {
      if (
        t.method === CONSTANTS.SIGN_METHODS.OTP ||
        t.method === CONSTANTS.SIGN_METHODS.BIOMETRIC
      ) {
        this.method = t.method;
      } else {
        throw new MintifiException(CONSTANTS.EXCEPTIONS.INVALID_METHOD);
      }
    }
    if (t.redirect_url) {
      if (typeof t.redirect_url !== "string") {
        throw new MintifiException(CONSTANTS.EXCEPTIONS.INVALID_REDIRECT_URL);
      }
      this.redirectUrl = t.redirect_url;
    }
    if (t.error_url) {
      if (typeof t.error_url !== "string") {
        throw new MintifiException(CONSTANTS.EXCEPTIONS.INVALID_ERROR_URL);
      }
      this.errorUrl = t.error_url;
    }
    if (t.is_iframe) {
      if (typeof t.is_iframe !== "boolean") {
        throw new MintifiException(
          CONSTANTS.EXCEPTIONS.INVALID_IFRAME_INVOCATION
        );
      }
      this.isIframe = t.is_iframe;
    }
    if (t.theme) {
      this.theme = {};
      if (t.theme.primaryColor) {
        this.theme.PRIMARY_COLOR = t.theme.primaryColor;
      } else {
        this.theme.PRIMARY_COLOR = CONSTANTS.THEME.PRIMARY_COLOR;
      }
      if (t.theme.secondaryColor) {
        this.theme.SECONDARY_COLOR = t.theme.secondaryColor;
      } else {
        this.theme.SECONDARY_COLOR = CONSTANTS.THEME.SECONDARY_COLOR;
      }
    } else {
      this.theme = CONSTANTS.THEME;
    }
    for (var env in CONSTANTS.ENVIRONMENTS) {
      mintifiHandle.prototype.URL[CONSTANTS.ENVIRONMENTS[env]] =
        CONSTANTS.URLS[env];
    }
  });

  mintifiHandle.prototype = {
    version: CONSTANTS.VERSION,
    environment: CONSTANTS.ENVIRONMENTS.STAGE,
    method: CONSTANTS.SIGN_METHODS.OTP,
    URL: {},
    logo: null,
    payload: null,
    token: null,
    section: "aip",
    redirectUrl: null,
    errorUrl: null,
    isIframe: false,
    documentId: null,
    txnId: null,
    popup: null,
    lastState: null,
    resultCaptured: false,
    result: null,
    iFrameId: null,
    iFrameObj: null,
    theme: {},

    callback: function(msg) {},
    getLoadingHtml: function(themecolor) {
      var theme = this.theme;
      var style =
        "<style>@-webkit-keyframes placeHolderShimmer{0%{background-position: -1000px 0}100%{background-position: 1000px 0}}@keyframes placeHolderShimmer{0%{background-position: -1000px 0}100%{background-position: 1000px 0}}.animated-background{z-index: 999;-webkit-animation-duration: 20s; animation-duration: 20s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards; -webkit-animation-iteration-count: infinite; animation-iteration-count: infinite; -webkit-animation-name: placeHolderShimmer; animation-name: placeHolderShimmer; -webkit-animation-timing-function: linear; animation-timing-function: linear; background: transparent; background: -webkit-gradient(linear, left top, right top, color-stop(28%, transparent), color-stop(68%, " +
        theme.SECONDARY_COLOR +
        "14), color-stop(92%, transparent)); background: -webkit-linear-gradient(left, transparent 28%, #" +
        theme.SECONDARY_COLOR +
        "14 68%, transparent 92%); background: linear-gradient(to right, transparent 28%, #" +
        theme.SECONDARY_COLOR +
        "14 68%, transparent 92%); -webkit-background-size: 100% 100%; background-size: 100% 100%; height: 100%; width : 100%; top : 0; position: absolute;}</style>";

      var html =
        style +
        "<div class='animated-background'></div><div style=\"background: " +
        theme.PRIMARY_COLOR +
        ';position: relative; height: 100%; width: 100%;"><div style="position: absolute;width: 100%;height: 20px;top: 20%;text-align: center;color: ' +
        theme.SECONDARY_COLOR +
        ';font-weight: 300;font-family: Helvetica;"> Live paperless with Mintifi </div><div style="position: absolute;width: 100%;height: 20px;top: calc(50% - 20px);text-align: center;font-weight: 300;color: ' +
        theme.SECONDARY_COLOR +
        ';font-family: Helvetica;font-size: 85%;"> Please wait... </div><div style="position: absolute;width: 100%;height: 20px;top: calc(50%);text-align: center;color: ' +
        theme.SECONDARY_COLOR +
        ';font-weight: 300;font-family: Helvetica;font-size: 85%;"> Preparing your document </div><div style="position: absolute;bottom: 7px;width: 100%;font-family: Helvetica;color: ' +
        theme.SECONDARY_COLOR +
        ';font-size: 65%; text-align: center; font-weight : 300;"> Licensed application for <br/> Payment via Mintifi in the form of Loan </div></div>';
      return html;
    },
    reset: function() {
      this.result = null;
      this.popup = null;
      this.token = null;
      this.payload = null;
      this.section = null;
      this.interval = null;
      this.resultCaptured = false;
      this.lastState = null;
      this.iFrameId = null;
      this.iFrameObj = null;
    },
    receiveMessage: function(event) {
      var data;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        data = event.data;
      }
      if (typeof data !== "object") {
        return;
      }
      if (
        data !== undefined &&
        data.action !== undefined &&
        data.action === "close" &&
        data.popup !== undefined &&
        data.popup === "iframe"
      ) {
        this.cancel();
      }

      // if(data.action === 'close' && event.origin === this.URL[this.environment]){
      if (data.action === "close") {
        // console.log(event.data);
        this.resultCaptured = true;
        this.result = data;
        this.iFrameObj.closed = true;
        this.popup.close();
        document.body.removeChild(
          document.getElementById("parent" + this.iFrameId)
        );
        return this;
      }

      // if(data.action === 'continue' && event.origin === this.URL[this.environment]){
      if (data.action === "continue") {
        this.resultCaptured = true;
        this.result = data;
      }
    },
    init: function() {
      this.reset();
      var isIE = mintifiService.detectIE(),
        newWidth = Math.max(
          isIE ? 0.4 * window.innerWidth : 0.35 * screen.width,
          600
        ),
        newHeight = Math.max(
          isIE ? 0.9 * window.innerHeight : 0.7 * screen.height,
          630
        ),
        left = isIE ? 0.25 * window.innerWidth : 0.33 * screen.width,
        top = 0.15 * (isIE ? window.innerHeight : screen.height);
      top = (isIE ? window.innerHeight : screen.height) * 0.03;
      var that = this;
      if (this.isIframe) {
        this.iFrameId = "mintifi-ifm-" + Date.now();

        var iframeContainer = document.createElement("div");
        iframeContainer.setAttribute("id", "parent" + this.iFrameId);
        iframeContainer.style.cssText =
          "position: fixed; min-width: 450px; overflow: auto; z-index : 999999; width : 100%; height : 100%; " +
          "background : rgba(0,0,0,0.6); left: 0; top : 0; " +
          " text-align:center;";
        document.body.appendChild(iframeContainer);

        var iframeWrapper = document.createElement("div");
        iframeWrapper.setAttribute("id", "wrapper" + this.iFrameId);
        iframeWrapper.style.cssText =
          "position: absolute; min-width: 550px; overflow: auto; z-index : 999999; width : " +
          newWidth +
          "px; height : " +
          newHeight +
          "px; background : white; left: calc(50% - " +
          newWidth / 2 +
          "px); top : " +
          top +
          "px; " +
          "text-align:center; border-radius: 5px;";
        iframeContainer.appendChild(iframeWrapper);

        var closeIframeBtn = document.createElement("img");
        closeIframeBtn.style.cssText =
          "position: absolute;right: 5px;height: 14px;width: 14px;top: 7px;cursor: pointer;";
        closeIframeBtn.setAttribute(
          "src",
          "data:image/gif;base64," + CONSTANTS.CLOSE_BTN_BASE64
        );
        closeIframeBtn.onclick = function() {
          var iframe = window.document.getElementById("parent" + that.iFrameId);
          iframe.parentNode.removeChild(iframe);
          that.popup = null;
        };
        iframeWrapper.appendChild(closeIframeBtn);

        var centreTextEl = document.createElement("span");
        centreTextEl.style.cssText =
          "position: absolute; left: calc(50% - 50px); width : 100px; top: 8px; font-size: 12px; color: gray; text-decoration: underline;";
        centreTextEl.innerHTML =
          "<span>Powered By <a href='https://www.mintifi.com' target='_blank' style='color: #0261b0'>Mintifi</a></span>";
        iframeWrapper.appendChild(centreTextEl);

        var contentLoader = document.createElement("div");
        contentLoader.style.cssText =
          "position: absolute; height: calc(100% - 40px) ;width: 100%; top : 40px; left : 0; margin : 0;z-index: 9999999;";
        contentLoader.innerHTML = that.getLoadingHtml(that.logo, true);
        contentLoader.setAttribute("id", "mpl-ldr-" + this.iFrameId);
        iframeWrapper.appendChild(contentLoader);

        var iframe = document.createElement("iframe");
        iframe.style.cssText =
          "position: absolute; min-width: 450px; overflow: auto; z-index : 999999; width : 100%; height : calc(100% - 40px); background : white; left: 0; top : 40px; " +
          "border: 0; text-align:center;";
        iframe.setAttribute("id", this.iFrameId);
        iframe.setAttribute("src", "");
        iframeWrapper.appendChild(iframe);
        this.iFrameObj = iframe;
        this.popup =
          iframe.contentWindow || window.frames[window.frames.length - 1];
        this.isIframe = true;
      } else {
        this.popup = window.open(
          "",
          "",
          "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=1,width=" +
            newWidth +
            ",height=" +
            newHeight +
            ",top=" +
            top +
            ", left=" +
            left
        );
        this.popup.document.body.style.margin = 0;
        this.popup.document.body.style.padding = 0;
        this.popup.document.body.innerHTML = that.getLoadingHtml(
          that.logo,
          false
        );
      }
      try {
        window.addEventListener(
          "message",
          function(e) {
            that.receiveMessage(e);
          },
          false
        );
      } catch (e) {
        window.attachEvent("onmessage", function(e) {
          that.receiveMessage(e);
        });
      }
      var interval = window.setInterval(function() {
        var resObj = {};
        try {
          if (that.isIframe && that.iFrameObj.closed) {
            if (interval !== undefined) {
              window.clearInterval(interval);
            }
            if (that.resultCaptured) {
              if (self.lastState !== undefined) {
                if (self.lastState.hasOwnProperty("result")) {
                  delete self.lastState.result;
                }
                self.result.last_state = self.lastState;
              }
              that.callback(that.result);
            } else {
              resObj = {
                loan_id: that.documentId,
                error_code: "CANCELLED",
                message: "Payment Gateway Cancelled"
              };
              if (that.lastState !== undefined) {
                resObj.last_state = that.lastState;
              }
              that.callback(resObj);
            }
          } else if (that.popup == null || that.popup.closed) {
            if (interval !== undefined) {
              window.clearInterval(interval);
            }
            if (that.resultCaptured) {
              if (self.lastState !== undefined) {
                if (self.lastState.hasOwnProperty("result")) {
                  delete self.lastState.result;
                }
                self.result.last_state = self.lastState;
              }
              that.callback(that.result);
            } else {
              resObj = {
                loan_id: that.documentId,
                error_code: "CANCELLED",
                message: "Payment Gateway Cancelled"
              };
              if (that.lastState !== undefined) {
                resObj.last_state = that.lastState;
              }
              that.callback(resObj);
            }
          }
        } catch (e) {
          throw e;
        }
      }, 1000);
    },
    getOptionValues: function(option) {
      option = option.toUpperCase();
      if (CONSTANTS.hasOwnProperty(option)) {
        return Object.values(CONSTANTS[option]);
      }
    },
    submit: function(token, payload, section) {
      try {
        mintifiService.validateToken(token);
        mintifiService.validPayload(payload);
        return this.eLoanMintifi(token, payload, section);
      } catch (err) {
        console.error(err);
      }
    },
    eLoanMintifi: function(token, payload, section) {
      if (this.isIframe) {
        var ldr = document.getElementById("mpl-ldr-" + this.iFrameId);
        ldr.parentNode.removeChild(ldr);
      }

      if (this.popup === undefined) {
        this.init();
      }

      this.token = token;
      this.section = section;

      /*      this.token =
        token &&
        Math.random()
          .toString(36)
          .slice(2);*/

      this.payload = mintifiService.btoa(payload);

      var extendedConfig = {
        ver: this.version,
        logo: this.logo,
        redirectUrl: this.redirectUrl,
        errorUrl: this.errorUrl,
        method: this.method,
        isIframe: this.isIframe,
        theme: this.theme,
        section: this.section
      };

      console.log(this.section);

      this.popup.location = mintifiService.generateUrl(
        this.URL[this.environment],
        this.section,
        this.token,
        this.payload,
        extendedConfig
      );
    },

    cancel: function() {
      var that = this;
      if (that.popup !== undefined) {
        try {
          if (!that.isIframe) {
            that.popup.close();
          } else {
            var iframe = window.document.getElementById(
              "parent" + that.iFrameId
            );
            iframe.parentNode.removeChild(iframe);
            that.popup = null;
          }
        } catch (e) {
          that.popup = null;
        }
      }
    }
  };

  String.prototype.format = function(args) {
    var str = this;
    return str.replace(String.prototype.format.regex, function(item) {
      var intVal = parseInt(item.substring(1, item.length - 1));
      var replace;
      if (intVal >= 0) {
        replace = args[intVal];
      } else if (intVal === -1) {
        replace = "{";
      } else if (intVal === -2) {
        replace = "}";
      } else {
        replace = "";
      }
      return replace;
    });
  };

  String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");
})();
