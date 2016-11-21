/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('posapp')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('BASE_URL', 'http://localhost:8080/pos/api')
    .constant('PAGE_SIZE', 10);
    // .constant('BASE_URL', 'http://192.168.0.111:8080/pos/api');

})();
