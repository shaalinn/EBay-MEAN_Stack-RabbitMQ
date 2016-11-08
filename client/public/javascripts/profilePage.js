/**
 * Created by shalin on 10/5/2016.
 */
/**
 * Created by shalin on 10/2/2016.
 */
var app = angular.module('profile', []);
app.controller('profile', function ($scope, $http, $window) {



    $http({
        method: "GET",
        url: "/userData",
    }).success(function (result) {
        $scope.username = result.username;
    },function (err) {
        console.log("error occurred: "+err);
    });


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
});

