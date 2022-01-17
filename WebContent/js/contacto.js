var app = window.angular.module('contacto', ['ngResource']);

app.controller('contactoController', ['$scope', '$http', '$window', '$rootScope',
    function ($scope, $http, $window, $rootScope) {

        $scope.getTipoProblema = function () {
            $http.get(global_uri+'/modulos/catalogoContactanos/').success(function (data) {
                $scope.contacto = data.modulosDTO;
            });
        }

        $scope.saveContacto = function () {                       	
            $http({
                url: global_uri+'/modulos/Contactanos/'+
                      '?titulo=' + $scope.titulo +
                      '&idTipoProblema=' + $scope.user.idTipoProblema.id +
                      "&descProblema=" + $scope.descProblema +
                      "&nombre=" + $scope.nombre +
                      "&apellido=" + $scope.apellido +
                      "&correo=" + $scope.correo,
                method: 'POST',                
                headers : {
                	"Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"				    				    
				},
	            data : "",
				async : true,
				crossDomain : true,
				dataType : ""
              }).success(function (data) {
                console.log("ok");
                $("#modalEnviado").modal('show');

                window.setTimeout(function(){
                    // Move to a new location or you can do something else
                    window.location.reload();

                }, 15000);
            }).error(function (error) {
                //$("#modalNoEnviado").modal('show');
                $("#modalEnviado").modal('show');

                console.error("Error");
                console.log(error);
            });
        }

    }]
);
