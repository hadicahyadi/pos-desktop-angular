(function() {
	'use strict';

	angular
	.module('posapp')
	.controller('PriceParamController',  ['$state','$http','$log','BASE_URL','$scope','priceparamService','toastr','PAGE_SIZE', PriceParamController]);


	/** @ngInject */
	function PriceParamController($state,$http,$log,BASE_URL,$scope,priceparamService,toastr,PAGE_SIZE) {

		var vm = this;

		$scope.$parent.pageTitle= "Settings";

		vm.priceparam = {
			id: null,
			paramName: null
		};

		vm.priceparams = [];
		vm.dataCount = 0;
		vm.currentPage = 1;
		vm.pageSize = PAGE_SIZE;

		load();

		function load(){
			priceparamService.getAll(vm.pageSize,vm.currentPage).success(function(response){
				$log.info(response);
				vm.priceparams = [].concat(response.datas);
				vm.dataCount = response.pageCount;
			});
		}

		vm.isEdit = function isEdit(){
			if(vm.priceparam === null){
				return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
			}else{
				return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused";
			}
		}

		vm.save = function() {
			priceparamService.save(vm.priceparam).then(function successCallback(response){
				$log.error(response.data);
				$state.go("main.priceparam");
				vm.priceparam = null;
				vm.currentPage = 1;
				toastr.success(response.data.message,'');
				load();
			},
			function errorCallback(response){
				$log.error(response);
				toastr.error(response.data.message,'Failed');
			});
		}

		vm.edit = function edit(priceparam){
			vm.priceparam = priceparam;
		}

		vm.pageChangeHandler = function pageChangeHandler(pageNumber){
			vm.currentPage = pageNumber;
			load();
		}


	}

})();
