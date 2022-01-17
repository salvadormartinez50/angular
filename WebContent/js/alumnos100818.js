$(function () {
    /*$('.panel-map').on('shown.bs.collapse', function (e) {
        google.maps.event.trigger(map, "resize");
        map.setCenter(marker.getPosition());
    });*/

    $('#tblTeachers').on( 'draw.dt', function() {
        var seen = {};
        $('#tblTeachers tr').each(function() {
            var txt = $(this).text();
            if (seen[txt])
                $(this).remove();
            else
                seen[txt] = true;
            });
        });
});

/*var marker;
var markerLatLng;
var mapProp = {
    zoom: 15
};*/

//var map = new google.maps.Map(document.getElementById("map"), mapProp);

var body = $("html, body");

var app = window.angular.module('alumnos', ['ngResource']);

app.controller('alumnosController', ['$scope', '$http', '$window', '$rootScope',
    function ($scope, $http, $window, $rootScope) {

        var global_uri = 'http://172.31.62.7:8080/CoreServices_DES/apiRest';

        $scope.getConsultaByCURP = function () {
                    $scope.primeraBusqueda = 1;
            var curps = $scope.curp;
            curps = curps.toUpperCase();
            //console.log('https://siged.sep.gob.mx/services/AlumnoService/A/lumnoServiceRS/alumnos/alumno/' + curps);

            //var m = curps;
            //var expreg = /^[A-Z]{1,2}\s\d{4}\s([B-D]|[F-H]|[J-N]|[P-T]|[V-Z]){3}$/;
            var expreg = /^([A-Z]{4})([0-9]{6})([HM]{1})(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;

            //$("#modal-loading").modal('show');

            if (expreg.test(curps)) {

                processing();
$("#btnResetForm").removeClass("disabled");
                $http({
                    method: 'GET',
                    url: 'http://localhost/json/alumnos.php',
                    //url: global_uri+'/alumno/alumnoDetalle/curp=' + curps,
                    //url: 'http://localhost:8080/Core/alumno/curp=' + curps,
                    //url: 'https://siged.sep.gob.mx/services/AlumnoService/AlumnoServiceRS/alumnos/alumno/' + curps,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }

                }).success(function (data) {
                  $scope.primeraBusqueda = 0;
                  console.log( 'Detalle')
                  console.log(data)
                  if(data.datos !== undefined)
                    $scope.datos = data.datos.estatus;
                  else
                    $scope.datos = 2

                    var statu;

                    /*angular.forEach($scope.datos[0], function (value, key) {

                          statu = value.estatus;
                        //contEsc = value.control Escolar;

                    });*/

                    console.log($scope.datos);

                    if ($scope.datos == 1 || $scope.datos == 2) {
                        noprocessing();
                        console.log("error");
                        $scope.datos = null;
                        $scope.controlEscolar = null;
                        $scope.boleta= null;
                        $scope.estadisticasEscuela = null;


                        $('html, body').animate({
                            scrollTop: $("#noEncontrada").offset().top - 50
                        }, 1000);
                    } else {

                        noprocessing();
                      console.log("información: ")
                      console.log(data);

                        //DATOS PRINCIPALES
                        $scope.datos = data.datos.datos;
                        $scope.controlEscolar = data.datos.controlEscolar;

                        //DATOS DE Calificaciones
                        $scope.boleta= data.calificaciones;


                        //DATOS DE ESTADISTICA
                        $scope.estadisticasEscuela = data.promedioGrado;

                        datos = []
                        leyend = []

                        $scope.estadisticasEscuela.forEach(function(data){
                          leyend.push(data.grado+'°')
                          datos.push(data.promedio)
                        })

                        grafica(datos, leyend);


                        //$("#divCalendar").datepicker();
                        letra = curps;

                        var sexo = letra.substring(10, 11);

                        if (sexo == 'M') {
                            $scope.imgSexo = "images/avatar_nina.png";
                        } else {
                            $scope.imgSexo = "images/avatar_nino.png";
                        }

                        $scope.alerta($scope.estadisticasEscuela, $scope.controlEscolar.prom, $scope.controlEscolar.grado);
                        //if($scope.grafica !== undefined)

                        $("#Encontrada").show();
                        $('html, body').animate({
                            scrollTop: $("#Encontrada").offset().top - 100
                        }, 1000);


                    }

                }).error(function (error) {
                    $scope.primeraBusqueda = 0;
                    noprocessing();
                    console.log("error");
                    $scope.datos = null;
                    $scope.controlEscolar = null;
                    $scope.boleta= null;
                    $scope.estadisticasEscuela = null;


                    $('html, body').animate({
                        scrollTop: $("#noEncontrada").offset().top - 50
                    }, 1000);
                });
            } else {
                console.log("La CURP NO es correcta");

                $("#modalCurpError").modal('show');
            }

        }



        var randomColorFactor = function () {
            return Math.round(Math.random() * 255);
        };

        var randomColor = function () {
            return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',.5)';
        };

        var grafica = function (datos, leyend) {

            console.log("inica grafica");

            var barChartData = {
                labels: leyend,
                datasets: [{
                        label: 'Promedio',
                        backgroundColor: '#4D92DF',
                        data: datos
                    }]
            };


            setTimeout(function(){
              $('#container_grafica').html('<canvas id="canvas"></canvas>')
              var ctx = document.getElementById("canvas").getContext("2d");

              window.myBar = new Chart(ctx, {
                  type: 'bar',
                  data: barChartData,
                  options: {
                      // Elements options apply to all of the options unless overridden xin a dataset
                      // In this case, we are setting the border of each bar to be 2px wide and green
                      elements: {
                          rectangle: {
                              borderWidth: 3,
                              borderColor: '#4D92DF',
                              borderSkipped: 'bottom'
                          }
                      },
                      legend: {
                          position: 'top',
                      },
                      title: {
                          display: false,
                          text: "Calificaciones de los alumnos"
                      }, scales: {
                        yAxes: [{
                                display: true,
                                ticks: {
                                    beginAtZero: true,
                                    steps: 10,
                                    stepValue: 1,
                                    max: 10
                                }
                            }]
                    }
                  }
              });

             window.myBar.update();
            }, 1000);


        }

        $scope.alerta = function (estadisticas, prom, grado) {
          console.log(prom)
          console.log(grado)
          console.log(estadisticas)

          var mensajes = [
          {alerta: "alert alert-info",icon :"fa fa-check fa-3x", mensaje :"La calificación obtenida en este ciclo es igual al promedio  del grupo."},
          {alerta:"alert alert-success",icon: "fa fa-line-chart fa-3x", mensaje :"¡Felicidades! La calificación obtenida en este ciclo es más alta que el promedio  del resto del grupo."},
          {alerta:"alert alert-danger", icon: "fa fa-warning fa-3x", mensaje :"La calificación obtenida en este ciclo es inferior que el promedio  del grupo, se debe dar un seguimiento al alumno para mejorar las notas del próximo ciclo."},
          {alerta:"alert alert-warning",icon: "fa fa-question fa-3x ", mensaje :"No se cuenta con la información del grado."}]

          $scope.msjstd = mensajes[3].mensaje;
          $scope.class_alerta = mensajes[3].alerta;
          $scope.icon_alerta = mensajes[3].icon;

          prom = parseFloat(prom)
            estadisticas.forEach(function(gradoEstadistica){
              if(gradoEstadistica.grado == grado){
                if(parseFloat(gradoEstadistica.promedio) < prom){
                  $scope.msjstd = mensajes[1].mensaje;
                  $scope.class_alerta = mensajes[1].alerta;
                  $scope.icon_alerta = mensajes[1].icon;
                }else if(parseFloat(gradoEstadistica.promedio) == prom){
                  $scope.msjstd = mensajes[0].mensaje;
                  $scope.class_alerta = mensajes[0].alerta;
                  $scope.icon_alerta = mensajes[0].icon;

                }else if(parseFloat(gradoEstadistica.promedio) > prom){
                  $scope.msjstd = mensajes[2].mensaje;
                  $scope.class_alerta = mensajes[2].alerta;
                  $scope.icon_alerta = mensajes[2].icon;
                }

              }

            })


        }


         $scope.newSearch = function () {
            $scope.schools = null;
            $scope.datos = null;
            //$("#divSchoolResults").hide();
            $("#noEncontrada").hide();
            $("#Encontrada").hide();
            $scope.primeraBusqueda = 1;
            $scope.controlEscolar = null;
            $scope.boleta= null;
            $scope.estadisticasEscuela = null;

    
           // $scope.resetForm();
        }

        var processingschool = function () {

            $("#cont_escuela").hide();

            $("#modal_datos_escuela").modal('show');
            $("#dialog_escuela").css('margin-top', '50px');
            $("#cargando_escuela").show();
        }

        var processing = function () {

            $("#modal-loading").modal('show');
            $('.tiempo_fuera').hide();
            setTimeout(revisaModal, 30000);

        }

        var noprocessing = function () {
            $("#modal-loading").modal('hide');
        }

       var revisaModal = function (){
            if(($("#modal-loading").data('bs.modal') || {}).isShown){
                $('.tiempo_fuera').show();
            }
        }

        //-------------- Informacion de la Escuela  --------------------------------------------------------------------------------------------------------

        $scope.getEscuelas = function (esc) {
            $http.get('https://siged.sep.gob.mx/services/EscuelaService/EscuelaServiceRS/escuelas/list?primer=1&ultimo=10&clave=' + esc).success(function (data) {
                $scope.escuela = data.datos.datos[0];
                console.log($scope.escuela);
                $scope.showDetails($scope.escuela.clave, $scope.escuela.idTurno)
            });
        }

        $scope.showDetails = function (idDetailsToShow,
                idSchedule) {
            processingschool();
            $http(
                    {
                        method: 'get',
                        url: 'https://siged.sep.gob.mx/services/EscuelaService/EscuelaServiceRS/escuelas/escuela?'
                                + 'claveCct='
                                + idDetailsToShow,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        }
                    })
                    .success(
                            function (data) {
                                $scope.showResults = true;
                                $scope.school = data.datos.datos[0];
                                //$scope.hideFinder();

                                if ($scope.school.latDms == null || $scope.school.latDms < 1) {
                                    $('#accordionMap').hide();
                                } else {
                                    $('#accordionMap').show();
                                    //  $('#accordionMap').show()
                                    console.log("coord mapa nuevo: " + gradosadecimales($scope.school.latDms) + " : " + gradosadecimales($scope.school.lonDms));
                                    console.log("coord mapa ant: " + $scope.school.latDeg + " : " + $scope.school.lonDeg);
                                    initialize(gradosadecimales($scope.school.latDms), gradosadecimales($scope.school.lonDms));
                                }

                                $("#results").show();
                                console.log("coord mapa nuevo: " + gradosadecimales($scope.school.latDms) + " : " + gradosadecimales($scope.school.lonDms));
                                $scope.showTeachers = false;

                                $scope.getStats(idDetailsToShow, idSchedule);
                                $scope.getTeachers(idDetailsToShow);
                                $scope.searchButtons = false;
                                initialize(gradosadecimales($scope.school.latDms), gradosadecimales($scope.school.lonDms));
                                $("#divTeachers").show();
                                $("#cargando_escuela").hide();
                                $("#cont_escuela").show();
                                //google.maps.event.trigger(map, "resize");



                                $("#panelLocation").collapse("hide");
                                $("#accordionMap").collapse("hide");
                                $(".collpase-button").addClass('collpase-button collapsed');

                                noprocessing();
                            }).error(function (error) {

            });
        }

        $scope.getStats = function (idDetailsToShow, idSchedule) {
            console.log(idSchedule);
            $http(
                    {
                        method: 'get',
                        url: 'https://siged.sep.gob.mx/services/EscuelaService/EscuelaServiceRS/escuelas/escuela_estadistica/'
                                + idDetailsToShow + '/'
                                + idSchedule,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        }
                    }).success(function (dataStats) {
                console.log('estadistica');
                console.log(dataStats);
                if (dataStats.estadistica != null) {
                    $scope.stats = dataStats.estadistica[0];
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
                } else {
                    $("#divSchoolStats2").hide();
                    $scope.stats = null;
                }

            }).error(function (error) {
                console.log("no stats");
            })
        }

        $scope.getTeachers = function (idDetailsToShow) {
            $http
                    .get('https://siged.sep.gob.mx/services/EscuelaService/EscuelaServiceRS/escuelas/escuela_docentes/' + idDetailsToShow)
                    .success(
                            function (data) {

                                if(data.datos.docente !== undefined){
                                    var nuevo_docente = [],valor,copia;
                                    $.each(data.datos.docente, function(index, valor_old) {

                                        valor = {   nombres: valor_old.nombres,
                                                    primerAp: valor_old.primerAp,
                                                    segundoAp: valor_old.segundoAp,
                                                    curp: valor_old.curp,
                                                    categoria: valor_old.categoria
                                                };

                                        copia = 0;
                                        $.each(nuevo_docente, function(index, subvalor) {

                                            if(copia == 0){
                                                if( valor.curp == subvalor.curp &&
                                                    valor.categoria == subvalor.categoria
                                                ){
                                                    copia = 1;
                                                }
                                            }
                                        });

                                        if(copia != 1){
                                            nuevo_docente.push(valor);
                                        }
                                    });
                                }else{
                                    nuevo_docente = data.datos.docente;
                                }


                                $("#panelLocationMap").removeClass("in");
                                $scope.teachers = nuevo_docente;
                                $('#divTeachers').hide();
                                $scope.showTeachers = false;
                                if (typeof ($scope.teachers) !== 'undefined') {
                                    $('#divTeachers').show();
                                    $scope.showTeachers = true;
                                    $scope.teachers['fuente'] = data.datos.fteDocente[0].fuente;
                                    $scope.teachers['cicloFuente'] = data.datos.fteDocente[0].ciclo;
                                    var table = $('#tblTeachers').DataTable({
                                        "dom": 'tpr',
                                        "destroy": true,
                                        "procesing": true,
                                        "serverSide": false,
                                        "data": $scope.teachers,
                                        "pageLength": 10,
                                        "language": {
                                            "url": "js/datatable.spanish.lang"
                                        },
                                        "columns": [
                                            {"data": "nombres",
                                                "render": function (data, type, full, meta) {
                                                    return full.nombres + " " + full.primerAp + " " + full.segundoAp;
                                                }
                                            },
                                            {"data": "categoria"}
                                            //{"data": "clavePlaza"}

                                        ]
                                    });
                                }
                            });
        }

        var initialize = function (lat, lng) {
            if (lat == null || lng == null) {
                lat = 22.5579822;
                lng = -120.8041848;
            }

            markerLatLng = new google.maps.LatLng(lat, lng)

            map.setCenter(markerLatLng);
            if (marker !== undefined)
                marker.setMap(null);
            marker = new google.maps.Marker({
                position: markerLatLng,
                map: map,
                center: markerLatLng
            });

        }


    }]
        );
