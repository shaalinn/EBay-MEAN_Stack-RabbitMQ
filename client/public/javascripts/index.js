/**
 * Created by shalin on 10/3/2016.
 */
var header = angular.module('indexBody', []);
header.controller('indexBody', function ($scope, $http) {

        $http({
            method: "GET",
            url: '/userData'
        }).success(function (result) {
            $scope.username = result.username;
        },function (err) {
            console.log("error occurred: "+err);
        });

        $http({
            method: "GET",
            url: '/productList'
        }).success(function (result) {
            console.log(result);
            $scope.products = result;
        }), function (err) {
            console.log(err);
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