(function() {
	'use strict';

	angular
	.module('posapp')
	.controller('ProductFormController',  ['$state','$log','$scope','productService','priceparamService','brandService','categoryService','toastr','PAGE_SIZE','$stateParams', ProductFormController]);


	/** @ngInject */
	function ProductFormController($state,$log,$scope,productService,priceparamService,brandService,categoryService,toastr,PAGE_SIZE,$stateParams) {

		var vm = this;

		$scope.$parent.pageTitle= "Create/Edit Product";

		vm.product = {
			id: null,
			brandId: null,
			categoryId: null,
			productCode: null,
			productName: null,
			basePrice: null,
			minStock: null,
			stock: null,
			productPriceList: []
		};
		vm.productPrices = [];
		vm.priceParams = [];
		vm.productPrice = {
			id: null,
			priceParam: null,
			min: null,
			max: null,
			priceValue: null
		}

		if($stateParams.product != null){
			vm.product = $stateParams.product;
			loadProductPrices();
		}
		loadPriceParam();
		loadBrand();
		loadCategory();

		function loadBrand(){
			brandService.getAll(999,1).success(function(response){
				$log.info(response);
				vm.brands = [].concat(response.datas);

			});
		}

		function loadCategory(){
			categoryService.getAll(999,1).success(function(response){
				$log.info(response);
				vm.categories = [].concat(response.datas);
			});
		}
		
		function loadPriceParam(){
			priceparamService.getAll(99,1).success(function(response){
				$log.info(response);
				vm.priceParams = [].concat(response.datas);
				vm.dataCount = response.pageCount;
			});
		}

		function loadProductPrices(){
			productService.getProductPrices(vm.product.id).success(function (response){
				vm.productPrices = response;
			});
		}

		vm.addPrice = function(){
			vm.productPrices.push(vm.productPrice);
			vm.productPrice = null;
		}

		vm.save = function() {
			vm.product.productPriceList = vm.productPrices;
			productService.save(vm.product).then(function successCallback(response){
				$log.info(response.data);
				if(response.data.responseCode == '-1'){
					toastr.error(response.data.message,'');
				}else{
					$state.go("main.product");
					vm.product = null;
					vm.currentPage = 1;
					toastr.success(response.data.message,'');
				}
			},
			function errorCallback(response){
				$log.error(response);
				toastr.error(response.data.message,'Failed');
			});
		}

		vm.remove = function(index){
			$log.info(index);
			vm.productPrices.splice(index,1);
		}

		vm.isEdit = function isEdit(){
			if(vm.product.id == null){
				return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
			}else{
				return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused";
			}
		}

	}

})();
