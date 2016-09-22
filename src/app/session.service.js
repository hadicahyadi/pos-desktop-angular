(function() {
  'use strict';

  angular
    .module('posapp')
    .service('sessionService',['$http','BASE_URL','$cookies',function ($http,BASE_URL,$cookies){

        this.getAll = function (){
             return $http.get(BASE_URL+"/session/getSessionAttribute");
        }

        this.reloadAttribute = function(){
            this.getAll().success(function(response){
                $cookies.remove('sessionAttribute');
                $cookies.put('sessionAttribute',JSON.stringify(response));
            });
        }

    }]);

})();