/*var inicializa_grafica = function (id) { //"cont_graficas"
    document.getElementById(id).innerHTML = '<canvas id="canvas" style="width:100%"></canvas><br><a onclick="guarda_imagen(this)" class="btn btn-default pull-right" download="Estadisticas_siged.png" href="#">Descargar estadísticas</a><br>'+
    '<br><br><div class="fuente"  align="right"><p><b>Fuente de información</b></p><p>Estadística 911</p><p>Última actualización: Cierre de ciclo 2015-2016 Septiembre 2016</p><br></div> ';
}*/

var inicializa_grafica = function(id) {
	//"cont_graficas"
	document.getElementById(id).innerHTML =
		'<canvas id="canvas" style="width:100%"></canvas><br><a onclick="guarda_imagen(this)" class="btn btn-default pull-right" download="Estadisticas_siged.png" href="#">Descargar estadísticas</a><br>' +
		'<br></div> ';
};

var grafica = function(datos, leyenda, titulo) {
	var barChartData = {
		labels: leyenda,
		datasets: [
			{
				label: 'Escuelas',
				backgroundColor: '#4D92DF',
				data: datos
			}
		]
	};

	var ctx = document.getElementById('canvas').getContext('2d');
	console.log('Salida');
	window.myBar = new Chart(ctx, {
		type: 'bar',
		data: barChartData,
		options: {
			// Elements options apply to all of the options unless overridden xin a dataset
			// In this case, we are setting the border of each bar to be 2px wide and green
			elements: {
				rectangle: {
					borderWidth: 3,
					borderColor: '#4D92DF',
					borderSkipped: 'bottom'
				}
			},
			responsive: true,
			legend: {
				position: 'top'
			},
			title: {
				display: true,
				text: titulo
			},
			plugins: titulosGrafica
		}
	});

	window.myBar.update();
};
var graficaPastel = function(datos, leyenda, titulo) {
	var barChartData = {
		labels: leyenda,
		datasets: [
			{
				label: 'Escuelas',
				data: datos,
				backgroundColor: [ '#FF6384', '#36A2EB', '#FFCE56' ]
			}
		],
		options: {
			plugins: titulosGrafica
		}
	};

	var ctx = document.getElementById('canvas').getContext('2d');
	window.myBar = new Chart(ctx, {
		type: 'pie',
		data: barChartData,
		animation: {
			animateScale: true
		},
		responsive: true,
		options: {
			title: {
				display: true,
				text: titulo
			},
			plugins: titulosGrafica
		}
	});

	window.myBar.update();
};

var graficaDoble = function(datos1, datos2, leyend, titulo) {
	//Chart.defaults.global.legend.display = false;
	//Chart.defaults.global.tooltips.enabled = false;

	var barChartData = {
		labels: leyend,
		datasets: [
			{
				label: 'Privado',
				data: datos1,
				backgroundColor: '#4D92DF'
			},
			{
				label: 'Público',
				data: datos2,
				backgroundColor: '#D0021B'
			}
		],
		options: {
			plugins: titulosGrafica
		}
	};

	var ctx = document.getElementById('canvas').getContext('2d');
	window.myBar = new Chart(ctx, {
		type: 'bar',
		data: barChartData,
		options: {
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: true
						}
					}
				]
			},
			plugins: titulosGrafica
		},
		responsive: true
	});

	window.myBar.update();
};

const titulosGrafica = {
	title: {
		display: true,
		position: 'bottom',
		align: 'end',
		font: {
			family: 'Montserrat',
			size: '14px',
			color: '#404041',
			weight: '100    '
		},
		text: [
			'La información exhibida en esta sección es proporcionada directamente por la Autoridad Educativa Local.',
			'(1) Catálogo Nacional de Centros de Trabajo (Escuelas)'
		],
		padding: {
			top: 10,
			bottom: 30
		}
	}
};
function guarda_imagen(este) {
	var ctx = document.getElementById('canvas');
	var dt = canvas.toDataURL('image/png');
	/* Change MIME type to trick the browser to downlaod the file instead of displaying it */
	dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

	/* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
	dt = dt.replace(
		/^data:application\/octet-stream/,
		'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Estadisticas_siged.png'
	);

	este.href = dt;
}
