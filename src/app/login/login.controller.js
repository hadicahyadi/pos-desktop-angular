(function() {
	'use strict';

	angular
	.module('posapp')
	.controller('LoginController',['$scope','$log','authenticationService','sessionService','$timeout','md5','$location','$cookies', LoginController]);

	/** @ngInject */
	function LoginController($scope,$log,authenticationService,sessionService,$timeout,md5,$location,$cookies) {
		
		var vm = this;

		vm.error = null;
		vm.isError = false;
		vm.username = null;
		vm.password = null;
		vm.barShow = false;

		vm.login = function login(){
			authenticationService.login(vm.username,md5.createHash(vm.password || '')).then(function successCallback(response){
				$log.info(response);
				$cookies.put('user',JSON.stringify(response.data));
				//--- Call Session Api for global attribute
				sessionService.getAll().success(function(response){
					$log.info(response);
					$cookies.put('sessionAttribute',JSON.stringify(response));
				});

				$location.path("/dashboard");
			},
			function errorCallback(response){
				$log.info(response);
				vm.isError = true;
				vm.error = response.data.message
			});
		};

	}

})();
