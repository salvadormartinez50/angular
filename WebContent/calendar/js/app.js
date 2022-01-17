//var jSonDiasjSonDias='../calendarFechas.json';
var calendar ='../../calendarFechas.json';
(function($) {

	//"use strict";
	//clienteRest();
	creaCalendar(null);
	$('.btn-group button[data-calendar-nav]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.navigate($this.data('calendar-nav'));
			//creaCalendar(jSonDias);
		});
	});

	$('.btn-group button[data-calendar-view]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.view($this.data('calendar-view'));
		});
	});

	$('#first_day').change(function(){
		var value = $(this).val();
		value = value.length ? parseInt(value) : null;
		calendar.setOptions({first_day: value});
		calendar.view();
	});

	$('#language').change(function(){
		calendar.setLanguage($(this).val());
		calendar.view();
	});

	$('#events-in-modal').change(function(){
		var val = $(this).is(':checked') ? $(this).val() : null;
		calendar.setOptions({modal: val});
	});
	$('#format-12-hours').change(function(){
		var val = $(this).is(':checked') ? true : false;
		calendar.setOptions({format12: val});
		calendar.view();
	});
	$('#show_wbn').change(function(){
		var val = $(this).is(':checked') ? true : false;
		calendar.setOptions({display_week_numbers: val});
		calendar.view();
	});
	$('#show_wb').change(function(){
		var val = $(this).is(':checked') ? true : false;
		calendar.setOptions({weekbox: val});
		calendar.view();
	});
	$('#events-modal .modal-header, #events-modal .modal-footer').click(function(e){
		//e.preventDefault();
		//e.stopPropagation();
	});
	
	
	/*
	$('#calendar').dblclick(function(e){
		alert('okok');
	});
	*/
}(jQuery));



	function creaCalendar(jSon){
		var date = new Date();
		var d = date.getDate(), m = date.getMonth(), y = date.getFullYear();
		
		var vHoy=y+'-'+((++m>9)?m:('0'+m))+'-'+((d>9)?d:'0'+d);
		
		var options = {
			events_source: 'calendarFechas.json',
			view: 'month',
			tmpl_path: 'tmpls/',
			tmpl_cache: false,
			language: 'es-MX',
			day: vHoy,
			first_day: 2,
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

		calendar = $('#calendar').calendar(options);
	
	
	}
