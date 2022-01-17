/*
    1.0.10      30/07/2021          Ernesto         Agregar fecha de actualización de la información estadistica
*/

function numberFormat(_number, _sep) {
	_number = typeof _number != 'undefined' && _number > 0 ? _number : '';
	_number = _number
		.replace(new RegExp('^(\\d{' + (_number.length % 3 ? _number.length % 3 : 0) + '})(\\d{3})', 'g'), '$1 $2')
		.replace(/(\d{3})+?/gi, '$1 ')
		.trim();
	if (typeof _sep != 'undefined' && _sep != ' ') {
		_number = _number.replace(/\s/g, _sep);
	}
	return _number;
}

$(function() {
	$('.btn-zona').click(function() {
		$('.alert-zona').removeClass('alert-info');
		$(this).parent('.alert-zona').addClass('alert-info');
		if ($(this).attr('id') == 'entidad') {
			$('#sub_entidad').show('slow');
		} else $('#sub_entidad').hide();
	});
});

var app = angular.module('estadisticas', [ 'ngResource' ]);

app.controller('buscarEstadisticas', [
	'$scope',
	'$http',
	'$rootScope',
	function($scope, $http, $rootScope) {
		// var global_uri = 'http://172.31.62.7:8080/CoreServices/apiRest';
		$scope.tipo = null;
		$scope.tipoGrafica = null;
		$scope.estado = null;

		$scope.newSearch = function() {
			$('#mensaje_estadisticas').hide();
			$('#cont_graficas').hide();
			$('#error_estado').hide();
			$('#error_tipo').hide();
		};

		$scope.getURLCatalogs = function() {
			return global_uri + '/catalogos';
		};
		$scope.getURLEstadisticasEscuelas = function(idTipo, estado) {
			return global_uri + '/Estadisticas/grafica1/idTipo=' + idTipo + '&idEstado=' + estado;
			//return 'https://siged.sep.gob.mx/services/EstadisticasEscuelasService/GraficaEscuela_RS/graficas/escuela?';
			//http://172.31.62.7:8080/CoreServices/apiRest/Estadisticas/grafica1/idTipo=1&idEstado=0
		};
		$scope.getStates = function() {
			//arregla el bug de reeleccionar pais y luego entidad
			//console.log($scope.user.state.id);
			if ($scope.user !== undefined) $scope.estado = $scope.user.state.id;
			else $scope.estado = null;

			$http.get($scope.getURLCatalogs() + '/estado').success(function(data) {
				console.log(data);
				$scope.states = data.estadoDTO;
			});
		};
		$scope.getZona = function(tipo_zona) {
			if (tipo_zona === undefined) {
				$scope.estado = '';
			} else $scope.estado = tipo_zona;
		};
		$scope.procesarDatos = function(idTipo, estado) {
			console.log('inicia:' + idTipo + ',' + estado);
			$http({
				method: 'GET',
				//url: $scope.getURLEstadisticasEscuelas() + 'indice=' + indice + '&par1=' + estado,
				//url: $scope.getURLEstadisticasEscuelas() + 'idTipo=' + idTipo + '&idEstado=' + estado,
				url: global_uri + '/Estadisticas/grafica1/idTipo=' + idTipo + '&idEstado=' + estado,
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			})
				.success(function(data) {
					//$("#cont_graficas").show();

					var tituloEstado = '';
					var tituloTipo = '';

					$scope.tipo = idTipo;
					$scope.datos = data.EstadisticaDTO;

					console.log('DATOS');
					console.log($scope.datos);
					console.log('idEstado');
					console.log($scope.estado);

					/*$scope.privados;
                        $scope.publicos;

                        data.EstadisticaDTO.forEach(function(EstadisticaDTO){
                            EstadisticaDTO.sostenimientoDTO.forEach(function(sostenimientoDTO){
                              
                            if(sostenimientoDTO.totalSos == 0){
                                $scope.privados = sostenimientoDTO.totalSos[0];
                            }
                            else{
                                $scope.publicos = sostenimientoDTO.totalSos[1];     
                            }
                        console.log('SOSTENMIENTO')
                            console.log(sostenimientoDTO)
                        });

                        });*/

					/*Datos para Tipo Educativo*/
					var datosEducativo = [];
					var tipoEducativo = [];

					data.EstadisticaDTO.forEach(function(estadistica) {
						if (idTipo == 1) datosEducativo.push(estadistica.total);
						tipoEducativo.push(estadistica.tipoEducativo);
					});

					/*Datos para Sostenimiendo Educativo*/
					var datosSostenimientoTotal = [];
					var tipoSostenimiento = [];

					data.EstadisticaDTO.forEach(function(estadistica) {
						if (idTipo == 2) datosSostenimientoTotal.push(estadistica.total);
						tipoSostenimiento.push(estadistica.sostenimiento);
					});

					/*Datos para Tipo y Sostenimiendo Educativo*/
					var datosSostenimientoTipo = [];
					var tipoPrivado = [];
					var tipoPublico = [];

					data.EstadisticaDTO.forEach(function(estadistica, totalSos) {
						if (
							idTipo == 3 &&
							estadistica.sostenimientoDTO[1] !== undefined &&
							estadistica.sostenimientoDTO[0] !== undefined
						) {
							tipoPrivado.push(estadistica.sostenimientoDTO[0].totalSos);
							tipoPublico.push(estadistica.sostenimientoDTO[1].totalSos);
							datosSostenimientoTipo.push(estadistica.nombre);
						}
					});

					console.log(tipoPrivado);
					console.log(tipoPublico);
					console.log(datosSostenimientoTipo);

					//conseguir el nombre del estado a consultar

					if (estado == 0) {
						tituloEstado = 'a nivel <b style="color:#4D92DF" >NACIONAL</b>';
						tituloEstGraf = 'a nivel nacional';
					} else {
						tituloEstado = 'en <b style="color:#4D92DF">' + $scope.user.state.nombre + '</b>';
						tituloEstGraf = 'en ' + $scope.user.state.nombre;
					}
					//conseguir el tipo de gráfica
					switch ($scope.tipo) {
						case 1:
							tituloTipo = ' por tipo educativo';
							$('#tabla_tipoEducativo').show();
							$('#tabla_tipoEducativo1').show();
							$('#tabla_sostenimientoEducativo').hide();
							$('#tabla_sostenimientoEducativo1').hide();
							$('#tabla_sostenimientoTipo').hide();
							$('#tabla_sostenimientoTipo1').hide();
							break;
						case 2:
							tituloTipo = ' por sostenimiento educativo';
							$('#tabla_tipoEducativo').hide();
							$('#tabla_tipoEducativo1').hide();
							$('#tabla_sostenimientoEducativo').show();
							$('#tabla_sostenimientoEducativo1').show();
							$('#tabla_sostenimientoTipo').hide();
							$('#tabla_sostenimientoTipo1').hide();
							break;
						case 3:
							tituloTipo = ' por tipo y sostenimiento educativo';
							$('#tabla_tipoEducativo').hide();
							$('#tabla_tipoEducativo1').hide();
							$('#tabla_sostenimientoEducativo').hide();
							$('#tabla_sostenimientoEducativo1').hide();
							$('#tabla_sostenimientoTipo').show();
							$('#tabla_sostenimientoTipo1').show();
							break;
					}
					tituloEstadisticas = 'Escuelas ' + tituloEstGraf + tituloTipo;

					$('#mensaje_estadisticas').html(
						'Total de escuelas ' +
							tituloEstado +
							tituloTipo +
							'</small><br/> <h6>Fecha de actualización : ' +
							data.fechaActualizacionDTO[0].fechaCarga +
							'<h6>'
					);

					inicializa_grafica('cont_graficas');

					if (idTipo == 1) {
						$('#tabla_tipoEducativo').show();
						$('#tabla_tipoEducativo1').show();
						$('#tabla_sostenimientoEducativo').hide();
						$('#tabla_sostenimientoEducativo1').hide();
						$('#tabla_sostenimientoTipo').hide();
						$('#tabla_sostenimientoTipo1').hide();
						grafica(datosEducativo, tipoEducativo, tituloEstadisticas);
						encabezado = [ 'Tipo educativo', 'Número de escuelas' ];
					}

					if (idTipo == 2) {
						$('#tabla_tipoEducativo').hide();
						$('#tabla_tipoEducativo1').hide();
						$('#tabla_sostenimientoEducativo').show();
						$('#tabla_sostenimientoEducativo1').show();
						$('#tabla_sostenimientoTipo').hide();
						$('#tabla_sostenimientoTipo1').hide();
						graficaPastel(datosSostenimientoTotal, tipoSostenimiento, tituloEstadisticas);
						encabezado = [ 'Sostenimiento educativo', 'Número de escuelas' ];
					}

					if (idTipo == 3) {
						$('#tabla_tipoEducativo').hide();
						$('#tabla_tipoEducativo1').hide();
						$('#tabla_sostenimientoEducativo').hide();
						$('#tabla_sostenimientoEducativo1').hide();
						$('#tabla_sostenimientoTipo').show();
						$('#tabla_sostenimientoTipo1').show();
						graficaDoble(tipoPrivado, tipoPublico, datosSostenimientoTipo, tituloEstadisticas);
						encabezado = [ 'Tipo educativo', 'Escuelas privadas', 'Escuelas públicas' ];
					}

					genera_header_tabla(encabezado, $('#tabla_nueva'));
					//genera_body_tabla(datos, datos2, leyend, $('#tabla_nueva'));
				})
				.error(function(error) {
					muestra_error(2);
				});
		};

		$scope.search = function() {
			//console.log("valida:"+$scope.tipo+','+$scope.estado);
			$('.error').hide();
			/*if ($('.navbar-toggle').css('display') == 'none') {
                        $('html, body').animate({
                            scrollTop: $('#titulo').position().top - 50
                        }, 500);
                    }*/

			if ($scope.tipo === null || $scope.estado === null || $scope.estado === '' || $scope.tipo === '') {
				muestra_error(1);
				if ($scope.tipo === null || $scope.tipo === '') {
					$('#error_tipo').show();
				}
				if ($scope.estado === null || $scope.estado === '') {
					$('#error_estado').show();
				}
			} else {
				cargando();
				//TODOS LOS DATOS ESTA BIEN Y YA PUEDE DIBUJAR GRÁFICA
				if (parseInt($scope.estado) != 0) $scope.tipoGrafica = parseInt($scope.tipo);
				else $scope.tipoGrafica = parseInt($scope.tipo);

				$scope.procesarDatos($scope.tipoGrafica, $scope.estado);
				//console.log($scope.tipo+','+$scope.estado)
			}
		};
	}
]);

var cargando = function() {
	$('#cont_graficas').html('');
	$('#tabla_nueva thead,#tabla_nueva tbody').html('');
	$('#mensaje_estadisticas').html(
		'<h6><i class="fa fa-spin fa-spinner"></i> Cargando información, por favor espera un momento...</h6>'
	);
};
var muestra_error = function(tipo) {
	if (tipo == 1)
		$('#mensaje_estadisticas').html(
			'<h5 style="color:red"><i class="fa fa-times"></i> Para poder consultar la estadística, selecciona las opciones requeridas</h5>'
		);
	if (tipo == 2)
		$('#mensaje_estadisticas').html(
			'<h5 style="color:red"><i class="fa fa-clock-o"></i> Tiempo de espera terminado, inténtalo nuevamente</h5>'
		);
};

var genera_header_tabla = function(titulo, selector) {
	//para esto datos tiene ser del mismo tamaño que leyenda
	var encabezado = '';

	titulo.forEach(function(item, index) {
		encabezado += '<th>' + titulo[index] + '</th>';
	});

	$(selector).children('thead').html('<tr>' + encabezado + '</tr>');
};
