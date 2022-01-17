(function($) {

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd
	}

	if(mm<10) {
	    mm='0'+mm
	}

	today = yyyy+'-'+mm+'-'+dd;

	"use strict";

	var options = {
	events_source: [
					{
						"id": 293,
						"title": "Plantilla completa de personal identificado en su entidad. (Total de personal con corte al 15 de octubre de 2017)",
						"url": "",
						"class": "event-warning",
						"start": 1508155200000, // Milliseconds
						"end": 1509451200000 // Milliseconds

					},
					{
						"id": 294,
						"title": "Quincena 20 - 2017 ( Del 16-31 de octubre de 2017)",
						"url": "",
						"class": "event-info",
						"start": 1509537600000, // Milliseconds
						"end": 1510747200000 // Milliseconds
					},
					{
						"id": 295,
						"title": "Quincena 21 - 2017 (Del 01-15 de noviembre de 2017)",
						"url": "",
						"class": "event-success",
						"start": 1510833600000, // Milliseconds
						"end": 1512043200000 // Milliseconds
					},
					{
						"id": 296,
						"title": "Quincena 22 – 2017 (Del 16-30 de noviembre de 2017)",
						"url": "",
						"class": "event-important",
						"start": 1512129600000, // Milliseconds
						"end": 1513339200000 // Milliseconds
					},
					{
						"id": 297,
						"title": "Quincena 23 -2017	(Del 01-15 de diciembre de 2017)",
						"url": "",
						"class": "event-info",
						"start": 1513425600000, // Milliseconds
						"end": 1514721600000 // Milliseconds
					},
					{
						"id": 298,
						"title": "Quincena 24 -2017	(Del 16-31 de diciembre de 2017)",
						"url": "",
						"class": "event-warning",
						"start": 1514808000000, // Milliseconds
						"end": 1516017600000 // Milliseconds
					},
					{
						"id": 300,
						"title": "Quincena 1 -2018	(Del 01-15 de enero de 2018)",
						"url": "",
						"class": "event-success",
						"start": 1516104000000, // Milliseconds
						"end": 1517400000000 // Milliseconds
					},
					{
						"id": 301,
						"title": "Quincena 2 -2018	(Del 16-31 de enero de 2018)",
						"url": "",
						"class": "event-important",
						"start": 1517486400000, // Milliseconds
						"end": 1518696000000 // Milliseconds
					},
					{
						"id": 302,
						"title": "Quincena 3 -2018	(Del 01-15 de febrero de 2018)",
						"url": "",
						"class": "event-info",
						"start": 1518782400000, // Milliseconds
						"end": 1519819200000 // Milliseconds
					},
					{
						"id": 303,
						"title": "Quincena 4 -2018	(Del 16- 29 de febrero de 2018)",
						"url": "",
						"class": "event-warning",
						"start": 1519905600000, // Milliseconds
						"end": 1521115200000 // Milliseconds
					},
					{
						"id": 304,
						"title": "Quincena 5 -2018	(Del 01-15 de marzo de 2018)",
						"url": "",
						"class": "event-success",
						"start": 1521201600000, // Milliseconds
						"end": 1522497600000 // Milliseconds
					},
					{
						"id": 305,
						"title": "Quincena 6 -2018	(Del 16- 31 de marzo de 2018)",
						"url": "",
						"class": "event-important",
						"start": 1522584000000, // Milliseconds
						"end": 1523793600000 // Milliseconds
					},
					{
						"id": 306,
						"title": "Quincena 7 -2018	(Del 01- 15 de abril de 2018)",
						"url": "",
						"class": "event-info",
						"start": 1523880000000, // Milliseconds
						"end": 1525089600000 // Milliseconds
					},
					{
						"id": 307,
						"title": "Quincena 8 -2018	(Del 16- 30 de abril de 2018)",
						"url": "",
						"class": "event-warning",
						"start": 1525176000000, // Milliseconds
						"end": 1526385600000 // Milliseconds
					},
					{
						"id": 308,
						"title": "Quincena 9 -2018	(Del 01-15 de mayo de 2018)",
						"url": "",
						"class": "event-success",
						"start": 1526472000000, // Milliseconds
						"end": 1527768000000 // Milliseconds
					},
					{
						"id": 309,
						"title": "Quincena 10 -2018	(Del 16- 31 de mayo de 2018)",
						"url": "",
						"class": "event-important",
						"start": 1527854400000, // Milliseconds
						"end": 1529064000000 // Milliseconds
					},
					{
						"id": 310,
						"title": "Quincena 11 -2018	(Del 01-15 de junio de 2018)",
						"url": "",
						"class": "event-info",
						"start": 1529150400000, // Milliseconds
						"end": 1530360000000 // Milliseconds
					},
					{
						"id": 311,
						"title": "Quincena 12 -2018	(Del 16 al 30 de junio de 2018)",
						"url": "",
						"class": "event-warning",
						"start": 1530446400000, // Milliseconds
						"end": 1531656000000 // Milliseconds
					},
					{
						"id": 312,
						"title": "Quincena 13 -2018	(Del 1 al 15 de julio de 2018)",
						"url": "",
						"class": "event-success",
						"start": 1531742400000, // Milliseconds
						"end": 1533038400000 // Milliseconds
					},
					{
						"id": 313,
						"title": "Quincena 14 -2018	(Del 16 al 31 de julio de 2018)",
						"url": "",
						"class": "event-important",
						"start": 1533124800000, // Milliseconds
						"end": 1534334400000 // Milliseconds
					},
					{
						"id": 314,
						"title": "Quincena 15 -2018	(Del 1 al 15 de agosto de 2018)",
						"url": "",
						"class": "event-info",
						"start": 1534420800000, // Milliseconds
						"end": 1535716800000 // Milliseconds
					},
					{
						"id": 315,
						"title": "Quincena 16 -2018	(Del 16 al 31 de agosto de 2018)",
						"url": "",
						"class": "event-warning",
						"start": 1535803200000, // Milliseconds
						"end": 1537012800000 // Milliseconds
					},
					{
						"id": 316,
						"title": "Quincena 17 -2018	(Del 1 al 15 de septiembre de 2018)",
						"url": "",
						"class": "event-success",
						"start": 1537099200000, // Milliseconds
						"end": 1538308800000 // Milliseconds
					},
					{
						"id": 317,
						"title": "Quincena 18 -2018	(Del 16 al 30 de septiembre de 2018)",
						"url": "",
						"class": "event-important",
						"start": 1538395200000, // Milliseconds
						"end": 1539604800000 // Milliseconds
					},
					{
						"id": 318,
						"title": "Quincena 19 -2018	(Del 1 al 15 de octubre de 2018)",
						"url": "",
						"class": "event-info",
						"start": 1539691200000, // Milliseconds
						"end": 1540987200000 // Milliseconds
					},
					{
						"id": 319,
						"title": "Quincena 20 -2018	(Del 16 al 31 de octubre de 2018)",
						"url": "",
						"class": "event-warning",
						"start": 1541073600000, // Milliseconds
						"end": 1542283200000 // Milliseconds
					},
					{
						"id": 320,
						"title": "Quincena 21 -2018	(Del 1 al 15 de noviembre de 2018)",
						"url": "",
						"class": "event-success",
						"start": 1542369600000, // Milliseconds
						"end": 1543579200000 // Milliseconds
					},
					{
						"id": 321,
						"title": "Quincena 22 -2018	(Del 16 al 30 de noviembre de 2018)",
						"url": "",
						"class": "event-important",
						"start": 1543665600000, // Milliseconds
						"end": 1544875200000 // Milliseconds
					},
					{
						"id": 322,
						"title": "Quincena 23 -2018	(Del 1 al 15 de diciembre de 2018)",
						"url": "",
						"class": "event-warning",
						"start": 1544961600000, // Milliseconds
						"end": 1546257600000 // Milliseconds
					},
					{
						"id": 323,
						"title": "Quincena 24 -2018	(Del 16 al 31 de diciembre de 2018)",
						"url": "",
						"class": "event-success",
						"start": 1546344000000, // Milliseconds
						"end": 1547553600000 // Milliseconds
					}],
		view: 'month',
		tmpl_path: 'js/calendar/tmpls/',
		tmpl_cache: false,
		day: today,
		onAfterEventsLoad: function(events) {
			if(!events) {
				return;
			}

			var list = $('#eventlist');
			list.html('');

			$.each(events, function(key, val) {
				$(document.createElement('li'))
					.html('<a href="' + val.url + '">' + val.title + '</a>')
					.appendTo(list);
			});
		},
		onAfterViewLoad: function(view) {
			$('.page-header h3').text(this.getTitle());
			$('.btn-group button').removeClass('active');
			$('button[data-calendar-view="' + view + '"]').addClass('active');
		},
		classes: {
			months: {
				general: 'label'
			}
		}
	};

	var calendar = $('#calendar').calendar(options);

	$('.btn-group button[data-calendar-nav]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.navigate($this.data('calendar-nav'));
		});
	});

	$('.btn-group button[data-calendar-view]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.view($this.data('calendar-view'));
		});
	});


		calendar.setLanguage('es-MX');
		calendar.view();

	$('#events-in-modal').change(function(){
		var val = $(this).is(':checked') ? $(this).val() : null;
		calendar.setOptions({modal: val});
	});

	$('#events-modal .modal-header, #events-modal .modal-footer').click(function(e){
		//e.preventDefault();
		//e.stopPropagation();
	});
}(jQuery));
