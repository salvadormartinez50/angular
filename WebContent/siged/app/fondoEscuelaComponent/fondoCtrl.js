(function(){
  'use estrict';

  angular
    .module('myApp')
    .component('fondoComponent', {
      templateUrl: 'app/fondoEscuelaComponent/fondo.html',
      controller: fondoCtrl ,
    });

    function fondoCtrl($scope,$http){

      $scope.buscar = function(){
        $http(
                {
                    method: 'get',
                    url: 'https://siged.sep.gob.mx/Core/cctDano/cct='+$scope.cct,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                })
                .then(function(data){
                  console.log(data)
                  $scope.escuela = data.data.datos;
                  if($scope.escuela[0].dano != 'ABIERTA'){
                    $('.img-programa').addClass('filtro-gris');
                    switch ($scope.escuela[0].dano) {
                      case 'TOTAL':
                        $('.img-total').removeClass('filtro-gris');
                        $scope.escuela[0].alertdanio = 'danger'
                        break;
                      case 'MENOR':
                          $('.img-menor').removeClass('filtro-gris');
                          $scope.escuela[0].alertdanio = 'info'
                      break;
                      case 'PARCIAL':
                          $('.img-parcial').removeClass('filtro-gris');
                          $scope.escuela[0].alertdanio = 'warning'
                      break;
                      default:
                        $('.img-programa').removeClass('filtro-gris');
                      break;


                    }
                  }

                  console.log($scope.escuela)

                });
      }
    }

})();
