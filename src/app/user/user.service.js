(function() {
  'use strict';

  angular
    .module('posapp')
    .service('userService',['$http','BASE_URL','md5',function ($http,BASE_URL,md5){

    	this.getAll = function (itemsPerPage,pageNumber){
    		 return $http.get(BASE_URL+"/user?itemsPerPage="+itemsPerPage+"&pageNumber="+pageNumber);
    	}

    	this.save = function(user){
            user.password = md5.createHash(user.password || '');
    		return  $http.put(BASE_URL+"/user",user);
    	}

    	this.remove = function(id){
    		return $http.post(BASE_URL+"/user?id="+id);
    	}

    }]);

})();