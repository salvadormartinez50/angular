function fnExcelReport()
{
    var tab_text="<meta http-equiv='content-type' content='application/vnd.ms-excel; charset=UTF-8'><table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange; var j=0;
    tab = document.getElementById('tblSchoolResults'); // id of table

    for(j = 0 ; j < tab.rows.length ; j++)
    {
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text=tab_text+"</table>";
    tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html","replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus();
        sa=txtArea1.document.execCommand("SaveAs",true,"reporteFuerzaMexico.xls");
    }
    else                 //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

    return (sa);
}

$(function () {
/*    $('.panel-map').on('shown.bs.collapse', function (e) {
        google.maps.event.trigger(map, "resize");
    });
*/
  $('.btn-opcion').css({'display':'block'})

    $('#txtCCT').keyup(function(){
        if (!$(this).val().replace(/\s/g, '').length) {
            $(this).val($(this).val().replace(/\s/g, ''));
        }

    });
    var muestra = 1;

      $('.btn-buscar').click(function(){
        $('#extras').show('fast')
        $('#reset').show('fast')
        muestra = 0;
      });

    $('.btn-opcion').click(function(){
      if(muestra){
        $('#extras').show('fast')
        $('#reset').show('fast')

        muestra = 0;
      }
      else{
        $('#extras').hide('fast')
        $('#reset').hide('fast')

      muestra = 1;
      }
    })
});

var marker;
var markerLatLng;
var mapProp = {
    zoom: 15
};

var map = new google.maps.Map(document.getElementById("map"), mapProp);

$(function(){
	$('.inline-form-filters select').change(function(){
		var bloqueo = 0;

		$('.inline-form-filters select').each(function(){
			if($(this).val() != '')
				bloqueo = 1;
		});

		if(bloqueo){
			$('#txtCCT').removeAttr('required', true);
		}
		else{
			$('#txtCCT').prop('required', true);
		}
	});
});

var app = angular.module('escuelas', ['ngResource']);

app.controller('searchSchoolCtrl', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope){

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

        $scope.getURLCatalogs = function () {
            return 'https://siged.sep.gob.mx/servicios/catalogos/';
        }
        

        /*$scope.getURLSchools = function () {
            return 'https://siged.sep.gob.mx/services/EscuelaService/EscuelaServiceRS/escuelas/list?';
        }*/

        $scope.getURLSchools = function () {
            return global_uri +  '/escuela/FMexico/';
        }

        /*$scope.getURLSchool = function () {
            return 'https://siged.sep.gob.mx/services/EscuelaService/EscuelaServiceRS/escuelas/escuela?';
        }*/

        $scope.getURLSchool = function () {
            return 'https://siged.sep.gob.mx/Core/ct/cct=';
        }

        $scope.getURLTeachers = function () {
            return 'https://siged.sep.gob.mx/services/EscuelaService/EscuelaServiceRS/escuelas/escuela_docentes/';
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
            console.log("pasa ct: " + cct);
            $http.get('https://siged.sep.gob.mx/services/ServicioImagenesEscuela/ImagenesEscuelaRS/escuela/imagenes/' + cct + '/Entrada').success(function (data) {
                $scope.ctImagen = data.ctImagen;
                console.log($scope.ctImagen);
                //console.log("regresa imagen");
                //enlace.edu.mx
                modalImagen();
            });
        }

        $("#results").hide();
        console.log($scope.getURLCatalogs()+'estadoFMexico')
        $scope.getStates = function () {
            $http.get(
                    $scope.getURLCatalogs()
                    + 'estadoFMexico')
       
                    .success(function (data) {
                      console.log(data.entFed);

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

            $('#divSchoolResults').css({'min-height': '600px'});

            parametros = "";

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

            if ($scope.user.damage != null) {
                parametros = addParam(parametros,
                        '&dano=', $scope.user.damage);
            } else {
                parametros = addParam(parametros,
                        '&dano=', '');
            }

            parametros = addParam(parametros,'&primer=', '1');
            parametros = addParam(parametros,'&ultimo=', '1000');

            var totalRecords = 0;

            var table = $('#tblSchoolResults').DataTable({

            });

            //if (table != undefined)
            	table.destroy();
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
                    "infoFiltered": " ",
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
                "searching": false,
                "bLengthChange": false,
                "bProcessing": false,
                "sAjaxDataProp":'',
                "ajax": {
                    // "url": $scope.getURLSchools() + parametros,
                    "url": $scope.getURLSchools() + parametros
                          ,
                    "data": function (data) {


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
						console.log('resolvió el rest de busqueda');
                        noprocessing();
                        console.log('resultado de la busqueda:');
                        console.log(d);

                        //si no encuentra los datos
                        if (d.recordsTotal > 0) {
                            $("#divSchoolResults").show();
                            $("#divNoEncontrada").hide();

                        } else {
                            $("#divSchoolResults").show();
                            $("#divNoEncontrada").hide();
                        }

                        $('html, body').animate({
                            scrollTop: 290
                        }, 1000);
                        return d.datos;
                    },
                },
                "columns": [
                    {"name": "NOMBREENT", "data": "entidad"},
                    {"name": "NOMBREMUN", "data": "municipio"},
                    {"name": "NOMBRELOC", "data": "localidad"},
                    {"name": "NOMBRECT", "data": "nombre"},
                    {"name": "NOMBRENIV", "data": "nivel"},
                    {"name": "NOMBRETUR", "data": "turno"},
                    {"name": "NOMBRECONT", "data": "control"},
                    {"name": "NOMBREDANO", "data": "dano"},


                ]
            });

            $('#tblSchoolResults tbody').unbind('click');

            $('#tblSchoolResults tbody').on('click', 'tr', function () {

                var school = table.row(this).data();

                $scope.showDetails(school.clave, school.idTurno);
                $scope.dano_escuela = school.dano;
                $scope.cv_inmueble = school.cv_inmueble;
                $scope.abrir_escuela(school.clave);


                /*$("#divSchoolResults").hide();*/
            });

            $('#tblSchoolResults tbody tr').unbind('over');
            $("#tblSchoolResults tbody tr").on('over', function (event) {
                $("#tblSchoolResults tbody tr").removeClass('row_selected');
                $(this).addClass('row_selected');
            });
        }

        $scope.newSearch = function () {
            $scope.schools = null;
            $("#btnFindSchool").removeClass("disabled");
            $("#btnFindSchool").addClass("active");
            $("#btnResetForm").removeClass("active");
            $("#btnResetForm").addClass("disabled");
            $("#divSchoolResults").hide();
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


            alum1= $scope.stats.alumprimero;
            alum2= $scope.stats.alumsegundo;
            alum3= $scope.stats.alumtercero;
            alum4= $scope.stats.alumcuarto;
            alum5= $scope.stats.alumquinto;
            alum6= $scope.stats.alumsexto;
            totalAlum= alum1 + alum2 + alum3+ alum4+ alum5+ alum6;
            $scope.totalesAlum1 = (alum1 / totalAlum)*100;
            $scope.totalesAlum2 = (alum2 / totalAlum)*100;
            $scope.totalesAlum3 = (alum3 / totalAlum)*100;
            $scope.totalesAlum4 = (alum4 / totalAlum)*100;
            $scope.totalesAlum5 = (alum5 / totalAlum)*100;
            $scope.totalesAlum5 = (alum6 / totalAlum)*100;

						$("#divSchoolStats").show();
					} else {
						$("#divSchoolStats").hide();
						$scope.stats = null;
					}
            }).error(function (error) {
                console.log("no ats");
            })
        }

        $scope.getTeachers = function (idDetailsToShow) {
            //console.log($scope.getURLTeachers() + idDetailsToShow);
            $http
                    .get($scope.getURLTeachers() + idDetailsToShow)
                    .success(
                            function (data) {
                                var nuevo_docente = [],valor,copia;

								if(data.docente !== undefined){
									$.each(data.docente, function(index, valor_old) {

										valor = {   nombres: valor_old.nombres,
													primerAp: valor_old.primerAp,
													segundoAp: valor_old.segundoAp,
													categoria: valor_old.categoria,
													curp: valor_old.curp

												};

										copia = 0;
										$.each(nuevo_docente, function(index, subvalor) {

											if(copia == 0){
												//console.log('if v:'+valor.curp+' = v:'+subvalor.curp+' y c:'+valor.categoria+' = c:'+subvalor.categoria);
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
                                            {"data": "nombres",
                                                "render": function (data, type, full, meta) {
                                                    return full.nombres + " " + full.primerAp + " " + full.segundoAp;
                                                }
                                            },
                                            {"data": "categoria"}

                                        ]
                                    });
                                }
                            });
        }

        $scope.showDetails = function (idDetailsToShow,
                idSchedule) {
            processingschool();

            $scope.school = null;
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
                                $scope.showResults = true;

                                $scope.school = data.datos;
                                $scope.hideFinder();
                                $("#results").show();

                                //$scope.getImagen(idDetailsToShow);



                                //$scope.ctImagen = null;

                                /*$http.get('https://siged.sep.gob.mx/services/ServicioImagenesEscuela/ImagenesEscuelaRS/escuela/imagenes/' + idDetailsToShow + '/Entrada').success(function (data) {
                                    $scope.ctImagen = null;
                                    $scope.ctImagen = data.ctImagen[0];
                                });*/

                                /*$http.get('https://siged.sep.gob.mx/Core/ct/ctImg/cct=' + idDetailsToShow + '&etiqueta=Entrada').success(function (data) {
                                    $scope.ctImagen = null;

                                });*/



                                $scope.showTeachers = false;
                                $scope.getStats(idDetailsToShow, idSchedule);
                                $scope.getTeachers(idDetailsToShow);
                                $scope.searchButtons = false;

                                noprocessing();
                                $("#cargando_escuela").hide();
                                $("#cont_escuela").show();

                                    //	$('#accordionMap').show()
                                console.log('escuela')
                                console.log($scope.school);
                                //console.log("coord mapa nuevo: " + gradosadecimales($scope.school.latDms) + " : " + gradosadecimales($scope.school.lonDms));
                                console.log("coord mapa: " + $scope.school.latDms + " : " + $scope.school.lonDms);
                                if($scope.school.latDms === undefined || $scope.school.lonDms === undefined)
                                  initialize(null,null);
                                else{
                                  console.log("coord mapa convertidac: " + gradosadecimales($scope.school.latDms) + " : " + gradosadecimales($scope.school.lonDms));
                                  initialize(gradosadecimales($scope.school.latDms), gradosadecimales($scope.school.lonDms));
                                }


                            }).error(function (error) {
            });
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

        $scope.abrir_escuela = function(clave,estatus){

            console.info('situacion'+estatus);


          }



    }]);

var setDisabled = function (idComponent, disabled) {
    $("#" + idComponent).prop('disabled', disabled);
}

var initialize = function (lat, lng) {
    if(marker !== undefined)
        marker.setMap(null)

            if (lat == null || lng == null) {
              lat = 23.3905191;
              lng = -100.1085054;
              zoom = 4;
              markerLatLng = new google.maps.LatLng(lat, lng)
            }else{
              zoom = 15;
              markerLatLng = new google.maps.LatLng(lat, lng)
              marker = new google.maps.Marker({
                  position: markerLatLng,
                  map: map,
                  center: markerLatLng,
              });
            }

            google.maps.event.trigger(map, "resize");
            map.setCenter(markerLatLng);
            map.setZoom(zoom)
          //  if (marker !== undefined)
            //    marker.setMap(null);

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

var revisaModal = function (){
    if(($("#modal-loading").data('bs.modal') || {}).isShown){
        $('.tiempo_fuera').show();
    }
}

var modalImagen = function (){
    $("#modal-imagen").modal('show');
}

var verMas = function(){
    document.getElementById("divSchoolStats2").style = "display: inline";
    document.getElementById("divSchoolStats3").style = "display: inline";
    document.getElementById("texotMas").innerHTML = "ver menos";
    console.log(document.getElementById("mas2").innerHTML)
    document.getElementById("mas2").className = "fa fa-minus-circle";
    document.getElementById("texotMas").href = "javascript:verMenos();";
}

var verMenos = function(){
    document.getElementById("divSchoolStats2").style = "display: none";
    document.getElementById("divSchoolStats3").style = "display: none";
    document.getElementById("texotMas").innerHTML = "ver más";
    document.getElementById("mas2").className = "fa fa-plus-circle";
    document.getElementById("texotMas").href = "javascript:verMas();";
}


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
});
