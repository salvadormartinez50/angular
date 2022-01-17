/*****************************************************************************
        OBJETO: Gestionar el comportamiento de la vista de Centros de trabajo
        FECHA: 16/07/2021
        LIDER TECNICO: OMAR FLORES MAURICIO
        SCRUM MASTER: ERNESTO MARTINEZ ESPINOSA
        DESARROLLO: ERNESTO MARTINEZ ESPINOSA
        COMENTARIO: INDICE DEL PORTAL SIGED
        Versión:    Fecha Modificación  Desarrollador   Motivo
        1.0.9       16/06/2021          Ernesto         Eliminar opciones en Nivel Educativo cuando seleccionas el Tipo CT = Plantel (MS)
  ******************************************************************************/

/*boton que abra pestaña*/
$(function() {
	$('.panel-map').on('shown.bs.collapse', function(e) {
		//google.maps.event.trigger(map, "resize");
	});

	$('#txtCCT').keyup(function() {
		if (!$(this).val().replace(/\s/g, '').length) {
			$(this).val($(this).val().replace(/\s/g, ''));
		}
	});
});

$gmx(document).ready(function() {
	var queryString = window.location.search.split('cct=');
	if (queryString != null && queryString.length > 1) {
		$('#txtCCT').val(queryString[1]);
		$('#btnFindSchool').click();
	}
});

var marker;
let markerLatLng;

$(function() {
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
	'$window',
	'$rootScope',
	function($scope, $http, $window, $rootScope) {
		$http.defaults.headers.get = { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' };

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

		$scope.getURLCalendario = function() {
			return global_uri + '/consulta/calendario/cct=';
		};

		$scope.getCalendario = function(cct) {
			$scope.calendario = null;
			$('#calendario185').hide();
			$('#calendario195').hide();
			$('#calendario190').hide();
			$http({
				method: 'get',
				url: $scope.getURLCalendario() + cct,
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			})
				.success(function(dataCalendarios) {
					$scope.calendario = dataCalendarios.Calendario;
					/*console.log('Información calendarios');
                    console.log($scope.calendario);*/

					dataCalendarios.Calendario.forEach(function(tipoCalendario) {
						var arrayCalendar = [];
						tipoCalendario.calendarioDTO.forEach(function(calendarios) {
							var fecha = new Date(calendarios.fechaFin);
							fecha.setDate(fecha.getDate() + 2);

							calendarios.fechaFin = [
								fecha.getFullYear(),
								'0' + (fecha.getMonth() + 1),
								fecha.getDate()
							].join('-');

							arrayCalendar.push({
								title: calendarios.descripcion,
								start: calendarios.fechaInicio,
								end: calendarios.fechaFin,
								backgroundColor: calendarios.hexadecimal
							});
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
							events: arrayCalendar
						});

						if (tipoCalendario.calendario == 185) {
							$('#calendario185').show();
						} else if (tipoCalendario.calendario == 195) {
							$('#calendario195').show();
						} else {
							$('#calendario190').show();
						}
					});

					noprocessing();
				})
				.error(function(error) {
					console.log('no stats');
				});
		};

		$scope.getURLCatalogs = function() {
			return global_uri + '/catalogos/';
		};

		$scope.getURLSchools = function() {
			return global_uri + '/escuela/consultarCTBis/';
		};

		$scope.getURLSchool = function() {
			return global_uri + '/escuela/detalleCTBis/cct=';
		};

		$scope.getURLTeachers = function() {
			return global_uri + '/plaza/plazaCct/cct=';
		};

		$scope.getURLSchoolExcel = function() {
			return global_uri + '/escuela/selectCcts/';
		};

		$scope.getURLStats = function() {
			return 'https://siged.sep.gob.mx/Core/ct/ctEstad/cct=';
		};

		$scope.getRecordsByPage = function() {
			return 10;
		};

		$scope.getImagen = function(cct) {
			//console.log("pasa ct: " + cct);
			$http
				.get(
					'https://siged.sep.gob.mx/services/ServicioImagenesEscuela/ImagenesEscuelaRS/escuela/imagenes/' +
						cct +
						'/Entrada'
				)
				.success(function(data) {
					$scope.ctImagen = data.ctImagen;
					console.log($scope.ctImagen);
					//console.log("regresa imagen");
					//enlace.edu.mx
					modalImagen();
				});
		};

		$('#results').hide();
		$scope.getStates = function() {
			$http.get($scope.getURLCatalogs() + 'estado').success(function(data) {
				$scope.states = data.estadoDTO;
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

		$scope.getLevels = function() {
			$http.get($scope.getURLCatalogs() + 'nivel/').success(function(data) {
				$scope.levels = data.nivelescolarDTO;
			});
		};
		$scope.getEstatus = function() {
			$http.get($scope.getURLCatalogs() + 'estatus').success(function(data) {
				$scope.estatusTC = data.lstEstatus;
			});
		};
		$scope.getTiposTC = function() {
			$http.get($scope.getURLCatalogs() + 'tipoUnidad/').success(function(data) {
				$scope.tiposCT = data.tipoUnidades;
			});
		};

		$scope.getTipoEducativo = function() {
			$http.get($scope.getURLCatalogs() + 'tipoEducativo').success(function(data) {
				$scope.tipoEducativos = data.tipoEducativoDTO;
				console.log($scope.tipoEducativos);
				$scope.tipoEducativos.splice(6, 1);
				$scope.tipoEducativos.splice(4, 1);

				$scope.tipoEducativosXCT = $scope.tipoEducativos;
			});
		};
		$scope.getTipoEducativoXCT = function() {
			console.log($scope.user);
			if ($scope.user.tipo.id === 9 || $scope.user.tipo.id === 18) {
				if ($scope.user.tipo.id === 18) {
					console.log('Quitar opciones');
					$scope.tipoEducativos = [
						{ idNivelescolar: 0, id: 3, nombre: 'MEDIA SUPERIOR', clave: '3', estatus: 1 }
					];
				} else {
					$scope.tipoEducativos = $scope.tipoEducativosXCT;
				}
			} else {
				//Limpio combos referente a escuelas o planteles
				$scope.tipoEducativos = null;
				$scope.levels = null;
				$scope.sectors = null;
				$scope.subControls = null;
				$scope.serviciosEducativos = null;
				$scope.showMoreLevels = true;
			}
		};

		$scope.getSectors = function() {
			$http.get($scope.getURLCatalogs() + 'control').success(function(data) {
				$scope.sectors = data.controlDTO;
			});
		};

		$scope.getSubControl = function() {
			$http.get($scope.getURLCatalogs() + '/subControl/id=' + $scope.user.sector.id).success(function(data) {
				$scope.subControls = data.subControlDTO;
			});
		};

		$scope.getNivelEducativo = function() {
			$scope.serviciosEducativos = null;
			$scope.nivelesEducativos = null;
			//Limpiar selección del model/combo de modalidad

			$http
				.get($scope.getURLCatalogs() + 'nivelTipo/idTipoEducativo=' + $scope.user.tipoEducativo.id)
				.success(function(data) {
					$scope.levels = data.Niveltipo;
				});
		};

		$scope.getServicioEducativo = function() {
			$scope.serviciosEducativos = null;
			$http.get($scope.getURLCatalogs() + 'subNivel/idSubNivel=' + $scope.user.level.id).success(function(data) {
				$scope.serviciosEducativos = data.nivelescolarDTO;

				//console.log($scope.nivelesEducativos);
			});
		};

		$scope.search = function(pagina) {
			$('#divSchoolResults').css({ 'min-height': '600px' });

			parametros = '';

			if ($scope.user.schoolName != null) {
				$scope.user.schoolName = limpiar2($scope.user.schoolName);

				parametros = addParam(parametros, 'cct=', $scope.user.schoolName);
			} else {
				parametros = addParam(parametros, 'cct=', '');
			}

			if ($scope.user.state != null) {
				parametros = addParam(parametros, '&entidad=', $scope.user.state.id);
			} else {
				parametros = addParam(parametros, '&entidad=', '');
			}

			if ($scope.user.municipality != null) {
				parametros = addParam(parametros, '&municipio=', $scope.user.municipality.id);
			} else {
				parametros = addParam(parametros, '&municipio=', '');
			}

			if ($scope.user.olocation != null) {
				parametros = addParam(parametros, '&localidad=', $scope.user.olocation.id);
			} else {
				parametros = addParam(parametros, '&localidad=', '');
			}

			if ($scope.user.tipo != null) {
				parametros = addParam(parametros, '&tipo=', $scope.user.tipo.id);
			} else {
				parametros = addParam(parametros, '&tipo=', '');
			}

			if ($scope.user.estatus != null) {
				parametros = addParam(parametros, '&estatus=', $scope.user.estatus.id);
			} else {
				parametros = addParam(parametros, '&estatus=', '');
			}
			//Tipo educativo

			if ($scope.user.tipoEducativo != null) {
				parametros = addParam(parametros, '&tipoEdu=', $scope.user.tipoEducativo.id);
			} else {
				parametros = addParam(parametros, '&tipoEdu=', '');
			}
			//Nivel

			if ($scope.user.level != null) {
				parametros = addParam(parametros, '&nivel=', $scope.user.level.id);
			} else {
				parametros = addParam(parametros, '&nivel=', '');
			}

			//SubNivel
			if ($scope.user.servicioEducativo != null) {
				parametros = addParam(parametros, '&subNivel=', $scope.user.servicioEducativo.id);
			} else {
				parametros = addParam(parametros, '&subNivel=', '');
			}

			//Control
			if ($scope.user.sector != null) {
				parametros = addParam(parametros, '&control=', $scope.user.sector.id);
			} else {
				parametros = addParam(parametros, '&control=', '');
			}
			//SubControl
			if ($scope.user.subcontrol != null) {
				parametros = addParam(parametros, '&subControl=', $scope.user.subcontrol.id);
			} else {
				parametros = addParam(parametros, '&subControl=', '');
			}

			var totalRecords = 0;

			var table = $('#tblSchoolResults').DataTable({});
			var tableAll = $('#tblSchoolResultsAll').DataTable({});

			table.destroy();
			tableAll.destroy();

			var jsonColumnas = [
				{ name: 'NOMBREENT', data: 'clave' },
				{ name: 'NOMBRABREV', data: 'abrev' },
				{ name: 'NOMBREMUN', data: 'municipio' },
				{ name: 'NOMBRELOC', data: 'localidad' },
				{ name: 'NOMBRECT', data: 'nombre' },
				{ name: 'NOMBRENIV', data: 'nivel' },
				{ name: 'NOMBRECONT', data: 'control' }
			];

			table = $('#tblSchoolResults').DataTable({
				responsive: true,

				language: {
					lengthMenu: 'Mostrar _MENU_ registros por página.',
					zeroRecords: 'No se encontraron registros.',
					info: ' ',
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
				searching: true,
				bLengthChange: true,
				ajax: {
					url: $scope.getURLSchools() + parametros + '&primer=1' + '&ultimo=1000',
					beforeSend: function(request) {
						request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
					},
					data: function(data) {
						processing();
					},
					dataSrc: function(d) {
						//console.log('resolvió el rest de busqueda');
						noprocessing();

						//si no encuentra los datos
						if (d.recordsTotal < 1) {
							$('#divSchoolResults').show();
							$('#divNoEncontrada').hide();
						} else {
							$('#divSchoolResults').hide();
							$('#divNoEncontrada').show();
						}
						$('html, body').animate(
							{
								scrollTop: 290
							},
							1000
						);

						tableAll = $('#tblSchoolResultsAll').DataTable({
							retrieve: true,
							paging: false,

							data: d.datos,
							columns: jsonColumnas
						});

						return d.datos;
					}
				},
				columns: jsonColumnas
			});

			$('#tblSchoolResults tbody').unbind('click');

			$('#tblSchoolResults tbody').on('click', 'tr', function() {
				var school = table.row(this).data();
				//console.log(this);
				$scope.showDetails(school.clave, school.idTurno);

				//$scope.abrir_escuela(school.clave, school.idTurno);
				/*$("#divSchoolResults").hide();*/
			});

			$('#tblSchoolResults tbody tr').unbind('over');
			$('#tblSchoolResults tbody tr').on('over', function(event) {
				$('#tblSchoolResults tbody tr').removeClass('row_selected');
				$(this).addClass('row_selected');
			});
		};

		$scope.generaExcel = function() {
			$('#tblSchoolResultsAll').table2excel({
				filename: 'concentrado-cts',
				name: 'CTs-SIGED',
				fileext: '.xls',
				preserveColors: true
			});
		};

		$scope.newSearch = function() {
			$scope.schools = null;
			$scope.datos = null;
			$scope.calendario = null;
			$('#btnFindSchool').removeClass('disabled');
			$('#btnFindSchool').addClass('active');
			$('#btnResetForm').removeClass('active');
			$('#btnResetForm').addClass('disabled');
			$('#divSchoolResults').hide();
			$('#divNoEncontrada').hide();
			$scope.resetForm();
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
			//console.log($scope.getURLTeachers() + idDetailsToShow);
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
			//console.log( $scope.getURLSchool()+ idDetailsToShow+ '&idTurno='+ idSchedule);
			$http({
				method: 'get',
				url: $scope.getURLSchool() + idDetailsToShow + '&idTurno=' + '-1',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			})
				.success(function(data) {
					//console.log('detalles del ct')
					//console.log(data)
					$scope.showResults = true;
					$scope.school = data.datos;
					$scope.hideFinder();
					$('#results').show();

					//$scope.getImagen(idDetailsToShow);
					//console.log("coord mapa: " + $scope.school.latDms + " : " + $scope.school.lonDms);
					if ($scope.school.latDms == null || $scope.school.latDms < 1) {
						$('#accordionMap').hide();
					} else {
						$('#accordionMap').show();
						//  $('#accordionMap').show()
						console.log('coord mapa nuevo: ' + $scope.school.latDms + ' : ' + $scope.school.lonDms);
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

					if (data.docentes !== undefined && data.docentes.length > 0) {
						$('#DocentesEsc').show();

						$scope.docentes = data.docentes;
					} else {
						$('#DocentesEsc').hide();
						$scope.docentes = null;
					}

					$scope.searchButtons = false;

					noprocessing();
					$('#divTeachers').show();
					$('#cargando_escuela').hide();
					$('#cont_escuela').show();
					//mueve el tamaño del mapa nuevamente para no tener errores

					$('#panelLocation').collapse('hide');
					$('#accordionMap').collapse('hide');
					$('#panelLocationMap').collapse('hide');
					$('#accordionMap').collapse('hide');
					$('#panelCalendario').collapse('hide');
					$('#calendarioApi').collapse('hide');
					$('#accordionCalendario').collapse('hide');
					$('#panelCalendarioApi').collapse('hide');

					$('#panelCalendario2').collapse('hide');
					$('#calendarioApi2').collapse('hide');
					$('#accordionCalendario2').collapse('hide');
					$('#panelCalendarioApi2').collapse('hide');

					$('.collpase-button').addClass('collpase-button collapsed');

					console.log($scope.school);
					if ($scope.school.id_centrostrabajo !== -1) {
						$('#cont_ErrorConsulta').hide();
						$('#cont_escuela').show();
					} else {
						$('#cont_ErrorConsulta').show();
						$('#cont_escuela').hide();
					}
				})
				.error(function(error) {});

			//$scope.getCalendario(idDetailsToShow);
		};

		$scope.resetForm = function() {
			$scope.municipalities = null;
			$scope.locations = null;
			$scope.levels = null;
			$scope.subControls = null;
			$scope.serviciosEducativos = null;
			$scope.showMoreLevels = true;
			$scope.showSchedules = true;

			$scope.user = {
				schoolName: null,
				state: null,
				municipality: null,
				olocation: null,
				estatus: null,
				level: null,
				tipo: null,
				tipoEducativo: null,
				servicioEducativo: null,
				sector: null,
				subcontrol: null,
				idtype: null
			};
		};

		$scope.resetForm();
		$scope.getStates();
		$scope.getEstatus();
		$scope.getTiposTC();
		$scope.getTipoEducativo();

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

		var queryString = $window.location.search.split('cct=');
		if (queryString != null && queryString.length > 1) {
			$scope.user.schoolName = queryString[1];
		}
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

	console.log(markerLatLng);
	iframe.contentWindow.postMessage('crearMarker(' + lat + ', ' + lng + ')', '*');
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
	$('#divSchoolStats2').show();
	$('#divSchoolStats3').show();
	$('#mas2').hide();
	$('#menos2').show();
};

var verMenos = function() {
	$('#divSchoolStats2').hide();
	$('#divSchoolStats3').hide();
	$('#mas2').show();
	$('#menos2').hide();
};

var latitud = function(latitud) {
	var lat = latitud;
	var latn = Math.abs(lat); /* Devuelve el valor absoluto de un número, sea positivo o negativo */
	var latgr = Math.floor(latn * 1); /* Redondea un número hacia abajo a su entero más cercano */
	var latmin = Math.floor((latn - latgr) * 60); /* Vamos restando el número entero para transformarlo en minutos */
	var latseg = ((latn - latgr) * 60 - latmin) * 60; /* Restamos el entero  anterior ahora para segundos */
	var latc = latgr + ':' + latmin + ':' + latseg.toFixed(2); /* Prolongamos a centésimas de segundo */
	if (lat > 0) {
		x = latc + ' N'; /* Si el número original era positivo, es Norte */
	} else {
		x = latc + ' S'; /* Si el número original era negativo, es Sur */
	} /* Repetimos el proceso para la longitud (Este, -W-Oeste) */

	return x;
};

var longitud = function(longitud) {
	var lng = longitud;
	var lngn = Math.abs(lng);
	var lnggr = Math.floor(lngn * 1);
	var lngmin = Math.floor((lngn - lnggr) * 60);
	var lngseg = ((lngn - lnggr) * 60 - lngmin) * 60;
	var lngc = lnggr + ':' + lngmin + ':' + lngseg.toFixed(2);
	if (lng > 0) {
		y = lngc + ' E';
	} else {
		y = lngc + ' W';
	}

	return y;
};

let iframe;
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

	iframe = document.getElementById('mapIFrame');
});
