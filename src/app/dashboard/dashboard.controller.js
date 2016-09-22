(function() {
	'use strict';

	angular
	.module('posapp')
	.controller('DashboardController',['$scope','$log','dashboardService','$timeout', DashboardController]);


	/** @ngInject */
	function DashboardController($scope,$log,dashboardService,$timeout) {
		$scope.$parent.pageTitle= "Dashboard";

		// loadSalesSummary();
		loadPurchaseDebt();
		loadLowStockProduct();

		//--- MONTHLY STATS
		/**
			Use timeout to render multiple chart, 1 chart load by scope and other chart use timeout function
		*/
		$scope.labelsMonthly = [];
		$scope.seriesMonthly = ['Monthly'];
		$scope.dataMonthly = [];
		$scope.dataTrxMonthly = [];

		$timeout(function(){
			$log.info('load month controller');
			dashboardService.getSalesSummary().then(function successCallback(response){
				$log.info('response monthly ctrl='+response);
				angular.forEach(response.data.monthly,function(item){
					$scope.labelsMonthly.push(item.transactionDate);
					$scope.dataTrxMonthly.push(item.transactionSum);
				});
				$scope.dataMonthly.push($scope.dataTrxMonthly);
			},
			function errorCallback(response){
				$log.info(response);
			});
		},500);

		//--- DAILY STATS ---
		$scope.labels = [];
		$scope.series = ['Daily'];
		$scope.data = [];
		$scope.dataTrx = [];

		// loadSalesSummary();

		// function loadSalesSummary(){
		// 	dashboardService.getSalesSummary().then(function successCallback(response){
		// 		$log.info(response);
		// 		angular.forEach(response.data.daily,function(item){
		// 			$scope.labels.push(item.transactionDate);
		// 			$scope.dataTrx.push(item.transactionSum);
		// 		});
		// 		$scope.data.push($scope.dataTrx);
		// 	},
		// 	function errorCallback(response){
		// 		$log.info(response);
		// 	});
		// }

		$timeout(function(){
			dashboardService.getSalesSummary().then(function successCallback(response){
				$log.info(response);
				angular.forEach(response.data.daily,function(item){
					$scope.labels.push(item.transactionDate);
					$scope.dataTrx.push(item.transactionSum);
				});
				$scope.data.push($scope.dataTrx);
			},
			function errorCallback(response){
				$log.info(response);
			});
		},50);
		

		

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
