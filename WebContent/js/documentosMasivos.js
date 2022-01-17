
var app = window.angular.module('documentos', ['ngResource']);

app.controller('documentosController', ['$scope', '$http', '$window', '$rootScope',
    function ($scope, $http, $window, $rootScope) {
	
	
		$scope.resultados = 0;
		$scope.folios = []
		$scope.resultFolios = []
		
		$scope.getFolios = function(){
            return global_uri + '/certificado/consultaCertificado/';

		}
		$scope.newSearch = function(){
		   $scope.resultados = 0;
		}
		$scope.getConsultaByFOLIO = function(){
			processing()
			$scope.resultados = 0;
			
			if(outputExcel === undefined){
				alert('Formato de archivo no es correcto')
			}else{
				
				var mensajeFolios = ''
				var errorFolios = 0;
				var folios = JSON.parse(outputExcel);
				
				//obtiene los nombres de la hoja del archivo
				var nombreHoja = [];
				for (var key in folios) {
					nombreHoja.push(key);
				}
				try {
					var arregloFolio = []
					folios[nombreHoja[0]].forEach(function(columna,index){
						 	 if(index > 0){
						 		 columna.forEach(function(celda){
						 			 if(celda.length != 36){
						 				mensajeFolios += '"'+celda+'" no cuenta con el formato de folio <br>'
						 				errorFolios = 1; 
						 			 }
						 				
						 			 arregloFolio.push(celda)
						 		 });
						 	 }
					})

				if(arregloFolio.length == 0){
					errorFolios = 1
					mensajeFolios = 'El archivo no cuenta con ningún folio'
				}
				if(arregloFolio.length > 100){
					errorFolios = 1
					mensajeFolios = 'El archivo no debe contar con más de 100 folios'
				}
					
					
				if(!errorFolios){
					
					$scope.folios = arregloFolio;
					var parametros ="?folios="+arregloFolio.join("&folios=")
					
					 table = $('#tblSchoolResults').DataTable({
			                responsive: true,
			                "destroy": true,
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
			                    "url": $scope.getFolios() + parametros,
			                    "type": "GET",
			                    'beforeSend': function (request) {
			                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
			                    },
			                    "data": function(data){
			                    	$scope.resultados = 1;
			                    	
			                    	return data
			                    	 
			                    },
			                    "dataSrc": function (d) {
			                                    //console.log('resolvió el rest de busqueda');
			                    	noprocessing()
			                    	$scope.resultFolios = d.datos
			                        console.log('resultado de la busqueda:');
			                        console.log($scope.resultFolios);
			                        console.log($scope.resultFolios.length);
			                        
			                        return d.datos;
	
			                    },
			                },
			                "columns": [
			                	{"data": "folio"},
			                    {"data": "nombres",
			                    	"render": function (data, type, full, meta) {
                                        return full.nombres + " " + full.primerApellido + " " + full.segundoApellido;
			                    	}
			                    },
			                    {"data": "promedio"},
			                    {"data": "institucion"},
			                    {"data": "entidadFederativa"},
			                    {"data": "fechaEmision"},
			                    {"data": "fechaCertificado"},
			                    {"data": "estatus"}
			                    
			                ]
			            });
				}
				else{
                	noprocessing()
					$('#bodyfolioError').html('<p>'+mensajeFolios+'</p>');
					$('#modalfolioError').modal('show')
				}
			}
			catch(err) {
				errorFolios = 1
				mensajeFolios = 'El archivo no cuenta con el formato correcto'
                noprocessing()
				$('#bodyfolioError').html('<p>'+mensajeFolios+'</p>');
				$('#modalfolioError').modal('show')

			}
				
		}
			
			
			
	        $scope.generaExcel = function () {
	        	
				console.log($scope.resultFolios);
				console.log($scope.folios);


	            processing();
	            setTimeout(function(){

	                    var htmlTable = '<table><thead><tr>'
	                    htmlTable += '<th style="font-weight: 900;">FOLIO</th>'
	                    htmlTable += '<th style="font-weight: 900;">CURP</th>'
	                    htmlTable += '<th style="font-weight: 900;">NOMBRE</th>'
	                    htmlTable += '<th style="font-weight: 900;">PRIMER APELLIDO</th>'
	                    htmlTable += '<th style="font-weight: 900;">SEGUNDO APELLIDO</th>'
	                    htmlTable += '<th style="font-weight: 900;">PROMEDIO</th>'
	                    htmlTable += '<th style="font-weight: 900;">PROMEDIO TEXTO</th>'
	                    htmlTable += '<th style="font-weight: 900;">INSTITUCIÓN</th>'
	                    htmlTable += '<th style="font-weight: 900;">ENTIDAD FEDERATIVA</th>'
	                    htmlTable += '<th style="font-weight: 900;">FECHA DE EMISIÓN</th>'
	                    htmlTable += '<th style="font-weight: 900;">FECHA DE SELLO</th>'
	                    htmlTable += '<th style="font-weight: 900;">ESTATUS</th>'
	                    htmlTable += '</tr></thead><tbody>'; 	   
	                    	   


	                        $scope.folios.forEach(function(folioEntrada){
	                             htmlTable += '<tr>';
	                             var folioExiste = 0
	                             $scope.resultFolios.forEach(function(folioSalida){
                            	 	if(folioEntrada.toLowerCase() == folioSalida.folio.toLowerCase()){
        	                        	
                            	 		htmlTable += '<td>'+folioSalida.folio+'</td>';
                            	 		htmlTable += '<td>'+folioSalida.curp+'</td>';
                            	 		htmlTable += '<td>'+folioSalida.nombres+'</td>';
                            	 		htmlTable += '<td>'+folioSalida.primerApellido+'</td>';
                            	 		htmlTable += '<td>'+folioSalida.segundoApellido+'</td>';
                            	 		htmlTable += '<td>'+folioSalida.promedio+'</td>';
                            	 		htmlTable += '<td>'+NumeroALetras(folioSalida.promedio)+'</td>';
                            	 		htmlTable += '<td>'+folioSalida.institucion+'</td>';
                            	 		htmlTable += '<td>'+folioSalida.entidadFederativa+'</td>';
                            	 		htmlTable += '<td>'+folioSalida.fechaEmision+'</td>';
                            	 		htmlTable += '<td>'+folioSalida.fechaCertificado+'</td>';
                            	 		htmlTable += '<td>'+folioSalida.estatus+'</td>';

                            	 		folioExiste = 1
                            	 	}                              
                                })
                                
                                if(!folioExiste){
                                	htmlTable += '<td>'+folioEntrada+'</td><td colspan="10">Folio no existente</td>';
                                }
	                                
	                             htmlTable += '</tr>';

	                          })

	                         //htmlTable +='<tr></tr><tr></tr><tr><td colspan="8">¹ Conjunto de individuos adscritos a un centro de trabajo, de acuerdo a la función que realizan en el mismo. A cada uno se le considera tantas veces como en centros de trabajo esté adscrito.</td></td></tr>';                               


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
	                              
	                            a.download = 'concentrado_certificados.xls';
	                            a.click();
	                                
	                          }
	                         
	                         
	                    },250);

	                }

			
		};
    }]
 );


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