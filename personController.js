angular.module('myApp1', []).controller('personCtrl', function ($scope) {
    $scope.firstName = "Salvador",
        $scope.lastName = "Martínez",
        $scope.fullName = function () {
            return $scope.firstName + " " + $scope.lastName;
        }
});