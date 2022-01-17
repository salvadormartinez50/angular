var marker;
let markerLatLng;

var app = angular.module('myApp', []);
app.controller('myCtrl', ["$scope", "$http", "$window", function ($scope, $http, $window) {

  $scope.markers = [];
  $scope.markerCluster = null;

  $scope.claveEscCluster = [];

  var categorias = [];

  //get
  $('#box-restore').hide();
  $('#estado').attr('disabled', true)
  $('#estado2').append('<i class="fa fa-spin fa-spinner"></i>')
  $http.get(global_uri + "/plaza/estado")
    .then(function (data) {
      var arreglo = [];

      data.data.forEach(function (valor) {
        var elemento = {};
        elemento.id = valor.estadoDTO.id
        elemento.nombre = valor.estadoDTO.nombre;
        arreglo.push(elemento);
        $('#estado2').html('* Entidad')
        $('#estado').attr('disabled', false);

      });

      $scope.states = arreglo;


    });

  $http.get(global_uri + "/catalogos/nivel")
    .then(function (data) {
      var arreglo = [];
      $scope.levels = data.data.nivelescolarDTO;
    });

  $http.get(global_uri + "/catalogos/clasificacion")
    .then(function (data) {
      var arreglo = [];
      $scope.clasificaciones = data.data.clasificacionDTO;
    });


  $scope.getMunicipios = function () {
    $('#municipio').attr('disabled', true)
    $('#etiqueta_municipio').append('<i class="fa fa-spin fa-spinner"></i>')

    $http.get(global_uri + "/plaza/municipio/identidad=" + $scope.user.state.id)
      .then(function (data) {
        data.data.forEach(function (reg, id) {
          if (reg == null)
            data.data.splice(id, 1);
        })
        $('#etiqueta_municipio').html('* Municipio')
        $('#municipio').attr('disabled', false);

        $scope.municipalities = data.data;
      });
  }

  $scope.getCategorias = function () {

    //console.info($scope.user.municipality.municipioDTO.id);



    if ($scope.user.municipality === undefined || $scope.user.municipality === null) {
      var nombreMun = 0
    } else {
      var nombreMun = $scope.user.municipality.municipioDTO.id
    }

    console.info(nombreMun);

    $('#addon-categoria').html('<i class="fa fa-spin fa-spinner"></i>')
    $http.get(global_uri + "/plaza/categorias/identidad=" + $scope.user.state.id + "&idmunicipio=" + nombreMun + "&idnivel=" + $scope.user.nivel.id)
      .then(function (data) {
        $("#categoria").attr('disabled', false);
        $("#categoria").val('')
        $('#addon-categoria').html('<i class="fa fa-list-alt"></i>')


        if (data.data.length != 0) {
          data.data.cts.forEach(function (valor) {
            var nombre = valor.categoriaDTO.nombre;
            categorias.push(nombre);
          });

          $("#categoria").autocomplete({
            source: function (request, response) {
              var results = $.ui.autocomplete.filter(categorias, request.term);
              response(results.slice(0, 10));
            }
          });
        } else {
          $("#categoria").attr('disabled', true);
          $("#categoria").val('No se encontró ninguna categoria en este municipio')
        }
      });
  }

  $scope.restoreFilters = function () {
      //console.log("entró a restoreFilters");
      $('#mensaje_apartados').show();
      $(".buscador_caja").animate({ top: '0px' }, 'fast');
      $('#box-search').show();
      $('#box-restore').hide();
  }

  $scope.buscar = function () {
    var myLatLng, bounds;

    if ($scope.user.municipality === undefined || $scope.user.municipality === null) {
      var nombreMun = 0;
    } else {
      var nombreMun = $scope.user.municipality.municipioDTO.nombre;
    }

    if ($scope.user.municipality === undefined || $scope.user.municipality === null) {
      var idMun = 0;
    } else {
      var idMun = $scope.user.municipality.municipioDTO.id;
    }

    var nombreEst = $scope.user.state.nombre, idEst = $scope.user.state.id;
    // var nombreCat = $scope.user.categoria.toLowerCase()
    var nombreCla = $scope.user.clasificacion.id;

    var height

    $('.buscador_titulo').hide('slow');

    //if ($(window).width() > 768) {
      //$('.filtros_container').hide();
      $('#box-search').hide();
      $('#box-restore').show();
      //$('#kevin').hide();
      $('#mensaje_apartados').hide();
      $(".buscador_caja").animate({ top: '80px' }, 'fast');
      $(".buscador_caja").attr('rel', '1');
    //}

    //acondicionamos la vista para que no pueda clickear donde sea
    $('#buscar_plaza').attr('type', 'button');
    //$('#buscar_plaza').html('<i class="fa fa-spin fa-spinner"></i> Buscando ');
    $("#modal-loading").modal('show');
    $('.tiempo_fuera').hide();
    setTimeout(revisaModal, 30000);
    if (nombreEst == 'MEXICO')
      nombreEst = 'ESTADO DE MEXICO';

    $http.defaults.headers.get = { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" }

    $http({
      url: global_uri + "/plaza/buscarDisponible/identidad=" + idEst + "&idmunicipio=" + idMun + '&nivel=' + $scope.user.nivel.id + "&clasificacion=" + nombreCla,
      data: "",
      dataType: 'json',
      method: "GET"

    })
      .then(function (data) {

        $('#buscar_plaza').attr('type', 'submit');
        //$('#buscar_plaza').html('Buscar');
        $("#modal-loading").modal('hide');
        if (data.data.length == 0 || data.data.cts.length == 0 || data.data == null) {
          //alert('No se encontraron plazas disponibles con los parámetros de busqueda.')
          $("#modal-no-plazas").modal('show');
        } else {
          data.data.cts.forEach(function (item, index) {
            let infoEscuela = item.ctDTO.clave;

            iframe.contentWindow.postMessage(`crearMarker(${item.ctDTO.ctDealleDTO.latitud}, ${item.ctDTO.ctDealleDTO.longitud}, '${infoEscuela}', '${item.ctDTO.turnoDTO.id}' );`, '*');

          });


          // Add a marker clusterer to manage the markers.
          /*$scope.markerCluster = new MarkerClusterer(map, $scope.markers,
            { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });

          google.maps.event.addListener($scope.markerCluster, 'clusterclick', function (cluster) {
            console.log("clusterclic");
            // your code here
            if (this.getMap().getZoom() > 15) {
              var escuelas = [];

              cluster.getMarkers().forEach(function (item, index) {
                console.log('información de escuela');
                console.log(item)
                escuelas.push({ 'ct': item.customInfo[0], 'idTurno': item.customInfo[1], 'nombre': item.title, 'nombreTurno': item.customInfo[2] });
              })
              $scope.abrir_multiplesescuela(escuelas);
            }

          });*/
        }

      });

  }

  $scope.mas_informacion2 = function () {

    $('#informacion_extra').attr('type', 'button');
    $('#informacion_extra').html('<i class="fa fa-spin fa-spinner"></i> Buscando Información');

    $scope.school = null;

    $http.get(global_uri + '/escuela/detalleCT/cct=' + $scope.claveEsc + '&idTurno=' + $scope.idTurno)
      .then(
        function (data) {
          console.log(data)
          data = data.data
          $scope.showResults = true;
          $scope.school = data.datos;

          //$scope.getImagen(idDetailsToShow);
          //console.log("$scope.school.latDms = "+$scope.school.latDms);
          //console.log("$scope.school.lonDms = "+$scope.school.lonDms);

          if ($scope.school.latDms == null || $scope.school.latDms < 1) {
            $('#accordionMap').hide();
          } else {
            $('#accordionMap').show();
            //  $('#accordionMap').show()
            console.log("coord mapa: " + $scope.school.latDms + " : " + $scope.school.lonDms);
            initialize($scope.school.latDms, $scope.school.lonDms);

          }
          if (data.ctImagen !== undefined && data.ctImagen.length > 0) {
            $scope.ctImagen = data.ctImagen[0];
          } else {
            $scope.ctImagen = null;
          }

          if (data.fuentes !== undefined && data.fuentes.length > 0) {
            $scope.fuentePlazaCCT = data.fuentes[0];
          } else {
            $scope.fuentePlazaCCT = null;
          }
          //$scope.getStats(idDetailsToShow, idSchedule);
          if (data.plazas !== undefined && data.plazas.length > 0) {

            $("#plazasDis").show();

            $scope.plazasEsc = data.plazas;
          } else {
            $("#plazasDis").hide();
            $scope.plazasEsc = null
          }

          if (data.estadistica !== undefined) {
            try {
              $scope.stats = data.estadistica[0];
              girls = Number($scope.stats.alumnosM);
              boys = Number($scope.stats.alumnosH);
              totalKids = girls + boys;
              girls = (girls / totalKids) * 100;
              boys = (boys / totalKids) * 100;
              men = Number($scope.stats.docenteH);
              women = Number($scope.stats.docenteM);
              totalTeachers = men + women;
              men = (men / totalTeachers) * 100;
              women = (women / totalTeachers) * 100;
              $scope.girls = girls;
              $scope.boys = boys;
              $scope.men = men;
              $scope.women = women;

              alum1 = $scope.stats.alumprimero;
              alum2 = $scope.stats.alumsegundo;
              alum3 = $scope.stats.alumtercero;
              alum4 = $scope.stats.alumcuarto;
              alum5 = $scope.stats.alumquinto;
              alum6 = $scope.stats.alumsexto;
              totalAlum = alum1 + alum2 + alum3 + alum4 + alum5 + alum6;
              $scope.totalesAlum1 = (alum1 / totalAlum) * 100;
              $scope.totalesAlum2 = (alum2 / totalAlum) * 100;
              $scope.totalesAlum3 = (alum3 / totalAlum) * 100;
              $scope.totalesAlum4 = (alum4 / totalAlum) * 100;
              $scope.totalesAlum5 = (alum5 / totalAlum) * 100;
              $scope.totalesAlum5 = (alum6 / totalAlum) * 100;

            }
            catch (err) {
              console.error("error: ");
              console.error(err);
              $scope.stats = null;
            }

          } else {
            $scope.stats = null;
          }

          if (data.docentes !== undefined && data.docentes.length > 0) {

            $("#DocentesEsc").show();

            $scope.docentes = data.docentes;
          } else {
            $("#DocentesEsc").hide();
            $scope.docentes = null
          }

          $scope.searchButtons = false;


          $('.ct_container').hide('fast');
          $('.ct_container_extra').show('slow');
          //mueve el tamaño del mapa nuevamente para no tener errores
          $("#panelLocation").collapse("hide");
          $("#accordionMap").collapse("hide");
          $(".collpase-button").addClass('collpase-button collapsed');

        });
  }

  $scope.abrir_escuela = function (clave, turno) {
    $('#informacion_extra').attr('type', 'submit');
    $('#informacion_extra').html('más información');
    $('#modalCt').modal('show');
    $('.ct_container').hide();
    $('.ct_container_extra').hide();

    $('.ct_cargando').show();

    //console.log(global_uri + "/plaza/plazaCct2/cct=" + clave + "&idTurno=" + turno);

    $http.get(global_uri + "/plaza/plazaCct2/cct=" + clave + "&idTurno=" + turno)
      .then(function (data) {
        console.log(data);
        var infoCCT = data.data.listPlazaByCct[0];
        var infoPlaza = data.data.listPlazaByCct;
        var infoFuente = data.data.fuentes[0];
        console.log(infoFuente);
        $scope.cicloListaPlaza = infoFuente.ciclo;
        $scope.quincenaPlaza = infoFuente.quincena;
        $scope.fuentePlaza = infoFuente.fuentePlaza;
        $scope.nominaCct = infoFuente.nominaCct;
        $scope.fuenteNominaCct = infoFuente.fuenteNominaCct;

        $scope.nombreEsc = infoCCT.ctDTO.nombre;
        $scope.claveEsc = infoCCT.ctDTO.clave;
        $scope.fechaActualizacionEsc = infoCCT.ctDTO.fechaActualizacion;
        $scope.idTurno = infoCCT.ctDTO.turnoDTO.id;
        $scope.calleEsc = infoCCT.ctDTO.ctDealleDTO.calle;
        $scope.numExtEsc = infoCCT.ctDTO.ctDealleDTO.numExt;
        $scope.numIntEsc = infoCCT.ctDTO.ctDealleDTO.numInt;
        $scope.coloniaEsc = infoCCT.ctDTO.ctDealleDTO.colonia;
        $scope.cpEsc = infoCCT.ctDTO.ctDealleDTO.cp;
        $scope.estado = infoCCT.estadoDTO.nombre;
        //$scope.municipio = data.data[0].municipioDTO.nombre;
        if (infoCCT.municipioDTO === null || infoCCT.municipioDTO === undefined) {
          $scope.municipio = null;
        } else {
          $scope.municipio = infoCCT.municipioDTO.nombre
        }
        //$scope.localidad = data.data[0].localidadDTO.nombre;
        if (infoCCT.localidadDTO === null || infoCCT.localidadDTO === undefined) {
          $scope.localidad = null;
        } else {
          $scope.localidad = infoCCT.localidadDTO.nombre;
        }
        $scope.plazas = infoPlaza;
        $('.ct_container').show();
        $('.ct_cargando').hide();
      });

  }
  $scope.mas_informacion = function () {

    $scope.ctImagen = null;
    $('#informacion_extra').attr('type', 'button');
    $('#informacion_extra').html('<i class="fa fa-spin fa-spinner"></i> Buscando Información');

    $http.get(global_uri + "/escuela/detalleCT/cct=" + $scope.claveEsc + '&idTurno=1')
      .then(function (data) {
        $scope.school = data.data.datos
        $http.get('https://siged.sep.gob.mx/Core/ct/ctEstad/cct=' + $scope.claveEsc + '&idTurno=1')
          .then(function (data) {
            $scope.stats = data.data.estadistica[0];

            if ($scope.stats !== undefined) {
              $scope.totalKids = parseInt($scope.stats.alumnosM) + parseInt($scope.stats.alumnosH);
              $scope.girls = (parseInt($scope.stats.alumnosM) * 100 / parseInt($scope.totalKids));
              $scope.boys = (parseInt($scope.stats.alumnosH) * 100 / parseInt($scope.totalKids));
            }

            $('.ct_container').hide('fast');
            $('.ct_container_extra').show('slow');
            $http.get('https://siged.sep.gob.mx/Core/ct/ctImg/cct=' + $scope.claveEsc + '&etiqueta=Entrada')
              .then(function (data) {
                $scope.ctImagen = data.data.ctImagen[0];
              });
          });
      });

  }
  $scope.atras = function () {
    $('.ct_container').show('slow');
    $('.ct_container_extra').hide('fast');
    $('#informacion_extra').attr('type', 'submit');
    $('#informacion_extra').html('más información');
  }
  //$scope.abrir_escuela("01DPR0598S");
  $scope.abrir_escuela_alt = function (clave, turno) {
    $('#modalMultipleCt').one('hidden.bs.modal', function () {
      $scope.abrir_escuela(clave, turno);
    }).modal('hide');

  }
  $scope.abrir_multiplesescuela = function (escuelas) {

    $('#modalMultipleCt').modal('show')
    $('.cts_container').hide();
    $('.cts_cargando').show();

    //ESTO ESTA HORRIBLE, PERO POR AHORA NO SE HACER UN PROMISE SIN USAR HTTP, REMOVER ESTE GET ENCUANTO PUEDAS
    $http.get(global_uri + "/plaza/estado")
      .then(function (data) {
        $('.cts_cargando').hide();
        $('.cts_container').show();
        $scope.claveEscCluster = escuelas;
      });
  }



  $window.addEventListener("message", function (event) {

    $scope.abrir_escuela(event.data[0], event.data[1]);

  }, false);


  //$scope.abrir_escuela('01DST0037V',1);

  //$scope.abrir_multiplesescuela([{"ct":"01DES0009G","nombre":"CONGRESO DE ANAHUAC"},{"ct":"01DES0011V","nombre":"CONVENCION DE AGUASCALIENTES"},{"ct":"01FLB0002V","nombre":"PROYECTO DE LABORATORIO DE INGLES EN SECUNDARIAS"},{"ct":"01FIG0001D","nombre":"PROGRAMA NACIONAL DE INGLES EN EDUCACION BASICA"}]);
}]);
app.filter('formatDate', function (dateFilter) {
  var formattedDate = '';
  return function (dt) {
    if (dt !== undefined) {
      formattedDate = dateFilter(new Date(dt.split('-').join('/')), 'd/M/yyyy');
    } else {
      formattedDate = null;
    }
    return formattedDate;
  }

});

var modalImagen = function () {
  $("#modal-imagen").modal('show');
}


var verMas = function () {
  document.getElementById("divSchoolStats2").style = "display: inline";
  document.getElementById("divSchoolStats3").style = "display: inline";
  document.getElementById("texotMas").innerHTML = "ver menos";

  document.getElementById("mas2").className = "fa fa-minus-circle";
  document.getElementById("texotMas").href = "javascript:verMenos();";
}
var verMenos = function () {
  document.getElementById("divSchoolStats2").style = "display: none";
  document.getElementById("divSchoolStats3").style = "display: none";
  document.getElementById("texotMas").innerHTML = "ver más";
  document.getElementById("mas2").className = "fa fa-plus-circle";
  document.getElementById("texotMas").href = "javascript:verMas();";

}
var initialize = function (lat, lng) {
  //console.log("Entró a initialize con: lat="+lat+", lng="+lng);

  if (lat == null || lng == null) {
    lat = 22.5579822;
    lng = -120.8041848;
  }
  
  //console.log(markerLatLng);
  iframe2.contentWindow.postMessage("crearMarker(" + lat + ", " + lng + ")", '*');

}

var revisaModal = function () {
  if (($("#modal-loading").data('bs.modal') || {}).isShown) {
    $('.tiempo_fuera').show();
  }
}

let iframe2;
$(document).ready(function () {
    //console.log("Entró a document.ready 0236")
    iframe2 = document.getElementById("mapIFrame2");
});



