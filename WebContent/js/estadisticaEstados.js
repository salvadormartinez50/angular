var app = window.angular.module('estadisticaEstado', ['ngResource']);

app.controller('estadisticaEstadoController', ['$scope', '$http', '$window', '$rootScope',
    function ($scope, $http, $window, $rootScope) {

        $scope.estados = function () {
            $http.get('https://siged.sep.gob.mx/services/CatalogosSiged/CatalogosRS/catalogos/cat_entidad_federativa').success(function (data) {
                $scope.estado = data.entFed;
            }).error(function (error) {
                console.error("Error");
                console.log(error);
            });
        }

        selectGrafica = function(){
            console.info("ok");

            var opcion = $scope.state.id;

            if(opcion == 01) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = 'file:///C:/Users/Jesus/workspace/SIGED/WebContent/index.html';
            } else if(opcion == 02) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = 'http://beta.speedtest.net/es';
            } else if(opcion == 03) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = 'http://172.31.62.4:7004/SIGED/index.html';
            } else if(opcion == 04) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = 'http://172.31.62.4:7004/SIGED/estadisticas/escuelas.html';
            } else if(opcion == 05) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = 'http://172.31.62.4:7004/SIGED/contacto.html';
            } else if(opcion == 06) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 07) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 08) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 09) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 10) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 11) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 12) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 13) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 14) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 15) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 16) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 17) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 18) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 19) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 20) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 21) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 22) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 23) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 24) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 25) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 26) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 27) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 28) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 29) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 30) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 31) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else if(opcion == 32) {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            } else {
                console.info(opcion);
                document.getElementById("frameEstadistica").src = '';
            }
        }

    }]
);

