var body = $("html, body");

var app = window.angular.module('alumnos', ['ngResource']);

app.controller('alumnosController', ['$scope', '$http', '$window', '$rootScope',
    function ($scope, $http, $window, $rootScope) {

        var mensajes = [
            { alerta: "alert alert-info", icon: "fa fa-check fa-3x", mensaje: "La calificación obtenida en este ciclo es igual al promedio  del grupo." },
            { alerta: "alert alert-success", icon: "fa fa-line-chart fa-3x", mensaje: "¡Felicidades! La calificación obtenida en este ciclo es más alta que el promedio  del resto del grupo." },
            { alerta: "alert alert-danger", icon: "fa fa-warning fa-3x", mensaje: "La calificación obtenida en este ciclo es inferior que el promedio  del grupo, se debe dar un seguimiento al alumno para mejorar las notas del próximo ciclo." },
            { alerta: "alert alert-warning", icon: "fa fa-question fa-3x ", mensaje: "No se cuenta con la información del grado." }]

        var curp;
        $scope.cifraAnual=null;
        $scope.cifraAnualPeriodo = "";
        $scope.cifraAnualAlumnosGlobales=0;
        $scope.getAlumnosGlobales = function () {
            //Verificar info estadistica global
            $scope.cifraAnual = sessionStorage.getItem("cifraAnual");
            console.log("Buscando valor de alumnos." + $scope.cifraAnual)
            if ($scope.cifraAnual === null) {
                //Buscar en API el valor de alumnos,docentes y escuelas
                this.getTotales();
                
            } else {
                $scope.cifraAnualAlumnosGlobales = Intl.NumberFormat('en-US').format(JSON.parse($scope.cifraAnual).totalAlumnos);
                $scope.cifraAnualPeriodo = JSON.parse($scope.cifraAnual).periodo;
            }
            
        }

        $scope.getTotales = function () {
            $http.get(
                $scope.getURLEstadistica()
                + 'cifraAnual')
                .success(function (data) {
                    
                    $scope.cifraAnual = JSON.stringify(data.cifraAnualDTO[0]);
                    sessionStorage.setItem("cifraAnual", $scope.cifraAnual);
                    $scope.cifraAnualAlumnosGlobales = Intl.NumberFormat('en-US').format(JSON.parse($scope.cifraAnual).totalAlumnos);
                    $scope.cifraAnualPeriodo = JSON.parse($scope.cifraAnual).periodo;
                });
        }
        
        $scope.getURLEstadistica = function () {
            return global_uri +'/Estadisticas/';
        }

        $scope.getConsultaByCURP = function () {
            $scope.primeraBusqueda = 1;
            $scope.datos = null;
            $scope.datosUltimo = null;
            $scope.ciclos = null;

            curp = $scope.curp;
            var prom;

            curp = curp.toUpperCase();

            var expreg = /^([A-Z]{4})([0-9]{6})([HM]{1})(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;


            if (expreg.test(curp)) {

                processing();
                $("#btnResetForm").removeClass("disabled");
                $http({
                    url: global_uri + '/alumno/ciclosAlum/curp=' + curp,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }

                }).success(function (data) {

                    $scope.primeraBusqueda = 0;

                    console.log('datos')
                    console.log(data)

                    if (data.cicloEscolar && data.cicloEscolar.length > 0) {
                        $scope.ciclos = data.cicloEscolar;
                        $scope.ciclosUltimo = $scope.ciclos[1];

                        $scope.detalleAlumnos($scope.ciclos[0].id);

                    } else {
                        $scope.ciclos = null
                        $('html, body').animate({
                            scrollTop: $("#noEncontrada").offset().top - 50
                        }, 1000);
                    }

                }).error(function (error) {
                    $scope.primeraBusqueda = 0;
                    noprocessing();
                    console.log("error");


                    $('html, body').animate({
                        scrollTop: $("#noEncontrada").offset().top - 50
                    }, 1000);
                });

                $scope.detalleAlumnosUltimo(curp);


            } else {
                console.log("La CURP NO es correcta");

                $("#modalCurpError").modal('show');
            }

        }

        $scope.detalleAlumnos = function (ciclo) {

            $scope.buscandoBoleta = 1;


            $http({
                url: global_uri + '/alumno/alumnoDetalle/curp=' + curp + '&ciclo=' + ciclo,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).success(function (data) {

                $scope.buscandoBoleta = 0;
                if (data !== undefined && data.alumno !== undefined && data.alumno.length > 0) {
                    $scope.datos = data.alumno[0];
                    $scope.calificacionFinal = 0;

                    if ($scope.datos.movimientoDTO !== undefined && $scope.datos.movimientoDTO.length > 0) {
                        $scope.datos.movimientoDTO.forEach(function (calif) {
                            if (calif.clave == 'A')
                                $scope.calificacionFinal = calif.priomedio;
                        });
                    }
                } else {
                    $scope.datos = null;
                    $scope.calificacionFinal = 0;
                }

                //DATOS DE Calificaciones
                $scope.materias = [];
                $scope.boleta = [];
                $scope.numMat = 0;
                $scope.indiceArreglo = 0;
                $scope.PromedioFinal;
                var totCalif = 0, sumCalif = 0;

                // $scope.fuentePlazaCurp = data.fuentes[0];

                if (data.calificaciones != null
                    && data.calificaciones !== undefined
                    && data.calificaciones.length > 0
                    && data.calificaciones[0].califAlumDTO !== undefined
                    && data.calificaciones[0].califAlumDTO.length > 0
                    && data.calificaciones[0].califAlumDTO != null) {

                    var califAlumDTO = data.calificaciones[0].califAlumDTO;

                    $scope.materiasFullList = [];
                    califAlumDTO.forEach(function (periodo, index) {
                        periodo.asignaturaDTO.forEach(function (objMateria, k) {
                            var addMateria = true;
                            $scope.materiasFullList.forEach(function (objMateriasListFull, i) {
                                if ($scope.materiasFullList.length > 0) {
                                    if (objMateria.asignatura == objMateriasListFull.asignatura) {
                                        addMateria = false;
                                    }
                                }
                            });
                            if (addMateria) {
                                $scope.materiasFullList.push({ 'asignatura': objMateria.asignatura });
                            }
                        });
                    });
                    $scope.materias = $scope.materiasFullList;
                    $scope.numMat = $scope.materiasFullList.length;

                    califAlumDTO.forEach(function (periodo, i) {
                        var arregloMateria = [];
                        arregloMateria.push({ 'dato': periodo.periodo });

                        $scope.materias.forEach(function (materia, j) {
                            var calificacion = 0;

                            periodo.asignaturaDTO.forEach(function (materiaAlumno, k) {
                                if (materia.asignatura == materiaAlumno.asignatura) {
                                    calificacion = materiaAlumno.calificacion;
                                    return false;
                                }
                            });

                            totCalif++;
                            sumCalif += parseFloat(calificacion)

                            if (calificacion != 0)
                                arregloMateria.push({ 'dato': calificacion });
                            else
                                arregloMateria.push({ 'dato': '-' });
                        });

                        $scope.boleta.push(arregloMateria)

                    });

                    $scope.PromedioFinal = Math.round(sumCalif / totCalif * 100) / 100;
                    
                }

            }).error(function (error) {
                console.log(error);
            });

            $scope.promedioGrupal = null;
            $scope.mensajeFinal = null;

            $http({
                url: global_uri + '/alumno/cctCalif/curp=' + curp + '&ciclo=' + ciclo,
                //url : 'http://localhost/IFT/alumnos.php',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).success(function (data) {
                $scope.promedioGrupal;
                data.promedioGrado.forEach(function (promedioGrado, index) {
                    //if(promedioGrado.grado == $scope.datos.controlEscolar.grado){
                    if (promedioGrado.grado == promedioGrado.grado) {
                        $scope.promedioGrupal = data.promedioGrado[index].promedio;
                    }
                });

                if ($scope.promedioGrupal == $scope.PromedioFinal)
                    $scope.mensajeFinal = mensajes[0];
                else if ($scope.promedioGrupal < $scope.PromedioFinal)
                    $scope.mensajeFinal = mensajes[1];
                else if ($scope.promedioGrupal > $scope.PromedioFinal)
                    $scope.mensajeFinal = mensajes[2];

            }).error(function (error) {
                console.log(error);
            });

        }



        $scope.detalleAlumnosUltimo = function (curp) {

            $http({
                url: global_uri + '/alumno/consultaAlumnoUltimo/curp=' + curp,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).success(function (data) {
                noprocessing();
                $scope.datosUltimo = data.alumno[0];
                $scope.fuentePlazaCurp = data.fuente[0];
                console.log("$scope.datosUltimo");
                console.log($scope.datosUltimo);

                if ($scope.datosUltimo.movimientoDTO !== undefined && $scope.datosUltimo.movimientoDTO.length > 0) {
                    $scope.datosUltimo.movimientoDTO.forEach(function (califUltima) {
                        if (califUltima.clave = 'A')
                            $scope.calificacionFinalUltima = califUltima.priomedio;
                    });
                }

            }).error(function (error) {
                console.log(error);
            });
        }


        $scope.alerta = function (estadisticas, prom, grado) {
            console.log(prom)
            console.log(grado)
            console.log(estadisticas)

            var mensajes = [
                { alerta: "alert alert-info", icon: "fa fa-check fa-3x", mensaje: "La calificación obtenida en este ciclo es igual al promedio  del grupo." },
                { alerta: "alert alert-success", icon: "fa fa-line-chart fa-3x", mensaje: "¡Felicidades! La calificación obtenida en este ciclo es más alta que el promedio  del resto del grupo." },
                { alerta: "alert alert-danger", icon: "fa fa-warning fa-3x", mensaje: "La calificación obtenida en este ciclo es inferior que el promedio  del grupo, se debe dar un seguimiento al alumno para mejorar las notas del próximo ciclo." },
                { alerta: "alert alert-warning", icon: "fa fa-question fa-3x ", mensaje: "No se cuenta con la información del grado." }]

            $scope.msjstd = mensajes[3].mensaje;
            $scope.class_alerta = mensajes[3].alerta;
            $scope.icon_alerta = mensajes[3].icon;

            prom = parseFloat(prom)
            estadisticas.forEach(function (gradoEstadistica) {
                if (gradoEstadistica.grado == grado) {
                    if (parseFloat(gradoEstadistica.promedio) < prom) {
                        $scope.msjstd = mensajes[1].mensaje;
                        $scope.class_alerta = mensajes[1].alerta;
                        $scope.icon_alerta = mensajes[1].icon;
                    } else if (parseFloat(gradoEstadistica.promedio) == prom) {
                        $scope.msjstd = mensajes[0].mensaje;
                        $scope.class_alerta = mensajes[0].alerta;
                        $scope.icon_alerta = mensajes[0].icon;

                    } else if (parseFloat(gradoEstadistica.promedio) > prom) {
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
            $scope.boleta = null;
            $scope.ciclos = null;
            $scope.estadisticasEscuela = null;
            $scope.promedio = null;
            $scope.tipoPromedio = null;
            $scope.promedioGrupal = null;
            $scope.datos = null;
            $scope.datosUltimo = null;
            // $scope.resetForm();
        }


        $scope.Search = function () {
            $("#noEncontrada").show();
            $("#Encontrada").show();

            $scope.primeraBusqueda = 0;

        }



        var processing = function () {

            $("#modal-loading").modal('show');
            $('.tiempo_fuera').hide();
            setTimeout(revisaModal, 30000);

        }

        var noprocessing = function () {
            $("#modal-loading").modal('hide');
        }

        var revisaModal = function () {
            if (($("#modal-loading").data('bs.modal') || {}).isShown) {
                $('.tiempo_fuera').show();
            }
        }

    }]
);
