
function numberFormat(_number, _sep) {
    _number = typeof _number != "undefined" && _number > 0 ? _number : "";
    _number = _number.replace(new RegExp("^(\\d{" + (_number.length%3? _number.length%3:0) + "})(\\d{3})", "g"), "$1 $2").replace(/(\d{3})+?/gi, "$1 ").trim();
    if(typeof _sep != "undefined" && _sep != " ") {
        _number = _number.replace(/\s/g, _sep);
    }
    return _number;
}


$(function () {
    $('.btn-zona').click(function () {
        $('.alert-zona').removeClass('alert-info');
        $(this).parent('.alert-zona').addClass('alert-info');
        if ($(this).attr('id') == 'entidad') {
            $('#sub_entidad').show('slow');
        } else
            $('#sub_entidad').hide();
    });
});



var app = angular.module('estadisticas', ['ngResource']);

app.controller(
        'buscarEstadisticas',
        [
            '$scope',
            '$http',
            '$rootScope',
            function ($scope, $http, $rootScope) {
                $scope.tipo = null;
                $scope.tipoGrafica = null;
                $scope.estado = null;

                $scope.getURLCatalogs = function () {
                    return 'https://siged.sep.gob.mx/services/CatalogosSiged/CatalogosRS/catalogos/';
                }
                $scope.getURLEstadisticasEscuelas = function () {
                    return 'https://siged.sep.gob.mx/services/EstadisticasEscuelasService/GraficaEscuela_RS/graficas/escuela?';
                }

                $scope.getStates = function () {
                    //arregla el bug de reeleccionar pais y luego entidad
                    //console.log($scope.user.state.id);
                    if ($scope.user !== undefined)
                        $scope.estado = $scope.user.state.id;
                    else
                        $scope.estado = null;
                    $http.get($scope.getURLCatalogs() + 'cat_entidad_federativa')
                            .success(function (data) {
                                console.log(data);
                                $scope.states = data.entFed;

                            });
                }
                $scope.getZona = function (tipo_zona) {

                    if (tipo_zona === undefined) {
                        $scope.estado = "";
                    } else
                        $scope.estado = tipo_zona;
                }
                $scope.procesarDatos = function (indice, estado) {
                    console.log("inicia:" + indice + ',' + estado);
                    $http({
                        method: 'GET',
                        url: $scope.getURLEstadisticasEscuelas() + 'indice=' + indice + '&par1=' + estado,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }

                    }).success(function (data) {

                        var tituloEstado = '';
                        var tituloTipo = '';

                        console.log("termina arrojar data");

                        $scope.resultado = data.resultado;


                        var leyend = new Array();
                        var datos = new Array();
                        var datos2 = new Array();
                        //sabiend que es para el caso 5 y 6 los datos OBLIGATORIAMENTE son pares, agregamos una validacion
                        //que detecte las gráficas impares y corriga el valor
                        var impar = 0;



                        //asigna los valores a null
                        angular.forEach($scope.resultado, function (value, key) {

                            if (indice == 5 || indice == 6) {
                                if (leyend.indexOf(value.resp2) == -1) {
                                    if (impar == 1) {
                                        if (datos2 > datos)
                                            datos.push(0);
                                        else
                                            datos2.push(0);
                                    }
                                    impar = 1;

                                    leyend.push(value.resp2); //datos

                                    if (estado == 0) {
                                        datos.push(value.resp5);
                                    } else {
                                        datos.push(value.resp7);
                                    }
                                } else {
                                    impar = 0;
                                    if (estado == 0) {
                                        datos2.push(value.resp5);
                                    } else {
                                        datos2.push(value.resp7);
                                    }
                                }


                            } else {
                                leyend.push(value.resp2);

                                if (estado == 0) {
                                    datos.push(value.resp3);
                                } else {
                                    datos.push(value.resp5);
                                }
                            }

                        });


                        console.log(datos)
                        console.log(leyend)
                        //conseguir el nombre del estado a consultar

                        if (estado == 0) {
                            tituloEstado = 'a nivel <b style="color:#4D92DF" >NACIONAL</b>';
                            tituloEstGraf = 'a nivel nacional'
                        } else {
                            tituloEstado = 'en <b style="color:#4D92DF">' + $scope.user.state.des + '</b>';
                            tituloEstGraf = 'en ' + $scope.user.state.des;
                        }
                        //conseguir el tipo de gráfica
                        switch ($scope.tipo) {
                            case 1:
                                tituloTipo = ' por tipo educativo';
                                break;
                            case 3:
                                tituloTipo = ' por sostenimiento educativo';
                                break;
                            case 5:
                                tituloTipo = ' por tipo y sostenimiento educativo';
                                break;

                        }
                        tituloEstadisticas = 'Escuelas ' + tituloEstGraf + tituloTipo;

                        $('#mensaje_estadisticas').html('Total de escuelas ' + tituloEstado + tituloTipo + '</small>');

                        inicializa_grafica("cont_graficas");

                        if (indice == 1 || indice == 2) {
                            leyend2 = agregar_leyenda(datos,leyend);
                            grafica(datos, leyend2, tituloEstadisticas);
                            encabezado = ['Tipo educativo', 'Número de escuelas'];
                        }

                        if (indice == 3 || indice == 4) {
                            leyend2 = agregar_leyenda(datos,leyend);
                            graficaPastel(datos, leyend2, tituloEstadisticas);
                            encabezado = ['Sostenimiento educativo', 'Número de escuelas'];
                        }

                        if (indice == 5 || indice == 6) {
                            graficaDoble(datos, datos2, leyend, tituloEstadisticas);
                            encabezado = ['Tipo educativo', 'Escuelas privadas', 'Escuelas públicas'];
                        }


                        genera_header_tabla(encabezado, $('#tabla_nueva'));
                        genera_body_tabla(datos, datos2, leyend, $('#tabla_nueva'));

                    }).error(function (error) {
                        muestra_error(2)
                    });
                }
                $scope.search = function () {
                    //console.log("valida:"+$scope.tipo+','+$scope.estado);
                    $('.error').hide();
                    /*if ($('.navbar-toggle').css('display') == 'none') {
                        $('html, body').animate({
                            scrollTop: $('#titulo').position().top - 50
                        }, 500);
                    }*/

                    if ($scope.tipo === null || $scope.estado === null || $scope.estado === "" || $scope.tipo === "") {
                        muestra_error(1);
                        if ($scope.tipo === null || $scope.tipo === "") {
                            $('#error_tipo').show();
                        }
                        if ($scope.estado === null || $scope.estado === "") {
                            $('#error_estado').show();

                        }

                    } else {
                        cargando();
                        //TODOS LOS DATOS ESTA BIEN Y YA PUEDE DIBUJAR GRÁFICA
                        if (parseInt($scope.estado) != 0)
                            $scope.tipoGrafica = parseInt($scope.tipo) + 1;
                        else
                            $scope.tipoGrafica = parseInt($scope.tipo);

                        $scope.procesarDatos($scope.tipoGrafica, $scope.estado);
                        //console.log($scope.tipo+','+$scope.estado)
                    }

                }
            }
        ]
        );


var cargando = function () {
    $("#cont_graficas").html('');
    $("#tabla_nueva thead,#tabla_nueva tbody").html('');
    $("#mensaje_estadisticas").html('<h6><i class="fa fa-spin fa-spinner"></i> Cargando información, por favor espera un momento...</h6>');
}
var muestra_error = function (tipo) {
    if (tipo == 1)
        $("#mensaje_estadisticas").html('<h5 style="color:red"><i class="fa fa-times"></i> Para poder consultar la estadística, selecciona las opciones requeridas</h5>');
    if (tipo == 2)
        $("#mensaje_estadisticas").html('<h5 style="color:red"><i class="fa fa-clock-o"></i> Tiempo de espera terminado, inténtalo nuevamente</h5>');

}

var genera_header_tabla = function (titulo, selector) {
    //para esto datos tiene ser del mismo tamaño que leyenda
    var encabezado = ''

    titulo.forEach(function (item, index) {
        encabezado += '<th>' + titulo[index] + '</th>';
    });

    $(selector).children('thead').html('<tr>' + encabezado + '</tr>');
}

var genera_body_tabla = function (datos1, datos2, leyenda, selector) {
    //para esto datos tiene ser del mismo tamaño que leyenda
    var cuerpo = '';
    datos1.forEach(function (item, index) {

        cuerpo += '<tr><td>' + leyenda[index] + '</td>';
        if (datos1[index] !== undefined)
            cuerpo += '<td class="numero">' + numberFormat(datos1[index],',')+ '</td>';
        if (datos2[index] !== undefined)
            cuerpo += '<td class="numero">' + numberFormat(datos2[index],',') + '</td>';

        cuerpo += '</tr>';
    });


    $(selector).children('tbody').html(cuerpo);
}

var agregar_leyenda = function(datos,leyend){
    var leyend_new = [];

    leyend.forEach(function (item, index) {
        item = item + ' (' + datos[index]+')';
        leyend_new.push(item);
    });

    return leyend_new;
}
