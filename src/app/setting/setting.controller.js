(function() {
  'use strict';

  angular
    .module('posapp')
    .controller('SettingController',  ['$state','$http','$log','BASE_URL','$scope','settingService','sessionService','$cookies', SettingController]);

  /** @ngInject */
  function SettingController($state,$http,$log,BASE_URL,$scope,settingService,sessionService,$cookies) {
  	var vm = this;

    $scope.$parent.pageTitle= "Setting";

    vm.setting = {
    	id: null,
    	settingName: null,
    	settingValue: null
    };

    vm.isEdit = function isEdit(){
		if(vm.setting == null){
			return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
		}else{
			return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused";
		}
	}

    vm.settings = [];
	vm.remove = remove;
	vm.dataCount = 0;
	vm.currentPage = 1;
  	vm.pageSize = 5;
	
	load();

	function load(){
		settingService.getAll(vm.pageSize,vm.currentPage).success(function(response){
			$log.info(response);
			vm.settings = [].concat(response.datas);
			vm.dataCount = response.pageCount;
			vm.setting = {
				id: null,
				settingName: null,
				settingValue: null
			};
		});
	}

	vm.save = function() {
		settingService.save(vm.setting).then(function successCallback(response){
			$log.error(response.data);
			$state.go("main.setting");
			vm.setting = null;
			vm.currentPage = 1;
			load();
			sessionService.reloadAttribute();
		},
		function errorCallback(response){
			$log.error(response);
			alert('save data error!');
		});
	}

	function remove(id){
		settingService.remove(id).then(function successCallback(response){
			vm.currentPage = 1;
			load();
		},
		function errorCallback(response){
			$log.error(response);
			alert('delete data error!');
		});
	}

	vm.edit = function edit(setting){
		vm.setting = setting;
	}

	vm.pageChangeHandler = function pageChangeHandler(pageNumber){
		vm.currentPage = pageNumber;
		load();
	}

	
  }

})();
