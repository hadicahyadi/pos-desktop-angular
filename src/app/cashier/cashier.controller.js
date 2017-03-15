(function() {
  'use strict';

  angular
    .module('posapp')
    .controller('CashierController',  ['$state','$http','$log','BASE_URL','$scope','$cookies','productService','salesOrderService'
      ,'transactionMethodService','customerService','priceparamService','toastr','$filter', CashierController]);

  
  /** @ngInject */
  function CashierController($state,$http,$log,BASE_URL,$scope,$cookies,productService,salesOrderService,transactionMethodService,customerService,priceparamService,toastr,$filter) {

  	var vm = this;
  	$scope.$parent.pageTitle = "Cashier";

    vm.transactionMethodId = null;
    vm.total = 0;
    vm.subtotal = 0;
    vm.transactionMethod = {id:null,methodName:null};
    
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
      price: null
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
    vm.productsTmp = [];
    vm.priceParams = [];
    vm.priceParam = null;

    loadPriceParam();
   
    vm.updateProduct = function(value){
      productService.getByProductCode(value).then(function successCallback(response){
        $log.info(response);
        vm.products = parseResponse(response.data);
      },function errorCallback(response){
        $log.info(response);
      });
    }

    function parseResponse(productsResponse){
      var arrTmp = [];
      vm.productsTmp = [];
      angular.forEach(productsResponse,function(item){
        arrTmp.push(item.productName);
        vm.productsTmp.push(item);
      });

      return arrTmp;
    }

    function loadPriceParam(){
      priceparamService.getAll(99,1).success(function(response){
        vm.priceParams = [].concat(response.datas);
        vm.priceParam = vm.priceParams[0].id;
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
      var pricing =  $filter('productPriceLookup')(vm.priceParam,item.qty,item.product.productPriceList);
      item.price = pricing.priceValue;
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
      $log.info("product selected : "+vm.productName);
      var pp = $filter('collectionLookup')('productName',vm.productName,vm.productsTmp);
      $log.info("collection result = "+pp.productCode);
      var flag = true;
  		productService.getByProductCode(pp.productCode).then(function successCallback(response){
        if(response.data == null){
          alert("Product not found");
        }else{
          var pricing =  $filter('productPriceLookup')(vm.priceParam,1,response.data[0].productPriceList);
          vm.cartItem = {product:response.data[0],qty:1,subtotal:0,price:pricing.priceValue};

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
        toastr.error(response.data.message,'Failed');
      });

  	}

    vm.remove = function(index){
      vm.cart.splice(index,1);
      if(vm.cart.length == 0){
        vm.grandTotal = 0;
        vm.discount = null;
        vm.payment = null;
      }
    }


    vm.getTotal = function(){
      var total = 0;
      angular.forEach(vm.cart, function(item) {

        total += item.qty * item.price;
      })
      vm.total = total;
      return total;
    };

    vm.save = function(){
      var priceType = $filter('collectionLookup')('id',vm.priceParam,vm.priceParams);
      if(vm.customerId == 'none'){
        vm.customerId = null;
      }

      if(vm.discount == ''){
        vm.discount = null;
      }

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
        downPayment: 0,
        priceType: priceType.paramName
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
          salesOrder.change = vm.change;
        }
        
        salesOrderService.save(salesOrder).then(function successCallback(response){
          $log.info(response);
          toastr.success(response.data.message,'')
          refresh();
        },
        function errorCallback(response){
          $log.error(response);
          vm.change = 0;
          toastr.error(response.data.message,'Failed');
        });
      }
      
    }

    function validateForm(){
      $log.info('validate form');
      if(vm.cart.length == 0){
        toastr.error('Your cart is empty!','Failed');
        return false;
      }else if(vm.transactionMethod.id == null){
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
      vm.grandTotal = 0;
    }

    function updateSubtotal(index,price){
      vm.cartItem[index].subtotal = vm.cartItem[index].qty * vm.cartItem[index].product.pcsPrice;
    }

  }

})();
