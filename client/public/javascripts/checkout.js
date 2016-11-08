/**
 * Created by shalin on 10/11/2016.
 */
var checkout = angular.module('checkout', []);
checkout.controller('checkout', function ($scope, $http, $window) {

    $http({
        method: "GET",
        url: '/checkoutData'
    }).success(function (result) {
        console.log(result);
        $scope.address = result[0].addr + ", " + result[0].city +", "+ result[0].state;
        console.log(result[0].addr + ", " + result[0].city +", "+ result[0].state);
        $scope.grandTotal = result[0].grandTotal;
        console.log(result[0].grandTotal);
    },function (err) {
        console.log(err);
    });

    $scope.checkoutFinal = function () {

        $http({
            method: "GET",
            url: "/checkout"
        }).success(function (result) {
            if(result == "done"){
                $window.location.assign('/');
            }
        },function (err) {
            console.log(err);
        });
    }

});