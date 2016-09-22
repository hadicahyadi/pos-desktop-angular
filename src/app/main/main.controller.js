(function() {
  'use strict';

  angular
    .module('posapp')
    .controller('MainController',['$scope','$cookies','$location', MainController]);

  /** @ngInject */
  function MainController($scope,$cookies, $location) {

    $scope.user = angular.fromJson($cookies.get('user'));

    $scope.logout = function logout(){
      var cookies = $cookies.getAll();
      angular.forEach(cookies, function (v, k) {
        $cookies.remove(k);
      });
      $location.path('/login');
    }
  }
})();
