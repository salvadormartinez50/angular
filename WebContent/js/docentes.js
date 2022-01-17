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
var app = angular.module('docentes', ['ngResource']);

app.controller('docentesController', ['$scope', '$http', '$window', '$rootScope',
    function ($scope, $http, $window, $rootScope) {
        $scope.primeraBusqueda = 1;
        $scope.fuentes = null;
        
        $http.defaults.headers.get = {"Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"};

        $scope.getDocentesParams = function () {
           return global_uri+'/docente/docenteList/';

        }

        $scope.cifraAnual=null;
        $scope.cifraAnualPeriodo="";
        $scope.cifraAnualDocentesGlobales = 0;
        $scope.getGlobales = function () {
            //Verificar info estadistica global
            $scope.cifraAnual = sessionStorage.getItem("cifraAnual");
            console.log("Buscando valor de totales." + $scope.cifraAnual)
            if ($scope.cifraAnual === null) {
                //Buscar en API el valor de alumnos,docentes y escuelas
                this.getTotales();
                
            } else {
                console.log("Se tiene en SS");
                $scope.cifraAnualDocentesGlobales = Intl.NumberFormat('en-US').format(JSON.parse($scope.cifraAnual).totalDocentes);
                $scope.cifraAnualPeriodo = JSON.parse($scope.cifraAnual).periodo;
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
                    $scope.cifraAnualDocentesGlobales = Intl.NumberFormat('en-US').format(JSON.parse($scope.cifraAnual).totalDocentes);
                    $scope.cifraAnualPeriodo = JSON.parse($scope.cifraAnual).periodo;
                    console.log("Se cargó en sesión : " + $scope.cifraAnual);
                    console.log("cifraAnualPeriodo en sesión : " + $scope.cifraAnualPeriodo);
                });
        }        

        $scope.getConsultaByFuente = function () {
            var fuente = $scope.fuente;

                //processing();
                $("#btnResetForm").removeClass("disabled");
                $http({
                    method: 'GET',
                    url: global_uri+'/catalogos/fuente',
                    //url: global_uri+'/certificado/consultaCertificado/folio=' + fuente,
                    //url: 'http://localhost:8080/Core/alumno/curp=' + curps,
                    //url: 'https://siged.sep.gob.mx/services/AlumnoService/AlumnoServiceRS/alumnos/alumno/' + curps,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }

                }).success(function (data) {
                    //console.log( 'Detalle')
                    //console.log(data)
                  $scope.primeraBusqueda = 0;

                  if(data.fuentes === undefined)
                      $scope.fuentes = 0;
                  else
                      $scope.fuentes = data.fuentes[0];

                    noprocessing();
                  //console.log($scope.fuentes)
                  
                }).error(function (error) {
                    $scope.fuentes = null;
                               
                });



         
        }

        /*$scope.getDocenteCURP = function () {
            return 'https://siged.sep.gob.mx/services/DocentesService/DocenteServiceRS/docentes/docente/';
        }*/

        $scope.getDocenteCURP = function () {
            return global_uri+'/docente/docenteDetalle/curp=';
        }

        $scope.getRecordsByPage = function () {
            return 10;
        }

        var addParam = function (queryString, key, values) {
            return queryString += "" + key + "=" + values;
        }

        //Función para excel
        $scope.getURLSchoolExcel = function () {
            return global_uri+'/docente/docenteReporte/';
        }

        $scope.getConsultaDocentes = function () {

            $('#divSchoolResults').css({'min-height':'600px'});

            var val = $scope.myVar;

            //console.log("valor: " + val);
            if ($scope.busca !== undefined && $scope.busca !== null)
                $scope.busca = limpiar($scope.busca);
            if ($scope.buscaAP !== undefined && $scope.buscaAP !== null)
                $scope.buscaAP = limpiar($scope.buscaAP);
            if ($scope.buscaAM !== undefined && $scope.buscaAM !== null)
                $scope.buscaAM = limpiar($scope.buscaAM);

            var curps = $scope.buscaCurp;
            if (curps !== undefined && $scope.buscaCurp !== null)
                curps = curps.toUpperCase();

            var m = curps;
            //var expreg = /^[A-Z]{1,2}\s\d{4}\s([B-D]|[F-H]|[J-N]|[P-T]|[V-Z]){3}$/;
            var expreg = /^([A-Z]{4})([0-9]{6})([HM]{1})(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;



            if (val == 2) {
                if (expreg.test(curps)) {

                    parametros = "";

                        parametros = addParam(parametros,
                                'nombre', '');

                        parametros = addParam(parametros,
                                '&primerAp', '');

                        parametros = addParam(parametros,
                                '&segundoAp', '');

                    parametros = addParam(parametros,
                                '&curp', $scope.buscaCurp);

                    processing();
                    var totalRecords = 0;
                    $("#btnResetForm").removeClass("disabled");
                    var table = $('#tblSchoolResults').DataTable({
                        //responsive: true,
                        "destroy": true,
                        /*"dom": "tpr",
                        "procesing": true,
                        "serverSide": true,*/
                        //"pageLength": $scope.getRecordsByPage(),
                        "language": {
                            "url": "js/datatable.spanish.lang"
                        },
                        "ajax": {
                            "url": $scope.getDocentesParams() + parametros +  '&primer=1&ultimo=1000',

                            'beforeSend': function (request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
                    },
                            "data": function (data) {
                                processing();
                            },
                            "dataSrc": function (d) {
                              var datosLimpios = [];
                                noprocessing();
                                $("#divSchoolResults").show();
                                $('#noEncontrada').hide();

                                d.forEach(function(valor){
                                    datosLimpios.push(valor.datos[0]);
                                });

                                if (datosLimpios.length < 1) {
                                    $("#divSchoolResults").hide();
                                    $('#noEncontrada').show();
                                }

                                $('html, body').animate({
                                    scrollTop: 290
                                }, 1000);
                                return datosLimpios;
                            },
                        },
                        "columns": [
                            {"name": "CURP", "data": "nombre",
                                "render": function (data, type, full, meta) {
                                	
                                	if(full.segundoAp === undefined)
                                		full.segundoAp = "";
                                    return full.nombre + " " + full.primerAp + " " + full.segundoAp;
                                }
                            },
                            {"name": "NOMBREENTIDAD", "data": "nombreEntidad"},
                            {"name": "NOMBREMUNICIPIO", "data": "nombreMunicipio"},
                            {"name": "NOMBRELOCALIDAD", "data": "nombreLocalidad"},
                            {"name": "NOMBRECT", "data": "nombreCt"}

                        ]
                    });
                    $('#tblSchoolResults tbody').unbind('click');
                    $('#tblSchoolResults tbody').on('click', 'tr', function () {
                        var docente = table.row(this).data();
                        $scope.showDetails(docente.curp, docente.cct);


                    });
                    $('#tblSchoolResults tbody').unbind('over');
                    $("#tblSchoolResults tbody tr").on('over', function (event) {
                        $("#tblSchoolResults tbody tr").removeClass('row_selected');
                        $(this).addClass('row_selected');
                    });


                } else {

                    //console.log("La CURP NO es correcta");

                    $("#modalCurpError").modal('show');

                }

            } else {

                if ($scope.busca === undefined || $scope.buscaAP === undefined) {

                    if ($scope.busca === undefined)
                        $('#nom').addClass('input-error');
                    else
                        $('#nom').removeClass('input-error');
                    if ($scope.buscaAP === undefined)
                        $('#ap_pate').addClass('input-error');
                    else
                        $('#ap_pate').removeClass('input-error');

                } else {
                    parametros = "";
                    $('#nom').removeClass('input-error')
                    $('#ap_pate').removeClass('input-error')
                    //console.log(limpiar($scope.busca+' '+$scope.buscaAP+' '+$scope.buscaAM));
                    //if ($scope.busca != null) {
                        parametros = addParam(parametros,
                                'nombre', $scope.busca);
                    //}

                    //if ($scope.buscaAP != null) {
                        parametros = addParam(parametros,
                                '&primerAp', $scope.buscaAP);
                    //}

                    if ($scope.buscaAM != null) {
                        parametros = addParam(parametros,
                                '&segundoAp', $scope.buscaAM);
                    }else{
                        parametros = addParam(parametros,
                                '&segundoAp', '');
                    }

                    parametros = addParam(parametros,
                                '&curp', '');

                    processing();
                    var totalRecords = 0;
                    $("#btnResetForm").removeClass("disabled");
                    var table = $('#tblSchoolResults').DataTable({
                        //responsive: true,
                        "destroy": true,

                        "language": {
                            "url": "js/datatable.spanish.lang"
                        },
                        "ajax": {
                            "url": $scope.getDocentesParams() + parametros +  '&primer=1&ultimo=1000',
                            'beforeSend': function (request) {
                                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
                            },
                            "data": function (data) {
                                processing();
                            },
                            "dataSrc": function (d) {
                              var datosLimpios = [];
                                noprocessing();
                                $("#divSchoolResults").show();
                                $('#noEncontrada').hide();

                                d.forEach(function(valor){
                                    datosLimpios.push(valor.datos[0]);
                                });

                                if (datosLimpios.length < 1) {
                                    $("#divSchoolResults").hide();
                                    $('#noEncontrada').show();
                                }

                                $('html, body').animate({
                                    scrollTop: 290
                                }, 1000);
                                return datosLimpios;
                            },
                        },
                        "columns": [
                            {"name": "CURP", "data": "nombre",
                                "render": function (data, type, full, meta) {
                                	if(full.segundoAp === undefined)
                                		full.segundoAp = "";
                                    return full.nombre + " " + full.primerAp + " " + full.segundoAp;
                                }
                            },
                            {"name": "NOMBREENTIDAD", "data": "nombreEntidad"},
                            {"name": "NOMBREMUNICIPIO", "data": "nombreMunicipio"},
                            {"name": "NOMBRELOCALIDAD", "data": "nombreLocalidad"},
                            {"name": "NOMBRECT", "data": "nombreCt"}

                        ]
                    });
                    $('#tblSchoolResults tbody').unbind('click');
                    $('#tblSchoolResults tbody').on('click', 'tr', function () {
                        var docente = table.row(this).data();
                        $scope.showDetails(docente.curp, docente.cct);

                    });
                    $('#tblSchoolResults tbody').unbind('over');
                    $("#tblSchoolResults tbody tr").on('over', function (event) {
                        $("#tblSchoolResults tbody tr").removeClass('row_selected');
                        $(this).addClass('row_selected');
                    });
                }

            }

        }


         $scope.generaExcel = function () {

            $('#divSchoolResults').css({'min-height':'600px'});

            var val = $scope.myVar;

            //console.log("valor: " + val);
           if ($scope.busca !== undefined && $scope.busca !== null)
                $scope.busca = limpiar($scope.busca);
            if ($scope.buscaAP !== undefined && $scope.buscaAP !== null)
                $scope.buscaAP = limpiar($scope.buscaAP);
            if ($scope.buscaAM !== undefined && $scope.buscaAM !== null)
                $scope.buscaAM = limpiar($scope.buscaAM);

            var curps = $scope.buscaCurp;
            if (curps !== undefined && $scope.buscaCurp !== null)
                curps = curps.toUpperCase();


            var m = curps;
            //var expreg = /^[A-Z]{1,2}\s\d{4}\s([B-D]|[F-H]|[J-N]|[P-T]|[V-Z]){3}$/;
            var expreg = /^([A-Z]{4})([0-9]{6})([HM]{1})(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;



            if (val == 2) {
                if (expreg.test(curps)) {

                    parametros = "";

                        parametros = addParam(parametros,
                                'nombre', '');

                        parametros = addParam(parametros,
                                '&primerAp', '');

                        parametros = addParam(parametros,
                                '&segundoAp', '');

                    parametros = addParam(parametros,
                                '&curp', $scope.buscaCurp);

                    processing();

                } else {

                    //console.log("La CURP NO es correcta");

                    $("#modalCurpError").modal('show');

                }

            } else {

                if ($scope.busca === undefined || $scope.buscaAP === undefined) {

                    if ($scope.busca === undefined)
                        $('#nom').addClass('input-error');
                    else
                        $('#nom').removeClass('input-error');
                    if ($scope.buscaAP === undefined)
                        $('#ap_pate').addClass('input-error');
                    else
                        $('#ap_pate').removeClass('input-error');

                } else {
                    parametros = "";
                    $('#nom').removeClass('input-error')
                    $('#ap_pate').removeClass('input-error')
                    //console.log(limpiar($scope.busca+' '+$scope.buscaAP+' '+$scope.buscaAM));
                    //if ($scope.busca != null) {
                        parametros = addParam(parametros,
                                'nombre', $scope.busca);
                    //}

                    //if ($scope.buscaAP != null) {
                        parametros = addParam(parametros,
                                '&primerAp', $scope.buscaAP);
                    //}
                        
                    if ($scope.buscaAM != null) {
                        parametros = addParam(parametros,
                                '&segundoAp', $scope.buscaAM);
                    }else{
                        parametros = addParam(parametros,
                                '&segundoAp', '');
                    }

                    parametros = addParam(parametros,
                                '&curp', '');

                }
            }


                    processing();
                    $http(
                    {
                        method: 'get',
                        url: $scope.getURLSchoolExcel()
                                + parametros,
                        data : ""

                    }).success(function (data) {
                     $('.tiempo_fuera').show();
                     noprocessing();
                        if(data.Docentes != null && data.Docentes.length > 0){
                            var htmlTable = '<table ><thead><tbody>'

                                +'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:310px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nombre</th>'
                                +'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:180px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Apellido Paterno</th>'
                                +'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:180px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Apellido Materno</th>'
                                +'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:180px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nombre de la entidad</th>'
                                +'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:310px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nombre del municipio o delegación</th>'
                                +'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;;width:410px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nombre de localidad</th>'
                                +'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:310px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Clave del centro de trabajo</th>'
                                +'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:510px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nombre del centro de trabajo</th>'
                                
                            data.Docentes.forEach(function(docente){

                                htmlTable += '<tr>';
                                htmlTable += '<td>'+docente.datos[0].nombre+'</td>';
                                htmlTable += '<td>'+docente.datos[0].primerAp+'</td>';
                                htmlTable += '<td>'+docente.datos[0].segundoAp+'</td>';
                                htmlTable += '<td>'+docente.datos[0].nombreEntidad+'</td>';
                                htmlTable += '<td>'+docente.datos[0].nombreMunicipio+'</td>';
                                htmlTable += '<td>'+docente.datos[0].nombreLocalidad+'</td>';
                                htmlTable += '<td>'+docente.datos[0].cct+'</td>';
                                htmlTable += '<td>'+docente.datos[0].nombreCt+'</td>';
                                htmlTable += '</tr>';

                            })

                            htmlTable +='<tr></tr><tr></tr><tr><td colspan="4" style="border: 1px solid black;font-family: serif;font-size: 14px"> Con fundamento en lo dispuesto en los artículos 12 fracción X y 13 fracción VII de la Ley General de Educación, la presente información se encuentra contenida en el <b>Sistema de Información y Gestión Educativa (SIGED)</b></td></tr><tr></tr><tr><td colspan="4" style="text-align:center;;font-family: serif;font-size: 14px"><b>Dirección General del Sistema de Información y Gestión Educativa</b></td></tr><tr></tr><tr><td style="vertical-align: top;border: 1px solid black;font-family: serif;font-size: 14px"><b>Fuentes:</b></td><td colspan="3" style="border: 1px solid black;font-family: serif;font-size: 14px"> <b>Información de centros de trabajo educativos:</b> Catálogo Nacional de Centros de Trabajo, Dirección General de Planeación, Programación y Estadística Educativa / SPEC / SEP</td></tr><tr><td></td><td colspan="3" style="border: 1px solid black;font-family: serif;font-size: 14px"> <b>Información estadística educativa:</b> Cuestionarios del formato 911 (inicio de ciclo escolar 201X - 201X), Dirección General de Planeación, Programación y Estadística Educativa / SPEC / SEP</td></td></tr>';                               


                            htmlTable += '</tbody></thead></table>';

                    

                            console.log(htmlTable)
                            var htmlTable = htmlTable.replace(/undefined/g, "");
                                     
                     
                     var ua = window.navigator.userAgent;
                    var msie = ua.indexOf("MSIE ");
                     
                     if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
                      {
                         var txtArea1 = document.getElementById('txtArea1');
                            txtArea1.contentWindow.document.open("txt/html","replace");
                            txtArea1.contentWindow.document.write(htmlTable);
                            txtArea1.contentWindow.document.close();
                            txtArea1.contentWindow.focus(); 
                        var sa=txtArea1.contentWindow.document.execCommand("SaveAs",true,"concentrado_docentes.xls");
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
                          
                        a.download = 'concentrado_docentes.xls';
                        a.click();
                            
                      }
                        }
                 
                });


        }

            $scope.newSearch = function () {

            //$("#btnResetForm").removeClass("active");
            //$("#btnResetForm").addClass("disabled");
            $("#divSchoolResults").hide();
            $("#noEncontrada").hide();
            $scope.datosLimpios = null;
            $scope.busca = null;
            $scope.buscaAP = null;
            $scope.buscaAM = null;
            $scope.buscaCurp = null;


        }

        var processing = function () {
            $('#blockcontent').modal('show');

        }

        var noprocessing = function () {

            $('#blockcontent').modal('hide');
        }



        $scope.showDetails = function (curp, cct) {
            processingdocente();
            $scope.getConsultaByFuente();
            //$('#modal_docente').modal('show');
            //console.log("curp");
            //console.log(curp);
            //console.log("cct");
            //console.log(cct);
            $http(
                    {
                        method: 'get',
                        url: $scope.getDocenteCURP()
                                + curp + '&cct=' + cct,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        }
                    })
                    .success(function (data) {


                        $scope.docente = data.docente[0];
                        $scope.plazas = data.plazas;
                        $scope.fuentePlazas = data.plazas[0];
                        $scope.fuentePlazaCCT = data.fuentes[0];
                        //$scope.fuentePlazas = data.fuentePlazas;
                        console.log($scope.fuentePlazaCCT);
                        //-----------------------

                        var table = $('#idDtPlazas').DataTable({
                           // responsive: true,
                            "dom": 'tpr',
                            "destroy": true,
                            "procesing": true,
                            "serverSide": false,
                            "data": $scope.plazas,
                            "pageLength": $scope.getRecordsByPage(),
                            "language": {
                                "url": "js/datatable.spanish.lang"
                            },
                            "columns": [
                                {"data": "escuela"},
                                {"data": "categoria"},
                                {"data": "clavePlaza"},
                                //{"data": "estatus"},
                                {"data": "entidad"},
                                {"data": "municipio"}
                            ],
                            "columnDefs": [{
                                    targets: [0],
                                    orderData: [0, 1]
                                }, {
                                    targets: [1],
                                    orderData: [0, 1]
                                }, {
                                    targets: [2],
                                    orderData: [0, 1]
                                }, {
                                    targets: [3],
                                    orderData: [0, 1]
                                }, {
                                    targets: [4],
                                    orderData: [0, 1]
                                }/*, {
                                 targets: [5],
                                 orderData: [0, 1]
                                 }*/]
                        });

                        $("#cargando_docente").hide();
                        $("#cont_docente").show();

                        //--------------------------------------
                        noprocessing();
                    }).error(function (error) {
            });
        }
        var processingdocente = function () {

            $("#cont_docente").hide();

            $('#modal_docente').modal('show');
            $("#dialog_docente").css('margin-top', '50px');
            $("#cargando_docente").show();
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

    }]
        );
