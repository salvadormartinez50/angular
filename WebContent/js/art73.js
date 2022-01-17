$(function() {
	$('#txtCCT').keyup(function() {
		if (!$(this).val().replace(/\s/g, '').length) {
			$(this).val($(this).val().replace(/\s/g, ''));
		}
	});

	$('.inline-form-filters select').change(function() {
		var bloqueo = 0;

		$('.inline-form-filters select').each(function() {
			if ($(this).val() != '') bloqueo = 1;
		});

		if (bloqueo) {
			$('#txtCCT').removeAttr('required', true);
		} else {
			$('#txtCCT').prop('required', true);
		}
	});
});

var app = angular.module('escuelas', [ 'ngResource' ]);

app.controller('searchSchoolCtrl', [
	'$scope',
	'$http',
	'$rootScope',
	function($scope, $http, $rootScope) {
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
		$scope.excel = null;

		$scope.getURLCatalogs = function() {
			return global_uri + '/catalogos/';
		};
		$scope.getURLCatalogsArt73 = function() {
			return global_uri + '/art73/';
		};

		$scope.getURLSchools = function() {
			return global_uri + '/escuela/buscaEscuela/';
		};

		$scope.getURLArt73 = function() {
			return global_uri + '/art73/consultarArt73';
		};

		$scope.getURLTeachers = function() {
			return global_uri + '/plaza/plazaCct/cct=';
		};

		$scope.getURLSchoolExcel = function() {
			return global_uri + '/art73/consultarArt73';
		};

		$scope.getURLStats = function() {
			return 'https://siged.sep.gob.mx/Core/ct/ctEstad/cct=';
		};

		$('#results').hide();
		$scope.getStates = function() {
			$http.get($scope.getURLCatalogs() + 'estado').success(function(data) {
				$scope.states = data.estadoDTO;
			});
		};

		$scope.getTrimestre = function() {
			$http.get($scope.getURLCatalogsArt73() + 'consultarTrimestre').success(function(data) {
				$scope.trimestres = data.datos;
			});
		};

		$scope.getTipoPlaza = function() {
			$http.get($scope.getURLCatalogsArt73() + 'consultarTiposPlaza').success(function(data) {
				$scope.tipoPlazas = [];
				var i = 0;
				data.datos.forEach(function(tipoPlaza) {
					i++;
					$scope.tipoPlazas.push({ idTipoPlaza: i, tipoPlaza: tipoPlaza });
				});
			});
		};

		$scope.getModelos = function() {
			$http.get($scope.getURLCatalogsArt73() + 'consultarModelos').success(function(data) {
				$scope.modelos = data.datos;
			});
		};
		$scope.getMunicipalities = function() {
			$scope.locations = null;
			$scope.municipalities = null;
			$http.get($scope.getURLCatalogs() + 'municipio/idEstado=' + $scope.user.state.id).success(function(data) {
				$scope.municipalities = data.municipioDTO;
			});
		};

		$scope.getLocations = function() {
			$scope.locations = null;
			if ($scope.user.state != null && $scope.user.municipality != null) {
				$http
					.get($scope.getURLCatalogs() + 'localidad/idMunicipio=' + $scope.user.municipality.id)
					.success(function(data) {
						$scope.locations = data.localidadDTO;
					});
			}
		};

		$scope.search = function(pagina) {
			$('#divSchoolResults').css({ 'min-height': '600px' });

			parametros = '';
			console.log($scope.user.schoolName);
			console.log($scope.user.state);
			console.log($scope.trimestre);
			console.log($scope.tipoPlaza);
			console.log($scope.modelo);

			if ($scope.user.schoolName != null) {
				$scope.user.schoolName = limpiar2($scope.user.schoolName);
				parametros = addParam(parametros, '?cct=', $scope.user.schoolName);
			} else {
				parametros = addParam(parametros, '?cct=', '');
			}

			if ($scope.user.state != null) {
				parametros = addParam(parametros, '&identidad=', $scope.user.state.id);
			} else {
				parametros = addParam(parametros, '&identidad=', '');
			}

			if ($scope.trimestre != null) {
				parametros = addParam(parametros, '&trimestre=', $scope.trimestre.idTrimestre);
			} else {
				parametros = addParam(parametros, '&trimestre=', '');
			}

			if ($scope.tipoPlaza != null) {
				parametros = addParam(parametros, '&tipoPlaza=', $scope.tipoPlaza.tipoPlaza);
			} else {
				parametros = addParam(parametros, '&tipoPlaza=', '');
			}

			if ($scope.modelo != null) {
				parametros = addParam(parametros, '&descModelo=', $scope.modelo.idDescripcionModelo);
			} else {
				parametros = addParam(parametros, '&descModelo=', '');
			}

			processing();
			$('#divSchoolResults').hide();
			$http.get($scope.getURLArt73() + parametros).success(function(data) {
				//console.log('información del vera')
				console.log(data.datos);
				noprocessing();
				if (data.datos && data.datos.length > 0) {
					$scope.excel = data.datos;
					$('#divNoEncontrada').hide();
					$('#divSchoolResults').show();
					$('#divSchoolResultsFecha').show();
					$('#tblSchoolResults').dataTable().fnDestroy();
					var table = $('#tblSchoolResults').DataTable({
						searching: true,
						data: data.datos,
						language: {
							lengthMenu: 'Mostrar _MENU_ registros por página.',
							zeroRecords: 'No se encontraron registros.',
							info: ' ',
							//"infoEmpty": "No hay registros aún.",
							//"infoFiltered": "(filtrados de un total de _MAX_ registros)",
							infoEmpty: ' ',
							infoFiltered: '(filtrado de un total de _MAX_ registros)',
							search: 'Búsqueda',
							LoadingRecords: 'Cargando ...',
							Processing: 'Procesando...',
							SearchPlaceholder: 'Comience a teclear...',
							iDisplayLength: 20,
							sPaginationType: 'full_numbers',
							sServerMethod: 'POST',
							aLengthMenu: [ [ 10, 15, 20, -1 ], [ 10, 15, 20, 'All' ] ],
							iDisplayLength: 20,
							paginate: {
								previous: 'Anterior',
								next: 'Siguiente'
							}
						},
						columns: [
							{ name: 'NOMBRECCT', data: 'claveCentroTrabajo' },
							{ name: 'NOMBREENT', data: 'entidadFederativa' },
							{ name: 'NOMBRETRI', data: 'trimestre' },
							{ name: 'NOMBREENT', data: 'nombreCentroTrabajo' },
							{ name: 'CLAVEPLAZA', data: 'clavePlaza' },
							{ name: 'TIPOPLAZA', data: 'tipoPlaza' },
							{ name: 'DESMODELO', data: 'descripcionModelo' },
							{ name: 'PERCTRIM', data: 'percepcionesTrimestrales' }
						]
					});
				} else {
					$('#divSchoolResults').hide();
					$('#divSchoolResultsFecha').hide();
					$('#divNoEncontrada').show();
				}
			});
		};

		$scope.generaExcel = function() {
			/*parametros = addParam(parametros,'primer', '');
            parametros = addParam(parametros,'ultimo', '');*/
			//console.log($scope.getURLSchoolExcel() + parametros);
			processing();
			setTimeout(function() {
				var htmlTable =
					'<table><thead><tbody>' +
					'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black; width:95px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Clave del centro de trabajo</th>' +
					'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:180px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nombre de la entidad</th>' +
					'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;  width:75px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Trimestre</th>' +
					'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:410px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Nombre del centro de trabajo</th>' +
					'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:240px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Clave plaza</th>' +
					'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:90px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Tipo plaza</th>' +
					'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:250px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Descripción modelo</th>' +
					'<th style="color: #ffffff;background-color:#C80202;border: 1px solid black;width:130px;height: 60px;text-align: center;font-weight: normal;font-size: 14px">Percepciones trimestrales</th>';

				$scope.excel.forEach(function(articulo) {
					htmlTable += '<tr>';
					htmlTable += '<td>' + articulo.claveCentroTrabajo + '</td>';
					htmlTable += '<td>' + articulo.entidadFederativa + '</td>';
					htmlTable += '<td>' + articulo.trimestre + '</td>';
					htmlTable += '<td>' + articulo.nombreCentroTrabajo + '</td>';
					htmlTable += '<td>' + articulo.clavePlaza + '</td>';
					htmlTable += '<td>' + articulo.tipoPlaza + '</td>';
					htmlTable += '<td>' + articulo.descripcionModelo + '</td>';
					htmlTable += '<td>' + articulo.percepcionesTrimestrales + '</td>';
					htmlTable += '</tr>';
				});

				/*
				htmlTable +=
					'<tr></tr><tr></tr><tr><td colspan="4" style="border: 1px solid black;font-family: serif;font-size: 14px"> Con fundamento en lo dispuesto en los artículos 12 fracción X y 13 fracción VII de la Ley General de Educación, la presente información se encuentra contenida en el <b>Sistema de Información y Gestión Educativa (SIGED)</b></td></tr><tr></tr><tr><td colspan="4" style="text-align:center;;font-family: serif;font-size: 14px"><b>Dirección General del Sistema de Información y Gestión Educativa</b></td></tr><tr></tr><tr><td style="vertical-align: top;border: 1px solid black;font-family: serif;font-size: 14px"><b>Fuentes:</b></td><td colspan="3" style="border: 1px solid black;font-family: serif;font-size: 14px"> <b>Información de centros de trabajo educativos:</b> Catálogo Nacional de Centros de Trabajo, Dirección General de Planeación, Programación y Estadística Educativa / SPEC / SEP</td></tr><tr><td></td><td colspan="3" style="border: 1px solid black;font-family: serif;font-size: 14px"> <b>Información estadística educativa:</b> Cuestionarios del formato 911 (inicio de ciclo escolar 201X - 201X), Dirección General de Planeación, Programación y Estadística Educativa / SPEC / SEP</td></td></tr>';
				*/
				htmlTable +=
					'<tr></tr><tr></tr><tr><td colspan="4" style="border: 1px solid black;font-family: serif;font-size: 14px"> Con fundamento en lo dispuesto en el artículo 113, fracción XIII de la Ley General de Educación, la presente información se encuentra contenida en el Sistema de Información y Gestión Educativa (SIGED)</td></tr><tr></tr><tr></tr><tr><td style="vertical-align: top;border: 1px solid black;font-family: serif;font-size: 14px"><b>Fuentes:</b></td><td colspan="3" style="border: 1px solid black;font-family: serif;font-size: 14px"> <b>Información de centros de trabajo educativos:</b> Catálogo Nacional de Centros de Trabajo, Dirección General de Planeación, Programación y Estadística Educativa / JOS / SEP</td></tr><tr><td></td><td colspan="3" style="border: 1px solid black;font-family: serif;font-size: 14px"> <b>Información del trimestre, plazas, modelos y percepciones:</b> Fondo de Aportaciones para la Nómina Educativa y Gasto Operativo (FONE), Dirección General del Sistema de Administración de la Nómina Educativa Federalizada / UAF / SEP</td></td></tr><tr></tr><tr><td colspan="4" style="text-align:center;;font-family: serif;font-size: 14px"><b>Sistema de Información y Gestión Educativa</b></td></tr>';


				htmlTable += '</tbody></thead></table>';

				var htmlTable = htmlTable.replace(/undefined/g, '');

				noprocessing();
				var ua = window.navigator.userAgent;
				var msie = ua.indexOf('MSIE ');

				if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
					// If Internet Explorer
					var txtArea1 = document.getElementById('txtArea1');
					txtArea1.contentWindow.document.open('txt/html', 'replace');
					txtArea1.contentWindow.document.write(htmlTable);
					txtArea1.contentWindow.document.close();
					txtArea1.contentWindow.focus();
					var sa = txtArea1.contentWindow.document.execCommand('SaveAs', true, 'concentrado_articulo73.xls');
				} else {
					var data_type = 'data:application/vnd.ms-excel;charset=utf-8';

					var a = document.createElement('a');
					document.body.appendChild(a); // You need to add this line

					var uint8 = new Uint8Array(htmlTable.length);
					for (var i = 0; i < uint8.length; i++) {
						uint8[i] = htmlTable.charCodeAt(i);
					}

					var xData = new Blob([ uint8 ], { type: 'text/csv' });
					var xUrl = URL.createObjectURL(xData);
					a.href = xUrl;

					a.download = 'concentrado_articulo73.xls';
					a.click();
				}
			}, 250);
		};

		$scope.newSearch = function() {
			$('#divSchoolResults').hide();
			$('#divNoEncontrada').hide();
			$scope.user.schoolName = null;
			$scope.user.state = null;
			$scope.trimestre = null;
			$scope.tipoPlaza = null;
			$scope.modelo = null;
		};

		$scope.hideFinder = function() {
			$scope.showFinder = false;
		};

		$scope.getFinderStatus = function() {
			return $scope.showFinder;
		};

		$scope.getStats = function(idDetailsToShow, idSchedule) {
			$http({
				method: 'get',
				url: $scope.getURLStats() + idDetailsToShow + '&idTurno=' + idSchedule,
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			})
				.success(function(dataStats) {
					if (dataStats.estadistica !== undefined) {
						$scope.stats = dataStats.estadistica[0];
						girls = Number($scope.stats.alumnosM);
						boys = Number($scope.stats.alumnosH);
						totalKids = girls + boys;
						girls = girls / totalKids * 100;
						boys = boys / totalKids * 100;
						men = Number($scope.stats.docenteH);
						women = Number($scope.stats.docenteM);
						totalTeachers = men + women;
						men = men / totalTeachers * 100;
						women = women / totalTeachers * 100;
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
						$scope.totalesAlum1 = alum1 / totalAlum * 100;
						$scope.totalesAlum2 = alum2 / totalAlum * 100;
						$scope.totalesAlum3 = alum3 / totalAlum * 100;
						$scope.totalesAlum4 = alum4 / totalAlum * 100;
						$scope.totalesAlum5 = alum5 / totalAlum * 100;
						$scope.totalesAlum5 = alum6 / totalAlum * 100;

						$('#divSchoolStats').show();
					} else {
						$('#divSchoolStats').hide();
						$scope.stats = null;
					}
				})
				.error(function(error) {
					console.log('no stats');
				});
		};

		$scope.getTeachers = function(idDetailsToShow) {
			console.log($scope.getURLTeachers() + idDetailsToShow);
			$http.get($scope.getURLTeachers() + idDetailsToShow).success(function(data) {
				var nuevo_docente = [],
					valor,
					copia;

				if (data.docente !== undefined) {
					$.each(data.docente, function(index, valor_old) {
						valor = {
							nombres: valor_old.nombres,
							primerAp: valor_old.primerAp,
							segundoAp: valor_old.segundoAp,
							categoria: valor_old.categoria,
							curp: valor_old.curp
						};

						copia = 0;
						$.each(nuevo_docente, function(index, subvalor) {
							if (copia == 0) {
								//console.log('if v:'+valor.curp+' = v:'+subvalor.curp+' y c:'+valor.categoria+' = c:'+subvalor.categoria);
								if (valor.curp == subvalor.curp && valor.categoria == subvalor.categoria) {
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

				$('#panelLocationMap').removeClass('in');
				$scope.teachers = nuevo_docente;
				$('#divTeachers').hide();
				$scope.showTeachers = false;
				if (typeof $scope.teachers !== 'undefined') {
					$('#divTeachers').show();
					$scope.showTeachers = true;
					$scope.teachers['fuente'] = data.fteDocente[0].fuente;
					$scope.teachers['cicloFuente'] = data.fteDocente[0].ciclo;
					var table = $('#tblTeachers').DataTable({
						responsive: true,
						dom: 'tpr',
						destroy: true,
						procesing: true,
						serverSide: false,
						data: $scope.teachers,
						pageLength: $scope.getRecordsByPage(),
						language: {
							url: 'js/datatable.spanish.lang'
						},
						columns: [
							{
								data: 'nombres',
								render: function(data, type, full, meta) {
									return full.nombres + ' ' + full.primerAp + ' ' + full.segundoAp;
								}
							},
							{ data: 'categoria' }
						]
					});
				}
			});
		};

		$scope.showDetails = function(idDetailsToShow, idSchedule) {
			processingschool();
			$scope.school = null;
			console.log($scope.getURLSchool() + idDetailsToShow + '&idTurno=' + idSchedule);
			$http({
				method: 'get',
				url: $scope.getURLSchool() + idDetailsToShow + '&idTurno=' + idSchedule,
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			})
				.success(function(data) {
					console.log('detalles del ct');
					console.log(data);
					$scope.showResults = true;
					$scope.school = data.datos;
					$scope.hideFinder();
					$('#results').show();

					//$scope.getImagen(idDetailsToShow);
					console.log('coord mapa: ' + $scope.school.latDms + ' : ' + $scope.school.lonDms);
					if ($scope.school.latDms == null || $scope.school.latDms < 1) {
						$('#accordionMap').hide();
					} else {
						$('#accordionMap').show();
						//  $('#accordionMap').show()
						//console.log("coord mapa nuevo: " + gradosadecimales($scope.school.latDms) + " : " + gradosadecimales($scope.school.lonDms));
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
							girls = girls / totalKids * 100;
							boys = boys / totalKids * 100;
							men = Number($scope.stats.docenteH);
							women = Number($scope.stats.docenteM);
							totalTeachers = men + women;
							men = men / totalTeachers * 100;
							women = women / totalTeachers * 100;
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
							$scope.totalesAlum1 = alum1 / totalAlum * 100;
							$scope.totalesAlum2 = alum2 / totalAlum * 100;
							$scope.totalesAlum3 = alum3 / totalAlum * 100;
							$scope.totalesAlum4 = alum4 / totalAlum * 100;
							$scope.totalesAlum5 = alum5 / totalAlum * 100;
							$scope.totalesAlum5 = alum6 / totalAlum * 100;

							$('#divSchoolStats').show();
						} catch (err) {
							console.error('error: ');
							console.error(err);
							$('#divSchoolStats').hide();
							$scope.stats = null;
						}
					} else {
						$('#divSchoolStats').hide();
						$scope.stats = null;
					}
					//$scop<e.getTeachers(idDetailsToShow);
					if (data.plazas !== undefined && data.plazas.length > 0) {
						$('#plazasDis').show();

						$scope.plazas = data.plazas;
					} else {
						$('#plazasDis').hide();
						$scope.plazas = null;
					}

					$scope.searchButtons = false;

					noprocessing();
					$('#divTeachers').show();
					$('#cargando_escuela').hide();
					$('#cont_escuela').show();
					//mueve el tamaño del mapa nuevamente para no tener errores

					$('#panelLocation').collapse('hide');
					$('#accordionMap').collapse('hide');
					$('.collpase-button').addClass('collpase-button collapsed');
				})
				.error(function(error) {});
		};

		$scope.getSchedules = function() {
			$http.get($scope.getURLCatalogs() + 'turno').success(function(data) {
				$scope.schedules = data.turnoDTO;
			});
		};

		$scope.getLevels = function() {
			$http.get($scope.getURLCatalogs() + 'nivel').success(function(data) {
				$scope.levels = data.nivelescolarDTO;
			});
		};

		$scope.getSectors = function() {
			$http.get($scope.getURLCatalogs() + 'control').success(function(data) {
				$scope.sectors = data.controlDTO;
			});
		};

		$scope.resetForm = function() {
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
			};

			$scope.getStates();
		};

		$scope.resetForm();
		$scope.getStates();
		$scope.getTrimestre();
		$scope.getModelos();
		$scope.getTipoPlaza();

		$scope.getSchedules();
		$scope.getLevels();
		$scope.getSectors();

		$scope.abrir_escuela = function(clave, idTurno) {
			console.info('entro');

			$http.get(global_uri + '/plaza/plazaCct/cct=' + clave + '&idTurno=' + idTurno).then(function(data) {
				console.log(data);
				$scope.plazas = data.data;

				var valid = $scope.plazas;

				console.info('valid');

				console.info(valid);

				if (valid === undefined || valid === null || valid.length == 0) {
					console.info('entra a la validacion');
					document.getElementById('plazasDis').style = style = 'display: none';
				} else {
					document.getElementById('plazasDis').style = style = 'display: inline';
				}
			});
		};
	}
]);

var setDisabled = function(idComponent, disabled) {
	$('#' + idComponent).prop('disabled', disabled);
};

var initialize = function(lat, lng) {
	if (lat == null || lng == null) {
		lat = 22.5579822;
		lng = -120.8041848;
	}

	markerLatLng = new google.maps.LatLng(lat, lng);

	map.setCenter(markerLatLng);
	if (marker !== undefined) marker.setMap(null);
	marker = new google.maps.Marker({
		position: markerLatLng,
		map: map,
		center: markerLatLng
	});
};
var limitCatalog = function(catalog) {
	catalogs = [];
	if (catalog.length > 4) {
		i = 1;
		$(catalog).each(function(key, info) {
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
};

var addParam = function(queryString, key, values) {
	return (queryString += '' + key + '' + values);
};

var processingschool = function() {
	$('#cont_escuela').hide();

	$('#modal_datos_escuela').modal('show');
	$('#dialog_escuela').css('margin-top', '50px');
	$('#cargando_escuela').show();
};
var processing = function() {
	$('#modal-loading').modal('show');
	$('.tiempo_fuera').hide();
	setTimeout(revisaModal, 30000);
};

var noprocessing = function() {
	$('#modal-loading').modal('hide');
	$('#blockcontent').modal('hide');
};

var revisaModal = function() {
	if (($('#modal-loading').data('bs.modal') || {}).isShown) {
		$('.tiempo_fuera').show();
	}
};

var modalImagen = function() {
	$('#modal-imagen').modal('show');
};

var verMas = function() {
	document.getElementById('divSchoolStats2').style = 'display: inline';
	document.getElementById('divSchoolStats3').style = 'display: inline';
	document.getElementById('texotMas').innerHTML = 'ver menos';
	console.log(document.getElementById('mas2').innerHTML);
	document.getElementById('mas2').className = 'fa fa-minus-circle';
	document.getElementById('texotMas').href = 'javascript:verMenos();';
};

var verMenos = function() {
	document.getElementById('divSchoolStats2').style = 'display: none';
	document.getElementById('divSchoolStats3').style = 'display: none';
	document.getElementById('texotMas').innerHTML = 'ver más';
	document.getElementById('mas2').className = 'fa fa-plus-circle';
	document.getElementById('texotMas').href = 'javascript:verMas();';
};

$gmx(document).ready(function() {
	$('#divSchoolResults').hide();
	$('#blockcontent').hide();

	$('#btnToggleOptionalFIlters').click(function() {
		if ($(this).attr('rel') == 0) {
			$('#menu_opcional').show('slow');
			$(this).attr('rel', '1');
		} else {
			$('#menu_opcional').hide('slow');
			$(this).attr('rel', '0');
		}
	});
});
