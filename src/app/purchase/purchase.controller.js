(function() {
  'use strict';

  angular
  .module('posapp')
  .controller('PurchaseController',  ['$state','$http','$log','BASE_URL','$scope','productService','supplierService','purchaseService', PurchaseController]);


  /** @ngInject */
  function PurchaseController($state,$http,$log,BASE_URL,$scope,productService,supplierService,purchaseService) {
  	var vm = this;

    $scope.$parent.pageTitle= "Purchase Order";

    vm.isEditPage = false;
    vm.product = null;
    vm.price = null;
    vm.suppliers = [];
    vm.supplierId;
    vm.cart = [];
    vm.qty = null;
    vm.cartItem = {
      product: null,
      qty: null,
      subtotal: null,
      price:null
    }
    vm.dueDate = null;
    vm.status = null;
    vm.POnumber = null;
    vm.products = [];


    vm.updateProduct = function(value){
      productService.getByProductCode(value).then(function successCallback(response){
        $log.info(response);
        /*vm.products = [];
        vm.products = response.data;*/
        angular.forEach(response.data,function(item){
          vm.products = [];
          vm.products.push(item.productName);
        })

      },function errorCallback(response){
        $log.info(response);
      });
    }


    vm.addToCart = function(){
      var flag = true;
      productService.getByProductCode(vm.product).then(function successCallback(response){
        $log.info(response);
        if(response.data == ""){
          return alert('Product not found, create new product with product code '+vm.productCode+'!'); 
        }else{
          vm.cartItem = {product:response.data[0],qty:1,subtotal:0,price:response.data[0].price};
          $log.info(vm.cartItem.product.price);
          vm.price = response.data[0].price;
          $log.info(vm.cartItem);
          if(vm.cart.length > 0){
            angular.forEach(vm.cart,function(item){
              if(flag == true){
                if(item.product.productCode != response.productCode){
                  flag = true;
                }else{
                  flag = false;
                  alert("Product already in cart!");
                }
              }
              
            });

            $log.info("flag="+flag);
            if(flag == true){
              vm.cart.push(vm.cartItem);
            }

          }else{
            vm.cart.push(vm.cartItem);
          }

          
          vm.cartItem = null;
          // vm.productCode = null;
          vm.price = null;
          vm.qty = null;
        }
      }
        ,
      function errorCallback(response){
        $log.error(response);
        return alert('Product not found, create new product with product code '+vm.productCode+'!');
      });
    }

    function loadSupplier(){
     supplierService.getAll(99,1).success(function(response){
      $log.info(response);
      vm.suppliers = [].concat(response.datas);
      
    });

     vm.save = function(){
      var purchaseOrder = {
        supplierId: vm.supplierId,
        POnumber: vm.POnumber,
        total: vm.total,
        discount: vm.discount,
        grandTotal: vm.grandTotal,
        listDetail: vm.cart,
        status: vm.status,
        dueDate: vm.dueDate
      }
      purchaseService.save(purchaseOrder).then(function successCallback(response){
        $log.info(response.data);
        
        refresh();
      },
      function errorCallback(response){
        $log.error(response);
        alert('save data error!');
      });
    }

    function refresh(){
      vm.cart = [];
      vm.total = 0;
      vm.discount = null;
      vm.supplierId = 0;
      vm.POnumber = null;
      vm.status = null;
    }

     vm.getTotal = function(){
      var total = 0;
      angular.forEach(vm.cart, function(item) {

        total += item.qty * item.product.price;
      })
      vm.total = total;
      return total;
    };

    vm.remove = function(index){
      vm.cart.splice(index,1);
    }

   }

 }

})();
