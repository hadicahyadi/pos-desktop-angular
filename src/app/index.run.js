(function() {
  'use strict';

  angular
    .module('posapp')
    .run(runBlock);

  // * @ngInject 
  function runBlock($rootScope,$state,$cookies,authenticationService) {

    $rootScope.$on('$viewContentLoaded', function(event, next) {
      componentHandler.upgradeAllRegistered();
    });

    var mdlUpgradeDom = false;
    setInterval(function() {
      if (mdlUpgradeDom) {
        componentHandler.upgradeDom();
        mdlUpgradeDom = false;
      }
    }, 200);

    var observer = new MutationObserver(function () {
      mdlUpgradeDom = true;
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    $rootScope.$on("$stateChangeStart",function(event, toState, toParams, fromState, fromParams) {
       
        if (toState.authenticate && authenticationService.isLoggedIn() == null) {
          $state.go("login");
          event.preventDefault();
        }
    });
  }


})();
