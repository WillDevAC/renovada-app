import Framework7, { getDevice } from "framework7/bundle";

import "framework7/css/bundle";

import "../css/icons.less";
import "../css/app.less";
import "../css/global.less";

import "../css/ui/login.less";
import "../css/ui/header.less";

import "../css/ui/words.less";
import "../css/ui/view-word.less";
import "../css/ui/view-event.less";

import "../css/ui/group-managment.less";

import "../css/ui/categories.less";
import "../css/ui/profile.less";

import "../css/ui/create-report.less";

import cordovaApp from "./cordova-app.js";
import routes from "./routes.js";
import App from "../app.f7";

import jQuery from "jquery";

import header from "../components/header.f7";

window.jQuery = jQuery;
window.$ = jQuery;

var device = getDevice();

var app = new Framework7({
  name: "RENOVADA",
  theme: "ios",
  darkMode: true,
  el: "#app",
  component: App,
  routes: routes,
  input: {
    scrollIntoViewOnFocus: device.cordova,
    scrollIntoViewCentered: device.cordova,
  },
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        cordovaApp.init(f7);
      }
    },
  },
});

Framework7.registerComponent("renovada-header", header);

window.app = app;
