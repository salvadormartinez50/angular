
var app = angular.module('plazaEstados', ['ngResource']);

app.controller('plazaEstadosController', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope){

      $scope.getURLCatalogs = function () {
          return 'https://siged.sep.gob.mx/services/CatalogosSiged/CatalogosRS/catalogos/cat_entidad_federativa';
      }
	
	$scope.archivos = [ {'url': '01 Educación_Inicial','nombre': 'Educación inicial'},
						{'url': '02 Educación_Preescolar', 'nombre' : 'Educación preescolar'},
						{'url': '03 Educación_Primaria', 'nombre' : 'Educación primaria'},
						{'url': '04 Educación_Secundaria', 'nombre' : 'Educación secundaria'},
						{'url': '05 Educación_Secundaria Tecnica', 'nombre' : 'Educación secundaria técnica'},
						{'url': '06 Educación_Especial', 'nombre' : 'Educación especial'},
						{'url': '07 Educación_Preescolar_INDIGENA', 'nombre' : 'Educación preescolar indígena'},
						{'url': '08 Educación_Primaria_INDIGENA', 'nombre' : 'Educación primaria indígena'},
						{'url': '09 EO ALBERGUE PRIMARIA' , 'nombre' : 'Albergue primaria'},
						{'url': '10 EO ALBERGUE SECUNDARIA', 'nombre' : 'Albergue secundaria'},
						{'url': '11 MIGRANTES PREESCOLAR', 'nombre' : 'Migrantes preescolar'},
						{'url': '12 MIGRAMTES PRIMARIA' , 'nombre' : 'Migrantes primaria'},
						{'url': '13 MIGRANTES SECUNDARIA' , 'nombre' : 'Migrantes secundaria'},
						{'url': '14 Educación Basica para Adultos', 'nombre' : 'Educación básica para adultos'},
						{'url': '15 Misión Cultural', 'nombre' : 'Misión cultural'}				
	]

}]);
