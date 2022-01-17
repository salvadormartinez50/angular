$(function () {

    $('.tipo_busqueda').click(function () {
        if ($(this).val() == 1) {
            //limpio la curp para ingresar nombre
            $('#curp').find('input').each(function () {
                $(this).val('');
                $(this).removeAttr('required', true);
            })
            $('#nombre').find('input').each(function (index) {
                $(this).val('');
                if (index != 2)
                    $(this).prop('required', true);
            });
            $('#nombre').show('slow');
            $('#curp').hide();
        }
        if ($(this).val() == 2) {
            //limpio los nombre para ingresar curp
            $('#nombre').find('input').each(function () {
                $(this).val('');
                $(this).removeAttr('required');
            })
            $('#curp').find('input').each(function () {
                $(this).val('');
                $(this).prop('required', true);
            })
            $('#curp').show('slow');
            $('#nombre').hide();
        }
    });

    $('#nom').keyup(function(){
        if (!$(this).val().replace(/\s/g, '').length) {
            $(this).val($(this).val().replace(/\s/g, ''));
        }
    });

    $('#ap_pate').keyup(function(){
        if (!$(this).val().replace(/\s/g, '').length) {
            $(this).val($(this).val().replace(/\s/g, ''));
        }
    });
});

  $gmx(document).ready(function() {
	var queryString = window.location.search.split('folio=');
	if(queryString != null && queryString.length > 1){
    	$('#buscaFolio').val(queryString[1]);
    	$('#buscar').click()
    }
});

/*var marker;
var markerLatLng;
var mapProp = {
    zoom: 15
};*/

//var map = new google.maps.Map(document.getElementById("map"), mapProp);

var body = $("html, body");

var app = window.angular.module('documentos', ['ngResource']);

app.controller('documentosController', ['$scope', '$http', '$window', '$rootScope',
    function ($scope, $http, $window, $rootScope) {
        $scope.primeraBusqueda = 1;
        $scope.datos = null;
        $scope.tipo_busqueda = 1;
        
        var queryString = $window.location.search.split('folio=');
        if(queryString != null && queryString.length > 1){
        	$scope.folio = queryString[1]
        }
        
        $scope.getConsultaByFOLIO = function () {
        	//console.log($scope.tipo_busqueda)
        	var consulta;
        	
        	if($scope.tipo_busqueda == 2)
        		consulta = $scope.curp;
        	else
        		consulta = $scope.folio;

            consulta = consulta.toUpperCase();
            

                processing();
                $("#btnResetForm").removeClass("disabled");
                
                
                $http({
                    method: 'GET',
                    url: global_uri+'/certificado/consultaCertificado/?folios='+consulta,
                    //url: 'http://localhost:8080/Core/alumno/curp=' + curps,
                    //url: 'https://siged.sep.gob.mx/services/AlumnoService/AlumnoServiceRS/alumnos/alumno/' + curps,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }).success(function (data) {
                  $scope.primeraBusqueda = 0;
                   
                  if(data.datos === undefined || data.datos.length== 0)
                	  $scope.datos = 0;
                  else
                	  $scope.datos = data.datos[0];
                   
                    noprocessing();
                  //console.log( 'Detalle')
                  //console.log($scope.datos)
                }).error(function (error) {
                    $scope.datos = null;
                });



         
        }

        $scope.newSearch = function () {
            $scope.datos = null;
            
            $('.tipo_busqueda[value="1"]').click()
        }


        var randomColorFactor = function () {
            return Math.round(Math.random() * 255);
        };

        var randomColor = function () {
            return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',.5)';
        };

        var grafica = function (datos, leyend) {

            //console.log("inica grafica");

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
          //console.log(prom)
          //console.log(grado)
          //console.log(estadisticas)

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


            $scope.newSearch = function () {
            $scope.schools = null;
            $("#btnResetForm").removeClass("active");
            $("#btnResetForm").addClass("disabled");
            $scope.resetForm();
        }

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
                //console.log($scope.escuela);
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
                                    //	$('#accordionMap').show()
                                    //console.log("coord mapa nuevo: " + gradosadecimales($scope.school.latDms) + " : " + gradosadecimales($scope.school.lonDms));
                                    //console.log("coord mapa ant: " + $scope.school.latDeg + " : " + $scope.school.lonDeg);
                                    initialize(gradosadecimales($scope.school.latDms), gradosadecimales($scope.school.lonDms));
                                }

                                $("#results").show();
                                //console.log("coord mapa nuevo: " + gradosadecimales($scope.school.latDms) + " : " + gradosadecimales($scope.school.lonDms));
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
            //console.log(idSchedule);
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
                //console.log('estadistica');
                //console.log(dataStats);
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
