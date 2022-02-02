angular.module('myApp2', []).controller('namesCtrl', function ($scope) {
    $scope.names = [
        { name: 'Jani', country: 'Norway' },
        { name: 'Salvador', country: 'México' },
        { name: 'Kai', country: 'Denmark' }
    ];
});