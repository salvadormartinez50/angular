$(function () {
    $('.btn-zona').click(function () {
        $('.alert-zona').removeClass('alert-info');
        $(this).parent('.alert-zona').addClass('alert-info');
        if ($(this).attr('id') == 'entidad')
            $('#select_entidad').show('slow');
        else
            $('#select_entidad').hide();


    });
});

var app = angular.module('estadisticas', ['ngResource']);

app.controller(
        'buscarEstadisticas',
        [
            '$scope',
            '$http',
            '$rootScope',
            function ($scope, $http, $rootScope) {
                $scope.tipo = null;
                $scope.estado = null;

                $scope.getURLCatalogs = function () {
                    return 'https://siged.sep.gob.mx/services/CatalogosSiged/CatalogosRS/catalogos/';
                }
                $scope.getStates = function () {
                    $http.get($scope.getURLCatalogs() + 'cat_entidad_federativa')
                            .success(function (data) {
                                console.log(data);
                                $scope.states = data.entFed;
                            });
                }
                $scope.getZona = function (tipo_zona) {
                    console.log(tipo_zona);
                    if (tipo_zona === undefined)
                        $scope.estado = "";
                    else
                        $scope.estado = tipo_zona;
                }
                $scope.search = function () {
                    $('.error').hide()
                    if ($scope.tipo === null || $scope.estado === null) {
                        if ($scope.tipo === null) {
                            $('#error_tipo').show();
                        }
                        if ($scope.estado === null) {
                            $('#error_estado').show();

                        }
                        $('html, body').animate({
                            scrollTop: 0
                        }, 1000);
                    } else {
                        alert($scope.tipo + ',' + $scope.estado)
                    }

                }
            }
        ]
        );