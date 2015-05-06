'use strict';

angular.module('ryanWeb').factory('shoppingListService', function($http, $log, $q) {
    var SHOPPING_LIST_URL = '/ryan-web-service/items';
    var ADD_ITEM_URL = '/ryan-web-service/item/add';
    var REMOVE_ITEM_URL = '/ryan-web-service/item/remove/';

    return {
        getShoppingItems: function() {
            return $http.get(SHOPPING_LIST_URL).then(function(response) {
                return response.data;
            }, function(error) {
                $log.error('Failed to get shopping items: ', error);
                return $q.reject(error);
            });
        },
        addShoppingItem: function(item) {
            return $http.post(ADD_ITEM_URL, item).then(function(response) {
                return response.data;
            }, function(error) {
                $log.error('Failed to add shopping item: ', error);
                return $q.reject(error);
            });
        },
        removeShoppingItem: function(item) {
            return $http.delete(REMOVE_ITEM_URL + item.id).then(function(response) {
                return response.data;
            }, function(error) {
                $log.error('Failed to remove shopping item: ', error);
                return $q.reject(error);
            })
        }
    } ;
});
