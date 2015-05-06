'use strict';

angular.module('ryanWeb').directive('shoppingList', function() {
    return {
        restrict: 'E',
        templateUrl: 'components/shoppingList/shopping.list.html',
        scope: {},
        link: function(scope) {
            scope.shoppingList.init();
        },
        controller: function($scope, shoppingListService) {
            $scope.shoppingList = {};
            $scope.shoppingList.newItem = '';

            $scope.shoppingList.items = [];

            $scope.shoppingList.init = function() {
                shoppingListService.getShoppingItems().then(function(items) {
                    $scope.shoppingList.items = items;
                }, function(error) {
                    //handle error
                });
            };

            $scope.shoppingList.addItem = function() {
                if($scope.shoppingList.newItem.length > 0) {
                    var item = {item: $scope.shoppingList.newItem};

                    shoppingListService.addShoppingItem(item).then(function(item) {
                        $scope.shoppingList.items.push(item);
                        $scope.shoppingList.newItem = '';
                    }, function(error) {
                        //handle error
                    });
                }
            };

            $scope.shoppingList.removeItem = function(item) {
                shoppingListService.removeShoppingItem(item).then(function(items) {
                    $scope.shoppingList.items = items;
                }, function(error) {
                    //handle error
                });
            }
        }
    };
});