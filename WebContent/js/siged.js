function limpiar(text) {
    var r = text.toUpperCase();
   /* r = r.replace(new RegExp(/[aáãàäâåAÁÃÀÄÂÅ]/g), "A");
    r = r.replace(new RegExp(/[eéèêěëEÉÈÊĚË]/g), "E");
    r = r.replace(new RegExp(/[iïíîìIÍÏíîì]/g), "I");
    r = r.replace(new RegExp(/[oõôòóöOÕÔÒÓÖ]/g), "O");
    r = r.replace(new RegExp(/[uůùúüûUŮÙÚÜÛ]/g), "U");*/
    return r;
}

function limpiar2(text) {
    var r = text.toUpperCase();
    /*r = r.replace(new RegExp(/[aáãàäâåAÁÃÀÄÂÅ]/g), "A");
    r = r.replace(new RegExp(/[eéèêěëEÉÈÊĚË]/g), "E");
    r = r.replace(new RegExp(/[iïíîìIÍÏíîì]/g), "I");
    r = r.replace(new RegExp(/[oõôòóöOÕÔÒÓÖ]/g), "O");
    r = r.replace(new RegExp(/[uůùúüûUŮÙÚÜÛ]/g), "U");*/

    return r;
}

function gradosadecimales(grados) {
    if (grados.indexOf('-') == -1) {
        grados = grados.split(':');

        decimales = parseFloat(grados[0]) + (parseFloat(grados[1]) / 60) + (parseFloat(grados[2]) / 3600)
    } else {
        grados = grados.split('-');
        grados = grados[1].split(':');

        decimales = parseFloat(grados[0]) + (parseFloat(grados[1]) / 60) + (parseFloat(grados[2]) / 3600)
        decimales = decimales * -1;

    }

    return decimales;
}

var formatNumber = {
    separador: ",", // separador para los miles
    sepDecimal: '.', // separador para los decimales
    formatear: function (num) {
        num += '';
        var splitStr = num.split('.');
        var splitLeft = splitStr[0];
        var splitRight = splitStr.length & gt;
        1 ? this.sepDecimal + splitStr[1] : '';
        var regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
        }
        return this.simbol + splitLeft + splitRight;
    },
    new : function (num, simbol) {
        this.simbol = simbol || '';
        return this.formatear(num);
    }
}



$("#reset").on("click", function () {

	$('.form-control').each(function(){
		$(this).val("");
		console.log($(this).val()+',');
	});
});

$gmx(document).ready(function() {
    $('#main-search').fadeIn('slow');
    $('.navbar-siged').fadeIn('slow');

});



	/*$(window).scroll(function() {

		var scroll = $(window).scrollTop();
    var positionNav = $('.warning-nav').height() + 90;
		if(scroll > positionNav - 45){
			$('.navbar-siged').css({'top':'45px'})
			$('.navbar-siged').css({'position':'fixed'})
			}
		else
			{
			$('.navbar-siged').css({'top':positionNav+'px'})
			$('.navbar-siged').css({'position':'absolute'})
			}


	});*/
