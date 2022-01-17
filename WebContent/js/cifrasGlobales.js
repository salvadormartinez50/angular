

var randomColorFactor = function () {
  return Math.round(Math.random() * 255);
  };
  var randomColor = function () {
    return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',.5)';
  };

  var app = angular.module('myApp', []);
  app.controller('myCtrl', function($scope,$http) {

    $scope.servidorMampo = 'https://siged.sep.gob.mx/servicios';

    $scope.orden = 'asc';
    $scope.datos = null;
    $scope.totalDisplayed = 20;
    $http.get($scope.servidorMampo+"/cifras/totales/")
    .then(function(response) {
      $scope.datos =response.data.datos[0];
        //$scope.myWelcome = response.data;
        $scope.filas = [
            {nombre:'Personal con licencias y/o comisiones sin goce de sueldo',cita: "1",plazas:$scope.datos.licCom,tipo: 'LicenciaComiciones'},
            {nombre:'Docentes reubicados de áreas administrativas a escuelas',cita:"2,3",plazas:$scope.datos.totAdmin,tipo:'Administrativo'},
            //{nombre:'Ciudad de méxico',cita: "2",plazas:$scope.datos.totAdminCdmx, clase: 'administrativo'},
            //{nombre:'Resto de entidades federativas',cita: "3",plazas:$scope.datos.totAdmiEnt, clase: 'administrativo'},
            {nombre:'Bajas identificadas de la conciliación',cita: "4",plazas:$scope.datos.bajas,tipo: 'Baja'},
            {nombre:'No localizados o que laboran fuera del sistema educativo con pagos suspendidos y/o en proceso de suspensíón',cita:"4",plazas:$scope.datos.suspPago,tipo:'SuspensionPago'}
            ];
    });

    $scope.personas = [
      {nombre: 'Ricardo', aPate: 'Ruíz', aMate: 'Velazco',plaza: 'MFNNFNDFJKSKJE2ERJRWHG32',estado:'Puebla'},
      {nombre: 'Emmanuel', aPate: 'Zamora', aMate: 'Rivera',plaza: 'MFNNFNDFJKSKJE2ERJRWHG32',estado:'Puebla'},
      {nombre: 'Kevin', aPate: 'Nuñez', aMate: 'Toscano',plaza: 'MFNNFNDFJKSKJE2ERJRWHG32',estado:'CDMX'},
      {nombre: 'Jesus', aPate: 'Rojas', aMate: 'Moreno',plaza: 'MFNNFNDFJKSKJE2ERJRWHG32',estado:'CDMX'},
      {nombre: 'Luis', aPate: 'Moreno', aMate: 'Gutierrez',plaza: 'MFNNFNDFJKSKJE2ERJRWHG32',estado:'Tabasco'}
    ]



    $scope.personas.forEach(function(item,index){
        $scope.personas[index].nombreCompleto = item.nombre+' '+item.aPate+' '+item.aMate
    })


    $scope.setSort = function(tipo){
      if($scope.orden == 'asc'){
        $scope.sort = tipo;
        $scope.orden = 'desc'
      }else{
        $scope.sort = '-'+tipo;
        $scope.orden = 'asc'
      }
    }
    $scope.infoPersona = function(fila){
      $scope.categoria = fila.nombre;
    }
    $scope.excelReporte = function(nombreTabla){
      console.log($scope.plazas)

      var tab_text="<table border='2px'><thead><tr><th><b>Plaza</b></th><th><b>Estado</b></th></tr></thead><tbody>";
    j=0;
      tab = document.getElementById("tabla_resultados"); // id of table

      for(j = 0 ; j < $scope.plazas.length ; j++)
      {
          tab_text=tab_text+'<tr ><td bgcolor="#87AFC6">'+$scope.plazas[j].plazaDTO.codigoPlaza+'</td><td>'+$scope.plazas[j].estadoDTO.nombre+'</td></tr>';
          //tab_text=tab_text+"</tr>";
      }

      tab_text=tab_text+"</tbody></table>";
      tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
      tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
      tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

      var uri = 'data:application/vnd.ms-excel;base64,'
          , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><?xml version="1.0" encoding="UTF-8" standalone="yes"?><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
          , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
          , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }

    var ctx = {
        worksheet: name || '',
        table: tab_text
    };

    window.open(uri + base64(format(template, ctx)));

    }

    $scope.infoPlaza = function(fila){
      if(fila.tipo != null){

        $('#link-grafica').click();
        $('#modal_cargando').modal('show');

        $scope.categoria = fila.nombre
        console.log($scope.servidorMampo+"/cifras/"+fila.tipo+"/")
        $http.get($scope.servidorMampo+"/cifras/"+fila.tipo+"/")
        .then(function(response) {

          $scope.plazas = response.data.datos;

          var estado = []
          var numeros = []
          $http.get($scope.servidorMampo+"/cifras/Grafica"+fila.tipo+"/")
          .then(function(response) {
            $scope.estados = response.data.datos;
            $scope.estados.forEach(function(item,index){
              numeros.push(item.estadoDTO.id);
              estado.push(item.estadoDTO.nombre);
            });
            var ctx = document.getElementById("graficaPlazas").getContext('2d');

            if (window.myChart != undefined)
              window.myChart.destroy();


            window.myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: estado,
                    datasets: [{
                        label: '# de Plazas',
                        data: numeros,
                        borderWidth: 1,
                        backgroundColor: '#D0021B',
                         borderColor: '#D0021B'
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true,
                            }
                        }],
                        xAxes: [{
                           stacked: false,
                           beginAtZero: true,
                           scaleLabel: {
                               labelString: 'Month'
                           },
                           ticks: {
                               stepSize: 1,
                               min: 0,
                               autoSkip: false
                           }
                       }]
                    }
                }
            });
            $('#modal_cargando').one('hidden.bs.modal', function() {
              $('#modal_plazas').modal('show')
              $('#modal_plazas').children('.modal-dialog').css({"margin-top":"10px"})

            }).modal('hide');

          });
        });
      }
    }

    $scope.graficaPlaza = function(){

    }

    $scope.loadMore = function () {
      $scope.totalDisplayed += 20;
    };

  });
