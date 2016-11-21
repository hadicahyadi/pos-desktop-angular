(function() {
	'use strict';

	angular
	.module('posapp')
	.controller('DashboardController',['$scope','$log','dashboardService','$timeout','dataSales','$cookies', DashboardController]);


	/** @ngInject */
	function DashboardController($scope,$log,dashboardService,$timeout,dataSales,$cookies) {

		$scope.$parent.pageTitle= "Dashboard";

		$scope.user = angular.fromJson($cookies.get('user'));

		$scope.chartData = JSON.stringify(dataSales.data);

		//--- DAILY STATS ---
		$scope.labels = [];
		$scope.series = ['Daily'];
		$scope.dataDaily = [];
		$scope.dataTrx = [];

		//--- MONTHLY STATS
		$scope.labelsMonthly = [];
		$scope.seriesMonthly = ['Monthly'];
		$scope.dataMonthly = [];
		$scope.dataTrxMonthly = [];

		//--- call dashboard initial method ---
		loadChart();
		loadPurchaseDebt();
		loadLowStockProduct();
		loadSalesOrderCredit();

		function loadChart(){
			$log.info(dataSales.data.daily.length);
			angular.forEach(dataSales.data.daily,function(item){
				$scope.labels.push(item.transactionDate);
				$scope.dataTrx.push(item.transactionSum);
			});
			$scope.dataDaily.push($scope.dataTrx);

			angular.forEach(dataSales.data.monthly,function(item){
				$scope.labelsMonthly.push(item.transactionDate);
				$scope.dataTrxMonthly.push(item.transactionSum);
			});
			$scope.dataMonthly.push($scope.dataTrxMonthly);
		}
		
		function loadPurchaseDebt(){
			dashboardService.getPurchaseDebt().then(function successCallback(response){
				$log.info(response);
				$scope.purchaseDebt = [];
				$scope.purchaseDebt = response.data;
			},
			function errorCallback(response){
				$log.info(response);
			});
		}

		function loadSalesOrderCredit(){
			dashboardService.getSalesOrderCredit().then(function successCallback(response){
				$log.info(response);
				$scope.salesOrderCredit = [];
				$scope.salesOrderCredit = response.data;
			},
			function errorCallback(response){
				$log.info(response);
			});
		}

		function loadLowStockProduct(){
			dashboardService.getLowStockProduct().then(function successCallback(response){
				$log.info(response);
				$scope.products = [];
				$scope.products = response.data;
			},
			function errorCallback(response){
				$log.info(response);
			});
		}

		
		$scope.onClick = function (points, evt) {
			console.log(points, evt);
		};

		$scope.labelsPie = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
		$scope.dataPie = [300, 500, 100, 40, 120];

	 
	}
})();
