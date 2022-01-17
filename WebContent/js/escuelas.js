

/*boton que abra pestaña*/
$(function () {
    $('.panel-map').on('shown.bs.collapse', function (e) {
        //google.maps.event.trigger(map, "resize");

    });

    $('#txtCCT').keyup(function () {
        if (!$(this).val().replace(/\s/g, '').length) {
            $(this).val($(this).val().replace(/\s/g, ''));
        }

    });
});

$gmx(document).ready(function () {
    var queryString = window.location.search.split('cct=');
    if (queryString != null && queryString.length > 1) {
        $('#txtCCT').val(queryString[1]);
        $('#btnFindSchool').click()
    }
});

var marker;
let markerLatLng;


$(function () {
    $('.inline-form-filters select').change(function () {
        var bloqueo = 0;

        $('.inline-form-filters select').each(function () {
            if ($(this).val() != '')
                bloqueo = 1;
        });

        if (bloqueo) {
            $('#txtCCT').removeAttr('required', true);
        }
        else {
            $('#txtCCT').prop('required', true);
        }
    });
});

var app = angular.module('escuelas', ['ngResource']);

app.controller('searchSchoolCtrl', ['$scope', '$http', '$window', '$rootScope',
    function ($scope, $http, $window, $rootScope) {

        $http.defaults.headers.get = { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" };

        $scope.showFinder = true;
        $scope.showMoreLevels = true;
        $scope.showSchedules = true;
        $scope.showPagination = false;
        $scope.numberOfSchoolRecords = null;
        $scope.schoolPages = null;
        $scope.lastPage = null;
        $scope.schoolNumberOfPages = null;
        $scope.stats = null;
        $scope.searchButtons = true;
        $scope.showTeachers = false;
        $scope.inifed = null;
        $scope.inifed_v2 = null;


        $scope.getURLCalendario = function () {
            return global_uri + '/consulta/calendario/cct=';
        }
    
        $scope.cifraAnual=null;
        $scope.cifraAnualEscuelasGlobales = 0;
        $scope.getGlobales = function () {
            //Verificar info estadistica global
            $scope.cifraAnual = sessionStorage.getItem("cifraAnual");
            console.log("Buscando valor de totales." + $scope.cifraAnual)
            if ($scope.cifraAnual === null) {
                //Buscar en API el valor de alumnos,docentes y escuelas
                this.getTotales();
                
            } else {
                console.log("Se tiene en SS");
                $scope.cifraAnualEscuelasGlobales = Intl.NumberFormat('en-US').format(JSON.parse($scope.cifraAnual).totalEscuelas);
            }
        }
        $scope.getURLEstadistica = function () {
            return global_uri +'/Estadisticas/';
        }

        $scope.getTotales = function () {
            $http.get(
                $scope.getURLEstadistica()
                + 'cifraAnual')
                .success(function (data) {
                    $scope.cifraAnual = JSON.stringify(data.cifraAnualDTO[0]);
                    sessionStorage.setItem("cifraAnual", $scope.cifraAnual);
                    $scope.cifraAnualEscuelasGlobales = Intl.NumberFormat('en-US').format(JSON.parse($scope.cifraAnual).totalEscuelas);
                    console.log("Se cargó en sesión : " + $scope.cifraAnual);
                });
        }     
        $scope.getCalendario = function (cct) {

            $scope.calendario = null;
            $("#calendario185").hide();
            $("#calendario195").hide();
            $("#calendario190").hide();
            $("#calendario200").hide();
            $http(
                {
                    method: 'get',
                    url: $scope.getURLCalendario() + cct,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                }).success(function (dataCalendarios) {

                    $scope.calendario = dataCalendarios.Calendario;

                    dataCalendarios.Calendario.forEach(function (tipoCalendario) {

                        var arrayCalendar = [];
                        tipoCalendario.calendarioDTO.forEach(function (calendarios) {

                            var fecha = new Date(calendarios.fechaFin);
                            fecha.setDate(fecha.getDate() + 2);


                            calendarios.fechaFin = [fecha.getFullYear(), '0' + (fecha.getMonth() + 1), fecha.getDate()].join('-');
                            arrayCalendar.push({ 'title': calendarios.descripcion, 'start': calendarios.fechaInicio, 'end': calendarios.fechaFin, 'backgroundColor': calendarios.hexadecimal });

                        });


                        $('#calendar' + tipoCalendario.calendario).fullCalendar({
                            header: {
                                left: 'prev,next today',
                                center: 'title',
                                right: 'month,basicWeek,basicDay'
                            },
                            //defaultDate: '2018-03-12',
                            navLinks: true, // can click day/week names to navigate views
                            editable: true,
                            eventLimit: true, // allow "more" link when too many events
                            editable: false, // event resources editable by default
                            events:
                                arrayCalendar
                        });



                        if (tipoCalendario.calendario == 185) {
                            $("#calendario185").show();

                        } else if (tipoCalendario.calendario == 195) {
                            $("#calendario195").show();
                        } else if (tipoCalendario.calendario == 200) {
                            $("#calendario200").show();
                        } else {
                            $("#calendario190").show();
                        }

                    });

                    noprocessing();
                }).error(function (error) {

                    console.log("no stats");
                })
        }

        $scope.getURLCatalogs = function () {
            return global_uri + '/catalogos/';
        }

        /*$scope.getURLSchools = function () {
            return 'https://siged.sep.gob.mx/services/EscuelaService/EscuelaServiceRS/escuelas/list?';
        }*/

        /*$scope.getURLSchools = function () {
            return 'https://siged.sep.gob.mx/Core/ctList/';
        }*/

        $scope.getURLSchools = function () {
            return global_uri + '/escuela/buscaEscuela/';
        }

        /*$scope.getURLSchool = function () {
            return 'https://siged.sep.gob.mx/services/EscuelaService/EscuelaServiceRS/escuelas/escuela?';
        }*/

        $scope.getURLSchool = function () {
            return global_uri + '/escuela/detalleCT/cct=';
        }

        $scope.getURLTeachers = function () {
            return global_uri + '/plaza/plazaCct/cct=';
        }

        $scope.getURLSchoolExcel = function () {
            return global_uri + '/escuela/selectCcts/';
        }

        /*$scope.getURLStats = function () {
            return 'https://siged.sep.gob.mx/services/EscuelaService/EscuelaServiceRS/escuelas/escuela_estadistica/';
        }*/

        $scope.getURLStats = function () {
            return 'https://siged.sep.gob.mx/Core/ct/ctEstad/cct=';
        }

        $scope.getRecordsByPage = function () {
            return 10;
        }

        $scope.getImagen = function (cct) {
            //console.log("pasa ct: " + cct);
            $http.get('https://siged.sep.gob.mx/services/ServicioImagenesEscuela/ImagenesEscuelaRS/escuela/imagenes/' + cct + '/Entrada').success(function (data) {
                $scope.ctImagen = data.ctImagen;
                console.log($scope.ctImagen);
                //console.log("regresa imagen");
                //enlace.edu.mx
                modalImagen();
            });
        }

        $("#results").hide();
        $scope.getStates = function () {
            $http.get(
                $scope.getURLCatalogs()
                + 'estado')
                .success(function (data) {
                    $scope.states = data.estadoDTO;
                });
        }

        $scope.getMunicipalities = function () {
            $scope.locations = null;
            $scope.municipalities = null;
            $http
                .get(
                    $scope.getURLCatalogs()
                    + 'municipio/idEstado='
                    + $scope.user.state.id)
                .success(
                    function (data) {
                        $scope.municipalities = data.municipioDTO;
                    });
        }

        $scope.getLocations = function () {
            $scope.locations = null;
            if ($scope.user.state != null
                && $scope.user.municipality != null) {
                $http
                    .get(
                        $scope.getURLCatalogs()
                        + 'localidad/idMunicipio='
                        + $scope.user.municipality.id)
                    .success(
                        function (data) {
                            $scope.locations = data.localidadDTO;
                        });
            }
        }

        $scope.search = function (pagina) {

            $('#divSchoolResults').css({ 'min-height': '600px' });

            parametros = "";

            /*if ($scope.user.state != null) {
                parametros = addParam(parametros,
                        'entidad', $scope.user.state.id);
            }
            if ($scope.user.municipality != null) {
                parametros = addParam(parametros,
                        'municipio',
                        $scope.user.municipality.id);
            }
            if ($scope.user.olocation != null) {
                parametros = addParam(parametros,
                        'localidad',
                        $scope.user.olocation.id);
            }
            if ($scope.user.schoolName != null) {
                $scope.user.schoolName = limpiar2($scope.user.schoolName);
                parametros = addParam(parametros, 'nombre',
                        $scope.user.schoolName);
            }
            if ($scope.user.schedule != null) {
                parametros = addParam(parametros, 'turno',
                        $scope.user.schedule.id);
            }
            if ($scope.user.level != null) {
                parametros = addParam(parametros, 'tipo',
                        $scope.user.level.id);
            }
            if ($scope.user.sector != null) {
                parametros = addParam(parametros, 'control',
                        $scope.user.sector.id);
            }*/

            if ($scope.user.schoolName != null) {

                $scope.user.schoolName = limpiar2($scope.user.schoolName);

                parametros = addParam(parametros,
                    'cct=', $scope.user.schoolName);
            } else {

                parametros = addParam(parametros,
                    'cct=', '');
            }

            if ($scope.user.schedule != null) {
                parametros = addParam(parametros,
                    '&turno=', $scope.user.schedule.id);
            } else {
                parametros = addParam(parametros,
                    '&turno=', '');
            }

            if ($scope.user.level != null) {
                parametros = addParam(parametros,
                    '&nivel=', $scope.user.level.id);
            } else {
                parametros = addParam(parametros,
                    '&nivel=', '');
            }

            if ($scope.user.sector != null) {
                parametros = addParam(parametros,
                    '&control=', $scope.user.sector.id);
            } else {
                parametros = addParam(parametros,
                    '&control=', '');
            }

            if ($scope.user.state != null) {
                parametros = addParam(parametros,
                    '&entidad=', $scope.user.state.id);
            } else {
                parametros = addParam(parametros,
                    '&entidad=', '');
            }

            if ($scope.user.municipality != null) {
                parametros = addParam(parametros,
                    '&municipio=', $scope.user.municipality.id);
            } else {
                parametros = addParam(parametros,
                    '&municipio=', '');
            }

            if ($scope.user.olocation != null) {
                parametros = addParam(parametros,
                    '&localidad=', $scope.user.olocation.id);
            } else {
                parametros = addParam(parametros,
                    '&localidad=', '');
            }

            /*parametros = addParam(parametros,'primer', '');
            parametros = addParam(parametros,'ultimo', '');*/

            var totalRecords = 0;

            var table = $('#tblSchoolResults').DataTable({

            });

            //if (table != undefined)
            table.destroy();

            //console.log($scope.getURLSchools() + parametros + '&primer=1' + '&ultimo=1000');

            table = $('#tblSchoolResults').DataTable({
                responsive: true,
                /*"dom": "tpr",
                "destroy": true,
                "procesing": true,
                "serverSide": true,
                "pageLength": 10,
                "iDisplayLength": 20,
                "bPaginate": true,
                */
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros por página.",
                    "zeroRecords": "No se encontraron registros.",
                    "info": " ",
                    //"infoEmpty": "No hay registros aún.",
                    //"infoFiltered": "(filtrados de un total de _MAX_ registros)",
                    "infoEmpty": " ",
                    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "search": "Búsqueda",
                    "LoadingRecords": "Cargando ...",
                    "Processing": "Procesando...",
                    "SearchPlaceholder": "Comience a teclear...",
                    "iDisplayLength": 20,
                    "sPaginationType": "full_numbers",
                    "sServerMethod": "POST",
                    "aLengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
                    "iDisplayLength": 20,
                    "paginate": {
                        "previous": "Anterior",
                        "next": "Siguiente"
                    }
                },
                "searching": true,
                "bLengthChange": true,
                "ajax": {
                    // "url": $scope.getURLSchools() + parametros,
                    "url": $scope.getURLSchools() + parametros
                        + '&primer=1'
                        + '&ultimo=1000',
                    'beforeSend': function (request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
                    },
                    "data": function (data) {
                        //console.info(data)
                        processing();
                        /*var paginaInicial = data.start;
                        if (paginaInicial == 0) {
                            paginaInicial = 1;
                        } else {
                            paginaInicial += 1;
                        }
                        data.primer = paginaInicial;
                        data.ultimo = $scope.getRecordsByPage();
                        //var orderCol = data.order[0]['column'];
                        //var orderDir = data.order[0]['dir'];
                        var orderCol = data.order[0]['column'];
                        var orderDir = data.order[0]['dir'];
                        if (orderDir === 'asc') {
                            orderDir = 1;
                        }
                        //data.regOrder = data.columns[orderCol]['name'];
                        data.regOrder = data.columns[orderCol]['name'];
                        data.tipord = orderDir;*/

                    },
                    "dataSrc": function (d) {
                        //console.log('resolvió el rest de busqueda');
                        noprocessing();
                        //console.log('resultado de la busqueda:');
                        //console.log(d);

                        //si no encuentra los datos
                        if (d.recordsTotal < 1) {
                            $("#divSchoolResults").show();
                            $("#divNoEncontrada").hide();
                        } else {
                            $("#divSchoolResults").hide();
                            $("#divNoEncontrada").show();
                        }
                        $('html, body').animate({
                            scrollTop: 290
                        }, 1000);
                        return d.datos;

                    },
                },
                "columns": [
                    { "name": "NOMBREENT", "data": "clave" },
                    { "name": "NOMBRABREV", "data": "abrev" },
                    { "name": "NOMBREMUN", "data": "municipio" },
                    { "name": "NOMBRELOC", "data": "localidad" },
                    { "name": "NOMBRECT", "data": "nombre" },
                    { "name": "NOMBRENIV", "data": "nivel" },
                    { "name": "NOMBRETUR", "data": "turno" },
                    { "name": "NOMBRECONT", "data": "control" }
                ]
            });

            $('#tblSchoolResults tbody').unbind('click');

            $('#tblSchoolResults tbody').on('click', 'tr', function () {

                var school = table.row(this).data();
                //console.log(this);
                $scope.showDetails(school.clave, school.idTurno);

                //$scope.abrir_escuela(school.clave, school.idTurno);
                /*$("#divSchoolResults").hide();*/
            });

            $('#tblSchoolResults tbody tr').unbind('over');
            $("#tblSchoolResults tbody tr").on('over', function (event) {
                $("#tblSchoolResults tbody tr").removeClass('row_selected');
                $(this).addClass('row_selected');
            });

        }

        $scope.generaExcel = function () {



            parametros = "";

            if ($scope.user.schoolName != null) {
                //$scope.user.schoolName = limpiar2($scope.user.schoolName);
                parametros = addParam(parametros,
                    'cct=', $scope.user.schoolName);
            } else {

                parametros = addParam(parametros,
                    'cct=', '');
            }

            if ($scope.user.schedule != null) {
                parametros = addParam(parametros,
                    '&turno=', $scope.user.schedule.id);
            } else {
                parametros = addParam(parametros,
                    '&turno=', '');
            }

            if ($scope.user.level != null) {
                parametros = addParam(parametros,
                    '&nivel=', $scope.user.level.id);
            } else {
                parametros = addParam(parametros,
                    '&nivel=', '');
            }

            if ($scope.user.sector != null) {
                parametros = addParam(parametros,
                    '&control=', $scope.user.sector.id);
            } else {
                parametros = addParam(parametros,
                    '&control=', '');
            }

            if ($scope.user.state != null) {
                parametros = addParam(parametros,
                    '&entidad=', $scope.user.state.id);
            } else {
                parametros = addParam(parametros,
                    '&entidad=', '');
            }

            if ($scope.user.municipality != null) {
                parametros = addParam(parametros,
                    '&municipio=', $scope.user.municipality.id);
            } else {
                parametros = addParam(parametros,
                    '&municipio=', '');
            }

            if ($scope.user.location != null) {
                parametros = addParam(parametros,
                    '&localidad=', $scope.user.olocation.id);
            } else {
                parametros = addParam(parametros,
                    '&localidad=', '');
            }

            /*parametros = addParam(parametros,'primer', '');
            parametros = addParam(parametros,'ultimo', '');*/
            //console.log($scope.getURLSchoolExcel() + parametros);
            processing();


            $http(
                {
                    method: 'get',
                    url: $scope.getURLSchoolExcel()
                        + parametros,
                    data: ""
                }).success(function (data) {
                    $('.tiempo_fuera').show();
                    if (data.Ccts != null && data.Ccts.length > 0) {
                        var htmlTable = '<table width="100%" ><thead><tbody>'

                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black; width:95px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Clave del centro de trabajo</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;  width:75px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Clave del turno</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black; width:160px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nombre del turno</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:510px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nombre del centro de trabajo</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:140px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Tipo educativo</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:160px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nivel educativo</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:180px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Servicio educativo</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:140px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nombre del control (Público o Privado)</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:125px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Tipo de sostenimiento</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:105px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Clave de la entidad federativa</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:180px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nombre de la entidad</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:110px;height: 60px;text-align: center;font-weight: normal;font-size: 14px" >Clave del municipio o delegación</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:310px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nombre del municipio o delegación</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:100px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Clave de la localidad</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;;width:410px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nombre de localidad</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:410px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Domicilio</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:90px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Número exterior</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Entre la calle</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:230px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Y la calle</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:410px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Calle posterior</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:80px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Colonia</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:340px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nombre de la colonia</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:85px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Código postal</th>'

                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:50px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Clave lada</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:80px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Teléfono</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:85px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Extensión del teléfono</th>'
                            //+'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:310px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Correo electrónico</th>' 
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:310px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Página web</th>'

                            /*+'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:310px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nombre del director</th>'
                            +'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:180px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Apellido del director 1</th>'
                            +'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:180px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Apellido del director 2</th>'*/
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:110;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Alumnos total (hombres)</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:110;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Alumnos total (mujeres)</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Alumnos total</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:110;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Docentes total (hombres)</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:110;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Docentes total (mujeres)</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Docentes total</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:90;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Aulas en uso</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:90;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Aulas existentes</th>'

                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:140px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Tipo de localidad U - Urbano, R - Rural</th>'

                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:305;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Ubicación de la escuela-localidad al Oeste del Meridiano de Greenwich, expresada en grados, minutos y segundos</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:240;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Ubicación de la escuela-localidad al norte del Ecuador, expresada en grados, minutos y segundos</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:265;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Ubicación de la escuela-localidad al Oeste del Meridiano de Greenwich, expresada en grados</th>'
                            + '<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:230;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Ubicación de la escuela-localidad al norte del Ecuador, expresada en grados</th>';

                        data.Ccts.forEach(function (escuela) {

                            htmlTable += '<tr>';
                            htmlTable += '<td>' + escuela.clavecct + '</td>';
                            htmlTable += '<td>' + escuela.turno + '</td>';
                            htmlTable += '<td>' + escuela.nombretur + '</td>';
                            htmlTable += '<td>' + escuela.nombrect + '</td>';
                            htmlTable += '<td>' + escuela.tipoeducativo + '</td>';
                            htmlTable += '<td>' + escuela.nombreniv + '</td>';
                            htmlTable += '<td>' + escuela.servicioeducativo + '</td>';
                            htmlTable += '<td>' + escuela.nombrecont + '</td>';
                            htmlTable += '<td>' + escuela.sistenimiento + '</td>';
                            htmlTable += '<td>' + escuela.claveentidad + '</td>';
                            htmlTable += '<td>' + escuela.nombreent + '</td>';
                            htmlTable += '<td>' + escuela.clavemunicipio + '</td>';
                            htmlTable += '<td>' + escuela.nombremun + '</td>';
                            htmlTable += '<td>' + escuela.clavelocalidad + '</td>';
                            htmlTable += '<td>' + escuela.nombreloc + '</td>';
                            htmlTable += '<td>' + escuela.domicilio + '</td>';
                            htmlTable += '<td>' + escuela.numext + '</td>';
                            htmlTable += '<td>' + escuela.entrecalle + '</td>';
                            htmlTable += '<td>' + escuela.ycalle + '</td>';
                            htmlTable += '<td>' + escuela.calleposterior + '</td>';
                            htmlTable += '<td>' + escuela.colonia + '</td>';
                            htmlTable += '<td>' + escuela.nombrecolonia + '</td>';
                            htmlTable += '<td>' + escuela.cp + '</td>';

                            htmlTable += '<td>' + escuela.telefono + '</td>';
                            htmlTable += '<td>' + escuela.telefono + '</td>';
                            htmlTable += '<td>' + escuela.extensio + '</td>';
                            //htmlTable += '<td>'+escuela.correo+'</td>';
                            htmlTable += '<td>' + escuela.pweb + '</td>';

                            /* htmlTable += '<td>'+escuela.nombredir+'</td>'; 
                             htmlTable += '<td>'+escuela.apellidodir1+'</td>'; 
                             htmlTable += '<td>'+escuela.apellidodir2+'</td>'; */
                            htmlTable += '<td>' + escuela.hombrestotal + '</td>';
                            htmlTable += '<td>' + escuela.mujerestotal + '</td>';
                            htmlTable += '<td>' + escuela.alumnostotal + '</td>';
                            htmlTable += '<td>' + escuela.docenteshom + '</td>';
                            htmlTable += '<td>' + escuela.docentesmuj + '</td>';
                            htmlTable += '<td>' + escuela.docentestot + '</td>';
                            htmlTable += '<td>' + escuela.aulasuso + '</td>';
                            htmlTable += '<td>' + escuela.aulasexistentes + '</td>';

                            htmlTable += '<td>' + escuela.aulaExis + '</td>';

                            htmlTable += '<td>' + longitud(escuela.longitud) + '</td>';//expresada en grados, minutos y segundos
                            htmlTable += '<td>' + latitud(escuela.latitud) + '</td>';//expresada en grados, minutos y segundos
                            htmlTable += '<td>' + escuela.longitud + '</td>';
                            htmlTable += '<td>' + escuela.latitud + '</td>';
                            htmlTable += '</tr>';

                        })


                        htmlTable += '<tr></tr><tr></tr><tr><td colspan="4" style="border: 1px solid black;font-family: serif;font-size: 14px"> Con fundamento en lo dispuesto en los artículos 12 fracción X y 13 fracción VII de la Ley General de Educación, la presente información se encuentra contenida en el <b>Sistema de Información y Gestión Educativa (SIGED)</b></td></tr><tr></tr><tr><td colspan="4" style="text-align:center;;font-family: serif;font-size: 14px"><b>Dirección General del Sistema de Información y Gestión Educativa</b></td></tr><tr></tr><tr><td style="vertical-align: top;border: 1px solid black;font-family: serif;font-size: 14px"><b>Fuentes:</b></td><td colspan="3" style="border: 1px solid black;font-family: serif;font-size: 14px"> <b>Información de centros de trabajo educativos:</b> Catálogo Nacional de Centros de Trabajo, Dirección General de Planeación, Programación y Estadística Educativa / SPEC / SEP</td></tr><tr><td></td><td colspan="3" style="border: 1px solid black;font-family: serif;font-size: 14px"> <b>Información estadística educativa:</b> Cuestionarios del formato 911 (inicio de ciclo escolar 201X - 201X), Dirección General de Planeación, Programación y Estadística Educativa / SPEC / SEP</td></td></tr>';


                        htmlTable += '</tbody></thead></table>';



                        var htmlTable = htmlTable.replace(/undefined/g, "");
                        //console.log(htmlTable)

                        noprocessing();
                        var ua = window.navigator.userAgent;
                        var msie = ua.indexOf("MSIE ");

                        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
                        {
                            var txtArea1 = document.getElementById('txtArea1');
                            txtArea1.contentWindow.document.open("txt/html", "replace");
                            txtArea1.contentWindow.document.write(htmlTable);
                            txtArea1.contentWindow.document.close();
                            txtArea1.contentWindow.focus();
                            var sa = txtArea1.contentWindow.document.execCommand("SaveAs", true, "concentrado_escuelas.xls");
                        }
                        else {
                            var data_type = 'data:application/vnd.ms-excel;charset=utf-8';


                            var a = document.createElement('a');
                            document.body.appendChild(a);  // You need to add this line

                            var uint8 = new Uint8Array(htmlTable.length);
                            for (var i = 0; i < uint8.length; i++) {
                                uint8[i] = htmlTable.charCodeAt(i);
                            }

                            var xData = new Blob([uint8], { type: "text/csv" });
                            var xUrl = URL.createObjectURL(xData);
                            a.href = xUrl;

                            a.download = 'concentrado_escuelas.xls';
                            a.click();

                        }
                    }


                }).error(function (error) {
                    //console.log("no ats");
                })

        }

        $scope.newSearch = function () {
            $scope.schools = null;
            $scope.datos = null;
            $scope.calendario = null;
            $("#btnFindSchool").removeClass("disabled");
            $("#btnFindSchool").addClass("active");
            $("#btnResetForm").removeClass("active");
            $("#btnResetForm").addClass("disabled");
            $("#divSchoolResults").hide();
            $("#divNoEncontrada").hide();
            $scope.resetForm();
        }


        $scope.hideFinder = function () {
            $scope.showFinder = false;
        }

        $scope.getFinderStatus = function () {
            return $scope.showFinder;
        }

        $scope.getStats = function (idDetailsToShow, idSchedule) {
            $http(
                {
                    method: 'get',
                    url: $scope.getURLStats()
                        + idDetailsToShow + '&idTurno='
                        + idSchedule,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                }).success(function (dataStats) {
                    if (dataStats.estadistica !== undefined) {
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

                        $("#divSchoolStats").show();
                    } else {
                        $("#divSchoolStats").hide();
                        $scope.stats = null;
                    }
                }).error(function (error) {
                    console.log("no stats");
                })
        }

        $scope.getTeachers = function (idDetailsToShow) {
            //console.log($scope.getURLTeachers() + idDetailsToShow);
            $http
                .get($scope.getURLTeachers() + idDetailsToShow)
                .success(
                    function (data) {
                        var nuevo_docente = [], valor, copia;

                        if (data.docente !== undefined) {
                            $.each(data.docente, function (index, valor_old) {

                                valor = {
                                    nombres: valor_old.nombres,
                                    primerAp: valor_old.primerAp,
                                    segundoAp: valor_old.segundoAp,
                                    categoria: valor_old.categoria,
                                    curp: valor_old.curp

                                };

                                copia = 0;
                                $.each(nuevo_docente, function (index, subvalor) {

                                    if (copia == 0) {
                                        //console.log('if v:'+valor.curp+' = v:'+subvalor.curp+' y c:'+valor.categoria+' = c:'+subvalor.categoria);
                                        if (valor.curp == subvalor.curp &&
                                            valor.categoria == subvalor.categoria
                                        ) {
                                            copia = 1;
                                        }
                                    }
                                });

                                if (copia != 1) {
                                    nuevo_docente.push(valor);
                                }
                            });
                        } else {
                            nuevo_docente = data.docente;
                        }
                        //console.log(nuevo_docente);

                        $("#panelLocationMap").removeClass("in");
                        $scope.teachers = nuevo_docente;
                        $('#divTeachers').hide();
                        $scope.showTeachers = false;
                        if (typeof ($scope.teachers) !== 'undefined') {
                            $('#divTeachers').show();
                            $scope.showTeachers = true;
                            $scope.teachers['fuente'] = data.fteDocente[0].fuente;
                            $scope.teachers['cicloFuente'] = data.fteDocente[0].ciclo;
                            var table = $('#tblTeachers').DataTable({
                                responsive: true,
                                "dom": 'tpr',
                                "destroy": true,
                                "procesing": true,
                                "serverSide": false,
                                "data": $scope.teachers,
                                "pageLength": $scope.getRecordsByPage(),
                                "language": {
                                    "url": "js/datatable.spanish.lang"
                                },
                                "columns": [
                                    {
                                        "data": "nombres",
                                        "render": function (data, type, full, meta) {
                                            return full.nombres + " " + full.primerAp + " " + full.segundoAp;
                                        }
                                    },
                                    { "data": "categoria" }

                                ]
                            });
                        }
                    });
        }

        $scope.showDetails = function (idDetailsToShow,
            idSchedule) {
            processingschool();
            $scope.school = null;
            
            //console.log( $scope.getURLSchool()+ idDetailsToShow+ '&idTurno='+ idSchedule);
            
            $http(
                {
                    method: 'get',
                    url: $scope.getURLSchool()

                        + idDetailsToShow
                        + '&idTurno='
                        + idSchedule,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                })
                .success(
                    function (data) {
                        //console.log('detalles del ct')
                        //console.log(data)
                        $scope.showResults = true;
                        $scope.school = data.datos;
                        $scope.hideFinder();
                        $("#results").show();

                        
                        $scope.inifed = data.infoINIFED[0];
                        $scope.inifed_v2 = data.infoINIFED_v2[0];
                        console.log("Cargó info de INIFED");
                        console.log($scope.inifed);
                        console.log("Cargó info de INIFED:v2");
                        console.log($scope.inifed_v2);

                        //$scope.getImagen(idDetailsToShow);
                        //console.log("coord mapa: " + $scope.school.latDms + " : " + $scope.school.lonDms);
                        if ($scope.school.latDms == null || $scope.school.latDms < 1) {
                            $('#accordionMap').hide();
                        } else {
                            $('#accordionMap').show();
                            //  $('#accordionMap').show()
                            console.log("coord mapa nuevo: " + $scope.school.latDms + " : " + $scope.school.lonDms);
                            //console.log("coord mapa convertidac: " + gradosadecimales($scope.school.latDms) + " : " + gradosadecimales($scope.school.lonDms));
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

                                $("#divSchoolStats").show();
                            }
                            catch (err) {
                                console.error("error: ");
                                console.error(err);
                                $("#divSchoolStats").hide();
                                $scope.stats = null;
                            }

                        } else {
                            $("#divSchoolStats").hide();
                            $scope.stats = null;
                        }
                        //$scop<e.getTeachers(idDetailsToShow);
                        if (data.plazas !== undefined && data.plazas.length > 0) {

                            $("#plazasDis").show();

                            $scope.plazas = data.plazas;
                        } else {
                            $("#plazasDis").hide();
                            $scope.plazas = null
                        }

                        if (data.docentes !== undefined && data.docentes.length > 0) {

                            $("#DocentesEsc").show();

                            $scope.docentes = data.docentes;
                        } else {
                            $("#DocentesEsc").hide();
                            $scope.docentes = null
                        }


                        $scope.searchButtons = false;

                        noprocessing();
                        $("#divTeachers").show();
                        $("#cargando_escuela").hide();
                        $("#cont_escuela").show();
                        //mueve el tamaño del mapa nuevamente para no tener errores


                        $("#panelLocation").collapse("hide");
                        $("#accordionMap").collapse("hide");
                        $("#panelLocationMap").collapse("hide");
                        $("#accordionMap").collapse("hide");
                        $("#panelCalendario").collapse("hide");
                        $("#calendarioApi").collapse("hide");
                        $("#accordionCalendario").collapse("hide");
                        $("#panelCalendarioApi").collapse("hide");

                        $("#panelCalendario2").collapse("hide");
                        $("#calendarioApi2").collapse("hide");
                        $("#accordionCalendario2").collapse("hide");
                        $("#panelCalendarioApi2").collapse("hide");

                        $(".collpase-button").addClass('collpase-button collapsed');

                    }).error(function (error) {
                    });

            $scope.getCalendario(idDetailsToShow);

        }

        $scope.getSchedules = function () {
            $http
                .get(
                    $scope.getURLCatalogs()
                    + 'turno')
                .success(
                    function (data) {
                        $scope.schedules = data.turnoDTO;
                    });
        }

        $scope.getLevels = function () {
            $http
                .get(
                    $scope.getURLCatalogs()
                    + 'nivel')
                .success(
                    function (data) {
                        $scope.levels = data.nivelescolarDTO;
                    });
        }

        $scope.getSectors = function () {
            $http
                .get(
                    $scope.getURLCatalogs()
                    + 'control')
                .success(
                    function (data) {
                        $scope.sectors = data.controlDTO;
                    });
        }

        $scope.resetForm = function () {
            $scope.states = null;
            $scope.municipalities = null;
            $scope.locations = null;
            $scope.showMoreLevels = true;
            $scope.showSchedules = true;

            $scope.user = {
                schoolName: null,
                state: null,
                municipality: null,
                olocation: null,
                schedule: null,
                level: null,
                sector: null,
                idtype: null
            }

            $scope.getStates();

        }

        $scope.resetForm();
        $scope.getStates();
        $scope.getSchedules();
        $scope.getLevels();
        $scope.getSectors();

        $scope.abrir_escuela = function (clave, idTurno) {

            console.info("entro");

            $http.get(global_uri + "/plaza/plazaCct/cct=" + clave + "&idTurno=" + idTurno)
                .then(function (data) {
                    console.log(data)
                    $scope.plazas = data.data;


                    var valid = $scope.plazas;

                    console.info("valid");

                    console.info(valid);

                    if (valid === undefined || valid === null || valid.length == 0) {
                        console.info("entra a la validacion");
                        document.getElementById("plazasDis").style = style = "display: none";
                    } else {
                        document.getElementById("plazasDis").style = style = "display: inline";
                    }
                });

        }

        var queryString = $window.location.search.split('cct=');
        if (queryString != null && queryString.length > 1) {
            $scope.user.schoolName = queryString[1]

        }



    }]);

var setDisabled = function (idComponent, disabled) {
    $("#" + idComponent).prop('disabled', disabled);
}

var initialize = function (lat, lng) {
    if (lat == null || lng == null) {
        lat = 22.5579822;
        lng = -120.8041848;
    }

    /*markerLatLng = new google.maps.LatLng(lat, lng)

    map.setCenter(markerLatLng);
    if (marker !== undefined)
        marker.setMap(null);
    marker = new google.maps.Marker({
        position: markerLatLng,
        map: map,
        center: markerLatLng
    });*/



    console.log(markerLatLng);
    iframe.contentWindow.postMessage("crearMarker(" + lat + ", " + lng + ")", '*');

    console.log("Terminó");
}
var limitCatalog = function (catalog) {
    catalogs = [];
    if (catalog.length > 4) {
        i = 1;
        $(catalog).each(function (key, info) {
            catalogs.push(info);
            if (i == 5) {
                return false;
            }
            i++;
        });
    } else {
        catalogs = catalog;
    }
    return catalogs;
}

var addParam = function (queryString, key, values) {
    return queryString += "" + key + "" + values;
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
    $('#blockcontent').modal('hide');
}

var revisaModal = function () {
    if (($("#modal-loading").data('bs.modal') || {}).isShown) {
        $('.tiempo_fuera').show();
    }
}

var modalImagen = function () {
    $("#modal-imagen").modal('show');
}

var verMas = function () {
    $("#divSchoolStats2").show()
    $("#divSchoolStats3").show()
    $("#mas2").hide();
    $("#menos2").show();
}

var verMenos = function () {
    $("#divSchoolStats2").hide();
    $("#divSchoolStats3").hide();
    $("#mas2").show();
    $("#menos2").hide();
}

var latitud = function (latitud) {

    var lat = latitud;
    var latn = Math.abs(lat); /* Devuelve el valor absoluto de un número, sea positivo o negativo */
    var latgr = Math.floor(latn * 1); /* Redondea un número hacia abajo a su entero más cercano */
    var latmin = Math.floor((latn - latgr) * 60); /* Vamos restando el número entero para transformarlo en minutos */
    var latseg = ((((latn - latgr) * 60) - latmin) * 60); /* Restamos el entero  anterior ahora para segundos */
    var latc = (latgr + ":" + latmin + ":" + latseg.toFixed(2)); /* Prolongamos a centésimas de segundo */
    if (lat > 0) {
        x = latc + ' N'; /* Si el número original era positivo, es Norte */
    } else {
        x = latc + ' S'; /* Si el número original era negativo, es Sur */
    } /* Repetimos el proceso para la longitud (Este, -W-Oeste) */

    return x;
}


var longitud = function (longitud) {

    var lng = longitud;
    var lngn = Math.abs(lng);
    var lnggr = Math.floor(lngn * 1);
    var lngmin = Math.floor((lngn - lnggr) * 60);
    var lngseg = ((((lngn - lnggr) * 60) - lngmin) * 60);
    var lngc = (lnggr + ":" + lngmin + ":" + lngseg.toFixed(2));
    if (lng > 0) {
        y = lngc + ' E';
    } else {
        y = lngc + ' W';
    }

    return y;
}

let iframe;
$gmx(document).ready(function () {
    $("#divSchoolResults").hide();
    $("#blockcontent").hide();

    $('#btnToggleOptionalFIlters').click(function () {
        if ($(this).attr('rel') == 0) {
            $('#menu_opcional').show('slow');
            $(this).attr('rel', '1')
        } else {
            $('#menu_opcional').hide('slow');
            $(this).attr('rel', '0')
        }

    });


    iframe = document.getElementById("mapIFrame");
    console.log("Cargó");

});


