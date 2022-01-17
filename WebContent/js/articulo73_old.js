
var app = angular.module('plazaEstados', ['ngResource']);

app.controller('plazaEstadosController', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope){

      $scope.getURLCatalogs = function () {
          return 'https://siged.sep.gob.mx/services/CatalogosSiged/CatalogosRS/catalogos/cat_entidad_federativa';
      }

      $scope.getStates = function () {
          $http.get(
                  $scope.getURLCatalogs())
                  .success(function (data) {
                    console.log(data)
                      $scope.states = data.entFed;
                      $('#cargando').hide()
                      $('#responsable').show()

                      console.log($scope.states)
                  });
      }

}]);
