/**
 * Created by shalin on 10/2/2016.
 */
var app = angular.module('profile', []);
app.controller('profile', function ($scope, $http, $window) {

    $http({
        method: "GET",
        url: "/orderData"
    }).success(function (result) {

    },function (err) {
        console.log(err);
    })

    $http({
        method: "GET",
        url: "/userData",
    }).success(function (result) {
        $scope.username = result.username;
    },function (err) {
        console.log("error occurred: "+err);
    });

    $http({
        method: "GET",
        url: "/allOrders"
    }).success(function (result) {
        $scope.orders = result;
    },function (err) {
        console.log(err);
    });

    $http({
       method: "GET",
        url: "/allBids"
    }).success(function (result) {
        $scope.bids = result;
    },function (err) {
        console.log(err);
    });

    $http({
        method: "GET",
        url: "/allSolds"
    }).success(function (result) {
        $scope.solds = result;
    },function (err) {
        console.log(err);
    });

    $http({
        method: "GET",
        url: "/profileData",
    }).success(function (result) {
        console.log(result);
        var name = result[0].fn + " " + result[0].ln;
        var address = result[0].addr + ", " + result[0].city + ", " + result[0].state;
        $scope.username = result[0].username;
        $scope.bdate = result[0].bdate;
        $scope.email = result[0].email;
        $scope.phno = result[0].phno;
        $scope.name = name;
        $scope.last_login = result[0].last_login;
        $scope.address = address;
    },function (err) {
        console.log(err);
    });

    $http({
        method: "GET",
        url: "/itemForSale",
    }).success(function (result) {
        console.log(result);
        $scope.products = result;
    },function (err) {
        console.log(err);
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

app.controller('update', function ($scope, $http, $window) {
    $scope.updateProfile = function () {
        $http({
            method: "GET",
            url: '/updateProfile',
            params: {
                fnn: $scope.fnn,
                lnn: $scope.lnn,
                phnon: $scope.phnon,
                bdaten: $scope.bdaten,
                addrn: $scope.addrn,
                cityn: $scope.cityn,
                staten: $scope.staten
            }
        }).success(function (results) {
            $window.location.assign('/profile');
        },function (err) {
            console.log(err);
        });
    };



});