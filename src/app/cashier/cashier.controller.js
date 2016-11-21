(function() {
  'use strict';

  angular
    .module('posapp')
    .controller('CashierController',  ['$state','$http','$log','BASE_URL','$scope','$cookies','productService','salesOrderService'
      ,'transactionMethodService','customerService','toastr', CashierController]);

  
  /** @ngInject */
  function CashierController($state,$http,$log,BASE_URL,$scope,$cookies,productService,salesOrderService,transactionMethodService,customerService,toastr) {

  	var vm = this;
  	$scope.$parent.pageTitle = "Cashier";

    vm.transactionMethodId = null;
    vm.total = 0;
    vm.subtotal = 0;
    vm.transactionMethod = {id:null,methodName:null};
    // vm.minLot = angular.fromJson($cookies.get('sessionAttribute')).MIN_LOT;
    
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

    vm.customer = {
      id: null,
      customerName: null,
      address: null,
      phoneNumber: null
    };

    vm.productName = "";


    vm.products = [];

    vm.cartItem = {
      product: null,
      qty: null,
      subtotal: null,
      price: null,
      sellPrice: null
    }

  	vm.cart = [];
    vm.customers = [];
    vm.customerId = null;
    vm.transactionMethods = [];
    vm.payment = null;
    vm.change = 0;
    vm.productCode = "";
    vm.discount = null;
    vm.grandTotal = 0;
    vm.paymentLabel = "Payment";
   
    vm.updateProduct = function(value){
      productService.getByProductCode(value).then(function successCallback(response){
        $log.info(response);
        // vm.products = [];
        // vm.products = response.data;
        angular.forEach(response.data,function(item){
          vm.products = [];
          vm.products.push(item.productName);
        })

      },function errorCallback(response){
        $log.info(response);
      });
    }

    vm.selectProduct = function(value){
      $log.info(value);

    }

   
    vm.loadTransactionMethod = function(){
      transactionMethodService.getAll(99,1).success(function(response){
        $log.info(response);
        vm.transactionMethods = [].concat(response.datas);
      });
    }

    vm.loadCustomer = function(){
      customerService.getAll(99,1).success(function(response){
        $log.info(response);
        vm.customers = [].concat(response.datas);
      });
    }

    vm.changeQty = function(item,index){
      if(item.qty >= item.product.minLot){
        $log.info(item.product.minLot);
        item.sellPrice = item.product.lotPrice;
      }else if(item.qty < vm.minLot){
        item.sellPrice = item.product.pcsPrice;
      }
    }

    vm.changeMethod = function(method){
      $log.info("method="+method.methodName);
      vm.transactionMethod = method;
      if(method.methodName == 'DEBIT CARD'){
        vm.paymentLabel = "Payment";
        vm.payment = vm.grandTotal;
        vm.isFocused = "mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused";
      }else if(method.methodName == 'DEBT'){
        vm.paymentLabel = "Down Payment (DP)";
        vm.isFocused = "mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused";
        vm.payment = 0;
      }else{
        vm.paymentLabel = "Payment";
        vm.payment = null;
        vm.isFocused = "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
      }
    }

    vm.isFocused = "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";

  	vm.addToCart = function(){
      var flag = true;
  		productService.getByProductCode(vm.productName).then(function successCallback(response){
        $log.info(response);
        if(response.data == null){
          alert("Product not found");
        }else{
          vm.cartItem = {product:response.data[0],qty:1,subtotal:0,price:response.data[0].price,sellPrice:response.data[0].pcsPrice};

          if(vm.cart.length > 0){
            angular.forEach(vm.cart,function(item){
              if(flag == true){
                if(item.product.productCode != vm.cartItem.product.productCode){
                  flag = true;
                }else{
                  flag = false;
                  toastr.error('Product alredy in cart !','Failed');
                }
              }

            });

            
            if(flag == true){
              // vm.cart.push(vm.cartItem);
              vm.cart.unshift(vm.cartItem);
              // vm.cart.push(vm.cart.splice(vm.cartItem, 1));
            }

          }else{
            vm.cart.push(vm.cartItem);
          }
          vm.productName = null;
          vm.cartItem = null;
          vm.productCode = null;
        }
        
      },
      function errorCallback(response){
        $log.info(response);
        toastr.error(response.data.message,'Failed');
      });

  	}

    vm.remove = function(index){
      vm.cart.splice(index,1);
    }


    vm.getTotal = function(){
      var total = 0;
      angular.forEach(vm.cart, function(item) {

        total += item.qty * item.sellPrice;
      })
      vm.total = total;
      return total;
    };

    vm.save = function(){

      $log.info('customer id='+vm.customerId);

      var salesOrder = {
        userId: angular.fromJson($cookies.get('user')).id,
        total: vm.total,
        discount: vm.discount,
        grandTotal: vm.grandTotal,
        transactionMethodId: vm.transactionMethod.id,
        change: vm.change,
        listDetail: vm.cart,
        transactionMethod: vm.transactionMethod,
        payment: vm.payment,
        customerId: vm.customerId,
        status: null,
        downPayment: 0
      };

      if(vm.transactionMethod.methodName == 'DEBT' && vm.payment == 0){
        salesOrder.status = 'UNPAID';
      }else if(vm.transactionMethod.methodName == 'DEBT' && vm.payment > 0){
        salesOrder.downPayment = vm.payment;
        salesOrder.status = 'PARTIALLY PAID';
      }else{
        salesOrder.status = 'PAID';
      }

      //--- VALIDATION ---
      if(validateForm() == true){

        if(vm.transactionMethod.methodName != 'DEBT'){
          vm.change = vm.payment - vm.grandTotal;
        }
        
        salesOrderService.save(salesOrder).then(function successCallback(response){
          $log.info(response);
          toastr.success(response.data.message,'')
          refresh();
        },
        function errorCallback(response){
          $log.error(response);
          toastr.error(response.data.message,'Failed');
        });
      }
      
    }

    function validateForm(){
      $log.info('validate form');
      if(vm.transactionMethod.id == null){
        $log.info('enter');
        toastr.error('Please choose transaction method!','Failed');
        return false;
      }else if(vm.payment < vm.grandTotal && vm.transactionMethod.methodName != 'DEBT'){
        $log.info('enter');
        toastr.error('Payment must be greater than total!','Failed');
        return false;
      }else if(vm.transactionMethod.methodName == 'DEBT' && vm.customerId == null){
        $log.info('enter');
        toastr.error('Customer is required!','Failed');
        return false;
      }else{
        return true;
      }
    }

    function refresh(){
      vm.cart = [];
      vm.total = 0;
      vm.discount = null;
      vm.payment = null;
      vm.productName = null;
      vm.products = [];
    }

    function updateSubtotal(index,price){
      vm.cartItem[index].subtotal = vm.cartItem[index].qty * vm.cartItem[index].product.pcsPrice;
    }

  }

})();
