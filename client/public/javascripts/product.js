/**
 * Created by shalin on 10/5/2016.
 */
var product = angular.module('product',[]);
product.controller('product', function ($scope, $http, $window) {
    $http({
        method: "GET",
        url: '/userData'
    }).success(function (result) {
        $scope.username = result.username;
    },function (err) {
        console.log("error occurred: "+err);
    });

    $scope.addToSell = function () {
        var total = $scope.quantity * $scope.price;
        console.log(total, $scope.quantity, $scope.price, $scope.p_id);
        $http({
            method : "GET",
            url: '/addToShoppingCart',
            params: {
                quantity : $scope.quantity,
                p_id : $scope.p_id,
                total : total
            }
        }).success(function (results) {
            $window.location.assign('/');
        },function (err) {
            console.log(err);
        });
    };

    $scope.addToBid = function () {
        console.log("in bidding");
        console.log($scope.p_id);
        $http({
            method : "GET",
            url: '/placeBid',
            params: {
                bidPrice : $scope.bidPrice,
                p_id : $scope.p_id,
            }
        }).success(function (results) {
            $window.location.assign('/');
        },function (err) {
            console.log(err);
        });
    };


    $scope.search = function () {
        $http({
            method: "GET",
            url: "/search",
            params: {
                searchQ: $scope.searchQ
            }
        }).success(function (results) {
            $scope.products = results;
        },function (err) {
            console.log(err);
        });
    };
});