angular.module('myApp1', []).controller('personCtrl', function ($scope) {
    $scope.firstName = "Salvador",
        $scope.lastName = "Martínez",
        $scope.fullName = function () {
            return $scope.firstName + " " + $scope.lastName;
        }
});

var app = angular.module('myApp3', []);
app.controller('myCtrl', function($scope){
    $scope.color = 'red';
})