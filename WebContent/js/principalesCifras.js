$(function () {
    $('.panel-map').on('shown.bs.collapse', function (e) {
        google.maps.event.trigger(map, "resize");
    });

    $('#txtCCT').keyup(function(){
        if (!$(this).val().replace(/\s/g, '').length) {
            $(this).val($(this).val().replace(/\s/g, ''));
        }

    });
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
        }else{
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
        $scope.excel= null;


        $scope.getURLCatalogs = function () {
            return global_uri+'/catalogos/';
        }
 


        $scope.getCicloEscolar = function () {
            $http.get(
                    $scope.getURLCatalogs()
                    + 'cicloEscolar/')
                    .success(function (data) {
                        $scope.cicloEscolares = data.ciclos;
                        $scope.cicloEscolar =  $scope.cicloEscolares[0]
                    });
        }


        $scope.getModalidad = function () {
            $http.get(
                    $scope.getURLCatalogs()
                    + 'modalidadEducativa/')
                    .success(function (data) {
                        $scope.modalidadEducativas = data.modalidades;
                    });
        }

        $scope.getStates = function () {
            $http.get(
                    $scope.getURLCatalogs()
                    + 'estado')
                    .success(function (data) {
                        $scope.states = data.estadoDTO;
                    });
        }
        
        $scope.getTipoEducativo = function () {

            $http.get(
                $scope.getURLCatalogs()
                + 'tipoEducativo')
                .success(function (data) {
                    $scope.tipoEducativos = data.tipoEducativoDTO;
                    $scope.tipoEducativos.splice(6,1)
                    $scope.tipoEducativos.splice(4,1)
                });
        }

        $scope.getNivelEducativo = function () {
            $scope.serviciosEducativos = null;
            $scope.nivelesEducativos = null;
            //Limpiar selección del model/combo de modalidad
            $scope.modalidad=null;
            $http.get(
                $scope.getURLCatalogs()
                + 'nivelTipo/idTipoEducativo='+$scope.user.tipoEducativo.id)
                .success(function (data) {
                    $scope.nivelesEducativos = data.Niveltipo;
                });
        }
        
        $scope.getServicioEducativo = function () {
            $scope.serviciosEducativos = null;
            //console.log('servicio educativo');
            console.log($scope.getURLCatalogs()
                    + 'subNivel/idSubNivel='+$scope.user.nivelEducativo.id);
            $http.get(
                $scope.getURLCatalogs()
                + 'subNivel/idSubNivel='+$scope.user.nivelEducativo.id)
                .success(function (data) {
                    $scope.serviciosEducativos = data.nivelescolarDTO;

                    //console.log($scope.nivelesEducativos);
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

         $scope.buscaPricipalesCifras = function () {
            return global_uri+'/principalesCifras/consultarTabla?';
        }

$scope.headerHtml;
$scope.infoTabla;
$scope.ultimo;
$scope.ultimoArreglo;

        $scope.search = function (pagina) {

            $('#divSchoolResults').css({'min-height': '600px'});


            parametros = "";

            console.log('CICLO ESCOLAR')
            console.log($scope.cicloEscolar);
            console.log('TIPO EDUCATIVO')
            console.log($scope.user.tipoEducativo);
            console.log('NIVEL EDUCATIVO')
            console.log($scope.user.nivelEducativo);
            console.log('SERVICIO EDUCATIVO')
            console.log($scope.user.servicioEducativo);
            console.log('SOSTENIMIENTO')
            console.log($scope.control);
            console.log('ENTIDAD')
            console.log($scope.user.state);
            console.log('MUNICIPIO')
            console.log($scope.user.municipality);
            console.log('MODALIDAD')
            console.log($scope.modalidad );
           

            if ($scope.cicloEscolar != null) {
                parametros = addParam(parametros,
                        '&ciclo=', $scope.cicloEscolar.id);
            } else {
                parametros = addParam(parametros,
                        '&ciclo=', '');
            }

            if ($scope.user.tipoEducativo != null) {
                parametros = addParam(parametros,
                        '&tipoeducativo=', $scope.user.tipoEducativo.id);
            } else {
                parametros = addParam(parametros,
                        '&tipoeducativo=', '');
            }

            if ($scope.user.nivelEducativo != null) {
                parametros = addParam(parametros,
                        '&niveleducativo=', $scope.user.nivelEducativo.id);
            } else {
                parametros = addParam(parametros,
                        '&niveleducativo=', '');
            }

            if ($scope.control != null) {
                parametros = addParam(parametros,
                        '&sostenimiento=', $scope.control.id);
            } else {
                parametros = addParam(parametros,
                        '&sostenimiento=', '');
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

            if ($scope.modalidad != null) {
                parametros = addParam(parametros,
                        '&modalidad=', $scope.modalidad.idModalidadEducativa);
            } else {
                parametros = addParam(parametros,
                        '&modalidad=', '');
            }    

           /* if ($scope.user.location != null) {
                parametros = addParam(parametros,
                        '&localidad=', $scope.user.location.id);
            } else {
                parametros = addParam(parametros,
                        '&localidad=', '');
            }*/ 
//subnivel es el servicio educativo
            if ($scope.user.servicioEducativo != null) {
                parametros = addParam(parametros,
                        '&servicioeducativo=', $scope.user.servicioEducativo.id);
            } else {
                parametros = addParam(parametros,
                        '&servicioeducativo=', '');
            }    
   

            processing();
            //$('#tblSchoolResults tbody').html('');
            $http
            .get($scope.buscaPricipalesCifras() + parametros)
            //.get('http://localhost/json/alumnos.php')
            .success(	
                    function (data) {
                        //console.log('información del vera')
                       // console.log(data)
                        noprocessing();
                        if(data.datos && data.datos.length > 0){
                            $("#divSchoolResults").show();
                            $("#divNo1").show();

                            $("#divNoencontrada").hide();

                            var encabezadoTmp = data.header;
                            var infoTabla = data.datos;
                            var ultimoArreglo = infoTabla[infoTabla.length - 1];
                            infoTabla.splice(infoTabla.length - 1, 1);
                            var htmlTable;

                            var headerDT = []

                            encabezadoTmp.forEach(function(articulo,i){
                            
                                headerDT.push({title: articulo});
                            })
                            
                            $scope.infoTabla = infoTabla;
                            $scope.headerHtml = encabezadoTmp;

                            /*var ultimo = infoTabla[infoTabla.length - 1];
                            $scope.ultimo = ultimo;*/
                            $scope.ultimoArreglo = ultimoArreglo;

                            /*console.log('TOTAL-ULTIMO ARREGLO')
                            console.log($scope.ultimoArreglo)*/
                            var htmlTable = '<table id="tblSchoolResults" border="1" class="table table-siged table-select table-responsive"  style="width:100%"><thead class="header-order"></thead><tbody></tbody><tfoot style="font-weight: 900;font-size:15px">'

                            htmlTable += '<tr>';
                            $scope.ultimoArreglo.forEach(function(ultimoArreglo){

                            htmlTable += '<td>'+ultimoArreglo+'</td>';
                           // console.log('Arreglo')
                            //console.log(ultimoArreglo)
                                          })
                            htmlTable += '</tr>';

                           htmlTable += '</tfoot></table><br>';

                         $('#tableContainer').html(htmlTable);

                            var table = $('#tblSchoolResults').DataTable({
                               "searching": true,
                               data: infoTabla, 
                               "bDestroy": true,
                               "bFilter": false,
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
                                columns: headerDT
                            });


                        }else{
                           // console.log('no se encontró información')
                            $("#divSchoolResults").hide();
                            $("#divNoencontrada").show();
                            $("#divNo1").hide();
                        }

                    });

            /*parametros = addParam(parametros,'primer', '');
            parametros = addParam(parametros,'ultimo', '');*/
        }

         $scope.generaExcel = function () {

        processing();
        setTimeout(function(){

                    var htmlTable = '<table><thead><tbody>'
					

                    $scope.headerHtml.forEach(function(headerHtml){
                        htmlTable += '<td style="font-weight: 900;">'+headerHtml+'</td>';
                       // console.log($scope.headerHtml);
                      })


                    $scope.infoTabla.forEach(function(infoTabla,index){

                                htmlTable += '<tr>';

                         infoTabla.forEach(function(datosTabla){

                                htmlTable += '<td>'+datosTabla+'</td>';
                          
                            })
                               htmlTable += '</tr>';

                      })

                     if($scope.cicloEscolar.id==22){
	htmlTable +='<tr></tr><tr></tr><tr><td colspan="8"> Ciclo 2019 -2020 Información Preliminar</td></td></tr>';     
					 }
else					 
	htmlTable +='<tr></tr><tr></tr><tr><td colspan="8">¹ Conjunto de individuos adscritos a un centro de trabajo, de acuerdo a la función que realizan en el mismo. A cada uno se le considera tantas veces como en centros de trabajo esté adscrito.</td></td></tr>'; 


                     htmlTable += '</tbody></thead></table>';

                    var htmlTable = htmlTable.replace(/undefined/g, "");
                                     
                     noprocessing();
                     var ua = window.navigator.userAgent;
                    var msie = ua.indexOf("MSIE ");
                     
                     if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
                      {
                         var txtArea1 = document.getElementById('txtArea1');
                            txtArea1.contentWindow.document.open("txt/html","replace");
                            txtArea1.contentWindow.document.write(htmlTable);
                            txtArea1.contentWindow.document.close();
                            txtArea1.contentWindow.focus(); 
                        var sa=txtArea1.contentWindow.document.execCommand("SaveAs",true,"concentrado_articulo73.xls");
                      }
                      else {
                      var data_type = 'data:application/vnd.ms-excel;charset=utf-8';

                      
                        var a = document.createElement('a');
                        document.body.appendChild(a);  // You need to add this line
                        
                        var uint8 = new Uint8Array(htmlTable.length);
                        for (var i = 0; i <  uint8.length; i++){
                            uint8[i] = htmlTable.charCodeAt(i);
                        } 
                       
                        var xData = new Blob([uint8], {type:"text/csv"});
                        var xUrl = URL.createObjectURL(xData);
                        a.href = xUrl;
                          
                        a.download = 'concentrado_principalesCifras.xls';
                        a.click();
                            
                      }
                     
                     
                },250);

            }

        $scope.newSearch = function () {
            $("#divSchoolResults").hide();
            $("#divNoencontrada").hide();
            $("#divNo1").hide();
            $scope.states = null;
            $scope.municipalities = null;
            $scope.locations = null;
            $scope.cicloEscolares = null;
            $scope.modalidadEducativas = null;
            $scope.nivelesEducativos = null;
            $scope.tipoEducativos = null;
            $scope.locations = null;
            $scope.serviciosEducativos = null;

           $scope.sectors = null;
           $scope.cicloEscolar = null;
           $scope.resetForm();
        }

        $scope.resetForm = function () {
           /* $scope.states = null;
            $scope.municipalities = null;
            $scope.locations = null;
            $scope.cicloEscolares = null;
            $scope.modalidadEducativas = null;
            $scope.nivelesEducativos = null;
            $scope.tipoEducativos = null;
            $scope.locations = null;
            $scope.sectors = null;
            $scope.showMoreLevels = true;
            $scope.showSchedules = true;
            $scope.nivelesEducativos = null;
*/
            $scope.user = {
                schoolName: null,
                state: null,
                municipality: null,
                olocation: null,
                schedule: null,
                level: null,
                sector: null,
                serviciosEducativos: null,
                nivelesEducativos: null,
                tipoEducativo: null,
                idtype: null
            }

            $scope.getStates();
            $scope.getCicloEscolar();
            $scope.getModalidad();
            $scope.getTipoEducativo();
            $scope.getLocations();
            $scope.getSectors();
            $scope.getURLCatalogs();
        }
        
        $scope.resetForm();

    }]);


var addParam = function (queryString, key, values) {
    return queryString += "" + key + "" + values;
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







       