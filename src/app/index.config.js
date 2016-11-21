(function() {
  'use strict';

  angular
    .module('posapp')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig,$httpProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.autoDismiss = true;
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-center';
    toastrConfig.preventOpenDuplicates = true;
    toastrConfig.preventDuplicates = false;
    toastrConfig.progressBar = false;
    toastrConfig.target = 'body';

    $httpProvider.interceptors.push(function($q) {
        return {
          responseError: function(rejection) {
                if(rejection.status <= 0) {
                    // toastr.error('Connection Refused, Make Sure Server is Live','Failed');
                    alert('Connection Refused, Make Sure Server is Live');
                    return rejection;
                }
                return $q.reject(rejection);
            }
        };
    });

  }

})();
