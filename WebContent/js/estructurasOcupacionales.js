

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

var app = angular.module('estructurasOcupacionales', ['ngResource']);

app.controller('estructurasOcupacionalesCtrl', ['$scope', '$http','$window', '$rootScope','$timeout',
    function ($scope, $http,$window, $rootScope,$timeout){
	
		$http.defaults.headers.get = {"Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"};
		
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
            return global_uri+'/catalogos/';
        }

        $scope.getURLSchools = function () {
            return global_uri+'/escuela/buscaEscuelaEO/';
        }

        $scope.getURLSchoolEO = function () {
            return global_uri_eo+'/estructuras/consultaEstructuraPorCCT?claveCT=';
            
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
        	
        	processing();

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

            if ($scope.user.location != null) {
                parametros = addParam(parametros,
                        '&localidad=', $scope.user.olocation.id);
            } else {
                parametros = addParam(parametros,
                        '&localidad=', '');
            }


            var totalRecords = 0;

            var table = $('#tblSchoolResults').DataTable({

            });

            //if (table != undefined)
                table.destroy();


            table = $('#tblSchoolResults').DataTable({
                responsive: true,
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
                    "url": $scope.getURLSchools() + parametros
                            + '&primer=1'
                            + '&ultimo=1000',
                    'beforeSend': function (request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
                    },
                    "dataSrc": function (d) {
                                    //console.log('resolvió el rest de busqueda');
                    	console.log(d)
                    	console.log(d.datos)
                        noprocessing();
                    	if(d.datos == null)
                    		d.datos = []
                        //si no encuentra los datos
                        if(d.datos.length) {
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
                    {"name": "NOMBREENT", "data": "clave"},
                    {"name": "NOMBRABREV", "data": "entidad"},
                    {"name": "NOMBRECT", "data": "nombre"},
                    {"name": "NOMBRENIV", "data": "nivel"},
                    {"name": "NOMBRECONT", "data": "sostenimiento"}
                ]
            });

            $('#tblSchoolResults tbody').unbind('click');

            $('#tblSchoolResults tbody').on('click', 'tr', function () {

                var school = table.row(this).data();
                //console.log(this);
                $scope.showDetails(school.clave);

                //$scope.abrir_escuela(school.clave, school.idTurno);
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
            $scope.datos = null;
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



        $scope.showDetails = function (idDetailsToShow) {
	         $('#myModal').modal('show');  
	         $("#dialog_estructura").css('margin-top', '10px');

	         

	         $scope.buscandoEstructura = true;
        	  $http
              .get($scope.getURLSchoolEO()+idDetailsToShow)
              .success(
                      function (data) {
                    	  $scope.buscandoEstructura = false;
                    	  console.log(data)
                    	  
                    	  $timeout(function () {
				    	    $('.nav-tabs a:first').tab('show');
                            $('.capacidad').DataTable({
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
                            	}
                            });

					    }, 100);

                          if(data.datos.cts && data.datos.cts.length){
                        	  $scope.capacidadEscuela = data.datos.cts[0]
                        	  
                        	  console.log($scope.capacidadEscuela)
                          }else{
                        	  $scope.capacidadEscuela = null;
                          }
                           
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

       



    }]);



var addParam = function (queryString, key, values) {
    return queryString += "" + key + "" + values;
}

var processing = function () {
    $("#modal-loading").modal('show');
    $('.tiempo_fuera').hide();
    setTimeout(revisaModal, 30000);
}

var noprocessing = function (modal_abrir) {
	$('#blockcontent').modal('hide');
    $('#modal-loading').modal('hide');

}

var revisaModal = function (){
    if(($("#modal-loading").data('bs.modal') || {}).isShown){
        $('.tiempo_fuera').show();
    }
}



