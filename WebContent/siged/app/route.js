
(function(){
  'use strict';
  config.$inject = ['$routeProvider'];
  function config($routeProvider) {
        $routeProvider
        .when('/fuerzaMexico',{
        template: '<fuerza-component></fuerza-component>',
        controllerAs: 'vm'
      }).when('/fondoEscuela',{
      template: '<fondo-component></fondo-component>',
      controllerAs: 'vm'
    });
}

angular
  .module('myApp')
  .config(config);

})();
