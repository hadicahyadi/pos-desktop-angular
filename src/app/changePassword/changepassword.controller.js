(function() {
  'use strict';

  angular
    .module('posapp')
    .controller('ChangePasswordController',  ['$state','$http','$log','BASE_URL','$scope','$cookies','md5', ChangePasswordController]);

  
  /** @ngInject */
  function ChangePasswordController($state,$http,$log,BASE_URL,$scope,$cookies,md5) {

  	var vm = this;

    $scope.$parent.pageTitle= "Change Password";
    vm.oldPassword = null;
    vm.newPassword = null;
	vm.user = angular.fromJson($cookies.get('user'));
	$log.info(vm.user.password);

	vm.save = function(){
		if(md5.createHash(vm.oldPassword || '') != vm.user.password){
			alert('Your Old Password is Wrong');
		}else{
			vm.user.password = md5.createHash(vm.newPassword || '');
			$http.post(BASE_URL+'/user/changePassword',vm.user).then(function successCallback(response){
				vm.oldPassword = null;
				vm.newPassword = null;
				alert('Change Password Success');
			},
			function errorCallback(response){
				alert('Change Password Failed');
			});
		}
		
	}

  }

})();
