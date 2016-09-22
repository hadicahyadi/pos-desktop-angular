(function() {
  'use strict';

  angular
    .module('posapp')
    .service('settingService',['$http','BASE_URL',function ($http,BASE_URL){

    	this.getAll = function (itemsPerPage,pageNumber){
    		 return $http.get(BASE_URL+"/setting?itemsPerPage="+itemsPerPage+"&pageNumber="+pageNumber);
    	}

    	this.save = function(setting){
    		return  $http.put(BASE_URL+"/setting",setting);
    	}

    	this.remove = function(id){
    		return $http.post(BASE_URL+"/setting?id="+id);
    	}

    }]);

})();