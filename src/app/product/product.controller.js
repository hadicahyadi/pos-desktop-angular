(function() {
	'use strict';

	angular
	.module('posapp')
	.controller('ProductController',  ['$state','$http','$log','BASE_URL','$scope','productService','brandService','categoryService','$filter',
		'toastr','PAGE_SIZE', ProductController]);

	/** @ngInject */
	function ProductController($state,$http,$log,BASE_URL,$scope,productService,brandService,categoryService,$filter,toastr,PAGE_SIZE) {
		var vm = this;

		$scope.$parent.pageTitle= "Product";

		vm.isEditPage = false;
		vm.sortBy = 'product_name';
		vm.sortValue = 'desc';
		vm.reverse = true;
		vm.sortingCriteria = ["Product Name(A-Z)","Product Name(Z-A)","Brand(A-Z)","Brand(Z-A)","Category(A-Z)","Category(Z-A)"];
		vm.criteriaSelected = 1;
		vm.brands = [];
		vm.categories = [];
		vm.product = {
			id: null,
			brandId: null,
			categoryId: null,
			productCode: null,
			productName: null,
			pcsPrice: null,
			lotPrice: null,
			minLot: null,
			minStock: null,
			stock: null,
			description: null
		};

		vm.products = [];
		vm.exportData = [];
		vm.dataCount = 0;
		vm.currentPage = 1;
		vm.pageSize = PAGE_SIZE;
		vm.isDisabled = true;
		vm.searchValue = "";

		load();
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


		function load(){
			productService.getAll(vm.pageSize,vm.currentPage,vm.sortBy,vm.sortValue,vm.searchValue).success(function(response){
				$log.info(response);
				vm.products = [].concat(response.datas);
				vm.dataCount = response.pageCount;
			});
		}

		vm.refresh = function(){
			vm.searchValue = "";
			vm.sortBy = 'product_name';
			vm.sortValue = 'desc';
			load();
		}

		vm.search = function(){
			load();
		}

		vm.save = function() {
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
				load();
			},
			function errorCallback(response){
				$log.error(response);
				toastr.error(response.data.message,'Failed');
			});
		}

		vm.edit = function edit(product){
			vm.isEditPage = true;  
			vm.product = product;
			vm.isDisabled = false;
		}

		vm.isEdit = function isEdit(){
			if(vm.isEditPage == false){
				return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
			}else{
				return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused";
			}
		}

	// Download excel function
	vm.export = function(){
		productService.export().success(function (data, status, headers, config) {
			var blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			});
			var date = new Date();
			vm.filename = 'DATA_PRODUCT_'+date.getFullYear()+('0' + (date.getMonth() + 1)).slice(-2)+('0' + date.getDate()).slice(-2);
			saveAs(blob, vm.filename + '.xlsx');
		});
	}
	// End excel function

	vm.pageChangeHandler = function pageChangeHandler(pageNumber){
		vm.currentPage = pageNumber;
		load();
	}

	vm.sort = function(){
		if(vm.criteriaSelected == 0){ // product name asc
			vm.sortBy = 'product_name';
			vm.reverse = false;
			vm.sortValue = 'asc';
		}else if(vm.criteriaSelected == 1){ // product name desc
			vm.sortBy = 'product_name';
			vm.reverse = true;
			vm.sortValue = 'desc';
		}else if(vm.criteriaSelected == 2){ // brand name asc
			vm.sortBy = 'b.brand_name';
			vm.reverse = false;
			vm.sortValue = 'asc';
		}else if(vm.criteriaSelected == 3){ // brand name desc
			vm.sortBy = 'b.brand_name';
			vm.reverse = true;
			vm.sortValue = 'desc';
		}else if(vm.criteriaSelected == 4){ // category name asc
			vm.sortBy = 'c.category_name';
			vm.reverse = false;
			vm.sortValue = 'asc';
		}else if(vm.criteriaSelected == 5){ // category name desc
			vm.sortBy = 'c.category_name';
			vm.reverse = true;
			vm.sortValue = 'desc';
		}
		// vm.pageSize = 9999;
		// vm.currentPage = 1;
		load();
	}

	//--- ALL EXPORT to PDF FUNCTION GOES BELOW (UNUSED)---

	function buildColumns(columns){
		var arrColumn = [];
		angular.forEach(columns,function(col){
			arrColumn.push({text:col,fontSize: 12, bold: true,margin:[0,10]});
		});
		return arrColumn;
	}

	function loadAllProduct(){
		return productService.getAll(99999,1);
	}

	function buildTableBody(columns) {
		var body = [];
		var data = vm.exportData;
		body.push(buildColumns(columns));

		angular.forEach(data,function(row) {
			var dataRow = [];
			// $log.info(row);
			var rowAfter = angular.fromJson(row);
			var arr = Object.keys(rowAfter).map(function(k) { return rowAfter[k] });
			// $log.info(angular.toJson(arr));
			columns.forEach(function(column,index) {
				// $log.info(JSON.parse(JSON.stringify(row)));
				switch(index){
					case 0:
					dataRow.push({text:arr[4]+''+'',margin:[5,5,0,0],fontSize:10});
					break;
					case 1:
					dataRow.push({text:arr[5]+''+'',margin:[5,5,0,0],fontSize:10});
					break;
					case 2:
					dataRow.push({text:arr[14].brandName+'',margin:[5,5,0,0],fontSize:10});
					break;
					case 3:
					dataRow.push({text:arr[9]+''+'',margin:[5,5,0,0],fontSize:10});
					break;
					case 4:
					dataRow.push({text:arr[10]+''+'',margin:[5,5,0,0],fontSize:10});
					break;
					case 5:
					dataRow.push({text:currencyFormat(arr[7])+''+'',margin:[5,5,0,0],fontSize:10});
					break;
					case 6:
					dataRow.push({text:currencyFormat(arr[8])+''+'',margin:[5,5,0,0],fontSize:10});
					break;
					// case 7:
					// 	dataRow.push({text:currencyFormat(arr[8])+''+'',margin:[5,5,0,0]});
					// 	break;
				}
				
			});
			body.push(dataRow);
		});
		// $log.info(angular.toJson(body));
		return body;
	}

	function currencyFormat(value){
		return $filter('currency')(value,'');
	}

	function buildTable(columns) {
		return {
			style: 'productTable',
			table: {
				widths: [ 85, 100, 55 ,25,25,'*','*'],
				headerRows: 1,
				body:buildTableBody(columns)
			},
			layout:'headerLineOnly'
		};
	}



	function getDefinition(){
		var date = new Date();
		vm.dateStr = ('0' + date.getDate()).slice(-2)+'/'+('0' + (date.getMonth() + 1)).slice(-2)+'/'+date.getFullYear();
		vm.docDefinition = {
			content: [
			{
				text: 'Data Product \n '+vm.dateStr, fontSize: 14, bold: true,margin: [0,20],
				alignment: 'center',
				pageSize: 'A5',
				
			},
			buildTable(['Product Code','Product Name','Brand','Min Stock','Stock','Pcs Price','Lot Price'])
			]
		};

		return vm.docDefinition;
	}


	vm.download = function(){
		// open the PDF in a new window
		// pdfMake.createPdf(getDefinition()).open();
		var date = new Date();
		vm.filename = 'DATA_PRODUCT_'+date.getFullYear()+('0' + (date.getMonth() + 1)).slice(-2)+('0' + date.getDate()).slice(-2);
		// download the PDF
		loadAllProduct().then(function successCallback(response){
			vm.exportData = response.data.datas;
			pdfMake.createPdf(getDefinition()).download(vm.filename+'.pdf');
		}, function errorCallback(response){
			$log.error(response);
		});
		
	}

	

}

})();
