/**
 * Created by shalin on 10/6/2016.
 */
var shoopingCart = angular.module('shoppingCart', []);
shoopingCart.controller('shoppingCart', function ($scope, $http, $window) {


    $http({
        method: "GET",
        url: '/userData'
    }).success(function (result) {
        $scope.username = result.username;
    }, function (err) {
        console.log("error occurred: " + err);
    });

    $http({
        method: "GET",
        url: '/cartData',
    }).success(function (results) {
        console.log("in angualr");
        console.log(Total(results));
        $scope.products = results;
        $scope.grandTotal = Total(results);
    },function (err) {
        console.log(err);
    });

    $scope.test = function (x,y,z,a) {
        total1 = x * z;
        $http({
            method : "GET",
            url: '/addToShoppingCartUpdate',
            params: {
                quantity : x,
                p_id : y,
                total : total1,
                s_id: a
            }
        }).success(function (results) {
            $scope.products = results;
            $scope.grandTotal = Total(results);
            console.log(Total(results));
        },function (err) {
            console.log(err);
        });

    }

    function Total(results) {
        var total=0;
        for(var i=0;i<results.length;i++){
            total = total + results[i].total;
        }
        $scope.grandTotal = total;
        return total;
    }

    $scope.search = function () {
        $http({
            method: "GET",
            url: "/search",
            params: {
                searchQ: $scope.searchQ
            }
        }).success(function (results) {
            $scope.searchs = results;
        },function (err) {
            console.log(err);
        });
    };

    $scope.checkoutPage = function () {
        $http({
            method: "GET",
            url: '/checkoutPageData',
            params: {
                grandTotal: $scope.grandTotal
            }
        }).success(function (result) {
            if(result == "success"){
                $window.location.assign('/checkoutPage');
            }
        },function (err) {
            console.log(err);
        });
    }
});