//http://172.31.62.7:8080/CoreServices/apiRest/alumno/boleta/curp=OAAS041001MBSCLYA6&ciclo=0
//172.31.62.7:8080/CoreServices/apiRest/alumno/alumnoDetalle/curp=OAAS041001MBSCLYA6
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

          var mensajes = [
          {alerta: "alert alert-info",icon :"fa fa-check fa-3x", mensaje :"La calificación obtenida en este ciclo es igual al promedio  del grupo."},
          {alerta:"alert alert-success",icon: "fa fa-line-chart fa-3x", mensaje :"¡Felicidades! La calificación obtenida en este ciclo es más alta que el promedio  del resto del grupo."},
          {alerta:"alert alert-danger", icon: "fa fa-warning fa-3x", mensaje :"La calificación obtenida en este ciclo es inferior que el promedio  del grupo, se debe dar un seguimiento al alumno para mejorar las notas del próximo ciclo."},
          {alerta:"alert alert-warning",icon: "fa fa-question fa-3x ", mensaje :"No se cuenta con la información del grado."}]

        $scope.getConsultaByCURP = function () {
                    $scope.primeraBusqueda = 1;
                    $scope.datos = null;
            var curps = $scope.curp;
            var prom;

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
                    //url: 'http://localhost/alumnos.php',
                    url: global_uri+'/alumno/alumnoDetalle/curp=' + curps,
                    //url: 'http://localhost:8080/Core/alumno/curp=' + curps,
                    //url: 'https://siged.sep.gob.mx/services/AlumnoService/AlumnoServiceRS/alumnos/alumno/' + curps,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }

                }).success(function (data) {
                     $scope.primeraBusqueda = 0;
                     console.log(data)
                    
                  if(data === undefined || data.length == 0 || data.alumno === undefined){
                	  $scope.datos = 0;  
                  }
                  else{
                	  $scope.ciclos = data.cicloEscolar;
                      $scope.datos = data.alumno[0];
                
                    console.log($scope.datos)
                    

                        noprocessing();
                      console.log("información: ")


                        //DATOS DE Calificaciones
                      $scope.materias = [];
                      $scope.boleta = [];
                      $scope.numMat = 0;
                      $scope.indiceArreglo = 0;
                      
                      if(data.cicloEscolar.length > 0){
                    	  $scope.consultarEscuela(data.cicloEscolar[0].id)
                      }
                      
                      if(data.calificaciones != null && data.calificaciones !== undefined && data.calificaciones.length > 0){
                        data.calificaciones.forEach(function(periodo,index){
                        console.log(periodo.asignaturaDTO)
                        var numMatPer = periodo.asignaturaDTO.length;
                        if(numMatPer > $scope.numMat){
                          $scope.numMat = numMatPer;
                          $scope.indiceArreglo = index;
                        }
                          
                      })
                      $scope.materias = data.calificaciones[$scope.indiceArreglo].asignaturaDTO;
                      
                      data.calificaciones.forEach(function(periodo,i){
                        var arregloMateria = [];
                        arregloMateria.push({'dato':periodo.periodo});
                    $scope.materias.forEach(function(materia,j){
                      var calificacion = 0;
                      periodo.asignaturaDTO.forEach(function(materiaAlumno,k){
                          if(materia.asignatura == materiaAlumno.asignatura){
                            calificacion = materiaAlumno.calificacion;
                            return false;
                          }
                         
                        });
                      
                      if(calificacion != 0)
                        arregloMateria.push({'dato':calificacion});
                        else
                          arregloMateria.push( {'dato':'-'});
                    }); 
                    
                    $scope.boleta.push(arregloMateria)
                      });

                      }
                      
                      //VALIDA PROMEDIO
                   $scope.promedio;
                   $scope.tipoPromedio;

                   if(data.alumno[0].movimientoDTO != null && data.alumno[0].movimientoDTO !== undefined && data.alumno[0].movimientoDTO.length > 0){
                    data.alumno[0].movimientoDTO.forEach(function(movimientoDTO){
                           console.log(movimientoDTO)
                        if(movimientoDTO.clave == 'A' || movimientoDTO.clave == 'C'){
                            $scope.promedio = movimientoDTO.priomedio;
                          $scope.tipoPromedio = movimientoDTO.descripcion;
                        }
                        
                      });

                   }
                      
                     $scope.promedioGrupal;

                      data.promedioGrado.forEach(function(promedioGrado,index){
                          console.log(promedioGrado)
                          if(promedioGrado.grado == $scope.datos.controlEscolar.grado){
                            $scope.promedioGrupal = data.promedioGrado[index].promedio;
                          }
                        });




                      console.log('comparacion')
                      console.log($scope.promedioGrupal)

                      console.log('PROMEDIO')
                      console.log($scope.promedio)

                      console.log('calificaciones')
                      console.log($scope.boleta)     
                        
                        //DATOS DE ESTADISTICA
                        /*$scope.estadisticasEscuela = data.promedioGrado;

                        datos = []
                        leyend = []

                        $scope.estadisticasEscuela.forEach(function(data){
                          leyend.push(data.grado)
                          datos.push(data.promedio)
                        })

                        grafica(datos, leyend);*/


                      letra = curps;

                        var sexo = letra.substring(10, 11);

                        if (sexo == 'M') {
                            $scope.imgSexo = "images/avatar_nina.png";
                        } else {
                            $scope.imgSexo = "images/avatar_nino.png";
                        }
                         console.log( 'Prueba');
                     
                       // $scope.alerta($scope.estadisticasEscuela, $scope.promedio, $scope.datos.controlEscolar.grado);


                   
        }
         noprocessing();
                  console.log( 'Detalle');
                  console.log($scope.datos);

                   $("#Encontrada").show();
                   $('html, body').animate({
                   scrollTop: $("#Encontrada").offset().top - 100
                        }, 1000);

                }).error(function (error) {
                   $scope.primeraBusqueda = 0;
                    noprocessing();
                    console.log("error");
                    $scope.datos = null;
                    $scope.controlEscolar = null;
                    $scope.boleta= null;
                    $scope.estadisticasEscuela = null;
                    //$scope.controlEscolar.prom = null;
                    $scope.movimientoDTO = null;

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

        /*var grafica = function (datos, leyend) {

            console.log("inicia grafica");

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


        }*/

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
            //$("#divSchoolResults").hide();
            $("#noEncontrada").hide();
            $("#Encontrada").hide();
            $scope.primeraBusqueda = 1;
            $scope.controlEscolar = null;
            $scope.boleta= null;
            $scope.ciclos = null;
            $scope.estadisticasEscuela = null;
            $scope.promedio = null;
            $scope.tipoPromedio = null;
            $scope.promedioGrupal = null;
            $scope.datos = null;

    
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
       
       $scope.consultarEscuela = function (id) {
           $scope.buscandoBoleta = 1;
           console.log(global_uri+'/alumno/boleta/curp=' + $scope.curp+'&ciclo='+id)
             $http(
                    {
                        method: 'get',
                        url: global_uri+'/alumno/boleta/curp=' + $scope.curp+'&ciclo='+id,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        }
                    })
                    .success(
                     function (data) {
                    	 $scope.buscandoBoleta = 0;
                    	 
                    	console.log(data)
                        //DATOS DE Calificaciones
                        $scope.materias = [];
                        $scope.boleta = [];
                        $scope.numMat = 0;
                        $scope.indiceArreglo = 0;
                        $scope.PromedioFinal
                        
                        var totCalif = 0,sumCalif = 0;
                        
                        if(data.boleta != null && data.boleta[0].califAlumDTO !== undefined && data.boleta[0].califAlumDTO.length > 0){
                        	
                          data.boleta[0].califAlumDTO.forEach(function(periodo,index){
                          var numMatPer = periodo.asignaturaDTO.length;
                          if(numMatPer > $scope.numMat){
                            $scope.numMat = numMatPer;
                            $scope.indiceArreglo = index;
                          }
                            
                        })
                        
                        
                        $scope.materias = data.boleta[0].califAlumDTO[$scope.indiceArreglo].asignaturaDTO;
                          
                         console.log('materias')
                        console.log($scope.materias)
                        
                        data.boleta[0].califAlumDTO.forEach(function(periodo,i){
                          var arregloMateria = [];
                          arregloMateria.push({'dato':periodo.periodo});
                      $scope.materias.forEach(function(materia,j){
                        var calificacion = 0;
                        periodo.asignaturaDTO.forEach(function(materiaAlumno,k){
                            if(materia.asignatura == materiaAlumno.asignatura){
                              calificacion = materiaAlumno.calificacion;
                              return false;
                            }
                           
                          });
                        totCalif ++;
                        sumCalif += parseFloat(calificacion)
                        if(calificacion != 0)
                          arregloMateria.push({'dato':calificacion});
                          else
                            arregloMateria.push( {'dato':'-'});
                      }); 
                      
                      $scope.boleta.push(arregloMateria)
                        });
                     
                      $scope.PromedioFinal = Math.round(sumCalif/totCalif * 100) / 100;
                      

                      if($scope.promedioGrupal == $scope.PromedioFinal)
                        $scope.mensajeFinal = mensajes[0];
                     else if($scope.promedioGrupal < $scope.PromedioFinal)
                        $scope.mensajeFinal = mensajes[1];
                     else if($scope.promedioGrupal > $scope.PromedioFinal)
                        $scope.mensajeFinal = mensajes[2];
                         
                     }
                    }).error(
                     function(data){
                    	 console.log(data)
                    });
       }

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
