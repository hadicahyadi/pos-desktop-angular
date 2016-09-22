(function() {
  'use strict';

  angular
    .module('posapp')
    .controller('ProductController',  ['$state','$http','$log','BASE_URL','$scope','productService','brandService','categoryService', ProductController]);


	

  /** @ngInject */
  function ProductController($state,$http,$log,BASE_URL,$scope,productService,brandService,categoryService) {
  	var vm = this;

    $scope.$parent.pageTitle= "Product";

    vm.isEditPage = false;

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
    	minStock: null,
    	stock: null,
    	description: null
    };

    vm.products = [];
    vm.dataCount = 0;
    vm.currentPage = 1;
    vm.pageSize = 5;

    load();
    loadBrand();
    loadCategory();
    
    function loadBrand(){
		brandService.getAll(99,1).success(function(response){
			$log.info(response);
			vm.brands = [].concat(response.datas);
			
		});
	}

	function loadCategory(){
		categoryService.getAll(99,1).success(function(response){
			$log.info(response);
			vm.categories = [].concat(response.datas);
		});
	}


	function load(){
		productService.getAll(vm.pageSize,vm.currentPage).success(function(response){
			$log.info(response);
			vm.products = [].concat(response.datas);
			vm.dataCount = response.pageCount;
		});
	}

	vm.save = function() {
		productService.save(vm.product).then(function successCallback(response){
			$log.error(response.data);
			$state.go("main.product");
			vm.product = null;
			vm.currentPage = 1;
			load();
		},
		function errorCallback(response){
			$log.error(response);
			alert('save data error!');
		});
	}

	vm.edit = function edit(product){
		vm.isEditPage = true;  
		vm.product = product;
	}

	vm.isEdit = function isEdit(){
		if(vm.isEditPage == false){
			return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
		}else{
			return "mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused";
		}
	}

	function buildColumns(columns){
		var arrColumn = [];
		angular.forEach(columns,function(col){
			arrColumn.push({text:col,fontSize: 12, bold: true,margin:[0,10]});
		});
		return arrColumn;
	}

	function buildTableBody(columns) {
		var body = [];
		var data = null;
		data = vm.products;

		body.push(buildColumns(columns));

		angular.forEach(data,function(row) {
			var dataRow = [];
			$log.info(row);
			var rowAfter = angular.fromJson(row);
			var arr = Object.keys(rowAfter).map(function(k) { return rowAfter[k] });
			$log.info(angular.toJson(arr));
			columns.forEach(function(column,index) {
				// $log.info(JSON.parse(JSON.stringify(row)));
				switch(index){
					case 0:
						dataRow.push({text:arr[4]+''+'',margin:[5,5,0,0]});
						break;
					case 1:
						dataRow.push({text:arr[5]+''+'',margin:[5,5,0,0]});
						break;
					case 2:
						dataRow.push({text:arr[13].brandName+'',margin:[5,5,0,0]});
						break;
					case 3:
						dataRow.push({text:arr[9]+''+'',margin:[5,5,0,0]});
						break;
					case 4:
						dataRow.push({text:arr[10]+''+'',margin:[5,5,0,0]});
						break;
					case 5:
						dataRow.push({text:arr[10]+''+'',margin:[5,5,0,0]});
						break;
					case 6:
						dataRow.push({text:arr[10]+''+'',margin:[5,5,0,0]});
						break;
				}
				
			});
			body.push(dataRow);
		});
		$log.info(angular.toJson(body));
		return body;
	}

	function table(columns) {
		return {
			style: 'productTable',
			table: {
				widths: [ '*', '*', '*' ,'*','*'],
				headerRows: 1,
				body:buildTableBody(columns)
			},
			layout:'headerLineOnly'
		};
	}



	function getDefinition(){
		vm.docDefinition = {
			content: [
			{
				text: 'Data Product', fontSize: 14, bold: true,margin: [0,20],
				alignment: 'center' ,
			},
			// {
				table(['Product Code','Product Name','Brand','Min Stock','Stock','Pcs Price','Lot Price'])
				// style: 'productTable',
				// table: {
					
					// widths: [ '*', '*', '*' ],
					// headerRows: 1,
					// body: [
					// [{text: 'Fruit', style: 'tableHeader'}, {text: 'Quantity', style: 'tableHeader'},
					// {text: 'Calories', style: 'tableHeader'},{text: 'xxx', style: 'tableHeader'}
					// ],buildTableContent()
					// ]
				// },
				// layout:'headerLineOnly'
			// }
			]
		};

		return vm.docDefinition;
	}


	vm.download = function(){
		// open the PDF in a new window
		pdfMake.createPdf(getDefinition()).open();

		// download the PDF
		pdfMake.createPdf(getDefinition()).download('product.pdf');
	}

	vm.pageChangeHandler = function pageChangeHandler(pageNumber){
		vm.currentPage = pageNumber;
		load();
	}

  }

})();
