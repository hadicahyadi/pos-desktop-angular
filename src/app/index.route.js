(function() {
  'use strict';

  angular
  .module('posapp')
  .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('base',{
      url: "/"
    })

    .state("default", {

    })

    .state('main',{
     abstract: true,
     templateUrl: "app/main/main.html",
     controller: "MainController"
   })

    .state("login", {
     url: "/login",
     templateUrl: "app/login/login.html",
     controller: "LoginController",
     controllerAs: "vm",
     authenticate: false
   })

    .state("main.dashboard", {
     url: "/dashboard",
     templateUrl: "app/dashboard/dashboard.html",
     controller: "DashboardController",
     controllerAs: "vm",
     parent: "main",
     authenticate: true,
     resolve: {
       dataSales: function(dashboardService){
          return dashboardService.getSalesSummary().then(function successCallback(response){
            console.log(response);
            return response;
          },
          function errorCallback(response){
            return response;
          });
        }
      
     }   
   })

     //--- BRAND STATE ---
     .state("main.brand", {
       url: "/brand",
       templateUrl: "app/brand/brand.html",
       controller: "BrandController",
       controllerAs: "vm",
       parent: "main",
       authenticate: true  
     })

     .state("main.brand.brand-dialog", {
      templateUrl: "app/brand/brand-dialog.html",
      onEnter: ["$state", function($state) {
        $(document).on("click", ".close", function() {
          $state.go("main.brand");
        });
      }],
      
    })

     //--- CUSTOMER STATE ---
     .state("main.customer", {
       url: "/customer",
       templateUrl: "app/customer/customer.html",
       controller: "CustomerController",
       controllerAs: "vm",
       parent: "main",
       authenticate: true  
     })

     .state("main.customer.customer-dialog", {
      templateUrl: "app/customer/customer-dialog.html",
      onEnter: ["$state", function($state) {
        $(document).on("click", ".close", function() {
          $state.go("main.customer");
        });
      }],
      
    })

     //--- CATEGORY STATE ---
     .state("main.category", {
       url: "/category",
       templateUrl: "app/category/category.html",
       controller: "CategoryController",
       controllerAs: "vm",
       parent: "main",
       authenticate: true  
     })

     .state("main.category.category-dialog", {
      templateUrl: "app/category/category-dialog.html",
      onEnter: ["$state", function($state) {
        $(document).on("click", ".close", function() {
          $state.go("main.category");
        });
      }],
      
    })

      //--- PRODUCT STATE ---
      .state("main.product", {
       url: "/product",
       templateUrl: "app/product/product.html",
       controller: "ProductController",
       controllerAs: "vm",
       parent: "main"  ,
       onLoad: $('.ng-scope').attr('overflow-x: scroll;'),
       authenticate: true
     })

      .state("main.product.product-dialog", {
        templateUrl: "app/product/product-dialog.html",
        onEnter: ["$state", function($state) {
          $(document).on("click", ".close", function() {
            $state.go("main.product");
          });
        }],

      })

      //--- CASHIER STATE ---
      .state("main.cashier", {
       url: "/cashier",
       templateUrl: "app/cashier/cashier.html",
       controller: "CashierController",
       controllerAs: "vm",
       parent: "main",
       authenticate: true,
       onEnter: function() {
        setTimeout(function() { jQuery('#valueCode').focus() }, 20);
      }
    })

      //--- SUPPLIER STATE ---
      .state("main.supplier", {
       url: "/supplier",
       templateUrl: "app/supplier/supplier.html",
       controller: "SupplierController",
       controllerAs: "vm",
       parent: "main",
       authenticate: true
     })

      .state("main.supplier.supplier-dialog", {
        templateUrl: "app/supplier/supplier-dialog.html",
        onEnter: ["$state", function($state) {
          $(document).on("click", ".close", function() {
            $state.go("main.supplier");
          });
        }],

      })

      //--- USER STATE ---
      .state("main.user", {
       url: "/user",
       templateUrl: "app/user/user.html",
       controller: "UserController",
       controllerAs: "vm",
       parent: "main",
       authenticate: true,
       
     })

      //--- CHANGE PASSWORD STATE ---
      .state("main.changepassword", {
       url: "/changepassword",
       templateUrl: "app/changePassword/changepassword.html",
       controller: "ChangePasswordController",
       controllerAs: "vm",
       parent: "main",
       authenticate: true,
       
     })

      .state("main.user.user-dialog", {
        templateUrl: "app/user/user-dialog.html",
        onEnter: ["$state", function($state) {
          $(document).on("click", ".close", function() {
            $state.go("main.user");
          });
        }],

      })

     //--- PURCHASE STATE ---
     .state("main.purchase", {
       url: "/purchase",
       templateUrl: "app/purchase/purchase.html",
       controller: "PurchaseController",
       controllerAs: "vm",
       parent: "main",
       authenticate: true 
     })

     //--- SALES ORDER STATE ---
     .state("main.salesorder", {
       url: "/history/salesorder",
       templateUrl: "app/history/salesorder.html",
       controller: "SalesOrderController",
       controllerAs: "vm",
       parent: "main",
       authenticate: true 
     })

     .state("main.salesorder.detail", {
        templateUrl: "app/history/salesorder-detail.html",
        onEnter: ["$state", function($state) {
          $(document).on("click", ".close", function() {
            $state.go("main.salesorder");
          });
        }],

      })

     //--- PURCHASE ORDER HISTORY STATE ---
     .state("main.purchasehistory", {
       url: "/history/purchasehistory",
       templateUrl: "app/history/purchasehistory.html",
       controller: "PurchaseHistoryController",
       controllerAs: "vm",
       parent: "main",
       authenticate: true 
     })

     .state("main.purchasehistory.detail", {
        templateUrl: "app/history/purchasehistory-detail.html",
        onEnter: ["$state", function($state) {
          $(document).on("click", ".close", function() {
            $state.go("main.purchasehistory");
          });
        }],

      })

     //--- SALES SUMMARY STATE ---
     .state("main.salessummary", {
       url: "/salessummary",
       templateUrl: "app/report/salesSummary/salessummary.html",
       controller: "SalesSummaryController",
       controllerAs: "vm",
       parent: "main",
       authenticate: true
     })

     //--- TRANSACTION SUMMARY STATE ---
     .state("main.transactionsummary", {
       url: "/transactionsummary",
       templateUrl: "app/report/transactionSummary/transactionsummary.html",
       controller: "TransactionSummaryController",
       controllerAs: "vm",
       parent: "main",
       authenticate: true
     })

     //--- TRANSACTION SUMMARY STATE ---
     .state("main.setting", {
       url: "/setting",
       templateUrl: "app/setting/setting.html",
       controller: "SettingController",
       controllerAs: "vm",
       parent: "main",
       authenticate: true
     })

     .state("main.setting.setting-dialog", {
        templateUrl: "app/setting/setting-dialog.html",
        onEnter: ["$state", function($state) {
          $(document).on("click", ".close", function() {
            $state.go("main.setting");
          });
        }],

      });


     $urlRouterProvider.otherwise('/login');
   }

 })();
