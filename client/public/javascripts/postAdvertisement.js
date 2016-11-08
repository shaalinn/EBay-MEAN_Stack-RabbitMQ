/**
 * Created by shalin on 9/30/2016.
 */
var postAD = angular.module('postAD', []);
postAD.controller('postAD',function ($scope, $http, $window) {



        $http({
            method: "GET",
            url: "/userData",
        }).success(function (result) {
            $scope.username = result.username;
        },function (err) {
            console.log("error occurred: "+err);
        });



    console.log("in angular");
    $scope.sell = function () {

        console.log($scope.pName, $scope.pDescription, $scope.price, $scope.quant, $scope.from);
        $http({
            method: "GET",
            url: '/postAdvertisement/sellItem',
            params: {
                pName: $scope.pName,
                pDescription: $scope.pDescription,
                price: $scope.price,
                quant: $scope.quant,
                sell: "sell",
                from: $scope.from
            }
        }).success(function () {
            $window.location.assign('/');
        }, function () {
            $window.location.assign('/postAdvertisement');
        });
    }

    $scope.auction = function () {

        console.log($scope.pName, $scope.pDescription, $scope.price, $scope.from);
        $http({
            method: "GET",
            url: '/postAdvertisement/sellItem',
            params: {
                pName: $scope.pName,
                pDescription: $scope.pDescription,
                price: $scope.price,
                quant:  0,
                sell: "auction",
                from: $scope.from
            }
        }).success(function () {
            $window.location.assign('/');
        }, function () {
            $window.location.assign('/postAdvertisement');
        });
    }

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