var cordovaApp = {
  f7: null,

  handleSplashscreen: function () {
    var f7 = cordovaApp.f7;
    if (!window.navigator.splashscreen) return;
    setTimeout(() => {
      window.navigator.splashscreen.hide();
    }, 2000);
  },

  handleAndroidBackButton: function () {
    var f7 = cordovaApp.f7;
    const $ = f7.$;

    document.addEventListener(
      'backbutton',
      function (e) {
        if ($('.actions-modal.modal-in').length) {
          f7.actions.close('.actions-modal.modal-in');
          e.preventDefault();
          return false;
        }
        if ($('.dialog.modal-in').length) {
          f7.dialog.close('.dialog.modal-in');
          e.preventDefault();
          return false;
        }
        if ($('.sheet-modal.modal-in').length) {
          f7.sheet.close('.sheet-modal.modal-in');
          e.preventDefault();
          return false;
        }
        if ($('.popover.modal-in').length) {
          f7.popover.close('.popover.modal-in');
          e.preventDefault();
          return false;
        }
        if ($('.popup.modal-in').length) {
          if ($('.popup.modal-in>.view').length) {
            const currentView = f7.views.get('.popup.modal-in>.view');
            if (currentView && currentView.router && currentView.router.history.length > 1) {
              currentView.router.back();
              e.preventDefault();
              return false;
            }
          }
          f7.popup.close('.popup.modal-in');
          e.preventDefault();
          return false;
        }
        if ($('.login-screen.modal-in').length) {
          f7.loginScreen.close('.login-screen.modal-in');
          e.preventDefault();
          return false;
        }

        if ($('.page-current .searchbar-enabled').length) {
          f7.searchbar.disable('.page-current .searchbar-enabled');
          e.preventDefault();
          return false;
        }

        if ($('.page-current .card-expandable.card-opened').length) {
          f7.card.close('.page-current .card-expandable.card-opened');
          e.preventDefault();
          return false;
        }

        const currentView = f7.views.current;
        if (currentView && currentView.router && currentView.router.history.length > 1) {
          currentView.router.back();
          e.preventDefault();
          return false;
        }

        if ($('.panel.panel-in').length) {
          f7.panel.close('.panel.panel-in');
          e.preventDefault();
          return false;
        }
      },
      false,
    );
  },
  handleKeyboard: function () {
    var f7 = cordovaApp.f7;
    if (!window.Keyboard || !window.Keyboard.shrinkView) return;
    var $ = f7.$;
    window.Keyboard.shrinkView(false);
    window.Keyboard.disableScrollingInShrinkView(true);
    window.Keyboard.hideFormAccessoryBar(true);
    window.addEventListener('keyboardWillShow', () => {
      f7.input.scrollIntoView(document.activeElement, 0, true, true);
    });
    window.addEventListener('keyboardDidShow', () => {
      f7.input.scrollIntoView(document.activeElement, 0, true, true);
    });
    window.addEventListener('keyboardDidHide', () => {
      if (document.activeElement && $(document.activeElement).parents('.messagebar').length) {
        return;
      }
      window.Keyboard.hideFormAccessoryBar(false);
    });
    window.addEventListener('keyboardHeightWillChange', (event) => {
      var keyboardHeight = event.keyboardHeight;
      if (keyboardHeight > 0) {
        // Keyboard is going to be opened
        document.body.style.height = `calc(100% - ${keyboardHeight}px)`;
        $('html').addClass('device-with-keyboard');
      } else {
        // Keyboard is going to be closed
        document.body.style.height = '';
        $('html').removeClass('device-with-keyboard');
      }
    });
    $(document).on(
      'touchstart',
      'input, textarea, select',
      function (e) {
        var nodeName = e.target.nodeName.toLowerCase();
        var type = e.target.type;
        var showForTypes = ['datetime-local', 'time', 'date', 'datetime'];
        if (nodeName === 'select' || showForTypes.indexOf(type) >= 0) {
          window.Keyboard.hideFormAccessoryBar(false);
        } else {
          window.Keyboard.hideFormAccessoryBar(true);
        }
      },
      true,
    );
  },
  init: function (f7) {
    cordovaApp.f7 = f7;

    document.addEventListener('deviceready', () => {
      cordovaApp.handleAndroidBackButton();

      cordovaApp.handleSplashscreen();

      cordovaApp.handleKeyboard();
    });
  },
};

export default cordovaApp;
