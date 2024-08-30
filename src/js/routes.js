import LoginPage from "../pages/login.f7";
import RegisterPage from "../pages/register.f7";

import HomePage from "../pages/home.f7";
import WordsPage from "../pages/words.f7";

import ProfilePage from "../pages/profile.f7";

import ViewWord from "../pages/view-word.f7";
import ViewEvent from "../pages/view-event.f7";

import GroupManagment from "../pages/group-managment.f7";
import createReport from "../pages/create-report.f7";

var routes = [
  {
    path: "/",
    component: LoginPage,
    on: {
      pageInit: function () {
        $.getScript("services/auth.js");
      },
    },
  },
  {
    path: "/register",
    component: RegisterPage,
    on: {
      pageInit: function () {
        $.getScript("services/register.js");
      },
    },
  },
  {
    path: "/home",
    component: HomePage,
    on: {
      pageInit: function () {
        $.getScript("services/home.js");
      },
      pageBeforeIn: function () {
        getAllFeed();
      },
    },
  },
  {
    path: "/profile",
    component: ProfilePage,
    on: {
      pageInit: function () {
        $.getScript("services/profile.js");
      },
      pageBeforeIn: function () {
        setUserDetails();
        getUserCellules();
      },
    },
  },
  {
    path: "/words",
    component: WordsPage,
    on: {
      pageInit: function () {
        $.getScript("services/words.js");
      },
      pageBeforeIn: function () {
        initialize();
      },
    },
  },
  {
    path: "/view-word/:wordId",
    component: ViewWord,
    on: {
      pageInit: function () {
        $.getScript("services/view_word.js");
      },
      pageBeforeIn: function () {
        const viewword3 = app.views.main;
        const currentRoute = viewword3.router.currentRoute;
        const wordid3 = currentRoute.params.wordid3;

        getWordById(wordid3);
      },
    },
  },
  {
    path: "/view-event/:eventId",
    component: ViewEvent,
    on: {
      pageInit: function () {
        $.getScript("services/view_event.js");
      },
      pageBeforeIn: function () {
        const teste4 = app.views.main;
        const currentRoute = teste4.router.currentRoute;
        const eventid3 = currentRoute.params.eventId;
        getEventById(eventid3);
      },
    },
  },
  {
    path: "/create-report/:reportId",
    component: createReport,
    on: {
      pageInit: function () {
        $.getScript("services/create-report.js");
      },
      pageBeforeIn: function () {
        const mainView = app.views.main;
        const currentRoute = mainView.router.currentRoute;
        const reportId = currentRoute.params.reportId;
        getReportDetails(reportId);
      },
    },
  },
  {
    path: "/group-managment/:groupId",
    component: GroupManagment,
    on: {
      pageInit: function () {
        $.getScript("services/group-managment.js");
      },
      pageBeforeIn: function () {
        const mainView = app.views.main;
        const currentRoute = mainView.router.currentRoute;
        const groupId = currentRoute.params.groupId;
        getGroupById(groupId);
        getRelatorys();
      },
    },
  },
];

export default routes;
