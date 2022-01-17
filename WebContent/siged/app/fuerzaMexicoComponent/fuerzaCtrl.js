(function(){
  'use estrict';

  angular
    .module('myApp')
    .component('fuerzaComponent', {
      templateUrl: 'app/fuerzaMexicoComponent/fuerza.html',
      controller: fuerzaCtrl ,
    });

    function fuerzaCtrl($scope){

      $('#main-search').fadeIn('slow');

      var muestra = 0;
      $('.btn-opcion').click(function(){
        if(muestra){
          $('#extras').show('fast')
          muestra = 0;
        }
        else{
        $('#extras').hide('fast')
        muestra = 1;
        }
      })
  }

})();
